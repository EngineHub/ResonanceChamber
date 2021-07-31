export interface Embed {
    title?: string,
    description?: string,
    url?: string,
    timestamp?: string,
    color?: number,
    author?: EmbedAuthor,
}

export interface EmbedAuthor {
    name?: string,
    url?: string,
    icon_url?: string,
}
