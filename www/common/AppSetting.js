export default class AppSetting {
    constructor({ host, circleToken } = {}) {
        this.host = host ?? 'circleci.com'
        this.circleToken = circleToken ?? ''
    }
}