<template>
  <div :class="ClassName">
    <NTable>
      <thead>
      <tr>
        <th class="th-title">Projects</th>
        <th></th>
        <th class="th-operate"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="!stateStore.showProjectList.length">
        <td class="td-empty" colspan="3">Empty</td>
      </tr>
      <template v-else>
        <ProjectTableRow v-for="(it) of stateStore.showProjectList" :key="it.id" :project="it"/>
      </template>
      </tbody>
    </NTable>
  </div>
</template>

<script setup>
import { NTable } from 'naive-ui'
import { css } from '@emotion/css'
import { useStateStore } from '@/store/app.js'
import ProjectTableRow from '@/components/ProjectTableRow.vue'

const ClassName = css`
  .th-operate {
    width: 180px;
  }

  .th-title {
    width: 180px;
    text-align: left;
  }

  .td-empty {
    text-align: center;
  }
`
const stateStore = useStateStore()
</script>