import { LoginForm } from '@/components/auth/login-form';


export default function Login() {
  return (
    <>
      <div className="z-[100] mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center py-16">
        <div className="mx-12 ">
          <div className="flex flex-col gap-y-4 py-4 text-center">
            <h1 className="mx-2 py-2 text-3xl font-semibold leading-none text-black md:text-[3rem]">Se Connecter</h1>
            <p className="text-md mx-auto mb-4 max-w-md text-muted-foreground">
              Connectez-vous pour accéder à votre compte
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </>
  );
}
