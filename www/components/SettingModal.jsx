import { reactive, ref } from 'vue'
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { AppData } from '@/deps.js'
import { openFileAndReadAsText } from '@/common/file.js'
import { getStateFromStorage } from '@/common/context.js'
import { message, modal } from '@/common/providers.jsx'

export function openAppSettingModal({ appSetting, importSetting, }) {
    let m

    function onImport() {
        openFileAndReadAsText(async (err, text) => {
            if (err) {
                console.error(err)
                message.error(err.message)
            } else {
                importSetting(text)
                m.destroy()
            }
        })
    }

    async function onExport() {
        const setting = await getStateFromStorage()
        if (setting) {
            setting.projectList.forEach((it) => it.recentTriggered = [])
            const { showSaveFilePicker } = window
            try {
                const handle = await showSaveFilePicker({
                    suggestedName: 'setting.json',
                })
                const writable = await handle.createWritable();
                await writable.write(new Blob([JSON.stringify(setting)]))
                await writable.close()
                m.destroy()
            } catch (err) {
                //
            }
        }
    }

    function isUserscript() {
        return AppData.userscript
    }

    const formRef = ref()
    const formState = reactive({
        host: appSetting.host,
        circleToken: appSetting.circleToken,
    })

    const rules = {
        host: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Enter Host',
        },
        circleToken: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Enter Circle Token',
        },
    }

    async function onSave() {
        try {
            await formRef.value.validate()
            const { host, circleToken } = formRef.value.model
            appSetting.host = host
            appSetting.circleToken = circleToken
            m.destroy()
        } catch (err) {
            //
        }
    }

    m = modal.create({
        title: 'Setting',
        preset: 'card',
        style: {
            width: 'min(80vw, 600px)',
        },
        content: () => {
            return (
                <NForm
                    ref={formRef}
                    model={formState}
                    labelPlacement="left"
                    labelWidth="auto"
                    size="medium"
                    rules={rules}>
                    <NFormItem label="Host" path="host">
                        <NInput vModel:value={formState.host} placeholder={rules.host.message}/>
                    </NFormItem>
                    {!isUserscript() && (
                        <NFormItem label="Circle Token" path="circleToken">
                            <NInput type="password" showPasswordOn="click" vModel:value={formState.circleToken}
                                    placeholder={rules.circleToken.message}/>
                        </NFormItem>
                    )}
                </NForm>
            )
        },
        footer: () => (
            <div class="flex justify-between">
                <div class="flex gap">
                    <NButton onClick={onImport}>Import</NButton>
                    <NButton onClick={onExport}>Export</NButton>
                </div>
                <NButton type="primary" onClick={onSave}>Save</NButton>
            </div>
        ),
    })
}
