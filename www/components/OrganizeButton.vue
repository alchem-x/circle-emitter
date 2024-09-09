<template>
  <NButton @click="openOrganizeProjectModal">Organize Project</NButton>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { openOrganizeProjectModal } from '@/components/OrganizeProjectModal.jsx'
</script>