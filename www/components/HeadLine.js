import { css, LightTip } from '../deps.js'
import Button from './Button.js'
import { openAppSettingModal } from './SettingModal.js'
import { initState } from '../common/context.js'

const ClassName = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    padding: 0;
    margin: 0;
  }
`

export default {
    template: `
      <div :class="ClassName">
        <h2>✅&nbsp;Circle Emitter</h2>
        <div>
          <a href="https://github.com/alchemy-works/circle-emitter" target="_blank">Docs</a>
          &nbsp;
          <Button :on-click="onClickSetting" type="normal">Setting</Button>
        </div>
      </div>
    `,
    components: { Button },
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
        }
    }
}