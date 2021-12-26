import { createDir, BaseDirectory } from '@tauri-apps/api/fs'

const setup = async () => {
    try {
        await createDir('./profile', {
            dir: BaseDirectory.LocalData
        })
    } catch (err) {}
}

export default setup
