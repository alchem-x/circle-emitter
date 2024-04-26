function loadJs(url, module = false) {
    return new Promise((resolve, reject) => {
        const scriptRef = document.createElement('script');
        scriptRef.src = url;
        if (module) {
            scriptRef.type = 'module';
        }
        scriptRef.addEventListener('load', (ev) => {
            resolve(ev);
        });
        scriptRef.addEventListener('error', (err) => {
            reject(err);
        });
        document.body.appendChild(scriptRef);
    })
}

function loadCss(url) {
    return new Promise((resolve, reject) => {
        const linkRef = document.createElement('link');
        linkRef.rel = 'stylesheet';
        linkRef.href = url;
        linkRef.addEventListener('load', (ev) => {
            resolve(ev);
        });
        linkRef.addEventListener('error', (err) => {
            reject(err);
        });
        document.head.appendChild(linkRef);
    })
}

await loadJs('https://unpkg.com/vue@3.3.4/dist/vue.global.prod.js');
await loadJs('https://unpkg.com/@emotion/css@11.11.2/dist/emotion-css.umd.min.js');
await loadJs('https://unpkg.com/lu2@2023.6.26/theme/edge/js/common/safari-polyfill.js');
await loadJs('https://unpkg.com/lu2@2023.6.26/theme/edge/js/common/all.js');

await loadCss('https://unpkg.com/lu2@2023.6.26/theme/edge/css/common/animate.css');
await loadCss('https://unpkg.com/lu2@2023.6.26/theme/edge/css/common/ui.css');


const AppData = {
    userscript: false,
};

const getGlobalModule = (name) => window[name];

const { reactive, watch, onMounted, createApp, computed, ref, nextTick } = getGlobalModule('Vue');
const { css, cx, injectGlobal } = getGlobalModule('emotion');
const Dialog = getGlobalModule('Dialog');
const LightTip = getGlobalModule('LightTip');

const showSaveFilePicker = getGlobalModule('showSaveFilePicker');

injectGlobal`
    * {
        -webkit-tap-highlight-color: transparent;
    }

    body {
        margin: 0;
        padding: 0;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
`;

var Button = {
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
        });

        async function onClickInternal() {
            try {
                state.loading = true;
                await props.onClick();
            } finally {
                state.loading = false;
            }
        }

        return {
            state,
            onClickInternal,
        }
    },
};

function readAsText(blob) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {

        reader.addEventListener('load', () => {
            resolve(reader.result);
        });

        reader.addEventListener('error', () => {
            reject(reader.error);
        });

        reader.readAsText(blob);
    })
}

function openFileAndReadAsText(callback = (err, text) => undefined) {
    const id = 'open_file_and_read_as_text';
    document.getElementById(id)?.remove();
    const inputRef = document.createElement('input');
    inputRef.type = 'file';
    inputRef.id = id;
    inputRef.style.display = 'none';
    inputRef.addEventListener('change', async (ev) => {
        try {
            const file = ev.target.files[0];
            if (file) {
                const text = await readAsText(file);
                callback(null, text);
            }
        } catch (err) {
            callback(err);
        } finally {
            inputRef.remove();
        }
    });
    document.body.appendChild(inputRef);
    inputRef.click();
}

function getTimeZone() {
    const timeZoneMap = {
        [60 * -8]: 'Asia/Shanghai',
        [60 * -9]: 'Asia/Seoul',
    };
    return timeZoneMap[new Date().getTimezoneOffset()] ?? 'UTC'
}

const timeZone = getTimeZone();

function getTimeTag(date = new Date()) {
    // sv: El Salvador
    return date.toLocaleString('sv', { hour12: false, timeZone })
}

class Project {

    static sequence = 1

    constructor({ name, description, projectSlug, branch, parameters, tags, recentTriggered } = {}) {
        this.id = Project.sequence++;
        this.name = name ?? '';
        this.description = description ?? '';
        this.projectSlug = projectSlug ?? '';
        this.branch = branch ?? '';
        this.parameters = parameters ?? {};
        this.tags = tags ?? '';
        this.recentTriggered = recentTriggered ?? [];
    }

    getParametersJsonString() {
        return JSON.stringify(this.parameters)
    }

    setParametersJsonString(jsonString) {
        this.parameters = JSON.parse(jsonString);
    }

    addNewTriggered(it) {
        this.recentTriggered.unshift(it);
        this.recentTriggered.length = 20;
    }

