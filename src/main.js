import { createApp } from 'vue'
import App from './App.vue'
import { vMaska } from 'maska/vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import 'vue3-toastify/dist/index.css'

const app = createApp(App)

// Register global components
app.component('VueDatePicker', VueDatePicker)

// Register the Maska directive
app.directive('maska', vMaska)

app.mount('#app')
