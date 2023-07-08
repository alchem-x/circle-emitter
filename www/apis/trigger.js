import { AppData } from '../deps.js'

async function triggerViaProxy({ project, appSetting }) {
    const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            url: `https://${appSetting.host}/api/v2/project/${project.projectSlug}/pipeline`,
            method: 'POST',
            headers: {
                'Circle-Token': appSetting.circleToken,
            },
            body: {
                branch: project.branch,
                parameters: project.parameters,
            },
        }),
    })
    if (!response.ok) {
        throw new Error(response.statusText || await response.text())
    }
    const result = await response.json()
    if (result.message) {
        throw new Error(result.message)
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

async function triggerViaApi({ project, appSetting }) {
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

export async function trigger(options = {}) {
    if (AppData.userscript) {
        return await triggerViaApi(options)
    } else {
        return await triggerViaProxy(options)
    }
}
