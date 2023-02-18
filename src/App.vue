<script setup lang="ts">
import { ref } from 'vue';
let text: string = "The code inside is compiled as the content of the component's setup() function. This means that unlike normal <script>, which only executes once when the component is first imported, code inside <script setup> will execute every time an instance of the component is created."

</script>

<template>
  <div>
    <div style="position: absolute; bottom: 0; width: 100vw">
      <van-field placeholder="请输入消息" />
      <van-button block type="primary">
        提交
      </van-button>
    </div>

  </div>
</template>

<style scoped></style>
