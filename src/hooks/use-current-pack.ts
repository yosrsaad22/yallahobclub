import { useSession } from 'next-auth/react';

export const useCurrentPack = () => {
  const session = useSession();
  return session.data?.user?.pack;
};
