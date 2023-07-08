import './globalStyle.js'
import { css, reactive, watch } from './deps.js'
import HeadLine from './components/HeadLine.js'
import ProjectTable from './components/ProjectTable.js'
import { initState, saveStateToLocalStorage } from './common/context.js'
import TagFilter from './components/TagFilter.js'

const ClassName = css`
    max-width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1rem;

    .project-table {
        margin-top: 1rem;
    }

    a {
        color: #2a80eb;
        text-decoration-line: none;
    }
`

export default {
    template: `
      <div :class="ClassName">
        <HeadLine :state="state"/>
        <TagFilter :state="state"/>
        <ProjectTable class="project-table" :state="state"/>
      </div>
    `,
    components: { HeadLine, TagFilter, ProjectTable, },
    setup(props) {
        const state = reactive(initState())

        watch(() => state, (newState) => {
            saveStateToLocalStorage(newState)
        }, {
            deep: true,
        })

        return {
            state,
            ClassName,
        }
    },
}
