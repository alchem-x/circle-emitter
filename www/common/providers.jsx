import { defineComponent } from 'vue'
import { dateZhCN, enUS, lightTheme, NConfigProvider, NMessageProvider, createDiscreteApi } from 'naive-ui'

export function withProvider(WrappedComponent) {
    return defineComponent({
        render() {
            return (
                <NConfigProvider theme={lightTheme} locale={enUS} dateLocale={dateZhCN}>
                    <NMessageProvider>
                        <WrappedComponent />
                    </NMessageProvider>
                </NConfigProvider>
            )
        }
    })
}

export const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
    ["message", "dialog", "notification", "loadingBar", "modal"],
    {
        configProviderProps: {
            theme: lightTheme,
            locale: enUS,
            dateLocale: dateZhCN,
        }
    }
);