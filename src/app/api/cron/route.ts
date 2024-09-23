import cleanOrphanFiles from '@/actions/files';
import { NextResponse } from 'next/server';

export async function GET() {
  const res = await cleanOrphanFiles();
  return NextResponse.json(res);
}
