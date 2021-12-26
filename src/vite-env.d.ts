/// <reference types="svelte" />
/// <reference types="vite/client" />

export interface EditorConfig {
    config: {
        Monaco: typeof MonacoEditor
        editor: monaco.editor.IStandaloneCodeEditor
        updateEditor: (body: string, langage?: string) => void
    }
    onEvent: (config: EditorConfig['config']) => void
    handleCustomEvent: (event: { detail: EditorConfig['config'] }) => void
}

declare namespace svelte.JSX {
    interface HTMLAttributes<T> {
        oneditorReady: EditorConfig['handleCustomEvent']
        oneditorDestroy: () => void
    }
}
