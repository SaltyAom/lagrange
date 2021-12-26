export const trySerialize = (value: string): string => {
    try {
        return JSON.stringify(JSON.parse(value), null, 4)
    } catch (e) {
        return value
    }
}
