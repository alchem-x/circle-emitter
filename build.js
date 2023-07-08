import { copyFile } from 'node:fs/promises'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const distDir = 'src/main/resources/static/'

async function build(filename) {
    const bundle = await rollup({
        input: `www/${filename}`,
        plugins: [nodeResolve()]
    })
    await bundle.write({
        dir: distDir,
        format: 'esm',
    })
}

await build('main.js')
await build('userscript.js')
await copyFile('./www/index.html', `${distDir}index.html`)
