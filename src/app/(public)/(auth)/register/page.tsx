import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export default function Register() {
  return (
    <>
      <div className="mx-auto mt-28 flex min-h-screen w-full  max-w-5xl flex-col  ">
        <div className=" mx-4   md:mx-8">
          <div className="flex flex-col gap-y-4 pb-4 text-center">
            <h1 className="  mx-2  py-2 text-3xl font-semibold leading-none  md:text-[3rem]">Créer un compte</h1>
            <p className="text-md mx-auto mb-4 max-w-md text-muted-foreground">
              Créez un compte pour accéder à votre compte
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </>
  );
}
