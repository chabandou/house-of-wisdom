import AddToBagButton from "@/components/AddToBagButton";
import ImageSlider from "@/components/ImageSlider";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { PRODUCT_CATEGORIES } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { formatPrice } from "@/lib/utils";
import { Check, ChevronRight, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    productId: string;
  };
}

const BREADCRUMBS = [
  { id: 1, name: "Home", href: "/" },
  { id: 2, name: "Products", href: "/products" },
];

export default async function ProductPage({ params }: PageProps) {
  const { productId } = params;
  const payload = await getPayloadClient();

  const { docs: products } = await payload.find({
    collection: "products",
    limit: 1,
    where: {
      id: {
        equals: productId,
      },
      approvedForSale: {
        equals: "approved",
      },
    },
    depth: 1,
  });

  const [product] = products;

  if (!product) {
    return notFound();
  }

  const label = PRODUCT_CATEGORIES.find(
    ({ value }) => value === product.category
  )?.label;


  const validUrls = product.images 
    .map(({ image }) => (typeof image === "string" ? image : image.url)) 
    .filter(Boolean) as string[];

  return (
    <MaxWidthWrapper className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:max-w-7xl lg:gap-x-8 lg:px-8">
          {/* product details */}
          <div className="lg:max-w-lg lg:self-end">
            <ol className="flex items-center space-x-2">
              {BREADCRUMBS.map((item, i) => (
                <li key={item.href} className="flex items-center text-sm">
                  <Link
                    href={item.href}
                    className="font-medium text-sm text-muted-foreground hover:text-gray-900"
                  >
                    {item.name}
                  </Link>
                  {i < BREADCRUMBS.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-1 self-end" />
                  )}
                </li>
              ))}
            </ol>

            <div className="mt-4">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <section className="mt-4">
              <div className="flex items-center ">
                <p className="font-medium text-gray-900">
                  {formatPrice(product.price)}
                </p>

                <div className="ml-4 border-l border-gray-300 pl-4 text-muted-foreground">
                  {label}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-base text-muted-foreground">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 flex items-center">
                <Check className="h-5 w-5 text-teal-500 flex-shrink-0" />
                <p className="ml-2 text-sm text-muted-foreground">
                  Eligible for instant delivery
                </p>
              </div>
            </section>
          </div>

          {/* product images */}

          <div className="mt-10 lg:col-start-2 lg:row-span-2 lg:mt-0 lg:self-center">
            <div className="aspect-square rounded-lg">
              <ImageSlider urls={validUrls} />
            </div>
          </div>

          {/* add to cart */}

          <div className="mt-10 lg:col-start-1 lg:row-start-2 lg:max-w-lg lg:self-start">
            <div>
              <div className="mt-10">
                <AddToBagButton product={product} />
              </div>
              <div className="mt-6 text-center">
                <div className="group inline-flex text-sm font-medium">
                  <Shield
                    aria-hidden="true"
                    className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400"
                  />
                  <span className="text-muted-foreground hover:text-gray-700">
                    30 Day Return Guarantee
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductReel
        href="/products"
        query={{ category: product.category, limit: 4 }}
        title={`Similar ${label} Books`}
        subtitle={`Browse similar high-quality ${label} books from our collection.`}
      />
    </MaxWidthWrapper>
  );
}
