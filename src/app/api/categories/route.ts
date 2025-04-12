import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET method to fetch categories and their associated questions for a specific user
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId'); // Assuming userId is passed in query parameters

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const categories = await prisma.category.findMany({
      where: { userId }, // Filter by userId to fetch only categories for the logged-in user
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}

// POST method to add a new category (and associated questions) for a specific user
export async function POST(req: Request) {
  const body = await req.json();
  const { userId, title, image, backImage, backColor, questions } = body;

  // Check if the user is authorized to add categories (could be the admin or a logged-in user)
  if (!userId || !title || !questions || questions.length === 0) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    // Create the category and associated questions
    const newCategory = await prisma.category.create({
      data: {
        title,
        image,
        backImage,
        backColor,
        userId, // Associate the category with the specific user
        questions: {
          create: questions.map((question: string) => ({
            question,
          })),
        },
      },
    });

    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating category' }, { status: 500 });
  }
}
