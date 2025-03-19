<script setup lang="ts">
import { RadioGroupItem } from 'radix-vue'

const props = defineProps<{
	active?: boolean
	value: string
	id?: string
	upElement?: string | (() => unknown)
	downElement?: string | (() => unknown)
}>()

const unwrap = (value?: string | (() => unknown)) => {
	switch (typeof value) {
		case 'function':
			return value

		case 'string':
			return document.getElementById(value)
	}

	return null
}

const handleKey = (event: KeyboardEvent) => {
	if (event.key === 'Escape')
		(document.activeElement as HTMLInputElement)?.blur()

	const upElement = unwrap(props.upElement)
	const downElement = unwrap(props.downElement)

	let current: HTMLElement | null = null
	if (props.active && props.id) current = document.getElementById(props.id)

	if (upElement && event.key === 'ArrowUp') {
		event.preventDefault()

		requestAnimationFrame(() => {
			if (typeof upElement === 'function') upElement()
			else upElement.focus()

			if (current) current.click()
		})

		return
	}

	if (downElement && event.key === 'ArrowDown') {
		event.preventDefault()

		requestAnimationFrame(() => {
			if (typeof downElement === 'function') downElement()
			else downElement.focus()

			if (current) current.click()
		})

		return
	}
}
</script>

<template>
	<RadioGroupItem
		:value="props.value"
		class="text-slate-500 px-1 py-0.25 interact:bg-violet-500/10 interact:text-violet-500/90 rounded-full transition-all outline-none ring-0 cursor-pointer capitalize highlight-focus"
		:id="props.id"
		:class="{
			'!bg-violet-500/10 !text-violet-500 font-medium':
				props.active
		}"
		@keydown="handleKey"
	>
		<slot />
	</RadioGroupItem>
</template>
