import { MS_IN_AN_HOUR, readableDate } from '../utils/date'
import { PunchState } from '../types'

export const segments = (status: PunchState) => {
    return status.segments.map(t => ({
        date: readableDate(new Date(t.start)),
        hours: (t.end - t.start) / MS_IN_AN_HOUR,
    }))
}
