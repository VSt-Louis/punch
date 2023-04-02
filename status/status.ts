import { read } from '../io'
import { inTimeHours } from './report'

export type InTime = { start: number; end: number }
export type Status = {
  lastIn: Date | null
  inTimes: InTime[]
}
export const readStatus = async (file?: string): Promise<Status> => {
  const status: Status = {
    lastIn: null,
    inTimes: [] as InTime[],
  }
  const content = await read(file)
  if (!content) return status
  const lines = content.split(/\r?\n/)
  lines.forEach(line => {
    if (line) {
      const [inDate, outDate] = line.split(' -> ').map(d => (d ? new Date(Date.parse(d)) : undefined))
      if (inDate) {
        if (outDate) {
          status.inTimes.push({
            start: inDate.getTime(),
            end: outDate.getTime(),
          })
        } else {
          status.lastIn = inDate
        }
      }
    }
  })

  return status
}
