import { IconUsers } from '@tabler/icons-react';
import React from 'react';
import { getUser } from '@/actions/users';
import NotFound from '@/app/[...not_found]/page';
import { EditUserForm } from '@/components/dashboard/forms/edit-user-form';
import { User } from '@prisma/client';

interface UserDetailsProps {
  params: { userId: string };
}

export default async function UserDetails({ params }: UserDetailsProps) {
  const res = await getUser(params.userId);
  if (res.error) {
    return NotFound();
  }
  const userData: User = res.error ? null : res.data;

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <div className="flex flex-row items-center space-x-2 text-3xl font-bold">
          <IconUsers className="h-7 w-7" />
          <h2 className="tracking-tight">Modifier l'utilisateur</h2>
        </div>
        <EditUserForm userData={userData} />
      </div>
    </div>
  );
}