    getLatestTriggered() {
        return this.recentTriggered[0]
    }

    getLatestWorkflowCreatedAt() {
        const it = this.getLatestTriggered();
        if (it) {
            return getTimeTag(new Date(it.created_at))
        }
    }

    getLatestWorkflowUrl(host) {
        const it = this.getLatestTriggered();
        if (it) {
            return `https://app.${host}/pipelines/${this.projectSlug}/${it.number}`
        }
    }

    getPipelineUrl(host) {
        return `https://app.${host}/pipelines/${this.projectSlug}`
    }

    getTagList() {
        if (!this.tags) {
            return []
        }
        return this.tags.split(',')
    }

    setTags(s) {
        this.tags = [...new Set(s.split(',').map((it) => it.trim()).filter((it) => !!it))].join(',');
    }
}

class AppSetting {
    constructor({ host, circleToken } = {}) {
        this.host = host ?? 'circleci.com';
        this.circleToken = circleToken ?? '';
    }
}

var sampleAppSetting = {
    "version": "2",
    "appSetting": {
        "host": "circleci.com",
        "circleToken": ""
    },
    "projectList": [
        {
            "name": "circle-emitter",
            "description": "Circle Emitter",
            "projectSlug": "github/alchemy-works/circle-emitter",
            "branch": "main",
            "parameters": {},
            "tags": "",
            "recentTriggered": []
        }
    ]
};

const version = '2';
const CIRCLE_SETTING_KEY = 'circle_emitter_setting';

function initProjectList(setting) {
    return setting?.projectList.map((it) => new Project(it)) ?? []
}

function initAppSetting(setting) {
    return new AppSetting({
        host: setting?.appSetting?.host,
        circleToken: setting?.appSetting?.circleToken,
    })
}

function saveStateToLocalStorage(state) {
    localStorage.setItem(CIRCLE_SETTING_KEY, JSON.stringify({
        ...state,
        version,
    }));
}

function getStateFromStorage() {
    const settingString = localStorage.getItem(CIRCLE_SETTING_KEY);
    if (settingString) {
        const setting = JSON.parse(settingString);
        return setting.version === version ? setting : undefined
    } else {
        return sampleAppSetting
    }
}

function initState(setting) {
    setting = setting ? setting : getStateFromStorage();
    return {
        appSetting: initAppSetting(setting),
        projectList: initProjectList(setting),
        searchTagList: setting?.searchTagList || [],
    }
}

const ClassName$5 = css`
    min-width: 540px;

    .form-row {
        :not(:first-child) {
            margin-top: .5rem;
        }

        display: flex;
        align-items: center;

        label {
            min-width: 90px;
        }

        input {
            flex: 1;
        }
    }

    .red {
        color: #eb4646;
    }
`;

function openAppSettingModal({ appSetting, importSetting, }) {
    const dialog = new Dialog({
        title: 'Setting',
        content: '<div class="modal-content-root"></div>',
        buttons: [
            {
                type: 'normal',
                value: 'Import',
                className: 'button-import-setting',
                events: (ev) => {
                    openFileAndReadAsText(async (err, text) => {
                        if (err) {
                            console.error(err);
                            LightTip.error(err.message);
                            return
                        }
                        importSetting(text);
                        dialog.remove();
                    });
                }
            },
            {
                type: 'normal',
                value: 'Export',
                className: 'button-export-setting',
                events: async (ev) => {
                    const setting = await getStateFromStorage();
                    if (setting) {
                        setting.projectList.forEach((it) => it.recentTriggered = []);
                        const handle = await showSaveFilePicker({
                            suggestedName: 'setting.json',
                        });
                        const writable = await handle.createWritable();
                        await writable.write(new Blob([JSON.stringify(setting)]));
                        await writable.close();
                    }
                }
            },
            {
                type: 'primary',
                value: 'Save',
                form: 'app-setting-form',
            }]
    });
    dialog.querySelector('.button-import-setting').style.float = 'left';
    dialog.querySelector('.button-export-setting').style.float = 'left';
    //
    const vm = createApp({
        template: `
          <form id="app-setting-form" class="ui-form" :class="ClassName" @submit.prevent="onSubmit">
            <div class="form-row">
              <label for="app-setting-host">Host<span class="red">*</span></label>
              <input :value="appSetting.host" type="text" id="app-setting-host"
                     class="ui-input" name="app-setting-host" required>
            </div>
            <div v-show="!isUserscript()" class="form-row">
              <label for="app-setting-circle-token">Circle Token<span class="red">*</span></label>
              <input :value="appSetting.circleToken" type="password" id="app-setting-circle-token"
                     class="ui-input" name="app-setting-circle-token" :required="!isUserscript()">
            </div>
          </form>
        `,
        setup() {
            function onSubmit(ev) {
                const form = new FormData(ev.target);
                appSetting.host = form.get('app-setting-host');
                appSetting.circleToken = form.get('app-setting-circle-token');
                dialog.remove();
                LightTip.success('App setting saved');
            }

            function isUserscript() {
                return AppData.userscript
            }

            return {
                ClassName: ClassName$5,
                appSetting,
                onSubmit,
                isUserscript,
            }
        },
    });
    vm.mount(dialog.querySelector('.modal-content-root'));
    return { dialog, vm, }
}

