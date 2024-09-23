import { cn } from '@/lib/utils';
import { Link } from '@/navigation';
import { IconChevronRight } from '@tabler/icons-react';
import React from 'react';

type BreadCrumbType = {
  title: string;
  link: string;
};

type BreadCrumbPropsType = {
  items: BreadCrumbType[];
};

export default function BreadCrumb({ items }: BreadCrumbPropsType) {
  return (
    <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href={'/dashboard'} className="overflow-hidden text-ellipsis whitespace-nowrap font-normal">
        Dashboard
      </Link>
      {items?.map((item: BreadCrumbType, index: number) => (
        <React.Fragment key={item.title}>
          <IconChevronRight className="h-5 w-5" />
          <Link
            href={item.link}
            className={cn(
              'font-normal',
              index === items.length - 1
                ? 'pointer-events-none font-semibold text-foreground'
                : 'font-normal text-muted-foreground',
            )}>
            {item.title}
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}
