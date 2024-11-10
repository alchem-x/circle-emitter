<template>
  <div :class="ClassName">
    <NSelect v-model:value="stateStore.searchTagList" :options="options" multiple filterable clearable
      placeholder="Select Tags" />
  </div>
</template>

<script setup>
import { NSelect } from 'naive-ui'
import { useStateStore } from '@/store/app.js'
import { computed } from 'vue'
import { css } from '@emotion/css'

const ClassName = css`
  margin-top: 1rem;
`

const stateStore = useStateStore()

const options = computed(() => {
  return stateStore.allTagList.map((it) => {
    return {
      label: it,
      value: it,
    }
  })
})

</script>