const ClassName$4 = css`
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    padding: 0;
    margin: 0;
  }
`;

var HeadLine = {
    template: `
      <div :class="ClassName">
        <h2>✅&nbsp;Circle Emitter</h2>
        <div>
          <a href="https://github.com/alchemy-works/circle-emitter" target="_blank">Docs</a>
          &nbsp;
          <Button :on-click="onClickSetting" type="normal">Setting</Button>
        </div>
      </div>
    `,
    components: { Button },
    props: {
        state: Object,
    },
    setup(props) {

        function importSetting(content) {
            try {
                const setting = JSON.parse(content);
                Object.assign(props.state, initState(setting));
            } catch (err) {
                LightTip.error(err.message);
            }
        }

        async function onClickSetting() {
            openAppSettingModal({
                appSetting: props.state.appSetting,
                importSetting,
            });
        }

        return {
            ClassName: ClassName$4,
            onClickSetting,
        }
    }
};

async function triggerPipelineViaProxy({ project, appSetting }) {
    const response = await fetch('/api/circle/trigger_pipeline', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            host: appSetting.host,
            circleToken: appSetting.circleToken,
            projectSlug: project.projectSlug,
            branch: project.branch,
            parameters: project.parameters,
        }),
    });
    if (!response.ok) {
        throw new Error(response.statusText || await response.text())
    }
    const result = await response.json();
    if (result.error) {
        throw new Error(result.error)
    }
    return result
}

async function getCsrfToken(host) {
    const response = await fetch(`https://${host}/api/v2/csrf`, {
        credentials: 'include',
    });
    const result = await response.json();
    return result.csrf_token
}

async function triggerPipelineViaApi({ project, appSetting }) {
    const url = `https://${appSetting.host}/api/v2/project/${project.projectSlug}/pipeline`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Csrftoken': await getCsrfToken(appSetting.host),
        },
        credentials: 'include',
        body: JSON.stringify({
            branch: project.branch,
            parameters: project.parameters,
        }),
    });
    const result = await response.json();
    if (result.message) {
        throw new Error(result.message)
    }
    return result
}

async function triggerPipeline(options = {}) {
    if (AppData.userscript) {
        return await triggerPipelineViaApi(options)
    } else {
        return await triggerPipelineViaProxy(options)
    }
}

const DialogClassName = css`
    .button-delete, .button-copy {
        float: left;
    }
`;

const ClassName$3 = css`
    min-width: 540px;

    .form-row {
        :not(:first-child) {
            margin-top: .5rem;
        }

        display: flex;
        align-items: center;

        label {
            min-width: 90px;
        }

        input {
            flex: 1;
        }

        textarea {
            flex: 1;
            resize: vertical;
        }
    }

    .red {
        color: #eb4646;
    }
`;

