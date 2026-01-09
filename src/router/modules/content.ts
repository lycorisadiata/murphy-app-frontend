/*
 * @Description: 内容管理路由组（二级菜单）- 文章管理、评论管理
 * @Author: 安知鱼
 * @Date: 2025-12-12
 */
const Layout = () => import("@/layout/index.vue");

// 内容管理 - 包含文章、评论
export default [
  {
    path: "/content",
    component: Layout,
    redirect: "/admin/post-management",
    meta: {
      icon: "ep:document",
      title: "内容管理",
      rank: 2
    },
    children: [
      {
        path: "/admin/post-management",
        name: "PostManagement",
        component: () => import("@/views/system/post-management/index.vue"),
        meta: {
          icon: "material-symbols:post-add",
          title: "文章管理",
          roles: ["1"]
        }
      },
      {
        path: "/admin/comment-management",
        name: "CommentManagement",
        component: () => import("@/views/system/comment-management/index.vue"),
        meta: {
          icon: "ep:comment",
          title: "评论管理",
          roles: ["1"]
        }
      },
      {
        path: "/admin/album-management",
        name: "AlbumManagement",
        component: () => import("@/views/system/album-management/index.vue"),
        meta: {
          icon: "ep:picture-filled",
          title: "相册管理",
          roles: ["1"]
        }
      },
      {
        path: "/admin/project-management",
        name: "ProjectManagement",
        component: () => import("@/views/system/project-management/index.vue"),
        meta: {
          icon: "ep:folder-opened",
          title: "项目管理",
          roles: ["1"]
        }
      },
      {
        path: "/admin/tech-share-management",
        name: "TechShareManagement",
        component: () => import("@/views/system/tech-share-management/index.vue"),
        meta: {
          icon: "ep:document",
          title: "技术分享管理",
          roles: ["1"]
        }
      }
    ]
  },
  {
    path: "/admin/project-management/edit/:id",
    name: "ProjectEdit",
    component: () => import("@/views/system/project-management/edit.vue"),
    meta: {
      title: "编辑项目",
      activePath: "/admin/project-management",
      showLink: false,
      roles: ["1"]
    }
  },
  {
    path: "/admin/tech-share-management/edit/:id",
    name: "TechShareEdit",
    component: () => import("@/views/system/tech-share-management/edit.vue"),
    meta: {
      title: "编辑技术分享",
      activePath: "/admin/tech-share-management",
      showLink: false,
      roles: ["1"]
    }
  }
] satisfies Array<RouteConfigsTable>;
