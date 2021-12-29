import { onMount } from 'svelte'

import type monaco from 'monaco-editor'

import type MonacoEditor from 'monaco-editor'

export interface EditorConfig {
    config: {
        Monaco: typeof MonacoEditor
        editor: monaco.editor.IStandaloneCodeEditor
        updateEditor: EditorConfig['updateEditor']
    }
    onEvent: (config: EditorConfig['config']) => void
    handleCustomEvent: (event: { detail: EditorConfig['config'] }) => void
    updateEditor: (
        body: string,
        langage?: string,
        config?: {
            overwrite: boolean
        }
    ) => void
}

const editor = (
    node: HTMLElement,
    config: monaco.editor.IStandaloneEditorConstructionOptions = {}
) => {
    let editor: monaco.editor.IStandaloneCodeEditor
    let Monaco: typeof MonacoEditor

    let prevBody: string
    let prevLanguage: string

    const updateEditor: EditorConfig['config']['updateEditor'] = (
        body,
        language = 'json',
        { overwrite } = {
            overwrite: false
        }
    ) => {
        if (!editor) return

        if (overwrite) setEditor(body, language)
        else {
            if (prevBody !== body) editor.setValue(body)
            if (prevLanguage !== language)
                Monaco.editor.setModelLanguage(editor.getModel(), language)
        }

        prevBody = body
        prevLanguage = language
    }

    const setEditor = (body: string, language = 'json') => {
        if (!editor) return

        editor.setModel(Monaco.editor.createModel(body, language))
    }

    onMount(async () => {
        // @ts-ignore
        Monaco = await import('monaco-editor')

        Monaco.editor.defineTheme('lagrange-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.background': '#1f2937'
            }
        })

        editor = Monaco.editor.create(node, {
            language: 'json',
            automaticLayout: true,
            theme: window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'lagrange-dark'
                : 'vs',
            minimap: {
                enabled: false
            },
            // @ts-ignore
            'bracketPairColorization.enabled': true,
            tabSize: 2,
            useShadowDOM: true,
            ...config
        })

        window
            .matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', ({ matches: isDarkTheme }) => {
                Monaco.editor.setTheme(isDarkTheme ? 'lagrange-dark' : 'vs')
            })

        node.dispatchEvent(
            new CustomEvent<EditorConfig['onEvent']>('editorReady', {
                detail: {
                    // @ts-ignore
                    Monaco,
                    editor,
                    updateEditor,
                    setEditor
                }
            })
        )

        return () => {
            node.dispatchEvent(new CustomEvent('editorDestroy'))

            editor.dispose()
        }
    })
}

export default editor
