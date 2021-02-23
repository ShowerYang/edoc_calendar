import Vue from 'vue'

import './styles/quasar.styl'
import 'quasar/dist/quasar.ie.polyfills'
import iconSet from 'quasar/icon-set/fontawesome-v5.js'
import '@quasar/extras/fontawesome-v5/fontawesome-v5.css'
import {
  Quasar, 
  // QLayout,
  // QHeader,
  // QDrawer,
  // QPageContainer,
  // QPage,
  // QToolbar,
  // QToolbarTitle,
  QBtn,
  // QIcon,
  // QList,
  // QItem,
  // QItemSection,
  // QItemLabel,
  QTooltip,
  QInput,
  QRadio,
  QDialog,
  QCard,
  QCardSection,
  QCardActions,
  ClosePopup,
  QSpinnerRings,
  QSpinnerCube,
  QSpinnerPuff,
  QSpinnerFacebook,
  QSpinnerDots
} from 'quasar'

Vue.use(Quasar, {
  config: {},
  components: {
    // QLayout,
    // QHeader,
    // QDrawer,
    // QPageContainer,
    // QPage,
    // QToolbar,
    // QToolbarTitle,
    QBtn,
    // QIcon,
    // QList,
    // QItem,
    // QItemSection,
    // QItemLabel,
    QTooltip,
    QInput,
    QRadio,
    QDialog,
    QCard,
    QCardSection,
    QCardActions,
    QSpinnerRings,
    QSpinnerCube,
    QSpinnerPuff,
    QSpinnerFacebook,
    QSpinnerDots
  },
  directives: {
    ClosePopup
  },
  plugins: {
  },
  iconSet: iconSet
 })