import cleanOrphanFiles from '@/actions/files';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await cleanOrphanFiles();
  return NextResponse.json({ success: 'Orphan files cleanup successful' }, { status: 200 });
}
