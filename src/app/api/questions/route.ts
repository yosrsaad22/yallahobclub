import { NextApiRequest, NextApiResponse } from 'next';

// Define types for category and question
interface Question {
  id: string;
  question: string;
  categoryId: string;
}

interface Category {
  id: string;
  title: string;
  questions: Question[];
}

const dummyCategories: Category[] = [
  {
    id: '1',
    title: 'حبّك بهناس',
    questions: [
      { id: '1', question: 'شنوا تتفكر من أول مرة خرجنا فيها مع بعضنا ?', categoryId: '1' },
      { id: '2', question: 'حسب رايك شنيا أحسن هدية جاتني من عندك ?', categoryId: '1' },
    ],
  },
  {
    id: '2',
    title: 'عرّي حقيقتك',
    questions: [
      { id: '3', question: 'شنوا أكثر تجارب مستك في حياتك?', categoryId: '2' },
    ],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle the POST request to add a new question
  if (req.method === 'POST') {
    const { categoryId, question } = req.body;

    if (!categoryId || !question) {
      return res.status(400).json({ error: 'Category ID and question are required' });
    }

    // Simulate adding the question to the database
    const newQuestion: Question = {
      id: String(Date.now()), // Use a unique ID based on current timestamp
      question,
      categoryId,
    };

    // Find the category and add the new question
    const category = dummyCategories.find((cat) => cat.id === categoryId);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    category.questions.push(newQuestion);

    // Return the new question in the response
    return res.status(201).json(newQuestion);
  }

  // Method Not Allowed for other HTTP methods
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
