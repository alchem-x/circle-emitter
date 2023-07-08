import { AppData, createApp, css, defineComponent, Dialog, LightTip, showSaveFilePicker } from '../deps.js'
import { openFileAndReadAsText } from '../common/file.js'
import { getStateFromStorage } from '../common/context.js'

const ClassName = css`
    width: min(80vw, 600px);

    .form-row {
        :not(:first-child) {
            margin-top: .5rem;
        }

        display: flex;
        align-items: center;

        label {
            min-width: 90px;
        }

        input {
            flex: 1;
        }
    }

    .red {
        color: #eb4646;
    }
`

export function openAppSettingModal({ appSetting, importSetting, }) {
    const dialog = new Dialog({
        title: 'Setting',
        content: '<div class="modal-content-root"></div>',
        buttons: [
            {
                type: 'normal',
                value: 'Import',
                className: 'button-import-setting',
                events: (ev) => {
                    openFileAndReadAsText(async (err, text) => {
                        if (err) {
                            console.error(err)
                            LightTip.error(err.message)
                            return
                        }
                        importSetting(text)
                        dialog.remove()
                    })
                }
            },
            {
                type: 'normal',
                value: 'Export',
                className: 'button-export-setting',
                events: async (ev) => {
                    const setting = await getStateFromStorage()
                    if (setting) {
                        setting.projectList.forEach((it) => it.recentTriggered = [])
                        const handle = await showSaveFilePicker({
                            suggestedName: 'setting.json',
                        })
                        const writable = await handle.createWritable();
                        await writable.write(new Blob([JSON.stringify(setting)]))
                        await writable.close()
                    }
                }
            },
            {
                type: 'primary',
                value: 'Save',
                form: 'app-setting-form',
            }]
    })
    dialog.querySelector('.button-import-setting').style.float = 'left'
    dialog.querySelector('.button-export-setting').style.float = 'left'
    //
    const vm = createApp(defineComponent({
        template: `
          <form id="app-setting-form" class="ui-form" :class="ClassName" @submit.prevent="onSubmit">
            <div class="form-row">
              <label for="app-setting-host">Host<span class="red">*</span></label>
              <input :value="appSetting.host" type="text" id="app-setting-host"
                     class="ui-input" name="app-setting-host" required>
            </div>
            <div v-show="!isUserscript()" class="form-row">
              <label for="app-setting-circle-token">Circle Token<span class="red">*</span></label>
              <input :value="appSetting.circleToken" type="password" id="app-setting-circle-token"
                     class="ui-input" name="app-setting-circle-token" :required="!isUserscript()">
            </div>
          </form>
        `,
        setup() {
            function onSubmit(ev) {
                const form = new FormData(ev.target)
                appSetting.host = form.get('app-setting-host')
                appSetting.circleToken = form.get('app-setting-circle-token')
                dialog.remove()
                LightTip.success('App setting saved')
            }

            function isUserscript() {
                return AppData.userscript
            }

            return {
                ClassName,
                appSetting,
                onSubmit,
                isUserscript,
            }
        },
    }))
    vm.mount(dialog.querySelector('.modal-content-root'))
    return { dialog, vm, }
}
