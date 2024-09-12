<template>
  <a :href="project.getLatestWorkflowUrl(stateStore.appSetting.host)" target="_blank">
    <NButton tertiary :type="stateStore.isRecentlyTriggerProject(project) ? 'primary' : 'default'">
      <template #icon>
        <PipelineIcon/>
      </template>
      <span :key="timestamp">
        {{ project.getLatestTriggered()?.number ?? -1 }} ({{ project.getLatestWorkflowCreatedAt() || '-' }})
      </span>
    </NButton>
  </a>
</template>
<script setup>
import { NButton } from 'naive-ui'
import PipelineIcon from '@/components/PipelineIcon.vue'
import Project from '@/common/Project.js'
import { useStateStore } from '@/store/app.js'
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineProps({
  project: {
    type: Project,
  }
})

const stateStore = useStateStore()

const timestamp = ref(Date.now())
const timer = ref()
onMounted(() => timer.value = setInterval(() => timestamp.value = Date.now(), 1000))
onBeforeUnmount(() => clearInterval(timer.value))
</script>