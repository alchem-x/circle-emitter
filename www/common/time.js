function getTimeZone() {
    const timeZoneMap = {
        [60 * -8]: 'Asia/Shanghai',
        [60 * -9]: 'Asia/Seoul',
    }
    return timeZoneMap[new Date().getTimezoneOffset()] ?? 'UTC'
}

const timeZone = getTimeZone()

export function getTimeTag(date = new Date()) {
    // sv: El Salvador
    return date.toLocaleString('sv', { hour12: false, timeZone })
}