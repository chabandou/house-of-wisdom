"use client";

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "../payload-types";
import { trpc } from "@/trpc/client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import ProductListing from "./ProductListing";

interface ProductReelProps {
  title: string;
  subtitle?: string;
  href?: string;
  query: TQueryValidator;
}

const FALL_BACK_LIMIT = 4;

export default function ProductReel(props: ProductReelProps) {
  const { title, subtitle, href, query } = props;

  const { data: queryResults, isLoading } =
    trpc.getInfiniteProducts.useInfiniteQuery(
      {
        limit: query.limit ?? FALL_BACK_LIMIT,
        query,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextPage,
      }
    );

  const products = queryResults?.pages.flatMap((page) => page.items);

  let map: (Product | null)[] = [];

  if (products && products.length) {
    // @ts-ignore
    map = products;
  } else if (isLoading) {
    map = new Array<null>(query.limit ?? FALL_BACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="md:flex md:items-center md:justify-between mb-4">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          {title && (
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {href && (
          <Link
            href={href}
            className="group hidden lg:flex lg:items-start lg:justify-start text-sm font-medium text-orange-600 hover:text-orange-400 "
          >
            Shop Collection{" "}
            <span className="" aria-hidden="true">
              <ArrowRightIcon className="w-4 group-hover:translate-x-2 translate-x-1 transition-transform" />
            </span>
          </Link>
        )}

        <div className="relative">
          <div className="flex items-center w-full mt-6 ">
            <div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
                {map.map((product, i) => (
                    <ProductListing key={i} index={i} product={product} />
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
