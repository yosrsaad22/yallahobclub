import cleanOrphanFiles from '@/actions/files';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const res = await cleanOrphanFiles();
  return NextResponse.json(res);
}
