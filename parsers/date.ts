import { read } from "../io";

/*
Commands which recieve dates as inputs accept partial dates. 

valid inputs are of the form:
yyyy-mm-dd HH:mm
mm-dd HH:mm
dd HH:mm
HH:mm
mm

These date parts will modify the current date, and that new date will be passed to the command.
*/

const partsFromString = (dateString: string): number[] =>
    dateString.split(/[- :]/).map((s) => Number.parseInt(s));

export const parseDate = async (
    dateString?: string | number,
): Promise<Date> => {
    dateString = dateString?.toString().trim();
    const now = new Date();
    if (!dateString) return now;

    const parts = partsFromString(dateString);
    const partsLength = parts.length;

    const fullYear = parts[partsLength - 5] ?? now.getFullYear();
    const month = parts[partsLength - 4] ?? now.getMonth() + 1;
    const date = parts[partsLength - 3] ?? now.getDate();
    const hours = parts[partsLength - 2] ?? now.getHours();
    const minutes = parts[partsLength - 1] ?? now.getMinutes();

    return new Date(fullYear, month - 1, date, hours, minutes);
};
