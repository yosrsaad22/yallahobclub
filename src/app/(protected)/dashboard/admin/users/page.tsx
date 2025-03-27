import { IconUsers } from '@tabler/icons-react';
import React from 'react';
import { ActionResponse } from '@/types';
import { getUsers } from '@/actions/users';
import { User } from '@prisma/client';
import { UserTable } from '@/components/dashboard/tables/user-table';

export default async function Utilisateurs() {
  const res: ActionResponse = await getUsers();
  const usersData: User[] = res.error ? [] : res.data;

  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconUsers className="h-7 w-7" />
          <h2 className="tracking-tight">Utilisateurs</h2>
        </div>
        <UserTable users={usersData} />
      </div>
    </div>
  );
}
