#!/usr/bin/env node

import yargs from 'yargs'
import { writeIn, writeOut } from './io'
import { parseDate } from './parsers/date'
import { statusReport } from './status/report'
import { datesHoursDelta, readableDateTime } from './utils/date'
import { version } from './package.json'
import { readStatus } from './status/status'

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
      const status = await readStatus(argv.f)
      if (!status.lastIn) {
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
      const status = await readStatus(argv.f)
      if (status.lastIn) {
        writeOut(date, argv.f)

        console.log(
          `out ${readableDateTime(new Date(date))},` +
            (status.lastIn ? ` last segment: ${datesHoursDelta(status.lastIn, date).toFixed(2)} hours` : '')
        )
      } else {
        console.log('status is already out!')
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
      const status = await readStatus(argv.f)

      const date = new Date()
      if (status.lastIn) {
        writeOut(new Date(date.getTime() - minutes * 6e4), argv.f)
        writeIn(date, argv.f)
        console.log(
          `${minutes} minute${minutes > 1 ? 's' : ''} break, back in at ${readableDateTime(date)},` +
            (status.lastIn
              ? ` last segment: ${datesHoursDelta(status.lastIn, new Date(date.getTime() - minutes * 6e4)).toFixed(
                  2
                )} hours`
              : '')
        )
      } else {
        console.log('status is out!')
      }
    }
  )
  .command(
    'bill',
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
      const status = await readStatus(argv.f)
      const date = new Date()
      if (!status.lastIn) {
        writeIn(new Date(date.getTime() - minutes * 6e4), argv.f)
        writeOut(date, argv.f)
        console.log(`billed ${minutes} minute${minutes > 1 ? 's' : ''}, back out at ${readableDateTime(date)},`)
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
          describe: 'Print time by day',
          type: 'boolean',
        },
        week: {
          alias: 'w',
          describe: 'Print time by week',
          type: 'boolean',
        },
        month: {
          alias: 'm',
          describe: 'Print time by month',
          type: 'boolean',
        },
        actions: {
          alias: 'a',
          describe: 'Print in or out events',
          type: 'boolean',
        },
      }),
    async argv => {
      argv.f && console.log(`File: ${argv.f}`)

      readStatus(argv.f)
        .then(status => {
          const { segments, day, week, month } = argv
          return statusReport(status, { segments, day, week, month })
        })
        .then(console.log)
        .catch(err => {
          console.error(err)
        })
    }
  ).argv
