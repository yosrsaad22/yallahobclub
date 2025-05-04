import { roleOptions } from '@/lib/constants';
import { z } from 'zod';

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
    role: z.nativeEnum(roleOptions),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const CardSchema = z.object({
  question: z.string().min(1, {
    message: "La question est requise",
  }),
  category: z.string().min(1, {
    message: "La catégorie est requise",
  }),
  typeId: z.string().min(1, {
    message: "Le type est requis",
  }),
});
export const ArticleSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  image: z.string().url("URL d'image invalide"),
  categoryId: z.string().min(1, "La catégorie est requise"),
  typeId: z.string().min(1, "Le type est requis"), // Use typeId, not type
});
export const ActivitySchema = z.object({
  title: z.string(),
  description: z.string(),
  location: z.string(),
  ageRange: z.string(),
  price: z.number(),
  priceCategory: z.enum(['gratuit', 'abordable', 'modéré', 'coûteux']),
  mood: z.enum(['amusant', 'éducatif', 'relaxant', 'aventureux', 'créatif']),
  weather: z.enum(['intérieur', 'extérieur', 'les_deux']),
  imageUrl: z.string(),
  date: z.string().optional(),
  typeId: z.string().min(1), 
});

export const BudgetSchema = z.object({
  category: z.string().min(1),
  limit: z.number().positive(),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
  });

export const UserSettingsSchema = z
  .object({
    fullName: z.string().min(3),
    email: z.string().email(),
    number: z.string().regex(/^\d{8}$/),
    address: z.string().min(3),
    state: z.string(),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
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

export const UserSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  number: z.string().regex(/^\d{8}$/),
  address: z.string().min(3),
  role: z.nativeEnum(roleOptions),
  onBoarding: z.number(),
});

export const OnboardingOneSchema = z.object({
  firstPartnerName: z.string().min(1),
  secondPartnerName: z.string().min(1),
});

export const OnboardingTwoSchema = z.object({
  yearsKnownEachOther: z.number().min(0),
  yearsMarried: z.number().min(0),
});

export const OnboardingThreeSchema = z.object({
  numberOfChildren: z.number().min(0),
});
