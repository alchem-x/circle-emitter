import Project from './Project.js'
import AppSetting from './AppSetting.js'
import sampleAppSetting from '../samples/sample_setting.js'

const version = '2'
const CIRCLE_SETTING_KEY = 'circle_emitter_setting'

function initProjectList(setting) {
    return setting?.projectList.map((it) => new Project(it)) ?? []
}

function initAppSetting(setting) {
    return new AppSetting({
        host: setting?.appSetting?.host,
        circleToken: setting?.appSetting?.circleToken,
    })
}

export function saveStateToLocalStorage(state) {
    localStorage.setItem(CIRCLE_SETTING_KEY, JSON.stringify({
        ...state,
        version,
    }))
}

export function getStateFromStorage() {
    const settingString = localStorage.getItem(CIRCLE_SETTING_KEY)
    if (settingString) {
        const setting = JSON.parse(settingString)
        return setting.version === version ? setting : undefined
    } else {
        return sampleAppSetting
    }
}

export function initState(setting) {
    setting = setting ? setting : getStateFromStorage()
    return {
        appSetting: initAppSetting(setting),
        projectList: initProjectList(setting),
        searchTagList: setting?.searchTagList || [],
    }
}

