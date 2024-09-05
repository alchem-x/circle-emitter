<template>
  <NButton @click="openFilterProjectModal">Filter Project</NButton>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { openFilterProjectModal } from '@/components/FilterProjectModal.jsx'
</script>