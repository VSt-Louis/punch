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
    readableDay,
    readableMonth,
    readableWeek,
    weekStartOfDate,
} from '../utils/date'
import { Segment, PunchState } from '../types'

export type StatusOptions = {
    segments?: boolean
    day?: boolean
    week?: boolean
    month?: boolean
    year?: boolean
}

const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
const inTimeMs = (inTime: Segment) => inTime.end - inTime.start
export const inTimeHours = (inTime: Segment) => (inTime.end - inTime.start) / MS_IN_AN_HOUR
export const totalHours = (state: PunchState) => sum(state.segments.map(inTimeHours))

const printState = (
    state: PunchState
) => `Punch status: ${state.lastIn ? `${chalk.bgGreen('IN')} since ${readableDateTime(state.lastIn)}` : chalk.bgRed('OUT')}
Total hours: ${totalHours(state)}`

const printMonth = (date: Date) => `${readableMonth(date)} ${date.getFullYear()}\n`

const printWeek = (date: Date) => `${readableWeek(date)}\n`

const printDay = (date: Date) => `${readableDay(date)}\n`

export const statusReport = (state: PunchState, options: StatusOptions) => {
    const { segments } = state
    let report = printState(state) + '\n\n'

    const inTimesBegin = segments[0].start
    const inTimesEnd = segments[segments.length - 1].end
    const earliestDate = new Date(inTimesBegin)
    const startOfReport = options.month
        ? monthStartOfDate(earliestDate)
        : options.week
          ? weekStartOfDate(earliestDate)
          : earliestDate

    const blocks: Partial<Record<'month' | 'week' | 'day', { start: Date; totalMs: number }>> = {}
    if (options.month) blocks.month = { start: monthStartOfDate(earliestDate), totalMs: 0 }
    if (options.week) blocks.week = { start: weekStartOfDate(earliestDate), totalMs: 0 }
    if (options.day) blocks.day = { start: dayStartOfDate(earliestDate), totalMs: 0 }

    // start report with selected labels
    if (blocks.month) report += printMonth(blocks.month.start)
    if (blocks.week) report += printWeek(blocks.week.start)
    if (blocks.day) report += printDay(blocks.day.start)

    segments.forEach(inTime => {
        if (blocks.month) {
            if (isInMonth(blocks.month.start, inTime)) {
                blocks.month.totalMs += inTimeMs(inTime)
            } else {
                if (![options.week, options.day, options.segments].some(i => i)) {
                    report += `hours: ${blocks.month.totalMs / MS_IN_AN_HOUR}\n`
                }
                // start new block
                blocks.month.totalMs = 0
                blocks.month.start = monthStartOfDate(new Date(inTime.start))
                report += printMonth(new Date(inTime.start))
            }
        }
        if (blocks.week) {
            if (isInWeek(blocks.week.start.getTime(), inTime.start)) {
                blocks.week.totalMs += inTimeMs(inTime)
            } else {
                if (![options.day, options.segments].some(i => i)) {
                    report += `hours: ${blocks.week.totalMs / MS_IN_AN_HOUR}\n`
                }
                // start new block
                blocks.week.totalMs = 0
                blocks.week.start = weekStartOfDate(new Date(inTime.start))
                report += printWeek(new Date(inTime.start))
            }
        }
        if (blocks.day) {
            if (isInDay(blocks.day.start.getTime(), inTime.start)) {
                blocks.day.totalMs += inTimeMs(inTime)
            } else {
                if (!options.segments) {
                    report += `hours: ${blocks.day.totalMs / MS_IN_AN_HOUR}\n`
                }
                // start new block
                blocks.day.totalMs = 0
                blocks.day.start = dayStartOfDate(new Date(inTime.start))
                report += printDay(new Date(inTime.start))
            }
        }
        if (options.segments) report += `${readableDate(new Date(inTime.start))} hours: ${inTimeHours(inTime) + '\n'}`
    })
    return report
}
