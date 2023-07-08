import { css, computed, watch, nextTick, ref, defineComponent } from '../deps.js'

const ClassName = css`
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: .25rem 1rem;

    .tag-span label {
        margin-left: .125rem;
    }
`

export default defineComponent({
    template: `
      <div :class="ClassName" v-if="filterTagList.length">
        <span class="tag-span">
          <input ref="checkAllInputRef" type="checkbox" id="x-filter-label-all" name="checkbox" is="ui-checkbox"
                 :checked="checkAll" @input="onCheckAll">
          <label for="x-filter-label-all">All</label>
        </span>
        <span class="tag-span" v-for="(it) of filterTagList">
          <input type="checkbox" :id="it.id" name="checkbox" is="ui-checkbox" @input="onCheck(it, $event)"
                 :checked="it.checked">
          <label :for="it.id">{{ it.value }}</label>
        </span>
      </div>
    `,
    props: {
        state: Object,
    },
    setup(props) {

        const allTagList = computed(() => {
            const projectList = props.state.projectList
            const l = []
            for (const p of projectList) {
                l.push(...p.getTagList())
            }
            return [...new Set(l)]
        })

        const filterTagList = computed(() => {
            return allTagList.value.map((it) => {
                return {
                    id: `filter-tag-${it}`,
                    value: it,
                    checked: props.state.searchTagList.includes(it),
                }
            })
        })

        const checkAll = computed(() => {
            return props.state.searchTagList.length === filterTagList.value.length
        })

        function onCheckAll(ev) {
            if (ev.target.checked) {
                props.state.searchTagList = allTagList.value
            } else {
                props.state.searchTagList = []
            }
        }

        function onCheck(it, ev) {
            if (ev.target.checked) {
                props.state.searchTagList.push(it.value)
            } else {
                props.state.searchTagList = props.state.searchTagList.filter((t) => t !== it.value)
            }
        }

        const checkAllInputRef = ref()
        watch(filterTagList, async () => {
            await nextTick()
            if (checkAllInputRef.value) {
                checkAllInputRef.value.indeterminate = props.state.searchTagList.length && !checkAll.value
            }
        }, {
            immediate: true,
        })

        return {
            ClassName,
            filterTagList,
            checkAll,
            onCheckAll,
            onCheck,
            checkAllInputRef,
        }
    },
})
