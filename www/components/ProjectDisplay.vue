<template>
  <div :class="ClassName">
    <div class="meta-info">
      <NTag :bordered="false">
        <template #avatar>
          <BranchIcon/>
        </template>
        {{ project.branch }}
      </NTag>
      <TriggeredButton v-if="project.getLatestTriggered()" :project="project"/>
    </div>
    <div v-if="project.tags" class="tags">
      <template v-for="it of project.getTagList()">
        <NTag :bordered="false">
          <template #avatar>
            <TagIcon/>
          </template>
          {{ it }}
        </NTag>
      </template>
    </div>
    <div v-if="project.description" class="description" v-html="markdownToHtml()"></div>
  </div>
</template>
<script setup>
import { NTag } from 'naive-ui'
import BranchIcon from '@/components/BranchIcon.vue'
import TagIcon from '@/components/TagIcon.vue'
import Project from '@/common/Project.js'
import { marked } from 'marked'
import { css } from '@emotion/css'
import TriggeredButton from '@/components/TriggeredButton.vue'

const ClassName = css`
  .meta-info {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: .25rem;
  }

  .tags {
    display: flex;
    gap: .25rem;
    flex-wrap: wrap;
    margin-top: .25rem;
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

function markdownToHtml() {
  const { description } = props.project
  try {
    return marked.parse(description)
  } catch (err) {
    return description
  }
}
</script>