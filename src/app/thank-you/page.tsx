import PaymentStatus from "@/components/PaymentStatus";
import { fee, PRODUCT_CATEGORIES } from "@/config";
import { getPayloadClient } from "@/get-payload";
import { getServerSideUser } from "@/lib/payload-utils";
import { formatPrice } from "@/lib/utils";
import { Product, ProductFile, User } from "@/payload-types";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ThankYou({ searchParams }: PageProps) {
  const orderId = searchParams.orderId;
  const nextCookies = cookies();

  const { user } = await getServerSideUser(nextCookies);
  const payload = await getPayloadClient();

  const { docs: orders } = await payload.find({
    collection: "orders",
    depth: 2,
    where: {
      id: {
        equals: orderId,
      },
    },
  });

  const [order] = orders;

  if (!order) {
    return notFound();
  }

  const orderUserId =
    typeof order.user === "string" ? order.user : order.user.id;

  if (orderUserId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`);
  }

  const products = order.products as Product[];

  const orderTotal = products.reduce(
    (total, product) => total + product.price,
    0
  );
  return (
    <main className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          src="/checkout-thank-you.jpg"
          alt="Thank you"
          fill
          className="object-cover object-center w-full h-full"
        />
      </div>

      <div>
        <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:py-32 lg:max-w-7xl lg:px-8">
          <div className="lg:col-start-2">
            <p className="text-sm font-medium text-orange-600">
              Order Successful
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Thanks for your order!
              <span className="block mt-3 text-3xl">
                We&apos;ll ship it as soon as we can.
              </span>
            </h1>
            {order._isPaid ? (
              <p className="mt-2 text-base text-muted-foreground">
                Your order has been processed and will be shipped within 24
                hours.
                <br />
                We&apos;ve sent your reciept and order details to{" "}
                {typeof order.user !== "string" ? (
                  <span className="font-medium text-gray-900">
                    {order.user.email}
                  </span>
                ) : null}
                .
              </p>
            ) : (
              <p className="mt-2 text-base text-muted-foreground">
                We appreciate your order and we&apos;re currently processing it.
                Hang tight!
              </p>
            )}

            <div className="mt-16 text-sm font-medium">
              <div className="text-muted-foreground">Order nr.</div>
              <div className="mt-2 text-gray-900">{order.id}</div>
              <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-sm font-medium text-muted-foreground">
                {(order.products as Product[]).map((product) => {
                  const label = PRODUCT_CATEGORIES.find(
                    ({ value }) => value === product.category
                  )?.label;

                  const downloadUrl = (product.product_files as ProductFile)
                    .url;

                  const { image } = product.images[0];

                  return (
                    <li key={product.id} className="flex space-x-6 py-6">
                      <div className="relative h-24 w-24">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            src={image.url}
                            alt={`${product.name} image`}
                            fill
                            className="flex-none bg-gray-100 object-cover object-center rounded-md"
                          />
                        ) : null}
                      </div>

                      <div className="flex-auto flex flex-col justify-between">
                        <div className="space-y-1">
                          <h3 className="text-gray-900">{product.name}</h3>

                          <p className="my-1">Category: {label}</p>
                        </div>

                        {order._isPaid ? (
                          <a
                            href={downloadUrl!}
                            download={product.name}
                            className="text-orange-600 hover:underline underline-offset-2"
                          >
                            Download Book
                          </a>
                        ) : null}
                      </div>

                      <p className="flex-none font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </p>
                    </li>
                  );
                })}
              </ul>

              <div className="space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p className="text-gray-900">{formatPrice(orderTotal)}</p>
                </div>
                <div className="flex justify-between">
                  <p>Transaction fee</p>
                  <p className="text-gray-900">{formatPrice(fee)}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
                  <p className="text-base">Total</p>
                  <p className="text-base">{formatPrice(orderTotal + fee)}</p>
                </div>
              </div>

              <PaymentStatus
                orderEmail={(order.user as User).email}
                orderId={order.id}
                isPaid={order._isPaid}
              />

              <div className="mt-16 border-t border-gray-200 py-6 text-right">
                <Link
                  href="/products"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  Continue Shopping <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
