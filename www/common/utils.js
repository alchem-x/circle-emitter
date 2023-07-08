export async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getCSTString(date = new Date) {
    // sv: El Salvador
    return `${date.toLocaleString('sv', { hour12: false, timeZone: 'Asia/Shanghai' })} CST`
}

export function isMobile() {
    return window.matchMedia("only screen and (max-width: 760px)").matches
}

export function isAsyncFunction(f) {
    return f?.constructor?.name === 'AsyncFunction'
}

export function isJson(s) {
    if (!isNaN(s) || s.toString() === 'true' || s.toString() === 'false') {
        return false;
    }
    try {
        JSON.parse(s);
    } catch (err) {
        return false;
    }
    return true;
}