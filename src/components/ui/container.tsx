import { cn } from '@/lib/utils';

export const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={cn('mx-auto p-6 md:px-24', className)}>{children}</div>;
};
