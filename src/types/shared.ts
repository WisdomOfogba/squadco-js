export type SharedSquadReturn<T> = {
    status: number,
    success: boolean,
    message: string
    data: T
}