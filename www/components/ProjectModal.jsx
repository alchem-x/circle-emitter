import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { reactive, ref } from 'vue'
import { trigger } from '@/apis/trigger.js'
import { message, modal } from '@/common/providers.jsx'
import Button from '@/components/Button.vue'
import { isJson } from '@/common/utils.js'
import { useStateStore } from '@/store/app.js'

export function openProjectModal({ project, appSetting, onDelete, onCopy }) {
    let m
    const formRef = ref()
    const projectState = reactive({
        id: project.id,
        name: project.name,
        description: project.description,
        projectSlug: project.projectSlug,
        branch: project.branch,
        parameters: project.getParametersJsonString(),
        tags: project.tags,
    })

    const rules = {
        name: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Enter Name',
        },
        description: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Enter Description',
        },
        projectSlug: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Enter Project slug',
        },
        branch: {
            required: true,
            trigger: ['blur', 'input'],
            message: 'Enter Branch',
        },
        parameters: {
            validator: (_, value) => isJson(value),
            trigger: ['blur', 'input'],
            message: 'Enter JSON Parameters',
        },
        tags: {
            required: false,
            trigger: ['blur', 'input'],
            message: 'Enter Tags',
        },
    }

    function onClickDelete() {
        try {
            if (typeof onDelete === 'function') {
                onDelete()
                message.success('Delete succeed')
            }
        } catch (err) {
            message.error(err.message || 'Delete failed')
        } finally {
            m.destroy()
        }
    }

    function onClickCopy() {
        try {
            if (typeof onCopy === 'function') {
                onCopy()
                message.success('Copy succeed')
            }
        } catch (err) {
            message.error(err.message || 'Copy failed')
        } finally {
            m.destroy()
        }
    }

    async function saveProject() {
        try {
            await formRef.value.validate()
        } catch (err) {
            const s = err.flatMap((it) => it).map((it) => `${it.field}: ${it.message}`).join(', ')
            throw new Error(s)
        }
        project.name = projectState.name
        project.description = projectState.description
        project.projectSlug = projectState.projectSlug
        project.branch = projectState.branch
        project.setTags(projectState.tags)
        project.setParametersJsonString(projectState.parameters)
    }

    async function onClickSave() {
        try {
            await saveProject()
            m.destroy()
        } catch (err) {
            message.error(err.message)
        }
    }

    async function onClickTrigger() {
        try {
            await saveProject()
            await useStateStore().trigger(project)
            m.destroy()
        } catch (err) {
            message.error(err.message)
        }
    }

    m = modal.create({
        title: project.name,
        preset: 'card',
        style: {
            width: 'min(80vw, 800px)',
        },
        content: () => (
            <NForm
                ref={formRef}
                model={projectState}
                labelPlacement="left"
                labelWidth="auto"
                size="medium"
                rules={rules}>
                <NFormItem label="Name" path="name">
                    <NInput vModel:value={projectState.name} placeholder={rules.name.message}/>
                </NFormItem>
                <NFormItem label="Project slug" path="projectSlug">
                    <NInput vModel:value={projectState.projectSlug} placeholder={rules.projectSlug.message}/>
                </NFormItem>
                <NFormItem label="Branch" path="branch">
                    <NInput vModel:value={projectState.branch} placeholder={rules.branch.message}/>
                </NFormItem>
                <NFormItem label="Parameters" path="parameters">
                    <NInput type="textarea" vModel:value={projectState.parameters}
                            autosize={{ minRows: 3 }} placeholder={rules.parameters.message}/>
                </NFormItem>
                <NFormItem label="Description" path="description">
                    <NInput type="textarea" vModel:value={projectState.description}
                            autosize={{ minRows: 3 }} placeholder={rules.description.message}/>
                </NFormItem>
                <NFormItem label="Tags" path="tags">
                    <NInput vModel:value={projectState.tags} placeholder={rules.tags.message}/>
                </NFormItem>
            </NForm>
        ),
        footer: () => (
            <div class="flex justify-between">
                <div class="flex gap">
                    <NButton type="error" onClick={onClickDelete}>Delete</NButton>
                    <NButton onClick={onClickCopy}>Copy</NButton>
                </div>
                <div class="flex gap">
                    <NButton onClick={onClickSave}>Save</NButton>
                    <Button onClick={onClickTrigger} type="primary">Trigger</Button>
                </div>
            </div>
        )
    })
}