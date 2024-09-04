"use client";

import { trpc } from "@/trpc/client";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

export default function VerifyEmail({ token }: { token: string }) {
  const { data, isLoading, isError } = trpc.auth.verifyEmail.useQuery({
    token,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2">
        <XCircle className="h-32 w-32 text-red-600" />
        <h3 className="font-semibold text-xl">Something went wrong</h3>
        <p className="text-muted-foreground text-sm text-center">
          This token is not valid or might be expired. Please try again later.
        </p>
      </div>
    );
  }

  if (data?.success) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className="relative mb-4 w-60 h-60 text-muted-foreground">
          <Image src="/email-verified.svg" alt="email sent" fill />
        </div>
        <h3 className="text-3xl font-semibold ">You&apos;re all set!</h3>
        <p className="text-muted-foreground text-center mt-1">
          You&apos;ve successfully verified your email.
        </p>
        <Link className={buttonVariants({ className: "mt-4" })} href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
        <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-32 w-32 text-teal-800 animate-spin" />
        <h3 className="font-semibold text-xl">Verifying your email...</h3>
        <p className="text-muted-foreground text-sm text-center">
          This might take a few seconds.
        </p>
      </div>
    )
  }
}
