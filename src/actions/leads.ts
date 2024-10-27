'use server';
import { getLeadById } from '@/data/lead';
import { db } from '@/lib/db';
import { EnrollSchema } from '@/schemas';
import { ActionResponse } from '@/types';
import { z } from 'zod';
import { getLeadByEmail } from '../data/lead';
import { roleGuard } from '@/lib/auth';
import { NotificationType, UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { notifyAllAdmins } from './notifications';
import { capitalizeWords } from '@/lib/utils';

export const enroll = async (values: z.infer<typeof EnrollSchema>): Promise<ActionResponse> => {
  try {
    const existingEmail = await getLeadByEmail(values.email);
    const existingNumber = await getLeadByEmail(values.number);

    if (existingEmail || existingNumber) {
      const lead = existingEmail ?? existingNumber;
      await db.lead.update({
        where: {
          email: lead?.email,
          number: lead?.number,
        },
        data: {
          enrollNumber: lead!.enrollNumber + 1,
        },
      });
      await notifyAllAdmins(NotificationType.ADMIN_NEW_LEAD, `/dashboard/admin/leads`, values.fullName);
      revalidatePath('/dashboard/admin/leads');
      return { success: 'enroll-success', data: lead?.id };
    } else {
      const lead = await db.lead.create({
        data: {
          fullName: capitalizeWords(values.fullName.trim()),
          email: values.email.trim(),
          number: values.number,
          enrollNumber: 1,
          videoProgress: 0,
        },
      });
      await notifyAllAdmins(NotificationType.ADMIN_NEW_LEAD, `/dashboard/admin/leads`, values.fullName);
      revalidatePath('/dashboard/admin/leads');
      return { success: 'enroll-success', data: lead.id };
    }
  } catch (error) {
    return { error: 'unknown-error' };
  }
};

export const saveVideoProgress = async (id: string, videoProgress: number): Promise<ActionResponse> => {
  try {
    const lead = await getLeadById(id);
    if (!lead) return { error: 'lead-not-found-error' };
    if (videoProgress > lead.videoProgress) {
      await db.lead.update({
        where: { id: id },
        data: {
          videoProgress: videoProgress,
        },
      });
      return { success: 'lead-save-success' };
    }
    return { success: 'lead-save-unnecessary' };
  } catch (error) {
    return { error: 'lead-save-error' };
  }
};

export const getLeads = async (): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN);
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: 'leads-fetch-success', data: leads };
  } catch (error) {
    return { error: 'leads-fetch-error' };
  }
};

export const bulkDeleteLeads = async (ids: string[]): Promise<ActionResponse> => {
  roleGuard(UserRole.ADMIN);
  try {
    await db.$transaction(async (transaction) => {
      await transaction.lead.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
    });

    revalidatePath('/dashboard/admin/leads');

    return { success: 'leads-delete-success' };
  } catch (error) {
    return { error: 'leads-delete-error' };
  }
};
