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
      <ProjectDisplay :project="project"/>
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
import { NButton } from 'naive-ui'
import Project from '@/common/Project.js'
import Button from '@/components/Button.vue'
import { openProjectModal } from '@/components/ProjectModal.jsx'
import { useStateStore } from '@/store/app.js'
import { css } from '@emotion/css'
import { message } from '@/common/providers.jsx'
import ProjectDisplay from '@/components/ProjectDisplay.vue'

const ClassName = css`

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
</script>