import { db } from '@/lib/db';

export const getLeadById = async (id: string) => {
  try {
    const lead = await db.lead.findUnique({ where: { id } });
    return lead;
  } catch {
    return null;
  }
};

export const getLeadByEmail = async (email: string) => {
  try {
    const lead = await db.lead.findUnique({ where: { email } });
    return lead;
  } catch {
    return null;
  }
};

export const getLeadByNumber = async (number: string) => {
  try {
    const lead = await db.lead.findUnique({ where: { number } });
    return lead;
  } catch {
    return null;
  }
};
