export const changeColor = {
    // 在绑定元素的 attribute 前
    // 或事件监听器应用前调用
    created(el, binding, vnode) {
        // 下面会介绍各个参数的细节
        console.log('组件创建完成');
        console.log('dom');
        console.log(el);
        el.style.color = binding.value.color
        console.log('绑定数据');
        console.log(binding);
        console.log('虚拟节点');
        console.log(vnode);
    },
    // 在元素被插入到 DOM 前调用
    beforeMount(el, binding, vnode) {
        // 下面会介绍各个参数的细节
        console.log('组件渲染之前');
        console.log('dom');
        console.log(el);
        console.log('绑定数据');
        console.log(binding);
        console.log('虚拟节点');

    },
    // 在绑定元素的父组件
    // 及他自己的所有子节点都挂载完成后调用
    mounted(el, binding, vnode) {
        // 下面会介绍各个参数的细节
        console.log('组件渲染完成');
        console.log('dom');
        console.log(el);
        console.log('绑定数据');
        console.log(binding);
        console.log('虚拟节点');
    },
    // 绑定元素的父组件更新前调用
    beforeUpdate(el, binding, vnode, prevVnode) { },
    // 在绑定元素的父组件
    // 及他自己的所有子节点都更新后调用
    updated(el, binding, vnode, prevVnode) { },
    // 绑定元素的父组件卸载前调用
    beforeUnmount(el, binding, vnode) { },
    // 绑定元素的父组件卸载后调用
    unmounted(el, binding, vnode) { }
}