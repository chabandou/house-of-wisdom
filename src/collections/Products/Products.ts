import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { PRODUCT_CATEGORIES } from "../../config";
import { CollectionConfig } from "payload/types";
import { Product } from "../../payload-types";
import { stripe } from "../../lib/stripe";


const addUser: BeforeChangeHook<Product> = async ({ req, data}) => {
  const { user } = req;

  return {...data, user: user.id}
} 

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {},
  hooks: {
    beforeChange: [
      addUser,
      async (args) => {
        if (args.operation === "create") {

          const data = args.data as Product;

          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "USD",
              unit_amount: Math.round(data.price * 100),
            }
          })

          const updated: Product = {
            ...data, 
            stripeId: createdProduct.id,
            priceId: createdProduct.default_price as string,
          }

          return updated;
        } else if (args.operation === "update") {
          const data = args.data as Product;

          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!
          })

          const updated: Product = {
            ...data, 
            stripeId: updatedProduct.id,
            priceId: updatedProduct.default_price as string,
          }

          return updated;

        }
      }
    ]
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "product name",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "product details",
    },
    {
      name: "price",
      type: "number",
      label: "price in USD",
      min: 0,
      max: 1000,
      required: true,
    },
    {
      name: "category",
      type: "select",
      label: "category",
      options: PRODUCT_CATEGORIES.map(({ value, label }) => ({ value, label })),
      required: true,
    },
    {
      name: "product_files",
      label: "Product file(s)",
      type: "relationship",
      relationTo: "product_files",
      hasMany: false,
      required: true,
    },
    {
      name: "approvedForSale",
      label: "product status",
      type: "select",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      options: [
        {
          label: "Pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
    {
      name: "priceId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "images",
      type: "array",
      label: "Product image(s)",
      minRows: 1,
      maxRows: 3,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
