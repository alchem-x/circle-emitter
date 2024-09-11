import { defineStore } from 'pinia'
import { initState, saveStateToLocalStorage, SORTING_TYPE } from '@/common/context.js'
import { trigger } from '@/apis/trigger.js'
import { message } from '@/common/providers.jsx'

export const useStateStore = defineStore('state', {
    state() {
        return initState()
    },
    getters: {
        recentlyTriggeredTime() {
            let t
            for (const p of this.projectList) {
                const it = p.getLatestTriggered()
                if (it) {
                    const d = new Date(it.created_at)
                    if (!t || d.getTime() > t.getTime()) {
                        t = d
                    }
                }
            }
            return t?.getTime()
        },
        projectMap() {
            const projectMap = {}
            this.projectList.forEach((it) => projectMap[it.id] = it)
            return projectMap
        },
        sortingTypeOptionList() {
            return [
                { label: 'By Default', value: SORTING_TYPE.BY_DEFAULT, },
                { label: 'By Name', value: SORTING_TYPE.BY_NAME, },
                { label: 'By Triggered Time', value: SORTING_TYPE.BY_TRIGGER_TIME, },
            ]
        },
        allTagList() {
            const projectList = this.projectList
            const l = []
            for (const p of projectList) {
                l.push(...p.getTagList())
            }
            return [...new Set(l)]
        },
        showProjectList() {
            const searchTagList = this.searchTagList
            if (!searchTagList.length) {
                return this.sortByType([...this.projectList])
            }
            const l = []
            for (const p of this.projectList) {
                const tagList = p.getTagList()
                if (searchTagList.every((t) => tagList.includes(t))) {
                    l.push(p)
                }
            }
            return this.sortByType(l)
        },
    },
    actions: {
        isRecentlyTriggerProject(p) {
            const t = p.getLatestTriggered()
            return t && new Date(t.created_at).getTime() === this.recentlyTriggeredTime
        },
        sortByType(l) {
            switch (this.sortingType) {
                case SORTING_TYPE.BY_NAME:
                    l.sort((a, b) => a.name.localeCompare(b.name))
                    break
                case SORTING_TYPE.BY_TRIGGER_TIME:
                    l.sort((a, b) => {
                        const aTime = a.getLatestWorkflowCreatedAt() ?? 0
                        const bTime = b.getLatestWorkflowCreatedAt() ?? 0
                        return new Date(bTime).getTime() - new Date(aTime).getTime()
                    })
                    break
                default:
            }
            return l
        },
        init() {
            this.$subscribe((mutation, state) => {
                saveStateToLocalStorage(state)
            })
        },
        async trigger(project) {
            const triggered = await trigger({
                project,
                appSetting: this.appSetting
            })
            project.addNewTriggered(triggered)
            message.success('Trigger succeed')
        }
    },
})