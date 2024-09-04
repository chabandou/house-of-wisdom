import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: ({ token }) => {
                return `
                    <h1>House of Wisdom - Verify your email</h1>
                    <p>Hello,</p>
                    <p>You can verify your email by clicking the link below:</p>
                    <p><a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}">Verify Email</a></p>
                    <p>If you didn't request this email, you can safely ignore it.</p>
                `
            },
        }
    },
    access: {
        read: () => true,
        create: () => true,
    },
    fields: [
        {
            name: "role",
            admin: {
                condition: (user) => user.role === "admin",
            },
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