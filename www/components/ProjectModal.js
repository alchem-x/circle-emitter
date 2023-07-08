import { createApp, css, defineComponent, Dialog, LightTip } from '../deps.js'
import { trigger } from '../apis/trigger.js'

const DialogClassName = css`
    .button-delete, .button-copy {
        float: left;
    }
`

const ClassName = css`
    width: min(80vw, 800px);

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

    .ui-textarea {
        font-family: "JetBrains Mono", monospace;
        white-space: nowrap;
    }
`

export function openProjectModal({ project, appSetting, onDelete, onCopy }) {
    const dialog = new Dialog({
        title: project.name,
        content: `<div class="modal-content-root"></div>`,
        buttons: [{
            type: 'error',
            value: 'Delete',
            className: 'button-delete',
            events: (ev) => {
                ev.preventDefault()
                try {
                    if (typeof onDelete === 'function') {
                        onDelete()
                        LightTip.success('Delete succeed')
                    }
                } catch (err) {
                    LightTip.error(err.message || 'Delete failed')
                } finally {
                    dialog.remove()
                }
            }
        }, {
            type: 'normal',
            value: 'Copy',
            className: 'button-copy',
            events: (ev) => {
                ev.preventDefault()
                try {
                    if (typeof onCopy === 'function') {
                        onCopy()
                        LightTip.success('Copy succeed')
                    }
                } catch (err) {
                    LightTip.error(err.message || 'Copy failed')
                } finally {
                    dialog.remove()
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
    })
    dialog.classList.add(DialogClassName)

    const vm = createApp(defineComponent({
        template: `
          <form id="project-form" class="ui-form" :class="ClassName" @submit.prevent="onSubmit">
            <div class="form-row">
              <label for="project-name">Name<span class="red">*</span></label>
              <input :value="project.name" type="text" id="project-name"
                     placeholder="Enter name"
                     class="ui-input" name="project-name" required>
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
                        rows="5" placeholder="Enter JSON parameters" spellcheck="false"
                        class="ui-textarea" name="project-parameters" required></textarea>
            </div>
            <div class="form-row">
              <label for="project-description">Description<span class="red">*</span></label>
              <textarea :value="project.description" id="project-description"
                        placeholder="Enter description" rows="5" spellcheck="false"
                        class="ui-textarea" name="project-description" required></textarea>
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
                try {
                    project.name = form.get('project-name')
                    project.description = form.get('project-description')
                    project.projectSlug = form.get('project-project-slug')
                    project.branch = form.get('project-branch')
                    project.setTags(form.get('project-tags'))
                    project.setParametersJsonString(form.get('project-parameters').toString())
                } catch (err) {
                    LightTip.error(err.message)
                    throw err
                }
            }


            async function onTrigger(ev) {
                const getTriggerButtonClassList = () => dialog.querySelector('.button-trigger').classList
                try {
                    getTriggerButtonClassList().add('loading')
                    saveProject(new FormData(ev.target))
                    //
                    const triggered = await trigger({
                        project,
                        appSetting,
                    })
                    project.addNewTriggered(triggered)
                    //
                    dialog.remove()
                    LightTip.success('Trigger succeed')
                } catch (err) {
                    console.error(err)
                    LightTip.error(err.message)
                } finally {
                    getTriggerButtonClassList().remove('loading')
                }
            }

            async function onSave(ev) {
                saveProject(new FormData(ev.target))
                dialog.remove()
                LightTip.success('Save succeed')
            }

            async function onSubmit(ev) {
                const buttonClassList = ev.submitter.classList
                if (buttonClassList.contains('button-trigger')) {
                    return await onTrigger(ev)
                }
                if (buttonClassList.contains('button-save')) {
                    return await onSave(ev)
                }
            }

            return {
                ClassName,
                project,
                onSubmit,
            }
        },
    }))
    vm.mount(dialog.querySelector('.modal-content-root'))
    return { dialog, vm, }
}
