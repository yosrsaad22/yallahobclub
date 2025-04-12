// app/api/questions/[id]/route.ts
import { prisma } from '@/lib/prisma'; // Import Prisma client
import { NextResponse } from 'next/server'; // Import Next.js server response utilities

// Handle GET, PUT, and DELETE requests for a single question by its ID
export async function GET({ params }: { params: { id: string } }) {
  const { id } = params; // Extract the ID parameter from the URL

  // Fetch the question from the database by ID
  const question = await prisma.question.findUnique({
    where: { id }, // Find the question by its unique ID
  });

  // If the question does not exist, return a 404 error
  if (!question) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 });
  }

  // Return the found question as a response
  return NextResponse.json(question);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Extract the ID from the URL
  const body = await req.json(); // Parse the JSON body of the request
  const { question } = body; // Extract the updated question data from the body

  // Update the question in the database with the new data
  const updatedQuestion = await prisma.question.update({
    where: { id }, // Find the question by its unique ID
    data: { question }, // Update the 'question' field with the new value
  });

  // Return the updated question as a response
  return NextResponse.json(updatedQuestion);
}

export async function DELETE({ params }: { params: { id: string } }) {
  const { id } = params; // Extract the ID from the URL

  // Delete the question from the database by its ID
  await prisma.question.delete({
    where: { id }, // Find and delete the question by its unique ID
  });

  // Return a success message after deletion
  return NextResponse.json({ message: 'Question deleted' });
}
