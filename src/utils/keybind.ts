/**
 * Element's ID or custom action
 */
export type Keybind = string | (() => unknown)

export const unwrapKey = (value?: Keybind) => {
	switch (typeof value) {
		case 'function':
			return value

		case 'string':
			return () => document.getElementById(value)?.focus()
	}

	return null
}
