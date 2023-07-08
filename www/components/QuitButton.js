import { defineComponent, LightTip } from '../deps.js'
import Button from './Button.js'
import { quit } from '../apis/quit.js'

export default defineComponent({
    components: { Button },
    template: `
      <Button type="danger" :on-click="onQuit">Quit</Button>
    `,
    setup(props) {
        async function onQuit() {
            try {
                await quit()
                window.close()
                window.location = 'about:blank'
            } catch (err) {
                console.error(err)
                LightTip.error(err.message)
            }
        }

        return {
            onQuit,
        }
    },
})
