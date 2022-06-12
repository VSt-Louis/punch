#!/usr/bin/env node

import yargs from 'yargs'
import { overall } from './formatters/overall'
import { period } from './formatters/period'
import { week } from './formatters/week'
import { actionsFromContent, read, write } from './io'
import { parseDate } from './parsers/date'

const dateOrToday = (date?: string | number | Date): Date => (date ? new Date(date) : new Date())

const getDateArgument = (argv: { _: [(string | number)?, (string | number)?, ...any[]] }) =>
  parseDate([argv._[1], argv._[2]].join(' ')).then(d => d.toJSON())

yargs(process.argv.slice(2))
  .scriptName('punch')
  .version('1.0.0')
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
      write(`in ${date}`, argv.f)
    }
  )
  .command(
    'out',
    '',
    yargs => yargs,
    async argv => {
      const date = await getDateArgument(argv)
      write(`out ${date}`, argv.f)
    }
  )
  .command(
    'status',
    'Print total time',
    yargs =>
      yargs.options({
        verbose: {
          alias: 'v',
          describe: 'Print additionnal info',
          type: 'boolean',
        },
        week: {
          alias: 'w',
          describe: 'Print time by week',
          type: 'boolean',
        },
        period: {
          alias: 'p',
          describe: 'Print time by period',
          type: 'boolean',
        },
        raw: {
          alias: 'r',
          describe: 'Print content of punch file as is',
          type: 'boolean',
        },
      }),
    async argv => {
      argv.f && console.log(argv.f)

      read(argv.f)
        .then(content => {
          if (argv.raw) console.log(actionsFromContent(content))
          else if (argv.period) console.log(period(actionsFromContent(content)))
          else if (argv.week) console.log(week(actionsFromContent(content)))
          else console.log(overall(actionsFromContent(content)))
        })
        .catch(err => {
          if (err.code == 'ENOENT') {
            console.error('use `punch init` to initialize a punch file before using other commands')
          }
        })
    }
  ).argv
