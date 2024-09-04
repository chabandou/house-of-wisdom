import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { Icons } from "./Icons";
import NavItems from "./NavItems";
import { buttonVariants } from "./ui/button";
import Cart from "./Cart";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import UserAccountNav from "./UserAccountNav";

export default async function Navbar() {
  const nextCookies = cookies();
  const { user } = await getServerSideUser(nextCookies);
  

  return (
    <div className="bg-white sticky top-0 inset-x-0 z-50 h-16">
      <header className="relative bg-white">
        <MaxWidthWrapper>
          <div className="border-b border-gray-200">
            <div className="flex h-16 items-center">
              {/* TODO: mobile nav */}
              <div className="ml-4 lg:ml-0 flex">
                <Link href="/">
                  <Icons.logo className="w-10 h-10" />
                </Link>
              </div>
              <div className="hidden z-50 lg:block lg:self-stretch lg:ml-8">
                <NavItems />
              </div>
              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-6">
                  {user ? null : (
                    <Link
                      href="/sign-in"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Log in <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  )}
                  {user ? null : (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  )}

                  {user ? <UserAccountNav user={user} /> : (
                    <Link
                      href="/sign-up"
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      Sign up
                    </Link>
                  )}

                  {user ? (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  ) : null}

                  {user ? null : (
                    <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  )}

                  <div className="ml-4 lg:ml-6 flow-root">
                    <Cart />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </header>
    </div>
  );
}
