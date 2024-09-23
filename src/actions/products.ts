'use server';
import { db } from '@/lib/db';
import { roleGuard } from '@/lib/auth';
import { ActionResponse } from '@/types';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getProductById } from '@/data/product';
import { UserRole } from '@prisma/client';
import { ProductSchema } from '@/schemas';

export const getProducts = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SELLER || UserRole.SUPPLIER);
  try {
    const products = await db.product.findMany({
      include: {
        supplier: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'products-fetch-success', data: products };
  } catch (error) {
    return { error: 'products-fetch-error' };
  }
};

export const getProductsBySupplier = async (id: string): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  try {
    const products = await db.product.findMany({
      where: {
        supplierId: id,
      },
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
  try {
    await db.product.create({
      data: {
        name: values.name,
        description: values.description,
        wholesalePrice: parseFloat(values.wholesalePrice),
        delivery: values.delivery,
        profitMargin: parseFloat(values.profitMargin),
        featured: values.featured,
        stock: parseFloat(values.stock),
        category: values.category,
        images: values.images,
        colors: values.colors,
        sizes: values.sizes,
        supplier: {
          connect: {
            id: values.supplierId,
          },
        },
      },
    });

    revalidatePath('/dashboard/admin/products');
    revalidatePath('/dashboard/supplier/products');
    revalidatePath('/dashboard/marketplace');

    return { success: 'product-save-success' };
  } catch (error) {
    return { error: 'product-save-error' };
  }
};

export const editProduct = async (id: string, values: z.infer<typeof ProductSchema>): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN || UserRole.SUPPLIER);
  try {
    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return { error: 'product-not-found-error' };
    }
    await db.product.update({
      where: { id: existingProduct.id },
      data: {
        name: values.name,
        description: values.description,
        wholesalePrice: parseFloat(values.wholesalePrice),
        delivery: values.delivery,
        profitMargin: parseFloat(values.profitMargin),
        featured: values.featured,
        stock: parseFloat(values.stock),
        category: values.category,
        images: values.images,
        colors: values.colors,
        sizes: values.sizes,
        supplier: {
          connect: {
            id: values.supplierId,
          },
        },
      },
    });

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
    await db.product.delete({
      where: {
        id: id,
      },
    });

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
    revalidatePath('/dashboard/admin/products');
    revalidatePath('/dashboard/supplier/products');
    revalidatePath('/dashboard/marketplace');

    return { success: 'products-delete-success' };
  } catch (error) {
    return { success: 'products-delete-error' };
  }
};
