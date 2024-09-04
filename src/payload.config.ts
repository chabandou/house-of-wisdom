import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import path from "path";
import { buildConfig } from "payload/config";

import dotenv from "dotenv";
import { Products } from "./collections/Products/Products";
import { Media } from "./collections/Media";
import { ProductFile } from "./collections/ProductFile";
import { Orders } from "./collections/Orders";
import { Users } from "./collections/Users";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "",
  collections: [Users, Products, Media, ProductFile, Orders],
  routes: {
    admin: "/sell",
  },
  admin: {
    user: "users",
    bundler: webpackBundler(),
    meta: {
      titleSuffix: " | House Of Wisdom",
      favicon: "/favicon.png",
      ogImage: "/thumbnail.jpg",
    },
  },
  rateLimit: {
    max: 2000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.MONGODB_URL!,
  }),
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
});
