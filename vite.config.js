import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import monacoEditorPlugin from 'vite-plugin-monaco-editor'

import WindiCSS from 'vite-plugin-windicss'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte({
            compilerOptions: {
                generate: 'dom'
            }
        }),
        WindiCSS(),
        monacoEditorPlugin.default({
            languageWorkers: ['html', 'json', 'editorWorkerService'],
            customWorkers: [
                {
                    label: 'graphql',
                    entry: 'monaco-graphql/esm/graphql.worker'
                }
            ]
        })
    ],
    clearScreen: false
})
