import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advancedFormat);
dayjs.extend(localeData);

export const convertTimeHour = (timestamp: number) => {
    const time = dayjs(timestamp * 1000)
    const formatted = time.format('hh:mm A')

    return formatted
}

export const convertDatetimeFormat = (timestamp: number) => {
    const formatted = dayjs(timestamp * 1000)
        .tz('Asia/Bangkok')
        .format('dddd, D MMMM, YYYY [at] hh:mm A');

    return formatted
}