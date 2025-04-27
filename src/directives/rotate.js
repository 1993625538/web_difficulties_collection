export const rotate = (el, binding, vnode) => {
    el.style.transition='all 0.3s'
    if (binding.value) {
        el.style.transform = `rotate(180deg)`
    } else {
        el.style.transform = `rotate(0deg)`
    }
}