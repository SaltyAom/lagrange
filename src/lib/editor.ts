import { onMount } from 'svelte'

import type monaco from 'monaco-editor'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
// import graphQLWorker from 'monaco-graphql/esm/graphql.worker'

import type MonacoEditor from 'monaco-editor'

export interface EditorConfig {
    config: {
        Monaco: typeof MonacoEditor
        editor: monaco.editor.IStandaloneCodeEditor
        updateEditor: (body: string, langage?: string) => void
    }
    onEvent: (config: EditorConfig['config']) => void
    handleCustomEvent: (event: { detail: EditorConfig['config'] }) => void
}

const editor = (
    node: HTMLElement,
    config: monaco.editor.IStandaloneEditorConstructionOptions = {}
) => {
    let editor: monaco.editor.IStandaloneCodeEditor
    let Monaco: typeof MonacoEditor

    let prevLanguage: string

    const updateEditor = (body: string, language = 'json') => {
        if (!editor) return

        let position = editor.getPosition()

        if (prevLanguage === language) editor.setValue(body)
        else editor.setModel(Monaco.editor.createModel(body, language))

        prevLanguage = language
        editor.setPosition(position)
    }

    onMount(async () => {
        // @ts-ignore
        self.MonacoEnvironment = {
            getWorker: (_id, language: string) => {
                if (language === 'json') return new jsonWorker()
                if (language === 'html') return new htmlWorker()

                return new editorWorker()
            }
        }

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
                    updateEditor
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
