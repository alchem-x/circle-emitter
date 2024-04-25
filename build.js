import fs from 'node:fs/promises'
import { rollup } from 'rollup'
import { nodeResolve } from '@rollup/plugin-node-resolve'

async function build(filename) {
    const bundle = await rollup({
        input: `www/${filename}`,
        plugins: [nodeResolve()]
    })
    await bundle.write({
        dir: 'src/main/resources/static/',
        format: 'esm',
    })
}

await build('main.js')
await build('userscript.js')
await fs.copyFile('./www/index.html', 'src/main/resources/static/index.html')
