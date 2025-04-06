<script setup lang="ts">
import { RadioGroupItem } from 'reka-ui'

import { unwrapKey, type Keybind } from '../utils/keybind'

const props = defineProps<{
	active?: boolean
	value: string
	id?: string
	upElement?: Keybind
	downElement?: Keybind
}>()

const handleKey = (event: KeyboardEvent) => {
	if (event.key === 'Escape')
		(document.activeElement as HTMLInputElement)?.blur()

	const handleUp = unwrapKey(props.upElement)
	const handleDown = unwrapKey(props.downElement)

	let current: HTMLElement | null = null
	if (props.active && props.id) current = document.getElementById(props.id)

	if (handleUp && event.key === 'ArrowUp') {
		event.preventDefault()

		requestAnimationFrame(() => {
			handleUp()

			if (current) current.click()
		})

		return
	}

	if (handleDown && event.key === 'ArrowDown') {
		event.preventDefault()

		requestAnimationFrame(() => {
			handleDown()

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
			'!bg-violet-500/10 !text-violet-500 font-medium': props.active
		}"
		@keydown="handleKey"
		tabindex="-1"
	>
		<slot />
	</RadioGroupItem>
</template>
