"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return "\n                    <h1>House of Wisdom - Verify your email</h1>\n                    <p>Hello,</p>\n                    <p>You can verify your email by clicking the link below:</p>\n                    <p><a href=\"".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token, "\">Verify Email</a></p>\n                    <p>If you didn't request this email, you can safely ignore it.</p>\n                ");
            },
        }
    },
    access: {
        read: function () { return true; },
        create: function () { return true; },
    },
    fields: [
        {
            name: "role",
            admin: {
                condition: function (user) { return user.role === "admin"; },
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
};
