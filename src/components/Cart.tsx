"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

import { ShoppingBag, ShoppingCart } from "lucide-react";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { ScrollArea } from "./ui/scroll-area";
import CartItem from "./CartItem";
import { useEffect, useState } from "react";
import { fee } from "@/config";

export default function Cart() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { items, clearCart } = useCart();
  const itemCount = items.length;

  const cartTotal = items.reduce((total, item) => total + item.product.price, 0);

  return (
    <Sheet>
      <SheetTrigger className="group flex items-center -m-2 p-2 ">
        <ShoppingBag className="w-6 h-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
        <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
          {isMounted ? itemCount : 0}
        </span>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full pr-0 sm:max-w-lg">
        <SheetHeader className="pr-6 space-y-2.5">
          <SheetTitle>Bag ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <div className="flex flex-col w-full pr-6">
              <ScrollArea>
              {items.map(({ product }) => (
                <CartItem key={product.id} product={product} />
              ))}
              </ScrollArea>
            </div>
            <div className="space-y-4 pr-6">
              <Separator />
              <div className="space-y-6 text-sm">
                <div className="flex">
                  <span className="flex-1">Shipping</span>
                  <span>$0.00</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Transaction Fee</span>
                  <span>{formatPrice(fee)}</span>
                </div>
                <div className="flex">
                  <span className="flex-1">Total</span>
                  <span>{formatPrice(cartTotal + fee)}</span>
                </div>
              </div>
              <SheetFooter>
                <SheetTrigger asChild>
                  <Link
                    href="/cart"
                    className={buttonVariants({
                      className: "w-full",
                    })}
                  >
                    Continue to Checkout &rarr;
                  </Link>
                </SheetTrigger>
              </SheetFooter>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-1">
            <div
              aria-hidden="true"
              className="w-60 h-60 mb-4 relative text-muted-foreground"
            >
              <Image src="/empty-book-bag.png" alt="empty-shopping-bag" fill />
            </div>
              <span className="text-xl font-semibold">Your bag is empty</span>
            <SheetTrigger asChild>
              <Link
                href="/products"
                className={buttonVariants({
                  variant: "link",
                  size: "sm",
                  className: "text-sm text-muted-foreground", 
                })}
              >
                Add books to your bag to checkout
              </Link>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
