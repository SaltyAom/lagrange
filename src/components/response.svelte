<script lang="ts">
    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'

    import { detectLanguage } from '../lib/language'

    import fetchResponse from '../store/response'

    let preview = ''

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { updateEditor }
    }) => {
        fetchResponse.subscribe(({ response, error }) => {
            if (error && !error.startsWith('Lagrange Error: '))
                return updateEditor(error, detectLanguage(error))

            if (preview === response) return

            preview = response
            updateEditor(response, detectLanguage(response), {
                overwrite: true
            })
        })
    }
</script>

<div
    use:editor={{ readOnly: true }}
    on:editorReady={onEditorReady}
    class={`content-app w-full h-screen dark:text-white ${$$props.class}`}
/>
