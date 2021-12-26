import type { Language } from 'src/store/fetch'

export const detectLanguage = (body: string): Language => {
    if (!body) return 'json'

    let [start, ...content] = body.trimStart().split(' ')

    let startOfContent = content?.find((a) => a !== '') || ''

    if (
        ['query', 'mutation', 'subscription'].includes(start) ||
        !startOfContent.startsWith('"')
    ) {
        return 'graphql'
    } else {
        if (start.startsWith('{')) return 'json'

        return 'text'
    }
}
