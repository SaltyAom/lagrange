import {
    writeFile,
    readTextFile,
    BaseDirectory,
    renameFile,
    removeFile
} from '@tauri-apps/api/fs'

import { get } from 'svelte/store'

import fetchStorage, { defaultFetchStorage } from './fetch'
import controller, { defaultController } from './controller'
import type { Controller } from './controller'

export const saveFetchStorage = async (
    index: number = get(controller).index
) => {
    // console.log("Save", index, get(fetchStorage))

    await writeFile(
        {
            path: `com.saltyaom.lagrange/profile/${index}.json`,
            contents: JSON.stringify(get(fetchStorage))
        },
        {
            dir: BaseDirectory.LocalData
        }
    )
}

const loadPersistedController = async () => {
    const persistedController = await readTextFile(
        `com.saltyaom.lagrange/profile/controller.json`,
        {
            dir: BaseDirectory.LocalData
        }
    ).catch(() => {})

    if (!persistedController) return controller.set(defaultController)

    const parsedController: Controller = JSON.parse(persistedController)
    controller.set(parsedController)

    try {
        const profile = await readTextFile(
            `com.saltyaom.lagrange/profile/${parsedController.index}.json`,
            {
                dir: BaseDirectory.LocalData
            }
        )

        if (!profile) return fetchStorage.set(defaultFetchStorage)

        fetchStorage.set(JSON.parse(profile))
    } catch (err) {}
}

export const movePersistedFile = async (index: number) => {
    const limit = get(controller).tabs.length - 1

    // There might be just opening the tab without saving data
    try {
        await removeFile(`com.saltyaom.lagrange/profile/${index}.json`, {
            dir: BaseDirectory.LocalData
        })
    } catch (err) {}

    for (let i = index; i < limit; i++) {
        const file = `com.saltyaom.lagrange/profile/${i + 1}.json`
        const target = `com.saltyaom.lagrange/profile/${i}.json`

        try {
            await renameFile(file, target, {
                dir: BaseDirectory.LocalData
            })
        } catch (e) {}
    }
}

const useDeriveSave = () => {
    let isLoaded = false
    let prevIndex: number

    loadPersistedController().finally(() => {
        isLoaded = true
        prevIndex = get(controller).index
    })

    controller.subscribe(async (controller) => {
        const { index } = controller

        if (!isLoaded) return

        try {
            if (index === prevIndex) return
 
            const profile = await readTextFile(`com.saltyaom.lagrange/profile/${index}.json`, {
                dir: BaseDirectory.LocalData
            })

            if (!profile) return fetchStorage.set(defaultFetchStorage)

            fetchStorage.set(JSON.parse(profile))
        } catch (err) {
            fetchStorage.set(defaultFetchStorage)
        } finally {
            prevIndex = controller.index

            await writeFile(
                {
                    path: `com.saltyaom.lagrange/profile/controller.json`,
                    contents: JSON.stringify(controller)
                },
                {
                    dir: BaseDirectory.LocalData
                }
            )
        }
    })
}

export default useDeriveSave
