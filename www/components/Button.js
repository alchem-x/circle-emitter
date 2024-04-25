import { reactive } from '../deps.js'

export default {
    template: `
      <button @click="onClickInternal" class="ui-button"
              :class="state.loading ? 'loading' : ''" :data-type="type">
      <slot></slot>
      </button>
    `,
    props: {
        type: {
            type: String,
            default: '',
        },
        onClick: {
            type: Function,
            default: () => undefined,
        }
    },
    setup(props) {
        const state = reactive({
            loading: false,
        })

        async function onClickInternal() {
            try {
                state.loading = true
                await props.onClick()
            } finally {
                state.loading = false
            }
        }

        return {
            state,
            onClickInternal,
        }
    },
}