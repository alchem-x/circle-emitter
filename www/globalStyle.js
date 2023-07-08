import { injectGlobal } from '@emotion/css'

export function injectGlobalStyle() {
    return injectGlobal`
        * {
            -webkit-tap-highlight-color: transparent;
        }

        body {
            margin: 0;
            padding: 0;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }

        .flex {
            display: flex;
        }

        .justify-between {
            justify-content: space-between;
        }

        .gap {
            gap: .5rem;
        }

        .items-center {
            align-items: center;
        }

        .flex-wrap {
            flex-wrap: wrap;
        }
        
        .justify-end {
            justify-content: end;
        }

    `
}
