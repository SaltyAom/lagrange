import { writable } from 'svelte/store'

export interface Tab {
    label: string
}

export interface Controller {
    index: number
    tabs: Tab[]
}

export const defaultController: Controller = {
    index: 0,
    tabs: [
        {
            label: 'New Tab'
        }
    ]
}

const controller = writable<Controller>(defaultController)

export default controller
