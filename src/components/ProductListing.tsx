"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORIES } from "@/config";
import ImageSlider from "./ImageSlider";

interface ProductListingProps {
    product: Product | null;
    index: number;
}

export default function ProductListing({product, index}: ProductListingProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(true);
        }, index * 75);

        return () => clearTimeout(timer);
    }, [index]);

    if (!visible || !product) {
        return <ProductPlaceHolder />;
    }

    const label = PRODUCT_CATEGORIES.find(({value}) => value === product.category)?.label;

    const validUrls = product.images.map(({image}) => typeof image === "string" ? image : image.url).filter(Boolean) as string[];

    if (product && visible) {
        return (
            <Link className={cn("invisible h-full w-full cursor-pointer group/main", {
                "visible animate-in fade-in-5": visible,
            })} href={`/product/${product.id}`}>
                <div className="flex flex-col w-full">
                    <ImageSlider urls={validUrls} />
                    <h3 className="mt-4 font-medium text-gray-700 text-sm">{product.name}</h3>
                    <p className="mt-1 text-gray-500 text-sm">{label}</p>
                    <p className="mt-1 font-medium text-gray-900 text-sm">{formatPrice(product.price)}</p>
                </div>
            </Link>
        )
    }
}

function ProductPlaceHolder() {
    return (
        <div className="flex flex-col w-full">
            <div className="relative w-full bg-zinc-100 rounded-xl aspect-square overflow-hidden animate-pulse">
                <Skeleton className="w-full h-full" />
            </div>
            <Skeleton className="mt-4 w-2/3 h-4 rounded-lg animate-pulse" />
            <Skeleton className="mt-2 w-16 h-2 rounded-lg animate-pulse" />
            <Skeleton className="mt-2 w-12 h-2 rounded-lg animate-pulse" />
        </div>
    )

}