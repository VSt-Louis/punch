import { R_OK, W_OK } from 'constants'
import fs, { appendFile, readFile, access } from 'fs/promises'
import path from 'path'
import { Action, ActionType } from './types'

// why do I have to do this...
export const fileExists = (file: string, mode?: number): Promise<boolean> => {
  return access(file, mode || W_OK | R_OK)
    .then(() => true)
    .catch(() => false)
}

const defaultFile = () => path.join(process.cwd(), 'punch.txt')

const getFile = (file?: string) => (file ? path.join(process.cwd(), file) : defaultFile())

export const read = async (file?: string) => {
  const _file = getFile(file)
  if (await fileExists(_file)) return readFile(_file, 'utf8')
}
export const write = async (line: string, file?: string) => {
  return appendFile(getFile(file), line + '\n')
}
export const actionsFromContent = (content?: string): Action[] => {
  if (!content) return []
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
