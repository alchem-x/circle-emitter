import { AppData, css, defineComponent, LightTip } from '../deps.js'
import Button from './Button.js'
import { openAppSettingModal } from './SettingModal.js'
import { initState } from '../common/context.js'
import QuitButton from './QuitButton.js'

const ClassName = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    padding: 0;
    margin: 0;
  }
`

export default defineComponent({
    template: `
      <div :class="ClassName">
        <h2>✅&nbsp;Circle Emitter</h2>
        <div>
          <a href="https://github.com/alchem-x/circle-emitter" target="_blank">Docs</a>
          &nbsp;
          <Button :on-click="onClickSetting" type="normal">Setting</Button>
          <template v-if="showQuit">
            &nbsp;
            <QuitButton/>
          </template>
        </div>
      </div>
    `,
    components: { QuitButton, Button },
    props: {
        state: Object,
    },
    setup(props) {

        function importSetting(content) {
            try {
                const setting = JSON.parse(content)
                Object.assign(props.state, initState(setting))
            } catch (err) {
                LightTip.error(err.message)
            }
        }

        async function onClickSetting() {
            openAppSettingModal({
                appSetting: props.state.appSetting,
                importSetting,
            })
        }

        return {
            ClassName,
            onClickSetting,
            showQuit: false,
        }
    }
})
