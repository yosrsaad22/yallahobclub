"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useState } from "react";

export function GoogleAuthButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
    setLoading(false);
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600"
      disabled={loading}
    >
      <IconBrandGoogle className="h-5 w-5" />
      {loading ? "Connexion..." : "Se connecter avec Google"}
    </Button>
  );
}
