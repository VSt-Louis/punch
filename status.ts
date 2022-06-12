import { Action } from './types'

export type InTime = { start: number; end: number }
type Status = {
  lastIn: Date | null
  inTimes: InTime[]
}

export const makeStatus = (actions: Action[]): Status => {
  actions.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())

  const status: Status = {
    lastIn: null,
    inTimes: [] as InTime[],
  }

  actions.forEach(a => {
    if (a.type == 'in' && !status.lastIn) {
      status.lastIn = a.timestamp
    }
    if (a.type == 'out' && status.lastIn) {
      const inTime = {
        start: status.lastIn.getTime(),
        end: a.timestamp.getTime(),
      }
      status.inTimes.push(inTime)
      status.lastIn = null
    }
    let minutes = 0
    if (a.type == 'break' && status.lastIn && !isNaN((minutes = Number(a.args[0])))) {
      // equivalent to out n mins before then in immediately
      const inTime = {
        start: status.lastIn.getTime(),
        end: a.timestamp.getTime() - minutes * 6e4,
      }
      if (inTime.start < inTime.end) status.inTimes.push(inTime)
      status.lastIn = a.timestamp
    }
  })
  return status
}
