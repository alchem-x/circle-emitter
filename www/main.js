import '@/deps.js'
import { createApp, h } from 'vue'
import App from '@/App.jsx'
import { injectGlobalStyle } from '@/globalStyle.js'
import { createPinia } from 'pinia'

async function main() {
    const app = createApp({
        render() {
            return h(App)
        }
    })
    app.use(createPinia())
    injectGlobalStyle()
    const divRef = document.createElement('div')
    document.body.appendChild(divRef)
    app.mount(divRef)
}

main().catch((err) => {
    console.error(err)
})