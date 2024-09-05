import { defineComponent, onMounted } from 'vue'
import HeadLine from './components/HeadLine.vue'
import ProjectTable from './components/ProjectTable.vue'
import { css } from '@emotion/css'
import { useStateStore } from '@/store/app.js'
import TagSelect from '@/components/TagSelect.vue'
import Toolbar from '@/components/Toolbar.vue'

const ClassName = css`
    max-width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1rem;

    .project-table {
        margin-top: 1rem;
    }

`

export default defineComponent({
    render({ state }) {
        return (
            <div class={ClassName}>
                <HeadLine/>
                <TagSelect/>
                <Toolbar/>
                <ProjectTable class="project-table"/>
            </div>
        )
    },
    setup() {
        const stateStore = useStateStore()

        onMounted(() => {
            stateStore.init()
        })

        return {
            state: stateStore,
        }
    },
})