function openProjectModal({ project, appSetting, onDelete, onCopy }) {
    const dialog = new Dialog({
        title: project.name,
        content: `<div class="modal-content-root"></div>`,
        buttons: [{
            type: 'error',
            value: 'Delete',
            className: 'button-delete',
            events: (ev) => {
                ev.preventDefault();
                try {
                    if (typeof onDelete === 'function') {
                        onDelete();
                        LightTip.success('Delete succeed');
                    }
                } catch (err) {
                    LightTip.error(err.message || 'Delete failed');
                } finally {
                    dialog.remove();
                }
            }
        }, {
            type: 'normal',
            value: 'Copy',
            className: 'button-copy',
            events: (ev) => {
                ev.preventDefault();
                try {
                    if (typeof onCopy === 'function') {
                        onCopy();
                        LightTip.success('Copy succeed');
                    }
                } catch (err) {
                    LightTip.error(err.message || 'Copy failed');
                } finally {
                    dialog.remove();
                }
            }
        }, {
            type: 'normal',
            form: 'project-form',
            value: 'Save',
            className: 'button-save',
        }, {
            type: 'primary',
            value: 'Trigger',
            form: 'project-form',
            className: 'button-trigger',
        }]
    });
    dialog.classList.add(DialogClassName);

    const vm = createApp({
        template: `
          <form id="project-form" class="ui-form" :class="ClassName" @submit.prevent="onSubmit">
            <div class="form-row">
              <label for="project-name">Name<span class="red">*</span></label>
              <input :value="project.name" type="text" id="project-name"
                     placeholder="Enter name"
                     class="ui-input" name="project-name" required>
            </div>
            <div class="form-row">
              <label for="project-description">Description<span class="red">*</span></label>
              <input :value="project.description" type="text" id="project-description"
                     placeholder="Enter description"
                     class="ui-input" name="project-description" required>
            </div>
            <div class="form-row">
              <label for="project-project-slug">Project slug<span class="red">*</span></label>
              <input :value="project.projectSlug" type="text" id="project-project-slug"
                     placeholder="Enter project slug"
                     class="ui-input" name="project-project-slug" required>
            </div>
            <div class="form-row">
              <label for="project-branch">Branch<span class="red">*</span></label>
              <input :value="project.branch" type="text" id="project-branch"
                     placeholder="Enter branch"
                     class="ui-input" name="project-branch" required>
            </div>
            <div class="form-row">
              <label for="project-parameters">Parameters<span class="red">*</span></label>
              <textarea :value="project.getParametersJsonString()" id="project-parameters"
                        rows="4" placeholder="Enter JSON parameters"
                        class="ui-textarea" name="project-parameters" required></textarea>
            </div>
            <div class="form-row">
              <label for="project-tags">Tags</label>
              <input :value="project.tags" type="text" id="project-tags" placeholder="Enter comma separated tags"
                     class="ui-input" name="project-tags">
            </div>
          </form>
        `,
        setup() {

            function saveProject(form) {
                project.name = form.get('project-name');
                project.description = form.get('project-description');
                project.projectSlug = form.get('project-project-slug');
                project.branch = form.get('project-branch');
                project.setTags(form.get('project-tags'));
                project.setParametersJsonString(form.get('project-parameters').toString());
            }


            async function onTrigger(ev) {
                const getTriggerButtonClassList = () => dialog.querySelector('.button-trigger').classList;
                try {
                    getTriggerButtonClassList().add('loading');
                    saveProject(new FormData(ev.target));
                    //
                    const triggered = await triggerPipeline({
                        project,
                        appSetting,
                    });
                    project.addNewTriggered(triggered);
                    //
                    dialog.remove();
                    LightTip.success('Trigger succeed');
                } catch (err) {
                    console.error(err);
                    LightTip.error(err.message);
                } finally {
                    getTriggerButtonClassList().remove('loading');
                }
            }

            async function onSave(ev) {
                saveProject(new FormData(ev.target));
                dialog.remove();
                LightTip.success('Save succeed');
            }

            async function onSubmit(ev) {
                const buttonClassList = ev.submitter.classList;
                if (buttonClassList.contains('button-trigger')) {
                    return await onTrigger(ev)
                }
                if (buttonClassList.contains('button-save')) {
                    return await onSave(ev)
                }
            }

            return {
                ClassName: ClassName$3,
                project,
                onSubmit,
            }
        },
    });
    vm.mount(dialog.querySelector('.modal-content-root'));
    return { dialog, vm, }
}

const ClassName$2 = css`
    .th-operate {
        width: 100px;
    }

    .th-title {
        width: 150px;
        text-align: left;
    }

    .td-operate {
        text-align: center;
    }

    .td-empty {
        text-align: center;
    }

    .title {
        color: #4c5161;
        font-weight: bold;
    }

    .description {
        color: #a2a9b6;
    }
`;

