#!/usr/bin/env node

import yargs from 'yargs'
import { actionsFromContent, read, write } from './io'
import { parseDate } from './parsers/date'
import status from './status/status'
import { Action, ActionType } from './types'
import { datesHoursDelta, MS_IN_AN_HOUR, readableDateTime } from './utils/date'
import {version} from './package.json'

const dateOrToday = (date?: string | number | Date): Date => (date ? new Date(date) : new Date())

const getDateArgument = (argv: { _: [(string | number)?, (string | number)?, ...any[]] }) =>
  parseDate([argv._[1], argv._[2]].join(' '))

const statusFromFile: (f: string | undefined) => Promise<{
  status: ActionType
  lastTimestamp: Date | null
}> = (f: string | undefined) => {
  const inOuts = (actions: Action[]) => actions.filter(a => ['in', 'out'].includes(a.type))
  return read(f)
    .then(actionsFromContent)
    .then(inOuts)
    .then(actions => {
      if (actions.length)
        return {
          status: actions[actions.length - 1].type,
          lastTimestamp: actions.length > 1 ? actions[actions.length - 1].timestamp : null,
        }
      return {
        status: 'out',
        lastTimestamp: null,
      }
    })
}

yargs(process.argv.slice(2))
  .scriptName('punch')
  .version(version)
  // .command(
  //   'init',
  //   '',
  //   yargs => yargs.coerce({ date: Date.parse }),
  //   async argv => {
  //     const date = dateOrToday(argv.date).toJSON()
  //     write(`init ${date}`, { replace: true })
  //   }
  // )
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
      const { status } = await statusFromFile(argv.f)
      if (status == 'out') {
        write(`in ${date.toJSON()}`, argv.f)
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
      const { status, lastTimestamp } = await statusFromFile(argv.f)
      if (status == 'in') {
        write(`out ${date.toJSON()}`, argv.f)

        console.log(
          `out ${readableDateTime(new Date(date))},` +
            (lastTimestamp ? ` last segment: ${datesHoursDelta(lastTimestamp, date).toFixed(2)} hours` : '')
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
      if (!argv._[1]) {
        console.log('minutes arg expected')
        return
      }
      if (isNaN(Number(argv._[1]))) {
        console.log(`arg ${argv._[1]} is not a number`)
        return
      }
      const { status } = await statusFromFile(argv.f)
      if (status == 'in') write(`break ${argv._[1]}`, argv.f)
      else {
        console.log('status is out!')
      }
    }
  )
  .command(
    'status',
    'Print total time',
    yargs =>
      yargs.options({
        period: {
          alias: 'p',
          describe: 'Print time of each in - out interval',
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

      read(argv.f)
        .then(actionsFromContent)
        .then(actions => {
          if (argv.actions) return actions
          const { period, day, week, month } = argv
          return status(actions, { period, day, week, month })
        })
        .then(console.log)
        .catch(err => {
          console.error(err)
        })
    }
  ).argv
