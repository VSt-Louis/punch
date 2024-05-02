import { R_OK, W_OK } from 'constants'
import fs, { appendFile, readFile, access } from 'fs/promises'
import path from 'path'
import { PunchState, Segment } from './types'

// why do I have to do this...
export const fileExists = (file: string, mode?: number): Promise<boolean> => {
    return access(file, mode || W_OK | R_OK)
        .then(() => true)
        .catch(() => false)
}

const defaultFile = () => path.join(process.cwd(), 'punch.txt')

export const getFile = (file?: string) => (file ? path.join(process.cwd(), file) : defaultFile())

export const read = async (file?: string) => {
    const _file = getFile(file)
    if (await fileExists(_file)) return readFile(_file, 'utf8')
}

export const readPunchState = async (file?: string): Promise<PunchState | undefined> => {
    const content = await read(file)
    if (!content) return

    const status: PunchState = {
        lastIn: null,
        segments: [] as Segment[],
    }

    const lines = content.split(/\r?\n/)
    lines.forEach(line => {
        if (line) {
            const [inDate, outDate] = line.split(' -> ').map(d => (d ? new Date(Date.parse(d)) : undefined))
            if (inDate) {
                if (outDate) {
                    status.segments.push({
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

export const writeIn = async (date: Date, file?: string) => {
    return appendFile(getFile(file), `${date.toJSON()} -> `)
}
export const writeOut = async (date: Date, file?: string) => {
    return appendFile(getFile(file), `${date.toJSON()}\n`)
}
