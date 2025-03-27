import { UserSettingsForm } from '@/components/dashboard/forms/user-settings-form';
import { IconSettings } from '@tabler/icons-react';

export default async function AdminSettings() {
  return (
    <div className="w-full">
      <div className="w-full space-y-4 p-4 pt-6 md:p-6">
        <div className="flex flex-row items-center space-x-2 text-3xl font-bold">
          <IconSettings className="h-7 w-7" />
          <h2 className=" text-3xl font-bold tracking-tight">Paramètres</h2>
        </div>
        <UserSettingsForm />
      </div>
    </div>
  );
}
