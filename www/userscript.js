import { AppData } from '@/deps.js'
import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.jsx'
import { injectGlobalStyle } from '@/globalStyle.js'

async function main() {
    AppData.userscript = true
    const app = createApp({
        render() {
            return h(App)
        },
    })
    app.use(createPinia())
    document.body.innerHTML = ''
    injectGlobalStyle()
    const divRef = document.createElement('div')
    document.body.appendChild(divRef)
    app.mount(divRef)
}

main().catch((err) => {
    console.error(err)
})