import chalk from 'chalk'
import {
  dayStartOfDate,
  isInDay,
  isInMonth,
  isInWeek,
  monthStartOfDate,
  MS_IN_AN_HOUR,
  readableDate,
  readableDateTime,
  weekStartOfDate,
} from '../utils/date'
import { InTime, Status } from './status'

export type StatusOptions = {
  segments?: boolean
  day?: boolean
  week?: boolean
  month?: boolean
}

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
const inTimeMs = (inTime: InTime) => inTime.end - inTime.start
export const inTimeHours = (inTime: InTime) => (inTime.end - inTime.start) / MS_IN_AN_HOUR

export const statusReport = (status: Status, opts: StatusOptions) => {
  return `
Punch status: ${status.lastIn ? `${chalk.bgGreen('IN')} since ${readableDateTime(status.lastIn)}` : chalk.bgRed('OUT')}
Total hours: ${sum(status.inTimes.map(inTimeHours))}

${opts.segments || opts.day || opts.week || opts.month ? report(status.inTimes, opts) : ''}
`
}

const report = (inTimes: InTime[], opts: StatusOptions) => {
  const inTimesBegin = inTimes[0].start
  const inTimesEnd = inTimes[inTimes.length - 1].end
  const earliestDate = new Date(inTimesBegin)
  const startOfReport = opts.month
    ? monthStartOfDate(earliestDate)
    : opts.week
    ? weekStartOfDate(earliestDate)
    : earliestDate

  const blocks: Partial<Record<'month' | 'week' | 'day', { start: Date; totalMs: number }>> = {}
  if (opts.month) blocks.month = { start: monthStartOfDate(earliestDate), totalMs: 0 }
  if (opts.week) blocks.week = { start: weekStartOfDate(earliestDate), totalMs: 0 }
  if (opts.day) blocks.day = { start: dayStartOfDate(earliestDate), totalMs: 0 }

  // start report with selected labels
  let _report = [blocks.month?.start, blocks.week?.start, blocks.day?.start]
    .filter(i => i)
    .map(d => readableDate(d!) + '\n')
    .join('')

  inTimes.forEach(inTime => {
    if (blocks.month) {
      blocks.month.totalMs += inTimeMs(inTime)
      if (!isInMonth(blocks.month.start, new Date(inTime.start))) {
        if (![opts.week, opts.day, opts.segments].some(i => i)) {
          _report += `hours: ${blocks.month.totalMs / MS_IN_AN_HOUR}\n`
          blocks.month.totalMs = 0
        }
        // update block start
        blocks.month.start = monthStartOfDate(new Date(inTime.start))
        // print label for next block
        _report += `month ${readableDate(new Date(inTime.start))}\n`
      }
    }
    if (blocks.week) {
      blocks.week.totalMs += inTimeMs(inTime)
      if (!isInWeek(blocks.week.start.getTime(), inTime.start)) {
        if (![opts.day, opts.segments].some(i => i)) {
          _report += `hours: ${blocks.week.totalMs / MS_IN_AN_HOUR}\n`
          blocks.week.totalMs = 0
        }
        blocks.week.start = weekStartOfDate(new Date(inTime.start))
        _report += `week ${readableDate(new Date(inTime.start))}\n`
      }
    }
    if (blocks.day) {
      blocks.day.totalMs += inTimeMs(inTime)
      if (!isInDay(blocks.day.start.getTime(), inTime.start)) {
        if (!opts.segments) {
          _report += `hours: ${blocks.day.totalMs / MS_IN_AN_HOUR}\n`
          blocks.day.totalMs = 0
        }
        blocks.day.start = dayStartOfDate(new Date(inTime.start))
        _report += `day ${readableDate(new Date(inTime.start))}\n`
      }
    }
    if (opts.segments) _report += `${readableDate(new Date(inTime.start))} hours: ${inTimeHours(inTime) + '\n'}`
  })
  return _report
}
