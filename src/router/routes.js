

export const routes = [
    {
        path: '/',
        redirect: '/home',
        meta: {
            showInTree: false,
        }
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import('@/layout/Home.vue'),
        meta: {
            title: 'Home',
            showInTree: true,
            keep: false,
        }
    },
    {
        path: '/file/upload',
        name: 'FileUpload',
        component: () => import('@/components/UploadFile.vue'),
        meta: {
            title: '文件上传',
            showInTree: true,
            keep: true,
        }
    },
    {
        path: '/test/async',
        name: 'AsyncComponent',
        component: () => import('@/components/AsyncComponent.vue'),
        meta: {
            title: '异步组件',
            showInTree: true,
            keep: true,
        }
    },
    {
        path: '/form/design',
        name: 'FormDesign',
        component: () => import('@/components/FormDesign.vue'),
        meta: {
            title: "表单设计器",
            showInTree: true,
            keep: true
        }
    },
    {
        path: '/chat',
        name: 'Chat',
        component: () => import('@/components/aichat/ChatMain.vue'),
        meta: {
            title: "对话区",
            showInTree: true,
            keep: true
        }
    },
    {
        path: '/worker',
        name: 'Worker',
        component: () => import('@/components/web_worker/Master.vue'),
        meta: {
            title: "线程通信",
            showInTree: true,
            keep: true
        }
    },
    {
        path: '/visual',
        name: 'VirtualDemo',
        component: () => import('@/components/visual_table/VirtualDemo.vue'),
        meta: {
            title: "虚拟列表",
            showInTree: true,
            keep: true
        }
    },
    {
        path: '/ws',
        name: 'WebSocket',
        component: () => import('@/components/websoket/Websocket.vue'),
        meta: {
            title: "实时通信",
            showInTree: true,
            keep: true
        }
    },

]