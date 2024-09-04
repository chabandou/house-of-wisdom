"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const isSeller = searchParams.get("as") === "seller";
  const origin = searchParams.get("origin");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const router = useRouter();

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: () => {
      toast.success("Successfully signed in.");
      
      if (origin) {
          router.push(origin);
          return;
        }
        
        if (isSeller) {
            router.push("/sell");
            return;
        }
        
        router.push("/");
        router.refresh();
    },

    onError: (error) => {
      if (error.data?.code === "UNAUTHORIZED") {
        toast.error("Incorrect email or password");
        return;
      }
    },
  });

  function onSubmit({ email, password }: TAuthCredentialsValidator) {
    signIn({ email, password });
  }

  function continueAsSeller() {
    router.push("?as=seller");
  }
  function continueAsCustomer() {
    router.replace("/sign-in", undefined);
  }

  return (
    <>
      <div className="container relative pt-20 flex flex-col justify-center items-center lg:px-0">
        <div className="mx-auto flex w-1/3 flex-col justify-center space-y-6 sw:w-[350px]">
          <div className="flex flex-col space-y-2 items-center text-center">
            <Icons.logo className="h-20 w-20" />
            <h1 className="text-2xl font-bold">Sign in to your {isSeller && "seller"} account</h1>
            <Link
              href="/sign-up"
              className={buttonVariants({
                variant: "link",
                className: "gap-1",
              })}
            >
              Don&apos;t have an account? Sign up{" "}
              <span className="group-hover:translate-x-1 transition-all ease-out">
                &rarr;
              </span>
            </Link>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-2">
                <div className="grid gap-1 py-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.email,
                    })}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-sm">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-1 py-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    {...register("password")}
                    className={cn({
                      "focus-visible:ring-red-500": errors.password,
                    })}
                    id="password"
                    type="password"
                    placeholder="Your password"
                  />
                  {errors?.password && (
                    <p className="text-red-500 text-sm">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button>Sign In</Button>
              </div>
            </form>

            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            {isSeller ? (
                <Button onClick={continueAsCustomer} variant={"secondary"} disabled={isLoading}>Continue as Customer</Button>
            ) : (
                <Button onClick={continueAsSeller} variant={"secondary"} disabled={isLoading}>Continue as Seller</Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
