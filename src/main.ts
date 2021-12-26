import App from './App.svelte'
import setup from './setup'

setup()

const app = new App({
    target: document.getElementById('app')
})

export default app
