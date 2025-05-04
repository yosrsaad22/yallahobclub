'use server'

import { roleGuard } from "@/lib/auth";
import { db } from "@/lib/db";
import { CardSchema } from "@/schemas";
import { ActionResponse } from "@/types";
import { UserRole } from "@prisma/client";
import { z } from "zod";

export const getCards = async (typeId?: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.USER]);
    
    const questions = await db.question.findMany({
      where: typeId ? { typeId } : undefined,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return { success: 'Cartes récupérées avec succès', data: questions };
  } catch (error) {
    return { error: 'Erreur lors de la récupération des cartes' };
  }
};

export const getCardById = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.USER]);
    
    const question = await db.question.findUnique({
      where: { id }
    });

    if (!question) {
      return { error: 'Carte non trouvée' };
    }

    return { success: 'Carte récupérée avec succès', data: question };
  } catch (error) {
    return { error: 'Erreur lors de la récupération de la carte' };
  }
};

export const addCard = async (values: z.infer<typeof CardSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    const newQuestion = await db.question.create({
      data: {
        question: values.question,
        category: values.category,
        typeId: values.typeId || 'couple', 
      },
    });

    return { success: 'Carte créée avec succès', data: newQuestion };
  } catch (error) {
    console.error("Error creating card:", error);
    return { error: "Erreur lors de la création de la carte" };
  }
};

export const updateCard = async (id: string, values: z.infer<typeof CardSchema>): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    const updatedQuestion = await db.question.update({
      where: { id },
      data: {
        question: values.question,
        category: values.category,
        typeId: values.typeId, 
      },
    });

    return { success: 'Carte mise à jour avec succès', data: updatedQuestion };
  } catch (error) {
    console.error("Error updating card:", error);
    return { error: "Erreur lors de la mise à jour de la carte" };
  }
};

export const deleteCard = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    await db.question.delete({
      where: { id }
    });

    return { success: 'Carte supprimée avec succès' };
  } catch (error) {
    return { error: "Erreur lors de la suppression de la carte" };
  }
};