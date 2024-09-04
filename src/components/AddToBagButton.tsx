"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/payload-types";

export default function AddToBagButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSuccess(false);
    }, 3000);

    return () => clearTimeout(timeOut);
  }, [success]);

  return (
    <Button
      onClick={() => {
        addItem(product);
        setSuccess(true);
      }}
      size={"lg"}
      className="w-full transition"
      variant={success ? "ghost" : "default"}
    >
      {success ? (
        <span className="animate-in fade-in-0 duration-500">
          Added to your Bag!
        </span>
      ) : (
        <span>Add to Bag</span>
      )}
    </Button>
  );
}
