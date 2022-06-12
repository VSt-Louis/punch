export type ActionType = 'in' | 'out' | 'break'

export type Action = {
  timestamp: Date
  type: ActionType
  args: (string | number)[]
}
