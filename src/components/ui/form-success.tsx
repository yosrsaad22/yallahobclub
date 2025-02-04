import { IconCircleCheck } from '@tabler/icons-react';

interface FormErrorProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className="mt-10 flex flex-row items-center gap-x-3 rounded-md bg-success p-3 text-sm text-success-foreground">
      <div className="flex h-full w-12 flex-col justify-center">
        <IconCircleCheck className="h-6 w-6"></IconCircleCheck>
      </div>
      <p>{message}</p>
    </div>
  );
};
