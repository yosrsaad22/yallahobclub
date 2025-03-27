import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Link, { LinkProps } from 'next/link';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        none: '',
        default: 'bg-foreground border border-input text-background hover:bg-foreground/80',
        success: 'bg-success border border-input text-white hover:bg-success/80',
        primary: 'bg-primary text-white hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-muted/60',
        secondary: 'bg-secondary text-white hover:bg-secondary/80',
        ghost: 'border-none bg-transparent text-foreground  focus:outline-none active:ring-0',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-10  px-3 text-sm font-normal',
        default: 'h-11 px-6 py-2 text-sm font-semibold',
        lg: 'h-12  px-8 py-2 text-md font-semibold',
        full: 'h-12 w-full  px-8 py-2 text-md font-semibold',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export interface LinkButtonProps extends LinkProps, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, href, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'a';
    return (
      <Link href={href} legacyBehavior passHref>
        <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
          {children}
        </Comp>
      </Link>
    );
  },
);
LinkButton.displayName = 'LinkButton';

export { Button, LinkButton, buttonVariants };
