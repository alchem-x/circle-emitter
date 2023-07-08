export async function quit() {
    const response = await fetch('/api/circle/quit', {
        method: 'POST',
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
