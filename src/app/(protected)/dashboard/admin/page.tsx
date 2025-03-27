import { IconLayoutDashboard } from '@tabler/icons-react';

export default async function AdminHome() {
  return (
    <div className="">
      <div className="flex-1 space-y-4 p-4 pt-6 lg:p-6">
        <div className="flex items-center space-x-2 text-3xl font-bold">
          <IconLayoutDashboard className="h-7 w-7" />
          <h2 className="tracking-tight">Tableau de bord Administrateur</h2>
        </div>
      </div>
    </div>
  );
}
