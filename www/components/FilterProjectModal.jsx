import { reactive } from 'vue'
import { modal } from '@/common/providers.jsx'
import { NButton, NPopover, NTransfer } from 'naive-ui'
import Button from '@/components/Button.vue'
import { css } from '@emotion/css'
import { useStateStore } from '@/store/app.js'
import ProjectDisplay from '@/components/ProjectDisplay.vue'

const FooterClassName = css`
    display: flex;
    justify-content: flex-end;
    gap: .5rem;
`

export function openFilterProjectModal() {
    let m
    const stateStore = useStateStore()
    const state = reactive({
        value: [],
    })

    function onCancel() {
        m.destroy()
    }

    function onSave() {
        m.destroy()
        const l = []
        for (const id of state.value) {
            l.push(stateStore.projectMap[id])
        }
        stateStore.projectList = l
    }

    const options = stateStore.projectList.map((it) => {
        return {
            label: it.name,
            value: it.id,
        }
    })

    function renderLabel({ option }) {
        const project = stateStore.projectMap[option.value]
        return (
            <NPopover trigger="hover">
                {{
                    trigger: () => project.name,
                    default: () => (<ProjectDisplay project={project}/>),
                }}
            </NPopover>
        )
    }

    function filterList(pattern, option, from) {
        const project = stateStore.projectMap[option.value]
        const r = new RegExp(pattern, 'i')
        return r.test(project.name) || project.getTagList().some((it) => r.test(it))
    }

    m = modal.create({
        title: 'Filter Project',
        preset: 'card',
        style: {
            width: 'min(80vw, 800px)',
        },
        content: () => (
            <NTransfer
                style={{ height: 'max(60vh, 300px)' }}
                vModel:value={state.value}
                options={options}
                renderSourceLabel={renderLabel}
                renderTargetLabel={renderLabel}
                filter={filterList}
                targetFilterable
                sourceFilterable
            />
        ),
        footer: () => (
            <div class={FooterClassName}>
                <NButton onClick={onCancel}>Cancel</NButton>
                <Button disabled={!state.value.length} onClick={onSave} type="primary">Save</Button>
            </div>
        )
    })
}