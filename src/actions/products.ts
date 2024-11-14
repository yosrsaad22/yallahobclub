'use server';
import { db } from '@/lib/db';
import { currentUser, roleGuard } from '@/lib/auth';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getProductById } from '@/data/product';
import { NotificationType, UserRole } from '@prisma/client';
import { ProductSchema } from '@/schemas';
import { getUserById } from '@/data/user';
import { notifyAllAdmins, notifyUser } from './notifications';
import cleanOrphanFiles from './files';
import { generateCode } from '@/lib/utils';

export const getProducts = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SELLER || UserRole.SUPPLIER);
  try {
    const products = await db.product.findMany({
      include: {
        supplier: true,
        media: true,
        sellers: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'products-fetch-success', data: products };
  } catch (error) {
    return { error: 'products-fetch-error' };
  }
};

export const getProductsBySeller = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.SELLER);
  try {
    const seller = await currentUser();
    const user = await db.user.findUnique({
      where: {
        id: seller?.id,
      },
      include: {
        myProducts: {
          include: {
            supplier: true,
            media: true,
          },
        },
      },
    });
    return { success: 'products-fetch-success', data: user?.myProducts };
  } catch (error) {
    return { error: 'products-fetch-error' };
  }
};

export const addToMyProducts = async (productId: string): Promise<ActionResponse> => {
  roleGuard(UserRole.SELLER);

  try {
    const seller = await currentUser();

    if (!seller) return { error: 'user-not-found-error' };

    // Fetch product and user data in parallel
    const [product, userWithProducts] = await Promise.all([
      getProductById(productId),
      db.user.findUnique({
        where: { id: seller.id },
        include: { myProducts: { where: { id: productId } } },
      }),
    ]);

    if (!product) return { error: 'product-not-found-error' };

    if (userWithProducts?.myProducts && userWithProducts?.myProducts?.length > 0) {
      return { error: 'products-add-to-my-products-error' };
    }

    // Perform both updates in parallel
    await Promise.all([
      db.user.update({
        where: { id: seller.id },
        data: { myProducts: { connect: [{ id: productId }] } },
      }),
      db.product.update({
        where: { id: productId },
        data: { sellers: { connect: [{ id: seller.id }] } },
      }),
    ]);

    revalidatePath('/dashboard/seller/my-products');
    revalidatePath('/dashboard/marketplace');

    return { success: 'products-add-to-my-products-success' };
  } catch (error) {
    console.error(error);
    return { error: 'products-add-to-my-products-error' };
  }
};

export const removeFromMyProducts = async (productId: string): Promise<ActionResponse> => {
  roleGuard(UserRole.SELLER);

  try {
    const seller = await currentUser();

    if (!seller) return { error: 'user-not-found-error' };

    // Fetch product and user data in parallel
    const [product, userWithProducts] = await Promise.all([
      getProductById(productId),
      db.user.findUnique({
        where: { id: seller.id },
        include: { myProducts: { where: { id: productId } } },
      }),
    ]);

    if (!product) return { error: 'product-not-found-error' };
    if (!userWithProducts?.myProducts?.length) {
      return { error: 'products-remove-from-my-products-error' };
    }

    // Perform both updates in parallel
    await Promise.all([
      db.user.update({
        where: { id: seller.id },
        data: { myProducts: { disconnect: [{ id: productId }] } },
      }),
      db.product.update({
        where: { id: productId },
        data: { sellers: { disconnect: [{ id: seller.id }] } },
      }),
    ]);

    revalidatePath('/dashboard/seller/my-products');
    revalidatePath('/dashboard/marketplace');

    return { success: 'products-remove-from-my-products-success' };
  } catch (error) {
    console.error(error);
    return { error: 'products-remove-from-my-products-error' };
  }
};

export const getProductsBySupplier = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  try {
    const products = await db.product.findMany({
      where: {
        supplierId: id,
      },
      include: { media: true },
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'products-fetch-success', data: products };
  } catch (error) {
    return { error: 'products-fetch-error' };
  }
};

export const getProduct = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SELLER || UserRole.SUPPLIER);
  try {
    const product = await getProductById(id);
    if (!product) return { error: 'product-not-found-error' };
    return { success: 'product-fetch-success', data: product };
  } catch (error) {
    return { error: 'product-fetch-error' };
  }
};

