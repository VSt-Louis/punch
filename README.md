# Punch

Used to log time on projects

## Usage

Initialize a punch file with

`punch init`

Use these two commands to log time:

- `punch in`
- `punch out`

They both accept these options

- time, t: override time at which the action takes place.

There is another command `status` used to see the state of the punch and total time. It takes the following options:

- verbose, v: adds info.
- week, w: prints the total time separated by week.
- raw, r: print the content of the punch file as is.

## Example command

punch in 10:39

## Datatypes

_Action:_ An action in time, either in, out, break. Has a target (team member or project) and a timestamp

## Sources

Sources are the different places the punch data can be stored. Two of them are implemented for now:

- Discord chat history
- Text file

Sources need a way to produce a list of actions
