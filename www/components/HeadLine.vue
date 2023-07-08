<template>
  <div :class="ClassName">
    <h2>✅&nbsp;Circle Emitter</h2>
    <div>
      <a href="https://github.com/alchem-x/circle-emitter" target="_blank">Docs</a>
      &nbsp;
      <NButton :on-click="onClickSetting">Setting</NButton>
      <template v-if="showQuit">
        &nbsp;
        <QuitButton />
      </template>
    </div>
  </div>
</template>

<script setup>
import { NButton } from 'naive-ui'
import { css } from '@emotion/css'
import { initState } from '@/common/context.js'
import { useStateStore } from '@/store/app.js'
import { message } from '@/common/providers.jsx'
import { openAppSettingModal } from './SettingModal.jsx'
import QuitButton from './QuitButton.jsx'

const ClassName = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    padding: 0;
    margin: 0;
  }
`

const stateStore = useStateStore()
const showQuit = false

function importSetting(content) {
  try {
    const setting = JSON.parse(content)
    Object.assign(stateStore, initState(setting))
  } catch (err) {
    message.error(err.message)
  }
}

async function onClickSetting() {
  openAppSettingModal({
    appSetting: stateStore.appSetting,
    importSetting,
  })
}
</script>