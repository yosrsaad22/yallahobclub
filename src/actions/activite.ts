"use server";

import { roleGuard } from "@/lib/auth";
import { db } from "@/lib/db";
import { ActivitySchema } from "@/schemas";
import { ActionResponse } from "@/types";
import { UserRole } from "@prisma/client";
import { z } from "zod";

export const getActivities = async (): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.USER]);

    const activities = await db.activity.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        type: true, 
      },
    });

    return { success: "Activités récupérées avec succès", data: activities };
  } catch (error) {
    return { error: "Erreur lors de la récupération des activités" };
  }
};

export const getActivityById = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.USER]);

    const activity = await db.activity.findUnique({
      where: { id },
      include: {
        type: true,
      },
    });

    if (!activity) {
      return { error: "Activité non trouvée" };
    }

    return { success: "Activité récupérée avec succès", data: activity };
  } catch (error) {
    return { error: "Erreur lors de la récupération de l'activité" };
  }
};

export const createActivity = async (values: z.infer<typeof ActivitySchema>): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    const newActivity = await db.activity.create({
      data: {
        title: values.title,
        description: values.description,
        location: values.location,
        ageRange: values.ageRange,
        price: values.price,
        priceCategory: values.priceCategory,
        mood: values.mood,
        weather: values.weather,
        imageUrl: values.imageUrl,
        date: values.date ? new Date(values.date) : undefined,
        type: {
          connect: { id: values.typeId }, 
        },
      },
    });

    return { success: "Activité créée avec succès", data: newActivity };
  } catch (error) {
    return { error: "Erreur lors de la création de l'activité" };
  }
};


export const updateActivity = async (id: string, values: z.infer<typeof ActivitySchema>): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    const updatedActivity = await db.activity.update({
      where: { id },
      data: {
        title: values.title,
        description: values.description,
        location: values.location,
        ageRange: values.ageRange,
        price: values.price,
        priceCategory: values.priceCategory,
        mood: values.mood,
        weather: values.weather,
        imageUrl: values.imageUrl,
        date: values.date ? new Date(values.date) : undefined,
        type: {
          connect: { id: values.typeId }, 
        },
      },
    });

    return { success: "Activité mise à jour avec succès", data: updatedActivity };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour de l'activité" };
  }
};

export const deleteActivity = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    await db.activity.delete({
      where: { id },
    });

    return { success: "Activité supprimée avec succès" };
  } catch (error) {
    return { error: "Erreur lors de la suppression de l'activité" };
  }
};