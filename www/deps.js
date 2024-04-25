import { loadCss, loadJs } from './common/load.js'

await loadJs('https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js')
await loadJs('https://unpkg.com/@emotion/css@11.11.2/dist/emotion-css.umd.min.js')
await loadJs('https://unpkg.com/lu2@2023.6.26/theme/edge/js/common/safari-polyfill.js')
await loadJs('https://unpkg.com/lu2@2023.6.26/theme/edge/js/common/all.js')

await loadCss('https://unpkg.com/lu2@2023.6.26/theme/edge/css/common/animate.css')
await loadCss('https://unpkg.com/lu2@2023.6.26/theme/edge/css/common/ui.css')


export const AppData = {
    userscript: false,
}

export const getGlobalModule = (name) => window[name] || {}

export const { reactive, watch, onMounted, createApp, computed, ref, nextTick } = getGlobalModule('Vue')
export const { css, cx, injectGlobal } = getGlobalModule('emotion')
export const Dialog = getGlobalModule('Dialog')
export const LightTip = getGlobalModule('LightTip')

export const showSaveFilePicker = getGlobalModule('showSaveFilePicker')
