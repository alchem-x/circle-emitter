import { defineComponent } from 'vue'
import Button from './Button.vue'
import { quit } from '../apis/quit.js'
import { message } from '@/common/providers.jsx'

export default defineComponent({
    render({ onQuit }) {
        return (
            <Button type="danger" onClick={onQuit}>
                Quit
            </Button>
        )
    },
    setup() {
        async function onQuit() {
            try {
                await quit()
                window.close()
                window.location = 'about:blank'
            } catch (err) {
                console.error(err)
                message.error(err.message)
            }
        }

        return {
            onQuit,
        }
    },
})
