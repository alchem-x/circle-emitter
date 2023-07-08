import { getTimeTag } from './time.js'

export default class Project {

    static sequence = 1

    constructor({ name, description, projectSlug, branch, parameters, tags, recentTriggered } = {}) {
        this.id = Project.sequence++
        this.name = name ?? ''
        this.description = description ?? ''
        this.projectSlug = projectSlug ?? ''
        this.branch = branch ?? ''
        this.parameters = parameters ?? {}
        this.tags = tags ?? ''
        this.recentTriggered = recentTriggered ?? []
    }

    getParametersJsonString() {
        return JSON.stringify(this.parameters, null, 2)
    }

    setParametersJsonString(jsonString) {
        this.parameters = JSON.parse(jsonString)
    }

    addNewTriggered(it) {
        this.recentTriggered.unshift(it)
        this.recentTriggered.length = 20
    }

    getLatestTriggered() {
        return this.recentTriggered[0]
    }

    getLatestWorkflowCreatedAt() {
        const it = this.getLatestTriggered()
        if (it) {
            return getTimeTag(new Date(it.created_at))
        }
    }

    getLatestWorkflowUrl(host) {
        const it = this.getLatestTriggered()
        if (it) {
            return `https://app.${host}/pipelines/${this.projectSlug}/${it.number}`
        }
    }

    getPipelineUrl(host) {
        return `https://app.${host}/pipelines/${this.projectSlug}`
    }

    getTagList() {
        if (!this.tags) {
            return []
        }
        return this.tags.split(',')
    }

    setTags(s) {
        this.tags = [...new Set(s.split(',').map((it) => it.trim()).filter((it) => !!it))].join(',')
    }
}
