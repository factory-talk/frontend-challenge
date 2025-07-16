import {
    convertTimeHour,
    convertDatetimeFormat,
    convertLocalTime
} from '../../util/convert-date'

describe('convert-date utils', () => {
    const timestamp = 1625079600 // July 1, 2021 11:00 PM UTC
    const timezoneOffset = 25200 // +7 hours in seconds

    it('convertTimeHour should return time in hh:mm A format', () => {
        const result = convertTimeHour(timestamp)
        expect(result).toMatch(/\d{2}:\d{2} [AP]M/)
    })

    it('convertDatetimeFormat should return readable full format in Asia/Bangkok', () => {
        const result = convertDatetimeFormat(timestamp)
        expect(result).toMatch(/^\w+, \d{1,2} \w+, \d{4} at \d{2}:\d{2} [AP]M$/)
    })

    it('convertLocalTime should return correct local time from offset', () => {
        const result = convertLocalTime(timestamp, timezoneOffset)
        expect(result).toMatch(/^\w+, \d{1,2} \w+, \d{4} \d{2}:\d{2} [AP]M$/)
    })
})
