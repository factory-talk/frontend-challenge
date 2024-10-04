import {
	convertToLocalTime,
	getLocalTimezone,
	getHour,
	convertTimestampToLocalTime,
	formatDate,
	offsetToTimezone
} from './dateTimeUtil';

describe('dateTimeUtil', () => {
	test('convertToLocalTime should convert UTC time to local time', () => {
		const utcDateTime = '2024-10-01T12:00:00Z';
		const timezone = 'Asia/Bangkok';
		const localTime = convertToLocalTime(utcDateTime, timezone);
		expect(localTime).toBe('2024-10-01 19:00:00');
	});

	test('getLocalTimezone should return the local timezone', () => {
		const localTimezone = getLocalTimezone();
		expect(localTimezone).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone);
	});

	test('getHour should return the hour in the specified timezone', () => {
		const dateTimeStr = '2024-10-01T12:00:00Z';
		const timezone = 'Asia/Bangkok';
		const hour = getHour(dateTimeStr, timezone);
		expect(hour).toBe('7 PM');
	});

	test('convertTimestampToLocalTime should convert timestamp to local time', () => {
		const timestamp = 1727793600; // Unix timestamp for 2024-10-01T14:40:00Z
		const timezone = 'Asia/Bangkok';
		const localTime = convertTimestampToLocalTime(timestamp, timezone);
		expect(localTime).toBe('2024-10-01 21:40:00');
	});

	test('formatDate should format the date in the specified format and timezone', () => {
		const dateTimeStr = '2024-10-01T12:00:00Z';
		const timezone = 'Asia/Bangkok';
		const displayFormat = 'dddd, DD MMM YYYY';
		const formattedDate = formatDate(dateTimeStr, timezone, displayFormat);
		expect(formattedDate).toBe('Tuesday, 01 Oct 2024');
	});

	test('offsetToTimezone should convert offset to timezone string', () => {
		const offset7Hrs = 25200;
		const timezoneString = offsetToTimezone(offset7Hrs);
		expect(timezoneString).toBe('UTC+07:00');
	});
});