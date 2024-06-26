import { weekStartOfDate, weekStartFormatted, MS_IN_A_WEEK } from '../utils/date'
import { PunchState } from '../types'

type WorkWeek = {
    weekStart: string
    hours: number
}

export const week = (status: PunchState) => {
    const workWeeks: WorkWeek[] = []

    const earliestDate = new Date(Math.min(...status.segments.map(t => t.start)))
    // either the lastIn time or the end of the last inTime
    const mostRecentDate = new Date(
        Math.max(status.lastIn?.getTime() || -1, status.segments[status.segments.length - 1].end)
    )
    const numberOfWeeks =
        (weekStartOfDate(mostRecentDate).getTime() - weekStartOfDate(earliestDate).getTime()) / MS_IN_A_WEEK + 1

    const startOfReport = weekStartOfDate(earliestDate)

    const isInWeek = (time: number, weekStartTime: number) => {
        const d = time - weekStartTime
        return d > 0 && d < MS_IN_A_WEEK
    }
    for (let i = 0; i < numberOfWeeks; i++) {
        const weekStartTime = startOfReport.getTime() + i * MS_IN_A_WEEK
        //only include weeks with at least 1 hour in the report
        const hours =
            Math.round(
                status.segments.reduce(
                    (tot, t) => (isInWeek(t.start, weekStartTime) ? tot + t.end - t.start : tot),
                    0
                ) / 36000
            ) / 100

        const workWeek = {
            weekStart: weekStartFormatted(new Date(weekStartTime)),
            hours,
        }
        hours > 0 && workWeeks.push(workWeek)
    }
    return workWeeks
}
