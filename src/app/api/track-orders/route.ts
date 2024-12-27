import { trackOrders } from '@/actions/orders';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  console.log(req.headers.get('Authorization'));
  if (req.headers.get('Authorization') !== `Bearer ${process.env.TRACKING_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = await trackOrders();
  if (res.success) {
    return NextResponse.json({ success: res.data + ' orders tracked successfully ' }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Error while tracking orders' }, { status: 501 });
  }
}
