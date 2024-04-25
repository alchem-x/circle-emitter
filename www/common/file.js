export function readAsText(blob) {
    const reader = new FileReader()
    return new Promise((resolve, reject) => {

        reader.addEventListener('load', () => {
            resolve(reader.result)
        })

        reader.addEventListener('error', () => {
            reject(reader.error)
        })

        reader.readAsText(blob)
    })
}

export function openFileAndReadAsText(callback = (err, text) => undefined) {
    const id = 'open_file_and_read_as_text'
    document.getElementById(id)?.remove()
    const inputRef = document.createElement('input')
    inputRef.type = 'file'
    inputRef.id = id
    inputRef.style.display = 'none'
    inputRef.addEventListener('change', async (ev) => {
        try {
            const file = ev.target.files[0]
            if (file) {
                const text = await readAsText(file)
                callback(null, text)
            }
        } catch (err) {
            callback(err)
        } finally {
            inputRef.remove()
        }
    })
    document.body.appendChild(inputRef)
    inputRef.click()
}