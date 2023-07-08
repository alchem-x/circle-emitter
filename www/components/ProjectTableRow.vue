<template>
  <tr :class="ClassName">
    <td>
      <a :href="project.getPipelineUrl(stateStore.appSetting.host)" target="_blank">
        <NButton text>
          <strong>{{ project.name }}</strong>
        </NButton>
      </a>
    </td>
    <td>
      <div class="flex items-center flex-wrap gap">
        <NTag>
          <template #avatar>
            <BranchIcon/>
          </template>
          {{ project.branch }}
        </NTag>
        <template v-if="project.getLatestTriggered()">
          <a :href="project.getLatestWorkflowUrl(stateStore.appSetting.host)" target="_blank">
            <NButton tertiary>
              <template #icon>
                <PipelineIcon/>
              </template>
              {{ project.getLatestTriggered()?.number ?? -1 }} ({{ project.getLatestWorkflowCreatedAt() || '-' }})
            </NButton>
          </a>
        </template>
      </div>
      <div class="description" v-html="markdownToHtml()"></div>
    </td>
    <td class="td-operate">
      <div class="flex justify-end gap">
        <Button type="primary" @click="onClickTrigger">Trigger</Button>
        <NButton @click="onClickOpenProject()">Details</NButton>
      </div>
    </td>
  </tr>
</template>
<script setup>
import { NButton, NDivider, NTag } from 'naive-ui'
import Project from '@/common/Project.js'
import Button from '@/components/Button.vue'
import BranchIcon from '@/components/BranchIcon.vue'
import { openProjectModal } from '@/components/ProjectModal.jsx'
import { useStateStore } from '@/store/app.js'
import { marked } from 'marked'
import { css } from '@emotion/css'
import { message } from '@/common/providers.jsx'
import PipelineIcon from '@/components/PipelineIcon.vue'

const ClassName = css`
  .title {
    font-weight: bold;
  }

  .td-operate {
  }

  .description {
    margin-top: .25rem;

    p {
      padding: 0;
      margin: 0;
    }
  }


`

const props = defineProps({
  project: {
    type: Project,
    required: true,
  },
})

const stateStore = useStateStore()

async function onClickOpenProject() {
  const project = props.project
  openProjectModal({
    project,
    appSetting: stateStore.appSetting,
    onDelete: () => {
      if (stateStore.projectList.length === 1) {
        throw new Error('Cannot delete the last Project')
      }
      stateStore.projectList = stateStore.projectList.filter((it) => it !== project)
      stateStore.searchTagList = []
    },
    onCopy: () => {
      stateStore.projectList.push(new Project({
        ...project,
        recentTriggered: [],
      }))
    },
  })
}

async function onClickTrigger() {
  try {
    await stateStore.trigger(props.project)
  } catch (err) {
    message.error(err.message)
  }
}

function markdownToHtml() {
  const { description } = props.project
  try {
    return marked.parse(description)
  } catch (err) {
    return description
  }
}
</script>