var ProjectTable = {
    template: `
      <div :class="ClassName">
        <table class="ui-table">
          <thead>
          <tr>
            <th class="th-title">Projects</th>
            <th></th>
            <th class="th-operate"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-if="!showProjectList.length">
            <td class="td-empty" colspan="3">Empty</td>
          </tr>
          <tr v-else v-for="(it) of showProjectList" :key="it.id">
            <td>
              <div class="title">
                <a :href="it.getPipelineUrl(state.appSetting.host)" target="_blank">{{ it.name }}</a>
              </div>
              <div class="description" v-html="it.description"></div>
            </td>
            <td>
              <div v-if="it.getLatestTriggered()">
                Latest triggered:&nbsp;
                <a :href="it.getLatestWorkflowUrl(state.appSetting.host)" target="_blank">
                  Workflow({{ it.getLatestWorkflowCreatedAt() }})
                </a>
              </div>
            </td>
            <td class="td-operate">
              <Button @click="onClickOpenProject(it)">Trigger</Button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    `,
    components: { Button },
    props: {
        state: Object,
    },
    setup(props) {
        async function onClickOpenProject(project) {
            openProjectModal({
                project,
                appSetting: props.state.appSetting,
                onDelete: () => {
                    if (props.state.projectList.length === 1) {
                        throw new Error('Cannot delete the last Project')
                    }
                    props.state.projectList = props.state.projectList.filter((it) => it !== project);
                    props.state.searchTagList = [];
                },
                onCopy: () => {
                    props.state.projectList.push(new Project({
                        ...project,
                        recentTriggered: [],
                    }));
                },
            });
        }

        const showProjectList = computed(() => {
            const searchTagList = props.state.searchTagList;
            if (!searchTagList.length) {
                return props.state.projectList
            }
            const l = [];
            for (const p of props.state.projectList) {
                const tagList = p.getTagList();
                if (tagList.some((t) => searchTagList.includes(t))) {
                    l.push(p);
                }
            }
            return l
        });

        return {
            ClassName: ClassName$2,
            showProjectList,
            onClickOpenProject,
        }
    },
};

const ClassName$1 = css`
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: .25rem 1rem;

    .tag-span label {
        margin-left: .125rem;
    }
`;

var TagFilter = {
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
            const projectList = props.state.projectList;
            const l = [];
            for (const p of projectList) {
                l.push(...p.getTagList());
            }
            return [...new Set(l)]
        });

        const filterTagList = computed(() => {
            return allTagList.value.map((it) => {
                return {
                    id: `filter-tag-${it}`,
                    value: it,
                    checked: props.state.searchTagList.includes(it),
                }
            })
        });

        const checkAll = computed(() => {
            return props.state.searchTagList.length === filterTagList.value.length
        });

        function onCheckAll(ev) {
            if (ev.target.checked) {
                props.state.searchTagList = allTagList.value;
            } else {
                props.state.searchTagList = [];
            }
        }

        function onCheck(it, ev) {
            if (ev.target.checked) {
                props.state.searchTagList.push(it.value);
            } else {
                props.state.searchTagList = props.state.searchTagList.filter((t) => t !== it.value);
            }
        }

        const checkAllInputRef = ref();
        watch(filterTagList, async () => {
            await nextTick();
            if (checkAllInputRef.value) {
                checkAllInputRef.value.indeterminate = props.state.searchTagList.length && !checkAll.value;
            }
        }, {
            immediate: true,
        });

        return {
            ClassName: ClassName$1,
            filterTagList,
            checkAll,
            onCheckAll,
            onCheck,
            checkAllInputRef,
        }
    },
};

const ClassName = css`
    max-width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
    padding: 1rem;

    .project-table {
        margin-top: 1rem;
    }

    a {
        color: #2a80eb;
        text-decoration-line: none;
    }
`;

var App = {
    template: `
      <div :class="ClassName">
        <HeadLine :state="state"/>
        <TagFilter :state="state"/>
        <ProjectTable class="project-table" :state="state"/>
      </div>
    `,
    components: { HeadLine, TagFilter, ProjectTable, },
    setup(props) {
        const state = reactive(initState());

        watch(() => state, (newState) => {
            saveStateToLocalStorage(newState);
        }, {
            deep: true,
        });

        return {
            state,
            ClassName,
        }
    },
};

async function main() {
    AppData.userscript = true;
    const app = createApp(App);
    document.body.innerHTML = '<div id="app"></div>';
    app.mount('#app');
}

main().catch((err) => {
    console.error(err);
});
