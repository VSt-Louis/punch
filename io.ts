import { R_OK, W_OK } from 'constants'
import fs, { appendFile, readFile, access } from 'fs/promises'
import path from 'path'

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
export const writeIn = async (date: Date, file?: string) => {
  return appendFile(getFile(file), `${date.toJSON()} -> `)
}
export const writeOut = async (date: Date, file?: string) => {
  return appendFile(getFile(file), `${date.toJSON()}\n`)
}
