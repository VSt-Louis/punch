# Punch

Used to log time on projects

## Information

### Rationale

This program was created to track time spent on prjects, billable or not. It works like a "punch", a machine where employees of certain workplaces indicate the time they came in to work and went out.

### Architecture

This simple program reads and writes to a text file. The interface lets the user decide which file to read from and write to using the `-f` command line parameter. The file stores data one entry per line, those entries being either an in or an out entry followed by a timestamp or a break entry followed by a number of minutes.

## Usage

### Punch in

Use `punch in` to start counting time. This will print a confirmation of the exact begin time that was recorded.

Example:

```
> punch in
in 16:51:27, 2022 November 8
```

### Punch out

Use `punch out` to stop counting time. Just as with the in command, this one will confirm the time that was registered as the end of that time segment, and will also print the length of that segment.

Example:

```
> punch out
out 19:21:45, 2022 November 8, last segment: 2.50 hours
```

### Punch break

Use `punch break <minutes>` to remove an amount of minutes from the current segment. This is equivalent to punching out that number of minutes earlier and punching back in.

### Punch status

Use `punch status` to get information about the current segment and previous segments, as well as the total hours recorded.

Example:

```
> punch status
Punch status: OUT
Total hours: 2.6019544444444446
```

### Overriding the default date and time

Commands which recieve dates as inputs accept partial dates.

valid inputs are of the form:

```
yyyy-mm-dd HH:mm
mm-dd HH:mm
dd HH:mm
HH:mm
mm
```

These date parts will modify the current date, and that new date will be passed to the command.
Seconds are not supported for now, but could be added in the future.
