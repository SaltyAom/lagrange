<script setup lang="ts">
import { onMounted, onUnmounted, watch, computed } from 'vue'

import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { json } from '@codemirror/lang-json'
import { defaultKeymap } from '@codemirror/commands'

import { useEditorInstance, type EditorInstance } from './store'

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
	upElement?: string | (() => unknown)
	downElement?: string | (() => unknown)
	leftElement?: string | (() => unknown)
	rightElement?: string | (() => unknown)
	name?: keyof EditorInstance
}>()

let view: EditorView | undefined

const editorInstance = useEditorInstance()

const save = computed(() =>
	props.onInput
		? (_: unknown, view: EditorView | undefined) => {
				if (view) props.onInput!(view.state.doc.toString())
			}
		: undefined
)

onMounted(() => {
	const unwrap = (value?: string | (() => unknown)) => {
		switch (typeof value) {
			case 'function':
				return value

			case 'string':
				return document.getElementById(value)
		}

		return null
	}

	const upElement = unwrap(props.upElement)
	const downElement = unwrap(props.downElement)
	const leftElement = unwrap(props.leftElement)
	const rightElement = unwrap(props.rightElement)

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
					if (upElement && view.state.selection.main.to === 0) {
						if (typeof upElement === 'function') upElement()
						else upElement.focus()

						return true
					}

					if (up?.run) up.run(view)

					return true
				}
			},
			{
				...down,
				key: 'ArrowDown',
				run(view) {
					if (
						downElement &&
						view.state.selection.main.from === view.state.doc.length
					) {
						if (typeof downElement === 'function') downElement()
						else downElement.focus()

						return true
					}

					if (down?.run) down.run(view)

					return true
				}
			},
			{
				...left,
				key: 'ArrowLeft',
				run(view) {
					if (leftElement && view.state.selection.main.from === 0) {
						if (typeof leftElement === 'function') leftElement()
						else leftElement.focus()

						return true
					}

					if (left?.run) left.run(view)

					return true
				}
			},
			{
				...right,
				key: 'ArrowRight',
				run(view) {
					if (
						rightElement &&
						view.state.selection.main.to === view.state.doc.length
					) {
						if (typeof rightElement === 'function') rightElement()
						else rightElement.focus()

						return true
					}

					if (right?.run) right.run(view)

					return true
				}
			}
		]),
		basicSetup,
		json(),
		EditorState.readOnly.of(props.readOnly ?? false)
	]

	extensions.push(
		EditorView.domEventHandlers({
			change: save.value,
			input: save.value,
			paste: save.value
		})
	)

	view = new EditorView({
		doc: props.initial ?? props.doc ?? '',
		extensions,
		parent: document.getElementById(props.id)!
	})

	if (props.name) editorInstance.instance(props.name, view)

	if (props.shortcut)
		document.addEventListener('keydown', (event) => {
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
		if (view) {
			view.dispatch({
				changes: {
					from: 0,
					to: view.state.doc.length,
					insert: props.initial
				}
			})
		}
	}
)

onUnmounted(() => {
	if (props.name) editorInstance.instance(props.name, null)

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

.cm-selectionBackground,
.cm-editor ::selection {
	@apply !bg-violet-500/10;
}
</style>
