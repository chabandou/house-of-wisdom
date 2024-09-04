import VerifyEmail from "@/components/VerifyEmail";
import Image from "next/image";

interface pageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default function VerifyEmailPage({ searchParams }: pageProps) {
  const token = searchParams.token;
  const email = searchParams.to;
  return (
    <div className="container relative flex flex-col items-center justify-center pt-20 lg:px-0">
      <div className="w-full mx-auto flex flex-col space-y-6 justify-center sm:w-[350px] ">
        {token && typeof token === "string" ? (
          <div className="grid gap-6">
            <VerifyEmail token={token} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-1">
            <div className="relative mb-4 w-60 h-60 text-muted-foreground">
              <Image src="/email-sent.svg" alt="email sent" fill />
            </div>
            <h3 className="text-3xl font-semibold">
              Check your email
            </h3>
            {email ? (
              <p className="text-muted-foreground text-center">We sent a verification link to <span className="font-bold">{email}</span>.</p>
            ) : (
              <p className="text-muted-foreground text-center">We sent a verification link to your email.</p> 

            )}
            <p className="text-sm text-muted-foreground text-center translate-y-2">
              If you don&apos;t see the email in your inbox, check your spam
              folder.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
