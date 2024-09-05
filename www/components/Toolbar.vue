<template>
  <div :class="ClassName">
    <NSelect class="sorting-type-select"
             v-model:value="stateStore.sortingType"
             :options="stateStore.sortingTypeOptionList"/>
    <FilterButton/>
  </div>
</template>

<script setup>
import { css } from '@emotion/css'
import { NSelect } from 'naive-ui'
import { useStateStore } from '@/store/app.js'
import FilterButton from '@/components/FilterButton.vue'

const stateStore = useStateStore()

const ClassName = css`
  display: flex;
  flex-direction: row-reverse;
  margin-top: 1rem;
  gap: .5rem;

  .sorting-type-select {
    width: 200px;
  }
`
</script>

