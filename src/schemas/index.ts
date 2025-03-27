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
