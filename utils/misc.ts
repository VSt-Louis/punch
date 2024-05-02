export const assert = (value: any, errorMessage: string) => {
    if (value) return value
    throw new Error(errorMessage)
}

export const round = (num: number, precision: number) =>
    Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision)
