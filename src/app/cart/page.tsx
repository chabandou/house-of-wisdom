"use client";

import { cn, formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fee, PRODUCT_CATEGORIES } from "@/config";
import { Check, ImageIcon, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();

  const {mutate : createCheckoutSession, isLoading} = trpc.payment.createSession.useMutation({
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url);
      }
    },
  });

  
  const { items, removeItem } = useCart();
  
  const productIds = items.map(item => item.product.id);

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const cartTotal = items.reduce(
    (total, item) => total + item.product.price,
    0
  );

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
          Shopping Bag
        </h1>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div
            className={cn("lg:col-span-7", {
              "rounded-lg border-2 border-dashed border-zinc-200 p-12":
                isMounted && items.length === 0,
            })}
          >
            <h2 className="sr-only">Items in your bag</h2>

            {isMounted && items.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full space-y-1">
                <div
                  aria-hidden="true"
                  className="relative mb-4 h-40 w-40 text-muted-foreground"
                >
                  <Image
                    src="/empty-book-bag.png"
                    alt="empty-shopping-bag"
                    fill
                    loading="eager"
                  />
                </div>
                <h3 className="text-2xl font-semibold">Your bag is empty.</h3>
                <p className="text-sm text-muted-foreground text-center">
                  You can add items to your bag from the products page.
                </p>
              </div>
            )}

            <ul
              className={cn({
                "divide-y divide-gray-200 border-b border-t border-gray-200 ":
                  isMounted && items.length > 0,
              })}
            >
              {isMounted &&
                items.map((item, i) => {
                  const { image } = item.product.images[0];
                  const label = PRODUCT_CATEGORIES.find(
                    ({ value }) => value === item.product.category
                  )?.label;

                  return (
                    <li key={i} className="flex py-6 sm:py-10">
                      <div className="flex-shrink-0">
                        <div className="relative w-24 h-24">
                          {typeof image !== "string" && image.url ? (
                            <Image
                              src={image.url}
                              alt={item.product.name}
                              fill
                              className="absolute w-full h-full object-cover object-center rounded-md sm:w-48 sm:h-48"
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col flex-1 justify-between sm:ml-6">
                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:pr-0 sm:gap-x-6">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm font-medium text-gray-700">
                                <Link href={`/product/${item.product.id}`}>
                                  <span className="hover:text-gray-900">
                                    {item.product.name}
                                  </span>
                                </Link>
                              </h3>
                            </div>

                            <div className="mt-1 flex flex-col text-sm">
                              <p className="text-muted-foreground">
                                Category: {label}
                              </p>

                              <p className="mt-1 text-gray-900 text-sm font-medium ">
                                {formatPrice(item.product.price)}
                              </p>
                            </div>
                          </div>
                          <div className="mt-4 sm:mt-0 sm:pr-9 w-20 ">
                            <div className="absolute top-0 right-0">
                              <Button
                                variant="ghost"
                                aria-label="Remove"
                                onClick={() => removeItem(item.product.id)}
                              >
                                <X className="w-5 h-5" aria-hidden="true" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <p className="mt-3 flex space-x-2 text-sm text-gray-700">
                          <Check
                            className="w-5 h-5 flex-shrink-0 text-teal-500"
                            aria-hidden="true"
                          />
                          <span>Eligible for instant delivery</span>
                        </p>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </div>

          <section className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="font-medium text-gray-900 text-lg">Order Summury</h2>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">Subtotal</p>
                <p className="text-sm text-gray-900 font-medium">
                  {isMounted ? (
                    formatPrice(cartTotal)
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                  )}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>Flat transaction fee</span>
                </div>
                <div className="text-sm text-gray-900 font-medium">
                  {isMounted ? (
                    formatPrice(fee)
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="text-base font-medium text-gray-900">
                  Order Total
                </div>
                <div className="text-base text-gray-900 font-medium">
                  {isMounted ? (
                    formatPrice(cartTotal + fee)
                  ) : (
                    <Loader2 className="w-5 h-5 animate-spin text-teal-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button disabled={items.length === 0 || isLoading} onClick={() => createCheckoutSession({productIds})} variant="default" size="lg" className="w-full">
                {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-3" />}
                
                Check Out
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
