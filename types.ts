export type Segment = { start: number; end: number }
export type PunchState = {
    lastIn: Date | null
    segments: Segment[]
}
