import Vue from 'vue'
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue'
import VueCompositionAPI from '@vue/composition-api'

import i18n from '@/libs/i18n'
import router from './router'
import store from './store'
import App from './App.vue'

// Global Components
import './global-components'

// 3rd party plugins
import '@axios'
import '@/libs/acl'
import '@/libs/portal-vue'
import '@/libs/clipboard'
import '@/libs/toastification'
import '@/libs/sweet-alerts'
import '@/libs/vue-select'
import '@/libs/tour'

// BSV Plugin Registration
Vue.use(ToastPlugin)
Vue.use(ModalPlugin)

// Composition API
Vue.use(VueCompositionAPI)

import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask)

import {
  BOverlay, BPagination, BBadge, BTable,
  BCard, BButton, BFormGroup, BFormCheckbox,
  BFormInput, BForm, BRow, BCol, BFormTextarea,
  BSpinner, BInputGroup, BInputGroupAppend, BCardText,
  BAvatar, BTooltip, BSidebar, BFormSpinbutton, BTime,
  BFormTimepicker, BTab, BTabs, BCardTitle, BCardHeader, BAlert, BProgress
} from 'bootstrap-vue';
Vue.component('b-progress', BProgress)
Vue.component('b-alert', BAlert)
Vue.component('b-card-title', BCardTitle)
Vue.component('b-card-header', BCardHeader)
Vue.component('b-tab', BTab)
Vue.component('b-tabs', BTabs)
Vue.component('b-overlay', BOverlay)
Vue.component('b-spinner', BSpinner)
Vue.component('b-badge', BBadge)
Vue.component('b-table', BTable)
Vue.component('b-card', BCard)
Vue.component('b-button', BButton)
Vue.component('b-form-textarea', BFormTextarea)
Vue.component('b-form-checkbox', BFormCheckbox)
Vue.component('b-form-group', BFormGroup)
Vue.component('b-form-input', BFormInput)
Vue.component('b-pagination', BPagination)
Vue.component('b-form', BForm)
Vue.component('b-row', BRow)
Vue.component('b-col', BCol)
Vue.component('b-input-group', BInputGroup)
Vue.component('b-input-group-append', BInputGroupAppend)
Vue.component('b-card-text', BCardText)
Vue.component('b-avatar', BAvatar)
Vue.component('b-tooltip', BTooltip)
Vue.component('b-sidebar', BSidebar)
Vue.component('b-form-spinbutton', BFormSpinbutton)
Vue.component('b-form-timepicker', BFormTimepicker)
Vue.component('b-time', BTime)

import { ValidationProvider, ValidationObserver } from "vee-validate";
Vue.component('validation-observer', ValidationObserver)
Vue.component('validation-provider', ValidationProvider)

import vSelect from 'vue-select'
Vue.component('v-select', vSelect)

import { VueAutosuggest } from "vue-autosuggest";
Vue.component('vue-autosuggest', VueAutosuggest);

import { quillEditor } from "vue-quill-editor";
Vue.component('quill-editor', quillEditor);

import flatPickr from 'vue-flatpickr-component'
Vue.component('flat-pickr', flatPickr);

// componentes customizados
import viewCard from "@/components/view-card.vue";
Vue.component('viewcard--c', viewCard);

import view from "@/components/view.vue";
Vue.component('view--c', view);

import button from "@/components/button.vue";
Vue.component('button--c', button);

import spinner from "@/components/spinner.vue";
Vue.component('spinner--c', spinner);

import icon from "@/components/icon.vue";
Vue.component('icon--c', icon);

import info from "@/components/info.vue";
Vue.component('info--c', info);

import select from "@/components/select.vue";
Vue.component('select--c', select);

// * Shall remove it if not using font-icons of feather-icons - For form-wizard
require('@core/assets/fonts/feather/iconfont.css') // For form-wizard

// import core styles
require('@core/scss/core.scss')

// import assets styles
require('@/assets/scss/style.scss')

Vue.config.productionTip = false
const vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
})

import utils from './helpers/utils'
Vue.use(utils, {
  vm
})
vm.$mount('#app')