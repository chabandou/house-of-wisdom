import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/ProductReel";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle, HandHeart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const perks = [
  {
    name: "Instant delivery",
    icon: ArrowDownToLine,
    description: "Get your order in as fast as 1 business day.",
  },
  {
    name: "Guaranteed Quality",
    icon: CheckCircle,
    description:
      "We offer a selection of rich books filled with knowledge and experience at the best prices.",
  },
  {
    name: "Be a part of something bigger",
    icon: HandHeart,
    description:
      "We've pledged 5% of all the profits from our product sales to be donated to charity.",
  },
];

export default function Home() {
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center justify-center max-w-3xl">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-900">
            Your digital marketplace for quality{" "}
            <span className=" text-orange-600">Books</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to House of Wisdom, Where every book takes you on an
            exhilarating journey to find your better self.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <Link href="/products" className={buttonVariants()}>
              Begin your journey
            </Link>
            <Button variant="outline">More about us &rarr;</Button>
          </div>
        </div>

        <ProductReel
          query={{ sort: "desc", limit: 4 }}
          title="New Arrivals"
          subtitle="These are the latest releases"
          href="/products"
        />
        
      </MaxWidthWrapper>
      <section className="border-t border-gray-200 bg-gray-50">
        <MaxWidthWrapper className="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6  lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
            {perks.map((perk) => (
              <div
                key={perk.name}
                className="text-center md:flex md:text-left md:items-start lg:block lg:text-center"
              >
                <div className="flex-shrink-0 flex justify-center">
                  <div className="h-16 w-16 flex justify-center items-center rounded-full bg-orange-100 text-orange-900">
                    {<perk.icon className="w-1/3 h-1/3" />}
                  </div>
                </div>
                <div className="mt-6 md:mt-0 md:ml-4 lg:mt-6 lg:ml-0">
                  <h3 className="text-base font-medium text-gray-900">
                    {perk.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
