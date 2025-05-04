"use server";

import { roleGuard } from "@/lib/auth";
import { db } from "@/lib/db";
import { ArticleSchema } from "@/schemas";
import { ActionResponse } from "@/types";
import { UserRole } from "@prisma/client";
import { z } from "zod";

/**
 * Récupérer tous les articles
 */
export const getArticles = async (): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.USER]);

    const articles = await db.article.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: "Articles récupérés avec succès", data: articles };
  } catch (error) {
    return { error: "Erreur lors de la récupération des articles" };
  }
};

/**
 * Récupérer un article par ID
 */
export const getArticleById = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN, UserRole.USER]);

    const article = await db.article.findUnique({ where: { id } });

    if (!article) {
      return { error: "Article non trouvé" };
    }

    return { success: "Article récupéré avec succès", data: article };
  } catch (error) {
    return { error: "Erreur lors de la récupération de l'article" };
  }
};

/**
 * Créer un nouvel article
 */
export const createArticle = async (
  values: z.infer<typeof ArticleSchema>
): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    const newArticle = await db.article.create({
      data: {
        title: values.title,
        description: values.description,
        image: values.image,
        type: { connect: { id: values.typeId } }, 
        category: { connect: { id: values.categoryId } },
      },
    });

    return { success: "Article créé avec succès", data: newArticle };
  } catch (error) {
    return { error: "Erreur lors de la création de l'article" };
  }
};

/**
 * Mettre à jour un article
 */
export const updateArticle = async (
  id: string,
  values: z.infer<typeof ArticleSchema>
): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    const updatedArticle = await db.article.update({
      where: { id },
      data: {
        title: values.title,
        description: values.description,
        image: values.image,
        categoryId: values.categoryId,
      },
    });

    return { success: "Article mis à jour avec succès", data: updatedArticle };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour de l'article" };
  }
};

/**
 * Supprimer un article
 */
export const deleteArticle = async (id: string): Promise<ActionResponse> => {
  try {
    await roleGuard([UserRole.ADMIN]);

    await db.article.delete({ where: { id } });

    return { success: "Article supprimé avec succès" };
  } catch (error) {
    return { error: "Erreur lors de la suppression de l'article" };
  }
};
