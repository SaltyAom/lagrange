<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed, useTemplateRef } from 'vue'

import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { json } from '@codemirror/lang-json'
import { defaultKeymap } from '@codemirror/commands'

import { useEditorInstance, type EditorInstance } from './store'

import { unwrapKey, type Keybind } from '../../utils/keybind'
import { useKeyDown } from '../../utils/keydown'

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
	upElement?: Keybind
	downElement?: Keybind
	leftElement?: Keybind
	rightElement?: Keybind
	name?: keyof EditorInstance
}>()

let view: EditorView | undefined
let editorRef = useTemplateRef<HTMLDivElement>('editor-ref')

const editorInstance = useEditorInstance()

const save = computed(() =>
	props.onInput
		? (_: unknown, view: EditorView | undefined) => {
				if (view) props.onInput!(view.state.doc.toString())
			}
		: undefined
)

onMounted(() => {
	const handleUp = unwrapKey(props.upElement)
	const handleDown = unwrapKey(props.downElement)
	const handleLeft = unwrapKey(props.leftElement)
	const handleRight = unwrapKey(props.rightElement)

	const up = defaultKeymap.find((x) => x.key === 'ArrowUp')
	const down = defaultKeymap.find((x) => x.key === 'ArrowDown')
	const left = defaultKeymap.find((x) => x.key === 'ArrowLeft')
	const right = defaultKeymap.find((x) => x.key === 'ArrowRight')

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
					if (handleUp && view.state.selection.main.to === 0)
						handleUp()
					else if (up?.run) up.run(view)

					return true
				}
			},
			{
				...down,
				key: 'ArrowDown',
				run(view) {
					if (
						handleDown &&
						view.state.selection.main.from === view.state.doc.length
					)
						handleDown()
					else if (down?.run) down.run(view)

					return true
				}
			},
			{
				...left,
				key: 'ArrowLeft',
				run(view) {
					if (handleLeft && view.state.selection.main.from === 0)
						handleLeft()
					else if (left?.run) left.run(view)

					return true
				}
			},
			{
				...right,
				key: 'ArrowRight',
				run(view) {
					if (
						handleRight &&
						view.state.selection.main.to === view.state.doc.length
					)
						handleRight()
					else if (right?.run) right.run(view)

					return true
				}
			},
			...defaultKeymap,
		]),
		basicSetup,
		json(),
		EditorState.readOnly.of(props.readOnly ?? false)
	]

	if (save.value)
		extensions.push(
			EditorView.domEventHandlers({
				keydown: save.value,
				paste: save.value,
				blur: save.value
			})
		)

	if (editorRef.value)
		view = new EditorView({
			doc: props.initial ?? props.doc ?? '',
			extensions,
			parent: editorRef.value
		})

	if (props.name && view) editorInstance.instance(props.name, view)
})

useKeyDown((event) => {
	const isMeta = !props.shortcutMeta || (props.shortcutMeta && event.metaKey)

	if (view && isMeta && event.key === props.shortcut) {
		event.preventDefault()
		view.focus()
	}
}, false)

watch(
	() => [props.doc, props.id],
	() => {
		if (view)
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: props.doc
				}
			})
	}
)

onUnmounted(() => {
	if (props.name) editorInstance.instance(props.name, null)

	view?.destroy()
})
</script>

<template>
	<div :id="id" :class="props.class" class="editor" ref="editor-ref" />
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

.cm-selectionBackground,
.cm-editor ::selection {
	@apply !bg-slate-500/15;
}

.cm-activeLine.cm-line,
.cm-gutterElement.cm-activeLineGutter {
	@apply bg-violet-500/7.5;
}

.cm-gutterElement.cm-activeLineGutter {
	@apply text-violet-500;
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
