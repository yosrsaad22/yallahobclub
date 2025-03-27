import { cn } from '@/lib/utils';
import { NavItem } from '@/types';
import { Dispatch, SetStateAction } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSidebar } from '@/hooks/use-sidebar';
import { useCurrentUser } from '@/hooks/use-current-user';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({ items, setOpen, isMobileNav = false }: DashboardNavProps) {
  const path = usePathname(); // Get current route
  const { isMinimized, toggle } = useSidebar();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="flex flex-col justify-between">
      <TooltipProvider>
        <div className={cn('flex h-full flex-col justify-start py-2', isMinimized ? 'gap-3' : 'gap-1')}>
          {items.map(
            (item, index) =>
              item.href && (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'group relative flex items-center justify-center  gap-4 rounded-md px-[0.35rem] py-[0.35rem] text-sm font-medium hover:bg-white/95 hover:text-black/95 ',
                        path.split('/')[3] === items[index].title ||
                          (path.split('/')[1] === 'dashboard' &&
                            items[index].title === 'dashboard' &&
                            path.split('/')[3] === undefined)
                          ? 'bg-white/95   text-black/95'
                          : '',
                        isMinimized ? '' : 'pl-2',
                      )}
                      onClick={async () => {
                        if (setOpen) setOpen(false);
                      }}>
                      <div
                        className={cn(
                          path.split('/')[3] === items[index].title ||
                            (path.split('/')[1] === 'dashboard' &&
                              items[index].title === 'dashboard' &&
                              path.split('/')[3] === undefined)
                            ? ' text-black/95'
                            : 'text-white',
                          'group-hover:text-black/95',
                        )}>
                        {item.icon}
                      </div>

                      {isMobileNav || (!isMinimized && !isMobileNav) ? (
                        <div className="flex w-full flex-row justify-between">
                          <span className="mr-2 truncate">{item.title}</span>
                        </div>
                      ) : null}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="right"
                    sideOffset={8}
                    className={!isMinimized ? 'hidden bg-background' : 'inline-block bg-background'}>
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              ),
          )}
        </div>
      </TooltipProvider>
    </nav>
  );
}
