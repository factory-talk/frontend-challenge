const date = new Date();

export function toReadableDateFormat(customDate?: Date) {

    let currentDate = date;
    if (customDate) {
        currentDate = customDate;
    }

    const month = date.toLocaleString('en-US', { month: 'long' });
    const day = date.toLocaleString('en-US', { day: 'numeric' });
    const dayName = date.toLocaleString('en-US', { weekday: 'long' });
    const year = date.getFullYear();
    const time = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    });

    // const newFormatDate = year.toString().concat('-', month, '-', day, ' ', time);
    const newFormattedDate = month.concat(' ', day, ', ', year.toString());
    const newFormattedTime = dayName.concat(', ', time);
    return [newFormattedDate, newFormattedTime];
}

export function toHourlyTime(customDate?: Date) {
    let currentDate = date;
    if (customDate) {
        currentDate = customDate;
    }

    const time = date.toLocaleString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',
    });

    return time;
}