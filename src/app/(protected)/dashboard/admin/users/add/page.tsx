import { IconUsers } from '@tabler/icons-react';
import React from 'react';
import { AddUserForm } from '@/components/dashboard/forms/add-user-form';

export default async function UserAdd() {
  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconUsers className="h-7 w-7" />
          <h2 className="tracking-tight">Ajouter un utilisateur</h2>
        </div>
        <AddUserForm />
      </div>
    </div>
  );
}
