import { Resend } from 'resend';
import React from 'react';
import EmailVerificationTemplate from '@/components/emails/email-verification-template';
import { getTranslations } from 'next-intl/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const hostname = process.env.HOSTNAME || 'https://www.ecomness.vercel.app';

export const sendEmailVerificationEmail = async (fullName: string, email: string, token: string) => {
  const confirmLink = `${hostname}/email-verification?token=${token}`;
  const t = await getTranslations('emails.email-verification');
  await resend.emails.send({
    from: 'Ecomness<support@ecomness.com>',
    to: email,
    subject: t('subject'),
    react: EmailVerificationTemplate({
      hostname: hostname,
      fullName: fullName,
      link: confirmLink,
      messages: t,
    }) as React.ReactElement,
  });
};

export const sendPasswordResetEmail = async (fullName: string, email: string, token: string) => {
  const confirmLink = `${hostname}/reset-password?token=${token}`;
  const t = await getTranslations('emails.password-reset');
  await resend.emails.send({
    from: 'Ecomness<support@ecomness.com>',
    to: email,
    subject: t('subject'),
    react: EmailVerificationTemplate({
      hostname: hostname,
      fullName: fullName,
      link: confirmLink,
      messages: t,
    }) as React.ReactElement,
  });
};
