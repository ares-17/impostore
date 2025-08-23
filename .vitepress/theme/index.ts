// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import './tailwind.css'
import MaterialDropdownFilled from '../components/MaterialDropdownFilled.vue'
import MaterialButton from '../components/MaterialButton.vue'
import MaterialTextInput from '../components/MaterialTextInput.vue'
import MaterialUserEdit from '../components/MaterialUserEdit.vue'
import MaterialNumberInput from '../components/MaterialNumberInput.vue'
import MaterialUserAvatar from '../components/MaterialUserAvatar.vue'
import MaterialTextButton from '../components/MaterialTextButton.vue'
import MaterialModal from '../components/MaterialModal.vue'
import MaterialToast from '../components/MaterialToast.vue'
import ShareTokenButton from '../components/ShareTokenButton.vue'
import MaterialCheckbox from '../components/MaterialCheckbox.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('MaterialDropdownFilled', MaterialDropdownFilled),
    app.component('MaterialButton', MaterialButton),
    app.component('MaterialTextInput', MaterialTextInput),
    app.component('MaterialUserEdit', MaterialUserEdit),
    app.component('MaterialNumberInput', MaterialNumberInput),
    app.component('MaterialUserAvatar', MaterialUserAvatar),
    app.component('MaterialTextButton', MaterialTextButton),
    app.component('MaterialModal', MaterialModal),
    app.component('MaterialToast', MaterialToast),
    app.component('ShareTokenButton', ShareTokenButton),
    app.component('MaterialCheckbox', MaterialCheckbox)
  }
} satisfies Theme
