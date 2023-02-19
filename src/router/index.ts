import { createRouter, createWebHashHistory } from 'vue-router'
const ChatGPT = () => import('@/views/ChatGPT.vue')
const GPT3 = () => import('@/views/GPT3.vue')
const routes = [
  { path: '/', name: 'home', component: ChatGPT },
  { path: '/gpt3', name: 'gpt3', component: GPT3, },
  { path: '/chatgpt', name: 'chatgpt', component: ChatGPT },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router
