import type { Language } from 'src/store/fetch'

export const detectLanguage = (body: string): Language => {
    if (!body) return 'text'
    if (body.includes("<html")) return 'html'

    let [start, ...content] = body.trimStart().split(' ')

    let startOfContent = content?.find((a) => a !== '') || ''

    if (
        ['query', 'mutation', 'subscription'].includes(start) ||
        !startOfContent.startsWith('"')
    )
        return 'graphql'

    if (start.startsWith('{')) return 'json'

    return 'text'
}
