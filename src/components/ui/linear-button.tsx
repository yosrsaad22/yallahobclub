import { cva, VariantProps } from 'class-variance-authority';
import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Link } from '@/navigation';

type ButtonBaseProps = VariantProps<typeof buttonClasses> & {
  children: React.ReactNode;
};

interface ButtonAsAnchorProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

interface ButtonAsButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: never;
}

type ButtonProps = ButtonBaseProps & (ButtonAsAnchorProps | ButtonAsButtonProps);

const buttonClasses = cva('relative rounded-full inline-flex items-center', {
  variants: {
    variant: {
      primary: ['text-off-white bg-white bg-opacity-10 border-[1.8px] border-orange backdrop-filter-[12px]'],
      secondary: ['text-off-white bg-white bg-opacity-10 border border-transparent-white backdrop-filter-[12px]'],
    },
    size: {
      small: 'text-xs px-3 py-1 h-6',
      medium: 'text-md px-4 py-2 h-8',
      large: 'text-lg px-6 py-3 h-12',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export const Highlight = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={cn('highlight', className)}>{children}</span>
);

export const LinearButton = ({ children, variant, size, ...props }: ButtonProps) => {
  const classes = buttonClasses({ variant, size, className: props.className });

  if ('href' in props && props.href !== undefined) {
    return (
      <Link passHref {...props} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
};
