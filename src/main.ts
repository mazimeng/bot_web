import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Button, Form, Field, CellGroup, List, Cell } from 'vant'

import 'vant/lib/index.css'
import './assets/base.css'

const app = createApp(App)

app.use(router)
app.use(Button)
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(List);
app.use(Cell);

app.mount('#app')