export const addProduct = async (values: z.infer<typeof ProductSchema>): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  const user = await currentUser();
  try {
    const supplier = await getUserById(values.supplierId);

    if (!supplier) return { error: 'user-not-found-error' };

    const newProduct = await db.product.create({
      data: {
        code: 'ENP-' + generateCode(),
        name: values.name,
        description: values.description,
        wholesalePrice: parseFloat(values.wholesalePrice),
        delivery: values.delivery,
        profitMargin: parseFloat(values.profitMargin),
        featured: values.featured,
        platformProfit: parseFloat(values.platformProfit),
        stock: parseFloat(values.stock),
        category: values.category,
        published: values.published,
        media: {
          create: values.media.map((mediaItem) => ({
            key: mediaItem.key,
            type: mediaItem.type,
          })),
        },
        colors: values.colors,
        sizes: values.sizes,
        supplier: {
          connect: {
            id: values.supplierId,
          },
        },
      },
    });

    await cleanOrphanFiles();

    revalidatePath('/dashboard/admin/products');
    revalidatePath('/dashboard/supplier/products');
    revalidatePath('/dashboard/marketplace');
    if (user?.role === UserRole.SUPPLIER) {
      notifyAllAdmins(
        NotificationType.ADMIN_NEW_PRODUCT,
        `/dashboard/admin/products/${newProduct.id}`,
        supplier?.fullName,
      );  
      return { success: 'supplier-product-add-success' };
    } else {
      return { success: 'product-add-success' };
    }
  } catch (error) {
    return { error: 'product-add-error' };
  }
};

export const editProduct = async (id: string, values: z.infer<typeof ProductSchema>): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  try {
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return { error: 'product-not-found-error' };
    }

    const oldStock = existingProduct.stock;
    const newStock = parseFloat(values.stock);
    const wasPublished = existingProduct.published;
    const willBePublished = values.published;

    await db.media.deleteMany({
      where: {
        productId: existingProduct.id,
      },
    });

    const product = await db.product.update({
      where: { id: existingProduct.id },
      data: {
        name: values.name,
        description: values.description,
        wholesalePrice: parseFloat(values.wholesalePrice),
        delivery: values.delivery,
        profitMargin: parseFloat(values.profitMargin),
        platformProfit: parseFloat(values.platformProfit),
        featured: values.featured,
        stock: parseFloat(values.stock),
        category: values.category,
        media: {
          create: values.media.map((mediaItem, index) => ({
            key: mediaItem.key,
            type: mediaItem.type,
          })),
        },
        colors: values.colors,
        sizes: values.sizes,
        supplier: {
          connect: {
            id: values.supplierId,
          },
        },
        published: values.published,
      },
      include: {
        sellers: true,
      },
    });

    if (oldStock !== newStock) {
      if (product.sellers && product.sellers.length > 0) {
        product.sellers.forEach(async (seller) => {
          notifyUser(
            seller.id,
            NotificationType.SELLER_STOCK_CHANGED,
            product.name,
            `/dashboard/marketplace/all-products/${product.id}`,
          );
        });
      }
    }

    if (!wasPublished && willBePublished) {
      notifyUser(
        product.supplierId!,
        NotificationType.SUPPLIER_PRODUCT_PUBLISHED,
        `/dashboard/marketplace/all-products/${id}`,
        product.name,
      );
    } else if (wasPublished && !willBePublished) {
      notifyUser(
        product.supplierId!,
        NotificationType.SUPPLIER_PRODUCT_UNPUBLISHED,
        `/dashboard/supplier/products/${id}`,
        product.name,
      );
    }

    await cleanOrphanFiles();

    revalidatePath('/dashboard/admin/products');
    revalidatePath('/dashboard/supplier/products');
    revalidatePath('/dashboard/marketplace');

    return { success: 'product-save-success' };
  } catch (error) {
    return { error: 'product-save-error' };
  }
};

export const deleteProduct = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  try {
    const product = await getProductById(id);

    const usersWithProduct = await db.user.findMany({
      where: {
        myProducts: { some: { id: id } },
      },
      select: { id: true },
    });

    for (const user of usersWithProduct) {
      await db.user.update({
        where: { id: user.id },
        data: {
          myProducts: {
            disconnect: [{ id: id }],
          },
        },
      });
    }

    await db.product.delete({
      where: {
        id: id,
      },
    });

    await cleanOrphanFiles();

    revalidatePath('/dashboard/admin/products');
    revalidatePath('/dashboard/supplier/products');
    revalidatePath('/dashboard/marketplace');

    return { success: 'product-delete-success' };
  } catch (error) {
    return { success: 'product-delete-error' };
  }
};

export const bulkDeleteProducts = async (ids: string[]): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  try {
    await db.$transaction(async (transaction) => {
      await transaction.product.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    });

    await cleanOrphanFiles();

    revalidatePath('/dashboard/admin/products');
    revalidatePath('/dashboard/supplier/products');
    revalidatePath('/dashboard/marketplace');

    return { success: 'products-delete-success' };
  } catch (error) {
    return { success: 'products-delete-error' };
  }
};
