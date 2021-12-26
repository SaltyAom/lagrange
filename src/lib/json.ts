export const trySerialize = (value: string): string => {
    try {
        return JSON.stringify(JSON.parse(value), null, 2)
    } catch (e) {
        return value
    }
}
