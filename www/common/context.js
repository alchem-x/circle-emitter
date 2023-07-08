import Project from './Project.js'
import AppSetting from './AppSetting.js'
import defaultSetting from '../samples/default_setting.js'
import { isJson } from '@/common/utils.js'

const version = '2'
const CIRCLE_SETTING_KEY = 'circle_emitter_setting'

export function saveStateToLocalStorage(state) {
    localStorage.setItem(CIRCLE_SETTING_KEY, JSON.stringify({
        ...state,
        version,
    }))
}

export function getStateFromStorage() {
    const settingString = localStorage.getItem(CIRCLE_SETTING_KEY)
    if (isJson(settingString)) {
        const setting = JSON.parse(settingString)
        return setting.version === version ? setting : defaultSetting
    } else {
        return defaultSetting
    }
}

export const SORTING_TYPE = {
    BY_DEFAULT: 'BY_DEFAULT',
    BY_NAME: 'BY_NAME',
    BY_TRIGGER_TIME: 'BY_TRIGGER_TIME',
}

export function initState(setting) {
    if (!setting) {
        setting = getStateFromStorage()
    }
    return {
        sortingType: setting?.sortingType ?? SORTING_TYPE.BY_DEFAULT,
        appSetting: new AppSetting({
            host: setting?.appSetting?.host,
            circleToken: setting?.appSetting?.circleToken,
        }),
        projectList: setting?.projectList?.map((it) => new Project(it)) ?? [],
        searchTagList: setting?.searchTagList ?? [],
    }
}

