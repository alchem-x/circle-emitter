import { computed, css, defineComponent } from '../deps.js'
import Button from './Button.js'
import { openProjectModal } from './ProjectModal.js'
import Project from '../common/Project.js'

const ClassName = css`
    .th-operate {
        width: 100px;
    }

    .th-title {
        width: 150px;
        text-align: left;
    }

    .td-operate {
        text-align: center;
    }

    .td-empty {
        text-align: center;
    }

    .title {
        color: #4c5161;
        font-weight: bold;
    }

    .description {
        color: #a2a9b6;
    }
`

export default defineComponent({
    template: `
      <div :class="ClassName">
        <table class="ui-table">
          <thead>
          <tr>
            <th class="th-title">Projects</th>
            <th></th>
            <th class="th-operate"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!showProjectList.length">
            <td class="td-empty" colspan="3">Empty</td>
          </tr>
          <tr v-else v-for="(it) of showProjectList" :key="it.id">
            <td>
              <div class="title">
                <a :href="it.getPipelineUrl(state.appSetting.host)" target="_blank">{{ it.name }}</a>
              </div>
              <div class="description" v-html="it.description"></div>
            </td>
            <td>
              <div v-if="it.getLatestTriggered()">
                Latest triggered:&nbsp;
                <a :href="it.getLatestWorkflowUrl(state.appSetting.host)" target="_blank">
                  Workflow({{ it.getLatestWorkflowCreatedAt() }})
                </a>
              </div>
            </td>
            <td class="td-operate">
              <Button @click="onClickOpenProject(it)">Trigger</Button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    `,
    components: { Button },
    props: {
        state: Object,
    },
    setup(props) {
        async function onClickOpenProject(project) {
            openProjectModal({
                project,
                appSetting: props.state.appSetting,
                onDelete: () => {
                    if (props.state.projectList.length === 1) {
                        throw new Error('Cannot delete the last Project')
                    }
                    props.state.projectList = props.state.projectList.filter((it) => it !== project)
                    props.state.searchTagList = []
                },
                onCopy: () => {
                    props.state.projectList.push(new Project({
                        ...project,
                        recentTriggered: [],
                    }))
                },
            })
        }

        const showProjectList = computed(() => {
            const searchTagList = props.state.searchTagList
            if (!searchTagList.length) {
                return props.state.projectList
            }
            const l = []
            for (const p of props.state.projectList) {
                const tagList = p.getTagList()
                if (tagList.some((t) => searchTagList.includes(t))) {
                    l.push(p)
                }
            }
            return l
        })

        return {
            ClassName,
            showProjectList,
            onClickOpenProject,
        }
    },
})
