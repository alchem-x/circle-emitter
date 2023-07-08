import { createApp, AppData } from './deps.js'
import App from './App.js'

async function main() {
    AppData.userscript = true
    const app = createApp(App)
    document.body.innerHTML = '<div id="app"></div>'
    app.mount('#app')
}

main().catch((err) => {
    console.error(err)
})