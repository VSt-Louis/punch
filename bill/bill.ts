import path from 'path'
import { totalHours } from '../status/report'
import { PunchState } from '../types'
import { invoiceDate } from '../utils/date'
import { appendFile } from 'fs/promises'
import { round } from '../utils/misc'
import { fileExists } from '../io'

const invoice = (state: PunchState, invoiceNumber: string) => `INVOICE

Victor

Invoice number: ${invoiceNumber}

Total hours: ${round(totalHours(state), 2)}
`

export const bill = async (state: PunchState, file: string) => {
    const today = new Date()
    const parentDir = path.resolve(file, '..')
    let invoiceSerial = 0
    let invoiceNumber
    let invoiceFile

    while (
        await fileExists(
            (invoiceFile = `${path.resolve(parentDir, (invoiceNumber = `${invoiceDate(today)}${String(invoiceSerial++).padStart(3, '0')}`))}.txt`)
        )
    );

    appendFile(invoiceFile, invoice(state, invoiceNumber))
    console.log(`Wrote invoice at: ${invoiceFile}`)
}
