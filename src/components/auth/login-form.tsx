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
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconLoader2, IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type LoginFormData = z.infer<typeof LoginSchema>;

export function LoginForm({ className }: LoginFormProps) {
  const [isLoading, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | undefined>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data, event) => {
    event?.preventDefault();
    setError(undefined);

    startTransition(() => {
      signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
        .then((res) => {
          if (res?.error) {
            setError("Email ou mot de passe invalide.");
          } else {
            router.push("/dashboard/admin");
          }
        })
        .catch(() => setError("Une erreur est survenue. Veuillez réessayer."));
    });
  };
  const handleGoogleLogin = async () => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (err) {
      setError("Erreur de connexion avec Google.");
    }
  };

  return (
    <div className={cn("mx-auto grid max-w-[25rem] gap-6", className)}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="Email@email.com"
            disabled={isLoading}
            className="text-foreground"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <span className="text-xs text-red-400">
              L'adresse email est invalide
            </span>
          )}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="flex items-end justify-between">
            Mot de passe
            <Link href="/forgot-password">
              <span className="text-xs underline text-foreground hover:text-red-500">
                Mot de passe oublié ?
              </span>
            </Link>
          </Label>
          <Input
            {...register("password")}
            id="password"
            type="password"
            placeholder="Mot de passe"
            disabled={isLoading}
            className="text-foreground"
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <span className="text-xs text-red-400">
              Le mot de passe est invalide
            </span>
          )}
        </LabelInputContainer>

        <FormError message={error} />

        <div className="mt-10 text-center">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 text-white hover:bg-red-600"
          >
            {isLoading && (
              <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
            )}
            Se connecter
          </Button>

          <Button
            type="button"
            onClick={handleGoogleLogin}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <IconBrandGoogle className="h-5 w-5" />
            Se connecter avec Google
          </Button>

          <p className="mt-4 text-sm text-muted-foreground">
            Vous n'avez pas de compte ?{" "}
            <Link
              href="/register"
              className="text-foreground underline hover:text-red-500"
            >
              S'inscrire
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
