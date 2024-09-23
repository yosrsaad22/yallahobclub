import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const locales = [
  {
    value: 'fr',
    img: '/img/fr.webp',
  },
  {
    value: 'tn',
    img: '/img/tn.webp',
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
        <Image
          src={getSelectedLocale()!.img}
          alt={`Flag for ${getSelectedLocale()!.value}`}
          width={72}
          height={64}
          className="h-auto w-[32px] cursor-pointer object-contain"
        />
      </PopoverTrigger>
      <PopoverContent className="z-[100] mt-5 w-[50px]  rounded-[0.375rem] border-gray-400/[0.4] bg-dark/20 p-0 text-sm text-light backdrop-blur-md">
        <Command className="bg-dark/20 backdrop-blur-md">
          <CommandGroup>
            {locales.map((locale) => (
              <CommandItem
                key={locale.value}
                value={locale.value}
                onSelect={() => handleSelect(locale.value)}
                className={cn('flex items-center rounded-[0.375rem] p-1 hover:bg-[hsl(0,0%,14.9%)] ')} // Highlight selected flag
              >
                <Link passHref href={pathName.replace(currentLocale, locale.value)}>
                  <Image
                    src={locale.img}
                    alt={`Flag for ${locale.value}`} // Descriptive alt text
                    width={72}
                    height={64}
                    className="h-auto w-[72px]  object-contain"
                  />
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
