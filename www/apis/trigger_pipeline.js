import { AppData } from '../deps.js'

async function triggerPipelineViaProxy({ project, appSetting }) {
    const response = await fetch('/api/circle/trigger_pipeline', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            host: appSetting.host,
            circleToken: appSetting.circleToken,
            projectSlug: project.projectSlug,
            branch: project.branch,
            parameters: project.parameters,
        }),
    })
    if (!response.ok) {
        throw new Error(response.statusText || await response.text())
    }
    const result = await response.json()
    if (result.error) {
        throw new Error(result.error)
    }
    return result
}

async function getCsrfToken(host) {
    const response = await fetch(`https://${host}/api/v2/csrf`, {
        credentials: 'include',
    })
    const result = await response.json()
    return result.csrf_token
}

async function triggerPipelineViaApi({ project, appSetting }) {
    const url = `https://${appSetting.host}/api/v2/project/${project.projectSlug}/pipeline`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Csrftoken': await getCsrfToken(appSetting.host),
        },
        credentials: 'include',
        body: JSON.stringify({
            branch: project.branch,
            parameters: project.parameters,
        }),
    })
    const result = await response.json()
    if (result.message) {
        throw new Error(result.message)
    }
    return result
}

export async function triggerPipeline(options = {}) {
    if (AppData.userscript) {
        return await triggerPipelineViaApi(options)
    } else {
        return await triggerPipelineViaProxy(options)
    }
}
