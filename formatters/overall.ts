import { Action } from '../types'
import { makeStatus } from '../status'

export const overall = (actions: Action[]) => {
  const status = makeStatus(actions)
  const totalHours = status.inTimes.reduce((tot, inTime) => tot + (inTime.end - inTime.start), 0) / (1000 * 3600)
  return `total hours ${totalHours}`
}
