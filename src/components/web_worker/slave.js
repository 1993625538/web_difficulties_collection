self.addEventListener('message', (event) => {
    setTimeout(() => {
        console.log(event);
        
        self.postMessage(event.data)
    }, 3000);
})