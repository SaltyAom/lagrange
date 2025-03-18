<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'

import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { json } from '@codemirror/lang-json'
import { defaultKeymap } from '@codemirror/commands'

// import * as prettier from 'prettier/standalone'
// import * as parserBabel from 'prettier/parser-babel'
// import * as prettierPluginEstree from 'prettier/plugins/estree'

const props = defineProps<{
	id: string
	initial?: string
	doc?: string
	class?: string
	readOnly?: boolean
	onInput?(doc: string): void
	shortcut?: string
	shortcutMeta?: boolean
	previousElement?: string
}>()

let view: EditorView | undefined

onMounted(() => {
	const up = defaultKeymap.find((x) => x.key === 'ArrowUp')

	const previousElement = props.previousElement
		? document.getElementById(props.previousElement)
		: null

	const extensions = [
		keymap.of([
			{
				key: 'Mod-Enter',
				preventDefault: true,
				run: () => true
			},
			{
				...up,
				key: 'ArrowUp',
				run(view) {
					if (previousElement && view.state.selection.main.to === 0) {
						previousElement.focus()

						return true
					}

					if (up?.run) up.run(view)

					return true
				}
			}
		]),
		basicSetup,
		json(),
		EditorState.readOnly.of(props.readOnly ?? false)
	]

	const save = props.onInput
		? (_: unknown, view: EditorView | undefined) => {
				if (view) props.onInput!(view.state.doc.toString())
			}
		: undefined

	extensions.push(
		EditorView.domEventHandlers({
			change: save,
			input: save
		})
	)

	view = new EditorView({
		doc: props.initial ?? props.doc ?? '',
		extensions,
		parent: document.getElementById(props.id)!
	})

	if (props.shortcut)
		window.addEventListener('keydown', (event) => {
			const isMeta =
				!props.shortcutMeta || (props.shortcutMeta && event.metaKey)

			if (view && isMeta && event.key === props.shortcut) {
				event.preventDefault()
				view.focus()
			}
		})
})

watch(
	() => props.id,
	() => {
		if (view)
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: props.initial
				}
			})
	}
)

onUnmounted(() => {
	view?.destroy()
})

watch(
	() => props.doc,
	(doc) => {
		// if (props.readOnly)
		// 	try {
		// 		doc = await prettier.format(doc ?? '', {
		// 			parser: 'babel',
		// 			plugins: [parserBabel, prettierPluginEstree as any],
		// 			tabWidth: 2,
		// 			useTabs: true
		// 		})
		// 	} catch {}

		if (view)
			view.dispatch({
				changes: { from: 0, to: view.state.doc.length, insert: doc }
			})
	}
)
</script>

<template>
	<div :id="id" :class="props.class" class="editor" />
</template>

<style>
@reference "../../main.css";

.editor {
	@apply flex flex-1 overflow-auto;
	font-size: 14px;

	& > .cm-editor {
		@apply w-full;

		&.cm-focused {
			outline: none;
		}

		& > .cm-scroller {
			& > .cm-gutters {
				@apply bg-transparent border-0;
			}
		}
	}
}

.cm-content {
	font-family:
		'Geist Mono Variable', 'Geist Mono', MonoLisa, 'JetBrains Mono',
		'Fira Code', 'IBM Plex Mono', monospace;
}

.cm-line,
.cm-gutterElement {
	line-height: 1.6;
}

.cm-gutterElement {
	align-content: center;
}

.cm-activeLine.cm-line,
.cm-gutterElement.cm-activeLineGutter {
	@apply bg-slate-500/10;
}

.cm-activeLine.cm-line {
	@apply rounded-r-md;
}

.cm-gutterElement.cm-activeLineGutter {
	@apply rounded-l-md;
}

.cm-foldGutter > .cm-gutterElement.cm-activeLineGutter {
	@apply rounded-l-none;
}
</style>
