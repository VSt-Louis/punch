#!/usr/bin/env node

import yargs from 'yargs'
import { getFile, writeIn, writeOut, readPunchState } from './io'
import { parseDate } from './parsers/date'
import { statusReport } from './status/report'
import { datesHoursDelta, readableDateTime } from './utils/date'
import { version } from './package.json'
import { bill } from './bill/bill'

const getDateArgument = (argv: { _: [(string | number)?, (string | number)?, ...any[]] }) =>
    parseDate(argv._.slice(1).join(' '))

yargs(process.argv.slice(2))
    .scriptName('punch')
    .version(version)
    .option('f', {
        alias: 'file',
        type: 'string',
    })
    .command(
        'in',
        '',
        yargs => yargs,
        async argv => {
            const date = await getDateArgument(argv)
            const status = await readPunchState(argv.f)

            if (!status?.lastIn) {
                writeIn(date, argv.f)
                console.log(`in ${readableDateTime(date)}`)
            } else {
                console.log('status is already in!')
            }
        }
    )
    .command(
        'out',
        '',
        yargs => yargs,
        async argv => {
            const date = await getDateArgument(argv)
            const status = await readPunchState(argv.f)

            if (!status?.lastIn) {
                console.log('status is already out!')
            } else {
                writeOut(date, argv.f)
                console.log(
                    `out ${readableDateTime(new Date(date))},` +
                        (status.lastIn ? ` last segment: ${datesHoursDelta(status.lastIn, date).toFixed(2)} hours` : '')
                )
            }
        }
    )
    .command(
        'break',
        '',
        yargs => yargs,
        async argv => {
            const minutes = Number(argv._[1])
            if (!minutes) {
                console.log('minutes arg expected')
                return
            }
            if (isNaN(minutes)) {
                console.log(`arg ${minutes} is not a number`)
                return
            }
            const status = await readPunchState(argv.f)

            const date = new Date()
            if (!status?.lastIn) {
                console.log('status is out!')
            } else {
                writeOut(new Date(date.getTime() - minutes * 6e4), argv.f)
                writeIn(date, argv.f)
                console.log(
                    `${minutes} minute${minutes > 1 ? 's' : ''} break, back in at ${readableDateTime(date)},` +
                        (status.lastIn
                            ? ` last segment: ${datesHoursDelta(
                                  status.lastIn,
                                  new Date(date.getTime() - minutes * 6e4)
                              ).toFixed(2)} hours`
                            : '')
                )
            }
        }
    )

    .command(
        'add',
        '',
        yargs => yargs,
        async argv => {
            const minutes = Number(argv._[1])
            if (!minutes) {
                console.log('minutes arg expected')
                return
            }
            if (isNaN(minutes)) {
                console.log(`arg ${minutes} is not a number`)
                return
            }
            const status = await readPunchState(argv.f)
            const date = new Date()
            if (!status?.lastIn) {
                writeIn(new Date(date.getTime() - minutes * 6e4), argv.f)
                writeOut(date, argv.f)
                console.log(`added ${minutes} minute${minutes > 1 ? 's' : ''}, back out at ${readableDateTime(date)},`)
            } else {
                console.log('status is in!')
            }
        }
    )
    .command(
        'status',
        'Print total time',
        yargs =>
            yargs.options({
                segments: {
                    alias: 's',
                    describe: 'Print each in - out segment',
                    type: 'boolean',
                },
                day: {
                    alias: 'd',
                    describe: 'Show the day of segments',
                    type: 'boolean',
                },
                week: {
                    alias: 'w',
                    describe: 'Show the week of segments',
                    type: 'boolean',
                },
                month: {
                    alias: 'm',
                    describe: 'Show the month of segments',
                    type: 'boolean',
                },
                year: {
                    alias: 'y',
                    describe: 'Show the year of segments',
                    type: 'boolean',
                },
            }),
        async argv => {
            const state = await readPunchState(argv.f)
            if (!state) console.log(`No punch file at "${getFile(argv.f)}" or file is empty`)
            else {
                argv.f && console.log(`File: ${argv.f}`)
                const { segments, day, week, month, year } = argv
                console.log(statusReport(state, { segments, day, week, month, year }))
            }
        }
    )
    .command(
        'bill',
        '',
        yargs => yargs,
        async argv => {
            const state = await readPunchState(argv.f)
            if (!state) console.log(`No punch file at "${getFile(argv.f)}" or file is empty`)
            else {
                const file = getFile(argv.f)
                console.log(`File: ${file}`)
                bill(state, file)
            }
        }
    ).argv
