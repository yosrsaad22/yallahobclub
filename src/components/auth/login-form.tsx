"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import z from "zod";
import { LabelInputContainer } from "@/components/ui/label-input-container";
import { LoginSchema } from "@/schemas";
import { FormError } from "@/components/ui/form-error";
import { login } from "@/actions/auth";
import { Button } from "../ui/button";
import { ActionResponse } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconLoader2, IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function LoginForm({ className }: LoginFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>("");
  const router = useRouter();

  type schemaType = z.infer<typeof LoginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<schemaType>({ resolver: zodResolver(LoginSchema) });

  const onSubmit: SubmitHandler<schemaType> = (data, event) => {
    event?.preventDefault();
    setError("");
    startTransition(() => {
      login(data).then((res: ActionResponse) => {
        if (res.error) {
          setError(res.error);
        } else {
          router.push(`/dashboard/${res.data}`);
        }
      });
    });
  };

  const handleGoogleLogin = async () => {
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className={cn("mx-auto grid max-w-[25rem] gap-6", className)}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            disabled={isLoading}
            placeholder="Email@email.com"
            type="email"
            className="text-foreground"
          />
          {errors.email && <span className="text-xs text-red-400">L'adresse email est invalide</span>}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="flex items-end justify-between">
            Mot de Passe
            <Link href={"/forgot-password"}>
              <span className="text-xs text-foreground underline hover:text-red-500">Mot de passe oublié?</span>
            </Link>
          </Label>
          <Input
            {...register("password")}
            id="password"
            disabled={isLoading}
            placeholder="Mot de Passe"
            type="password"
            className="text-foreground"
          />
          {errors.password && <span className="text-xs text-red-400">Le mot de passe est invalide</span>}
        </LabelInputContainer>
        <FormError message={error} />
        <div className="mt-10 text-center">
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full bg-red-500 text-white hover:bg-red-600 active:bg-red-600"
          >
            {isLoading && <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />}
            Se Connecter
          </Button>

          {/* Google Login Button */}
          <Button
            onClick={handleGoogleLogin}
            type="button"
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <IconBrandGoogle className="h-5 w-5" />
            Se connecter avec Google
          </Button>

          <div className="relative mt-4 flex flex-row justify-center text-sm">
            <Link href={"/register"}>
              <span className="px-2 text-foreground underline hover:text-red-500">S'inscrire</span>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
