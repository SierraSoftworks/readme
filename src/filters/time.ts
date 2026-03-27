import dayjs from "dayjs"
import relativeTimePlugin from "dayjs/plugin/relativeTime"
import calendarPlugin from "dayjs/plugin/calendar"
import utcPlugin from "dayjs/plugin/utc"

dayjs.extend(relativeTimePlugin)
dayjs.extend(calendarPlugin)
dayjs.extend(utcPlugin)

export function relativeTime(value: string) {
    return dayjs.utc(value).local().fromNow()
}

export function calendarTime(value: string) {
    return dayjs.utc(value).calendar()
}

export function formatTime(value: string, format?: string) {
    return dayjs.utc(value).format(format || "YYYY-MM-DD HH:mm")
}
