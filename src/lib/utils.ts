export const toLowerBase = (string: string) =>
	string
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLocaleLowerCase("el");

export const studentEmailRegex =
	/(dai1[6-9][0-3]\d{2}|it\d{3,4}|tm1[0-4]\d\d?|(ics2\d[0-4]\d\d)|iis2\d[0-4]\d\d)@uom\.edu\.gr/;

export function generateTimestamp(date: Date) {
	const dayKey = date.getDay();
	const timeKey = date.getHours();

	return (dayKey << 5) | (timeKey & 0x1f);
}
