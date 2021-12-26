import { createDir, BaseDirectory } from '@tauri-apps/api/fs'

const setup = async () => {
    try {
        await createDir('com.saltyaom.lagrange', {
            dir: BaseDirectory.LocalData
        })

        await createDir('com.saltyaom.lagrange/profile', {
            dir: BaseDirectory.LocalData
        })
    } catch (err) {
    }
}

export default setup
