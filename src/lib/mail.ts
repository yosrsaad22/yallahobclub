import { Resend } from 'resend';
import React from 'react';
import { getTranslations } from 'next-intl/server';
import BasicEmailTemplate from '@/components/emails/basic-email-template';

const resend = new Resend(process.env.RESEND_API_KEY);
const hostname = process.env.HOSTNAME || 'https://www.ecomness.vercel.app';

export const sendEmailVerificationEmail = async (fullName: string, email: string, token: string) => {
  const confirmLink = `${hostname}/email-verification?token=${token}`;
  const t = await getTranslations('emails.email-verification');
  await resend.emails.send({
    from: 'Ecomness<support@ecomness.com>',
    to: email,
    subject: t('subject'),
    react: BasicEmailTemplate({
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
    react: BasicEmailTemplate({
      hostname: hostname,
      fullName: fullName,
      link: confirmLink,
      messages: t,
    }) as React.ReactElement,
  });
};

export const sendAccountActivationEmail = async (fullName: string, email: string) => {
  const confirmLink = `${hostname}/login`;
  const t = await getTranslations('emails.account-activation');
  try {
    await resend.emails.send({
      from: 'Ecomness<support@ecomness.com>',
      to: email,
      subject: t('subject'),
      react: BasicEmailTemplate({
        hostname: hostname,
        fullName: fullName,
        link: confirmLink,
        messages: t,
      }) as React.ReactElement,
    });
  } catch (error) {
    console.log(error);
  }
};

export const sendOnBoardingApprovedEmail = async (fullName: string, email: string) => {
  const confirmLink = `${hostname}/login`;
  const t = await getTranslations('emails.account-activation');
  try {
    await resend.emails.send({
      from: 'Ecomness<support@ecomness.com>',
      to: email,
      subject: t('subject'),
      react: BasicEmailTemplate({
        hostname: hostname,
        fullName: fullName,
        link: confirmLink,
        messages: t,
      }) as React.ReactElement,
    });
  } catch (error) {
    console.log(error);
  }
};
