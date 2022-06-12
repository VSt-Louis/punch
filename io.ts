import fs, { appendFile, readFile } from 'fs/promises'
import path from 'path'
import { Action, ActionType } from './types'

const defaultFile = () => path.join(process.cwd(), 'punch.txt')

const getFile = (file?: string) => (file ? path.join(process.cwd(), file) : defaultFile())

export const read = async (file?: string) => {
  return readFile(getFile(file), 'utf8')
}
export const write = async (line: string, file?: string) => {
  return appendFile(getFile(file), line + '\n')
}
export const actionsFromContent = (content: string): Action[] => {
  const lines = content.split(/\r?\n/)
  const actions: Action[] = []
  lines.forEach(line => {
    const [type, time, ...args] = line.split(' ')
    if (['in', 'out', 'break'].includes(type))
      actions.push({
        timestamp: new Date(Date.parse(time)),
        type: type as ActionType,
        args,
      })
  })
  return actions
}
