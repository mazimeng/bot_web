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

interface Ask {
  text: string;
  conversationId?: string;
  messageId?: string
}

interface Conversation {
  conversationId?: string;
  messageId?: string
}

let messages = ref<Message[]>([])
const outgoingMessage = ref()
const conversation: Conversation = {}
const thinking = ref<boolean>(false)
const MACHINE_ID: string = "机器"
const HUMAN_ID: string = "人类"

const sendMessage = (text: string) => {
  thinking.value = true
  let payload: Ask = {
    "text": text
  }
  if (conversation.conversationId) {
    payload.conversationId = conversation.conversationId
    payload.messageId = conversation.messageId
  }
  fetch('api/messages', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  }).then((response) => response.json())
    .then((data) => {
      conversation.conversationId = data.conversationId
      conversation.messageId = data.messageId
      let msg: Message = {
        text: data.text,
        direction: "incoming",
        timestamp: moment().format('YYYY-MM-DD hh:mm:ss'),
        speaker: MACHINE_ID
      }

      messages.value.unshift(msg)
      outgoingMessage.value = ""
    }).catch(err => {
      showToast(MACHINE_ID + '出错了');
    }).then(() => {
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

  sendMessage(msg.text)
}


</script>

<template>
  <div>
    <div>
      <div v-for="item in messages" style="margin-bottom: 10px">
        [{{ item.speaker }}] {{ item.text }}
      </div>
    </div>
    <div style="position: fixed; bottom: 0; width: 100vw;">
      <van-field size="large" placeholder="请输入消息" v-model="outgoingMessage" :disabled="thinking" />
      <van-button block type="primary" size="large" :loading="thinking" @click="handleSendMessage">
        GPT3
      </van-button>
    </div>
  </div>
</template>

<style scoped></style>
