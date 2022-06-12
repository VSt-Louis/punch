import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isoWeek from 'dayjs/plugin/isoWeek'

dayjs.extend(advancedFormat)
dayjs.extend(isoWeek)

export const WEEK_START = 1 as number
export const MS_IN_AN_HOUR = 36e5
export const MS_IN_A_DAY = 864e5
export const MS_IN_A_WEEK = 6048e5

export const readableDate = (d: Date): string => dayjs(d).format('YYYY MMMM D')
export const weekNumber = (d: Date): string => dayjs(d).format('W')
export const weekStartFormatted = (d: Date): string => readableDate(d) + ' Week ' + weekNumber(d)
export const weekStartOfDate = (d: Date): Date =>
  new Date(
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - MS_IN_A_DAY * ((d.getDay() - WEEK_START + 7) % 7) //days into the current week
  )
