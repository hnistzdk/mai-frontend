import Vue from "vue";
import VueRouter from "vue-router";

// 每次调用Vue.$router.push方法跳转路由的时候先判断是不是已经在目标路由，避免重复跳转（Vue会有警告）
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "home",
        component: () => import("@/components/index/Index"),
    },
    {
        path: "/gossip",
        name: "gossip",
        component: () => import("@/components/index/GossipIndex"),
    },
    {
        path: "/search",
        component: () => import("@/components/search/SearchResultIndex"),
    },
    {
        path: "/recommended",
        component: () => import("@/components/index/AuthorsListIndex"),
    },
    {
        path: "/write",
        component: () => import("@/components/index/WritePostIndex"),
        meta: {
            //该字段表示跳转需要验证
            requireLogin: true
        },
    },
    {
        path: "/edit/:id",
        component: () => import("@/components/index/WritePostIndex"),
    },
    {
        path: "/detail/:id",
        component: () => import("@/components/index/PostDetailIndex"),
    },
    {
        path: "/empty",
        component: () => import("@/components/utils/CustomEmpty"),
    },
    {
        path: "/user/:id",
        component: () => import("@/components/index/UserCenterIndex"),
        children: [
            {
                path: ":userCenterTab",
                component: () => import("@/components/index/UserCenterIndex")
            },
        ]
    },
    {
        path: "/label",
        name: "label",
        component: () => import("@/components/index/LabelIndex"),
    },
    {
        path: "/label/:id",
        component: () => import("@/components/index/LabelToPostIndex"),
    },
    {
        path: "/settings",
        component: () => import("@/components/index/SetUpIndex"),
        meta: {
            //该字段表示需要登录
            requireLogin: true
        },
        children: [
            {
                path: "",
                redirect: "profile"
            },
            {
                path: "profile",
                name: "profile",
                component: () => import("@/components/user/ProfileContent"),
                meta: {
                    //该字段表示跳转需要验证
                    requireLogin: true
                }
            },
            {
                path: "account",
                name: "account",
                component: () => import("@/components/user/AccountSettings"),
                meta: {
                    //该字段表示跳转需要验证
                    requireLogin: true
                }
            },
        ]
    },
    {
        path: "/resource",
        name: "resource",
        component: () => import("@/components/index/ResourceIndex"),
    },
    {
        path: "/book",
        name: "book",
        component: () => import("@/components/index/Book"),
    },
    {
        path: "/admin",
        name: "admin",
        component: () => import("@/components/admin/user/AdminUser"),
        meta: {
            //该字段表示跳转需要验证
            requireLogin: true,
            //该字段表示跳转需要验证是否管理员
            requireAuth: true
        }
    },
    {
        path: "/admin/user",
        name: "user",
        component: () => import("@/components/admin/user/AdminUser"),
        meta: {
            //该字段表示跳转需要验证
            requireLogin: true,
            //该字段表示跳转需要验证是否管理员
            requireAuth: true
        }
    },
    {
        path: "/admin/role",
        name: "role",
        component: () => import("@/components/admin/role/AdminRole"),
        meta: {
            //该字段表示跳转需要验证是否登录
            requireLogin: true,
            //该字段表示跳转需要验证是否管理员
            requireAuth: true
        }
    },
    {
        path: "/admin/post",
        name: "adminPost",
        component: () => import("@/components/admin/post/AdminPost"),
        meta: {
            //该字段表示跳转需要验证是否登录
            requireLogin: true,
        }
    },
    {
        path: "/admin/gossip",
        name: "adminGossip",
        component: () => import("@/components/admin/gossip/AdminGossip"),
        meta: {
            //该字段表示跳转需要验证是否登录
            requireLogin: true,
        }
    },
    {
        path: "/about",
        name: "about",
        component: () => import("@/components/index/About"),
    },
    {
        path: "/500",
        component: () => import("@/components/errorPage/ServerError")
    },
    {
        path: "*",
        component: () => import("@/components/errorPage/NotFound")
    },
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;
