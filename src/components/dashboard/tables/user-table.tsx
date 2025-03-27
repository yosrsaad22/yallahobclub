'use client';

import { User } from '@prisma/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { IconEdit, IconPlus, IconTrash, IconLoader2 } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ActionResponse } from '@/types';
import { deleteUser } from '@/actions/users';
import { useToast } from '@/components/ui/use-toast';
import { MEDIA_HOSTNAME } from '@/lib/constants';
import { useCurrentUser } from '@/hooks/use-current-user';
import { useState } from 'react';

interface UserTableProps {
  users: User[];
}

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const currentUser = useCurrentUser();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDeleteUser = async (id: string) => {
    try {
      setDeletingId(id);
      const res: ActionResponse = await deleteUser(id);
      if (res.success) {
        toast({
          variant: 'success',
          title: 'Succès',
          description: res.success,
        });
        router.refresh();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erreur',
          description: res.error || 'Une erreur est survenue',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la suppression',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUsers = users.filter((user) => user.email !== currentUser?.email);

  return (
    <div className="space-y-8">
      <div className="flex justify-start">
        <Button onClick={() => router.push('/dashboard/admin/users/add')} className="flex items-center gap-2">
          <IconPlus className="h-8 w-8" />
          Add User
        </Button>
      </div>

      <div className="mt-8 rounded-md border">
        <Table>
          <TableHeader className="">
            <TableRow className="pl-8">
              <TableHead className="pl-8">Image</TableHead>
              <TableHead className="pl-8">Nom complet</TableHead>
              <TableHead className="pl-8">Email</TableHead>
              <TableHead className="pl-8">Numéro de téléphone</TableHead>
              <TableHead className="pl-8">Adresse</TableHead>
              <TableHead className="pl-8">Rôle</TableHead>
              <TableHead className="pl-8">Etape</TableHead>
              <TableHead className="pl-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className="pl-8">
                <TableCell className="pl-8">
                  {user.image ? (
                    <Image
                      src={MEDIA_HOSTNAME + user.image}
                      alt={user.fullName}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200" />
                  )}
                </TableCell>
                <TableCell className="pl-8">{user.fullName}</TableCell>
                <TableCell className="pl-8">{user.email}</TableCell>
                <TableCell className="pl-8">{user.number}</TableCell>
                <TableCell className="pl-8">{user.address}</TableCell>
                <TableCell className="pl-8">{user.role}</TableCell>
                <TableCell className="pl-8">Etape {user.onBoarding}</TableCell>
                <TableCell className="pl-8">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/admin/users/${user.id}`)}>
                      <IconEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={deletingId === user.id}
                      onClick={() => handleDeleteUser(user.id)}>
                      {deletingId === user.id ? (
                        <IconLoader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <IconTrash className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
