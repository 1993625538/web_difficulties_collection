let fn = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('err')
        }, 5000);
    })
}


let fn2 = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await fn()
            console.log(res);
            resolve(31232)
        } catch (err) {
            console.log(err);
        }
    })
}

fn2()