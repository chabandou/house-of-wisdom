"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateProcedure = exports.publicProcedure = exports.router = void 0;
var server_1 = require("@trpc/server");
var t = server_1.initTRPC.context().create();
var middleware = t.middleware;
var isAuth = t.middleware(function (_a) {
    var ctx = _a.ctx, next = _a.next;
    var req = ctx.req;
    var user = req.user;
    if (!user || !user.id) {
        throw new server_1.TRPCError({
            code: "UNAUTHORIZED",
        });
    }
    return next({
        ctx: __assign(__assign({}, ctx), { user: user }),
    });
});
exports.router = t.router;
exports.publicProcedure = t.procedure;
exports.privateProcedure = t.procedure.use(isAuth);
