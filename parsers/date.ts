import { read } from '../io'

/*
If a partial date is found, it is assumed that the missing parts are the same as the last time they were defined in the dates above.
If no such date cant be found, current date is used (there could be a prompt to confirm that tho)

in 2022-02-12 09:19
out 10:04             parsed as 2022-02-12 10:04  
in 21 07:20           parsed as 2022-02-21 07:20 
out 45                parsed as 2022-02-21 07:45
in 03-01 08:12        parsed as 2022-03-01 08:12
out 10:21             parsed as 2022-03-01 10:21

Seconds are not supported for now, could be added in the future.
*/

/*
valid inputs:
yyyy-mm-dd HH:mm
mm-dd HH:mm
dd HH:mm
HH:mm
mm
*/

const partsFromDate = (date: Date) => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
]

let cache: string[] | null = null
const getPreviousDateParts = async (): Promise<number[]> => {
  if (!cache) {
    const fileContents = await read().catch(err => '')
    cache = fileContents.split(/\r?\n/).filter(i => i)
  }
  if (!cache.length) {
    //all previous dates have been read, use today
    return partsFromDate(new Date())
  }
  return partsFromDate(new Date(cache.pop()!.split(' ')[1]))
}

const parseParts = (dateString: string): number[] => dateString.split(/[- :]/).map(s => Number.parseInt(s))

export const parseDate = async (dateString?: string | number): Promise<Date> => {
  dateString = dateString?.toString().trim()
  if (!dateString) return new Date()
  const parts = parseParts(dateString)
  while (parts.length < 5) {
    let previousDateParts
    while ((previousDateParts = await getPreviousDateParts()).length <= parts.length) {}
    while (previousDateParts.length > parts.length) {
      parts.unshift(previousDateParts[previousDateParts.length - (parts.length + 1)])
    }
  }

  //month is 0 indexed in new Date()
  parts[1]--

  return new Date(...(parts as [number, number, number, number, number]))
}
