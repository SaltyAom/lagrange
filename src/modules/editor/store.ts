import { defineStore } from 'pinia'

import { fetch } from '@tauri-apps/plugin-http'

import type { EditorView } from '@codemirror/view'

export const editorTypes = [
	'body',
	'headers',
	'authorization',
	'params',
	'query'
] as const
export type editorTypes = typeof editorTypes

interface Editor {
	url: string
	method: string
	request: Record<editorTypes[number], string>
	response: {
		body: string
		headers: string
		timestamp: number | null
		status: number | null
		ellapsed: number | null
	}
	history: (Pick<Editor, 'url' | 'method'> & { timestamp: number })[]
}

type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>
		}
	: T

const defaultEditor = {
	url: '',
	method: 'GET',
	request: {
		body: '',
		headers: '',
		authorization: '',
		params: '',
		query: ''
	},
	response: {
		body: '',
		headers: '',
		timestamp: null,
		status: null,
		ellapsed: null
	},
	history: []
} satisfies Editor

const headerToObject = (headers: Headers) => {
	const obj: Record<string, string> = {}

	headers.forEach((value, key) => {
		obj[key] = value
	})

	return obj
}

export interface EditorInstance {
	request: EditorView | null
	response: EditorView | null
}

export const useEditorInstance = defineStore('editorInstance', {
	state: () =>
		({
			request: null,
			response: null
		}) as EditorInstance,
	actions: {
		instance(name: keyof EditorInstance, instance: EditorView | null) {
			if (name === 'request') return void (this.request = instance as any)
			if (name === 'response')
				return void (this.response = instance as any)
		}
	}
})

export const useEditorStore = defineStore('editor', {
	state: () => ({
		index: 0,
		editors: <Editor[]>[defaultEditor],
		isFetching: false,
		controller: null as AbortController | null
	}),
	getters: {
		active: (state) => state.editors[state.index]
	},
	actions: {
		create() {
			this.editors.push(defaultEditor)
		},
		update(editor: DeepPartial<Editor>) {
			this.editors[this.index] = {
				...editor,
				...this.active,
				request: editor.request
					? {
							...this.active.request,
							...editor.request
						}
					: this.active.request,
				response: editor.response
					? { ...this.active.response, ...editor.response }
					: this.active.response,
				history: [
					...((editor.history ?? []).filter(
						(x) => x?.url && x?.method && x?.timestamp
					) as Editor['history']),
					...this.active.history
				]
			}
		},
		async fetch() {
			if (this.isFetching) {
				this.controller?.abort()
				return
			}

			const controller = new AbortController()

			this.isFetching = true
			this.controller = controller

			const method = this.active.method
			let headers: Record<string, string> = {}
			let timestamp: number | undefined

			try {
				headers = JSON.parse(this.active.request.headers)
			} catch {}

			const start = Date.now()

			const originalUrl = this.active.url
			const originalMethod = this.active.method

			let url = this.active.url
			if (!url.includes('://')) {
				if (url.startsWith(':')) url = `http://localhost${url}`
				else if (
					url.startsWith('192.168') ||
					url.startsWith('localhost') ||
					url.startsWith('0.0.0.0')
				)
					url = `http://${url}`
				else url = `https://${url}`
			}

			if (
				method !== 'GET' &&
				method !== 'CONNECT' &&
				this.active.request.body
			)
				try {
					JSON.parse(this.active.request.body)

					if (!headers['Content-Type'])
						headers['Content-Type'] = 'application/json'
				} catch {}

			try {
				const response = await fetch(url, {
					method,
					body:
						method === 'GET' || method === 'CONNECT'
							? undefined
							: this.active.request.body
								? this.active.request.body
								: undefined,
					headers,
					keepalive: true,
					credentials: 'include',
					signal: controller.signal
				}).catch((error) => {
					throw error
				})
				const ellapsed = Date.now() - start

				let body = await response.text()

				if (body)
					try {
						body = JSON.stringify(JSON.parse(body), null, 2)
					} catch {}

				this.update({
					response: {
						body,
						headers: JSON.stringify(
							headerToObject(response.headers),
							null,
							2
						),
						status: response.status,
						ellapsed,
						timestamp: (timestamp = Date.now())
					}
				})
			} catch {
				this.update({
					response: {
						body: 'Failed to fetch',
						headers: '',
						status: null,
						ellapsed: null,
						timestamp: null
					}
				})
			} finally {
				this.isFetching = false
				this.controller = null

				const latest = this.active.history[0]
				if (
					!latest ||
					this.active.url !== latest.url ||
					this.active.method !== latest.method
				)
					this.update({
						history: [
							{
								url: originalUrl,
								method: originalMethod,
								timestamp: timestamp || Date.now()
							}
						]
					})
			}
		}
	}
})
