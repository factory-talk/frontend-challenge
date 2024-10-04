import moment from 'moment-timezone';

export function convertToLocalTime (utcDateTime: string, timezone: string = 'Asia/Bangkok') {
	return moment.utc(utcDateTime).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
}

export function getLocalTimezone () {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getHour (dateTimeStr: string, timezone: string = 'Asia/Bangkok') {
	const formattedTime = moment.tz(dateTimeStr, timezone).format('h A');
	return formattedTime;
}

export function convertTimestampToLocalTime (timestamp: number, timezone: string = 'Asia/Bangkok') {
	return moment.unix(timestamp).tz(timezone).format('YYYY-MM-DD HH:mm:ss');
}

export function formatDate (dateTimeStr: string, timezone: string = 'Asia/Bangkok', displayFormat: string = 'dddd, DD MMM YYYY') {
	return moment.tz(dateTimeStr, timezone).format(displayFormat);
}

export const offsetToTimezone = (offset: number): string => {
	const hours = Math.floor(offset / 3600);
	const minutes = Math.abs(offset % 3600 / 60);
	const sign = hours >= 0 ? '+' : '-';
	return `UTC${sign}${String(Math.abs(hours)).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
