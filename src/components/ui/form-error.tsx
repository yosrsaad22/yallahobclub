import { IconExclamationCircle } from '@tabler/icons-react';

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className="mt-10 flex flex-row items-center gap-x-3 rounded-md bg-destructive p-3 text-sm text-destructive-foreground">
      <div className="flex h-full w-12 flex-col  justify-center">
        <IconExclamationCircle className="h-6 w-6"></IconExclamationCircle>
      </div>
      <p>{message}</p>
    </div>
  );
};
