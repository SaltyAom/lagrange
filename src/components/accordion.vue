<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

const props = defineProps<{
	title: string
	class?: string
}>()
</script>

<template>
	<section :class="props.class ?? ''" class="mb-2 px-2 py-1 overflow-hidden">
		<header @click="isOpen = !isOpen">
			<h1 class="text-gray-500 text-sm">{{ props.title }}</h1>
			<slot name="summary" />
		</header>
		<div :class="isOpen ? '' : 'hidden'">
			<slot />
		</div>
	</section>
</template>
