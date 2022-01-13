<script lang="ts">
    import fetchResponse from '../store/response'

    import editor from '../lib/editor'
    import type { EditorConfig } from '../lib/editor'

    let preview = ''

    const onEditorReady: EditorConfig['handleCustomEvent'] = ({
        detail: { updateEditor }
    }) => {
        fetchResponse.subscribe(({ status, headers }) => {
            if (preview === headers) return

            preview = JSON.stringify(headers, null, 2)
            updateEditor(status && preview ? preview : '', 'json', {
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
