<script setup lang="ts">
import { RadioGroupItem } from 'radix-vue'

const props = defineProps<{
	active?: boolean
	value: string
	id?: string
}>()
</script>

<template>
	<RadioGroupItem
		:value="props.value"
		class="text-slate-500 px-1 py-0.25 interact:bg-violet-500/10 interact:text-violet-500/90 border border-transparent interact:border-violet-500/15 rounded-full transition-colors outline-none ring-0 cursor-pointer capitalize"
		:id="props.id"
		:class="{
			'!bg-violet-500/10 !border-violet-500/15 !text-violet-500':
				props.active
		}"
	>
		<slot />
	</RadioGroupItem>
</template>
