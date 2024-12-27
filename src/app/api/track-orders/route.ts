import { trackOrders } from '@/actions/orders';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const res = await trackOrders();
  if (res.success) {
    console.log(res.data + ' orders tracked successfully');
    return NextResponse.json({ success: 'Orders tracked successfully' }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Error while tracking orders' }, { status: 501 });
  }
}
