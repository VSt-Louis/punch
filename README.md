# Punch

Used to log time on projects

## Commands

### in, out

Use these two commands to log time:

- `punch in`
- `punch out`

They both accept additionnal parameters to override time (logs current time by default)

Example:

If a partial date is found, it is assumed that the missing parts are the same as the last time they were defined in the dates above.
If no such date cant be found, current date is used (there could be a prompt to confirm that tho)

```
in 2022-02-12 09:19
out 10:04             //parsed as 2022-02-12 10:04
in 21 07:20           //parsed as 2022-02-21 07:20
out 45                //parsed as 2022-02-21 07:45
in 03-01 08:12        //parsed as 2022-03-01 08:12
out 10:21             //parsed as 2022-03-01 10:21
```

Seconds are not supported for now, could be added in the future.

### status

There is another command `status` used to see the state of the punch and total time. It takes the following options:

- verbose, v: adds info.
- week, w: prints the time per week.
- raw, r: print the content of the punch file as is.
