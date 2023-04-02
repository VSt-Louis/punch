import { MS_IN_AN_HOUR, readableDate } from '../utils/date'
import { Status } from './status'

export const segments = (status: Status) => {
  return status.inTimes.map(t => ({
    date: readableDate(new Date(t.start)),
    hours: (t.end - t.start) / MS_IN_AN_HOUR,
  }))
}
