<template>
  <NButton @click="onClickInternal" :loading="loading" :type="type">
    <slot></slot>
  </NButton>
</template>

<script setup>
import { ref } from 'vue'
import { NButton } from 'naive-ui'

const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  onClick: {
    type: Function,
    default: () => undefined,
  }
})

const loading = ref(false)

async function onClickInternal() {
  try {
    const p = props.onClick()
    if (typeof p?.then === 'function') {
      loading.value = true
      await p
    }
  } finally {
    loading.value = false
  }
}
</script>