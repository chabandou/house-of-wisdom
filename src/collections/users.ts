import { CollectionConfig } from "payload/types";

export const users: CollectionConfig = {
    slug: "users",
    auth: true,
    access: {
        read: () => true,
        create: () => true,
    },
    fields: [
        {
            name: "role",
            defaultValue: "user",
            required: true,
            type: "select",
            
            options: [
                {
                    value: "admin",
                    label: "Admin",
                },
                {
                    value: "user",
                    label: "User",
                },
            ],
        },
        {
            name: "email",
            type: "text",
        },

    ],
}