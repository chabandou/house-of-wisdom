"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { PRODUCT_CATEGORIES } from "@/config";
import { Button } from "./ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

export default function NavItems() {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);

  const navRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(navRef, () => setActiveIndex(null));

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    }

      document.addEventListener("keydown", handler);
      
      return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, index) => {
        const handleOpen = () => {
          if (activeIndex === index) {
            setActiveIndex(null);
          } else {
            setActiveIndex(index);
          }
        };
        return (
          <NavItem
            key={index}
            category={category}
            handleOpen={handleOpen}
            isOpen={activeIndex === index}
            isAnyOpen={activeIndex !== null}
          />
        );
      })}
    </div>
  );
}

function NavItem({ category, handleOpen, isOpen, isAnyOpen }: NavItemProps) {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5"
          onClick={handleOpen}
          variant={isOpen ? "secondary" : "ghost"}
        >
          {category.label}
          <ChevronDown
            className={cn("w-4 h-4 transition-all text-muted-foreground", {
              "-rotate-180": isOpen,
            })}
          />
        </Button>
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute inset-x-0 text-sm text-muted-foreground top-full",
            {
              "animate-in fade-in-50 slide-in-from-top-1": !isAnyOpen,
            }
          )}
        >
          <div
            className="absolute inset-x-0 top-1/2 bg-white shadow"
            aria-hidden="true"
          />
          <div className="relative bg-white">
            <div className="mx-auto grid max-w-7xl px-8">
              <div className="grid grid-cols-4 gap-y-10 gap-x-8 py-16">
                <div className="col-span-4 col-start-1 grid grid-cols-3 gap-x-8">
                  {category.featured.map((item)=> (
                    <div className="group relative text-base sm:text-sm" key={item.name}>
                      <div className="relative aspect-video overflow-hidden rounded-lg group-hover:opacity-75 bg-gray-100">
                      <Image
                        src={item.imageSrc}
                        alt="product category image"
                        fill
                        className="object-cover object-center"
                      />
                      </div>
                      <Link
                        href={item.href}
                        className="mt-6 block font-medium text-gray-900"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1" aria-hidden="true">Shop now</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface NavItemProps {
  category: Category;
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
  key: number;
}

type Category = (typeof PRODUCT_CATEGORIES)[number];
