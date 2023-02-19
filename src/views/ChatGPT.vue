<script setup lang="ts">
import { ref } from 'vue'
import moment from 'moment'
import { showToast } from 'vant';

interface Message {
  text: string;
  direction: string;
  timestamp: string;
  speaker: string;
}

let messages = ref<Message[]>([])
const outgoingMessage = ref()
const thinking = ref<boolean>(false)
let questionId: string
let conversationId: string
let parentId: string
const MACHINE_ID: string = "机器"
const HUMAN_ID: string = "人类"
const DIRECTION_INCOMING = "incoming"
const MAX_PATIENCE: number = 10
let patience: number = MAX_PATIENCE

const getAnswer = (questionId: string) => {
  if (patience <= 0) {
    thinking.value = false
    showToast(MACHINE_ID + "长时间没有响应");
  }

  if (!thinking.value) {
    return
  }

  setTimeout(() => {
    fetch(`chatgpt/api/answers?question_id=${questionId}`).then((response) => response.json())
      .then((data) => {
        console.log(data?.data?.text)
        if (data?.data?.text) {
          let firstMessage = messages.value[0]
          firstMessage.text += data?.data?.text
          patience = MAX_PATIENCE
        } else {
          patience -= 1
        }

        if (data?.data?.conversation_id) {
          conversationId = data?.data?.conversation_id
        }
        if (data?.data?.parent_id) {
          parentId = data?.data?.parent_id
        }

        if (!data?.data?.finished) {
          getAnswer(questionId)
        } else {
          thinking.value = false
          outgoingMessage.value = ""
        }
      }).catch(err => {
        showToast(MACHINE_ID + '出错了');
        thinking.value = false
      })
  }, 1000)
}
const sendQuestion = (text: string) => {
  thinking.value = true
  patience = MAX_PATIENCE

  let payload = {
    "text": text,
    "conversation_id": conversationId,
    "parent_id": parentId
  }
  console.log("sendQuestion", payload)
  fetch('chatgpt/api/questions', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then((response) => response.json())
    .then((data) => {
      let msg: Message = {
        text: "",
        direction: DIRECTION_INCOMING,
        timestamp: moment().format('YYYY-MM-DD hh:mm:ss'),
        speaker: MACHINE_ID
      }
      messages.value.unshift(msg)

      questionId = data["data"]["question_id"]
      getAnswer(questionId)
    }).catch(err => {
      showToast(MACHINE_ID + '出错了');
      thinking.value = false
    })
}

const handleSendMessage = () => {
  let msg: Message = {
    text: outgoingMessage.value,
    direction: "outgoing",
    timestamp: moment().format('YYYY-MM-DD hh:mm:ss'),
    speaker: HUMAN_ID
  }
  messages.value.unshift(msg)

  sendQuestion(msg.text)
}


</script>

<template>
  <div>
    <div>
      <div v-for="(item, index) in messages" style="margin-bottom: 10px">
        [<span>{{ item.speaker }}</span>] {{ item.text }} <span v-if="thinking && item.speaker === MACHINE_ID && index === 0">&lt;处理中&gt;</span>
      </div>
    </div>
    <div style="position: fixed; bottom: 0; width: 100vw;">
      <van-field size="large" placeholder="请输入消息" v-model="outgoingMessage" :disabled="thinking" />
      <van-button block type="primary" size="large" :loading="thinking" @click="handleSendMessage">
        ChatGPT
      </van-button>
    </div>
  </div>
</template>

<style scoped>
</style>
