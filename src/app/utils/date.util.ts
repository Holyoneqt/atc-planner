export function getDaysOfMonth(month: number, year: number): number {
	return new Date(year, month + 1, 0).getDate();
}

export function getNameOfDay(day: number, month: number, year: number): string {
	return new Date(year, month, day).toLocaleDateString('de-DE', {
		weekday: 'short'
	});
}

export function getNameOfMonth(month: number): string {
	return new Date(2000, month + 1, 0).toLocaleDateString('de-DE', {
		month: 'long',
	});
}