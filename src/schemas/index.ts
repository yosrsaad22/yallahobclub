import { colorOptions, packOptions, productCategoryOptions, roleOptions, sizeOptions } from '@/lib/constants';
import { z } from 'zod';

export const EnrollSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  number: z.string().regex(/^\d{8}$/),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.string().email(),
    number: z.string().regex(/^\d{8}$/),
    address: z.string().min(3),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    pack: z.nativeEnum(packOptions),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export const ImgSchema = z.object({
  fileName: z.string(),
  name: z.string(),
  fileSize: z.number(),
  size: z.number(),
  fileKey: z.string(),
  key: z.string(),
  fileUrl: z.string(),
  url: z.string(),
});

export const AdminSettingsSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.string().email(),
    number: z.string().regex(/^\d{8}$/),
    address: z.string().min(3),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    tva: z.string().regex(/^\d{2}$/),
    rib: z.string().regex(/^\d{20}$/),
    fiscalId: z.string().length(13),
  })
  .refine(
    (data) => {
      if (data.currentPassword && !data.newPassword) {
        return false;
      }
      if (data.currentPassword && !data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      path: ['newPassword', 'confirmPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.currentPassword && data.currentPassword.length < 8) {
        return false;
      }
      return true;
    },
    {
      path: ['currentPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 8) {
        return false;
      }
      return true;
    },
    {
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        if (data.newPassword !== data.confirmPassword) {
          return false;
        }
      }
      return true;
    },
    {
      path: ['confirmPassword'],
    },
  );

export const UserSettingsSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.string().email(),
    number: z.string().regex(/^\d{8}$/),
    address: z.string().min(3),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
    rib: z.string().optional(),
    pack: z.nativeEnum(packOptions).optional(),
  })
  .refine(
    (data) => {
      if (data.currentPassword && !data.newPassword) {
        return false;
      }
      if (data.currentPassword && !data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      path: ['newPassword', 'confirmPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.currentPassword && data.currentPassword.length < 8) {
        return false;
      }
      return true;
    },
    {
      path: ['currentPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length < 8) {
        return false;
      }
      return true;
    },
    {
      path: ['newPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword || data.confirmPassword) {
        if (data.newPassword !== data.confirmPassword) {
          return false;
        }
      }
      return true;
    },
    {
      path: ['confirmPassword'],
    },
  )
  .refine(
    (data) => {
      if (data.rib && !/^\d{20}$/.test(data.rib)) {
        return false;
      }
      return true;
    },
    {
      path: ['rib'],
    },
  );

export const UserSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.string().email(),
    number: z.string().regex(/^\d{8}$/),
    address: z.string().min(3),
    rib: z.string().optional(),
    pack: z.nativeEnum(packOptions).optional(),
    role: z.nativeEnum(roleOptions).optional(),
    emailVerified: z.boolean().optional(),
    active: z.boolean().optional(),
    paid: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.rib && !/^\d{20}$/.test(data.rib)) {
        return false;
      }
      return true;
    },
    {
      path: ['rib'],
    },
  );

export const CourseSchema = z.object({
  title_en: z.string().min(5),
  title_fr: z.string().min(5),
  description_en: z.string().min(5),
  description_fr: z.string().min(5),
});

export const ChapterSchema = z.object({
  title_en: z.string().min(5),
  title_fr: z.string().min(5),
  description_en: z.string().min(5),
  description_fr: z.string().min(5),
  video: z.string().min(5),
});

export const ProductSchema = z.object({
  name: z.string().min(5),
  description: z.string().min(5),
  delivery: z.string().min(5),
  wholesalePrice: z.string().regex(/^\d{1,}(\.\d{1,})?$/),
  profitMargin: z.string().regex(/^\d{1,}(\.\d{1,})?$/),
  featured: z.boolean().optional(),
  category: z.nativeEnum(productCategoryOptions),
  stock: z.string().regex(/^\d{1,}$/),
  supplierId: z.string(),
  colors: z.array(z.nativeEnum(colorOptions)).optional(),
  sizes: z.array(z.nativeEnum(sizeOptions)).optional(),
  images: z.array(z.string()).min(1),
});
