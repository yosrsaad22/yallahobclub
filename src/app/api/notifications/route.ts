import { getNotificationsByUserId } from '@/data/notification';
import { currentUser } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const user = await currentUser();
  const id = user?.id;
  try {
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
    const notifications = await getNotificationsByUserId(id);
    if (!notifications) {
      return NextResponse.json({ error: 'user-not-found-error' }, { status: 404 });
    }
    return NextResponse.json({ success: 'notifications-fetch-success', data: notifications }, { status: 200 });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'notifications-fetch-error' }, { status: 500 });
  }
}
