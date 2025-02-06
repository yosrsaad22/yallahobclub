import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import { IconWorld } from '@tabler/icons-react';

const locales = [
  {
    value: 'fr',
    img: '/img/fr.webp',
  },
  {
    value: 'en',
    img: '/img/uk.webp',
  },
];

export function LanguageToggle() {
  const pathName = usePathname();
  const [open, setOpen] = React.useState(false);
  const currentLocale = pathName.split('/')[1];
  const validLocale = locales.find((locale) => locale.value === currentLocale);
  const [value, setValue] = React.useState(validLocale ? validLocale.value : locales[0].value);

  const handleSelect = (newValue: string) => {
    setValue(newValue);
    setOpen(false);
  };

  const getSelectedLocale = () => locales.find((locale) => locale.value === currentLocale);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className="bg-transparent hover:bg-gray-700 " size={'sm'}>
          <IconWorld className="mr-2" />
          <p className="text-md py-2 font-bold">{getSelectedLocale()!.value.toUpperCase()}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-[100] mt-5 w-[75px]  rounded-[0.375rem] border-gray-400/[0.4] bg-dark/20 p-0 text-sm text-light backdrop-blur-md">
        <Command className="">
          <CommandGroup>
            {locales.map((locale) => (
              <CommandItem
                key={locale.value}
                value={locale.value}
                onSelect={() => handleSelect(locale.value)}
                className={cn('flex items-center justify-center rounded-[0.375rem] p-1 hover:bg-[hsl(0,0%,14.9%)] ')} // Highlight selected flag
              >
                <Link passHref href={pathName.replace(currentLocale, locale.value)}>
                  <p className="text-md py-2 font-bold">{locale.value.toUpperCase()}</p>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
