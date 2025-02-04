import cleanOrphanFiles from '@/actions/files';
import { cleanNotifications } from '@/actions/notifications';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await cleanNotifications();
  return NextResponse.json({ success: 'Notifications cleanup successful' }, { status: 200 });
}
