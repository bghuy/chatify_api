export type ServerCreateInputType = {
    name: string
    image?: string
    inviteCode?: string
}

export type ServerUpdateInputType = {
    name?: string
    image?: string
}