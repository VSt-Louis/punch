import { makeStatus } from '../status'
import { Action } from '../types'
import { MS_IN_AN_HOUR, MS_IN_A_DAY, readableDate } from '../utils/date'

export const period = (actions: Action[]) => {
  const status = makeStatus(actions)

  return status.inTimes.map(t => ({
    date: readableDate(new Date(t.start)),
    hours: (t.end - t.start) / MS_IN_AN_HOUR,
  }))
}
