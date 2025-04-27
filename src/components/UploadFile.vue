<template>
  <div>
    <input type="file" id="fileInput" />
    <button @click="startUploadFile" v-change-color="{ color: 'red' }" v-rotate="isRotate">开始上传文件</button>
    <input type="text" v-model="person.home.address">
  </div>

</template>
<script setup>

import { onMounted, reactive, ref, watch } from 'vue';
import { uploadFile } from '@/api/file';
import { rotate } from '@/directives/rotate';
let curFile = ref('')
onMounted(() => {
  const fileInput = document.getElementById('fileInput');

  fileInput.addEventListener('change', (event) => {
    const files = event.target.files; // FileList对象
    const selectedFile = files[0]; // 获取第一个文件

    console.log('文件信息:', {
      name: selectedFile.name,     // 文件名
      size: selectedFile.size,     // 文件大小(字节)
      type: selectedFile.type,     // MIME类型
      lastModified: selectedFile.lastModified // 最后修改时间
    });
    curFile.value = files[0]
  });
})
const vRotate = rotate
const isRotate = ref(false)
setInterval(() => {
  isRotate.value = !isRotate.value
}, 2000);
const person = reactive({
  out: {
    face: 'black',
    hand: 'white',
    eye: 'black',
    foot: 'white',
  },
  home: {
    address: 'ez',
    country: 'china'

  },
})
watch(person.home, (oldVal, newVal) => {
  console.log(oldVal);
  console.log(newVal);
})
const startUploadFile = async () => {
  try {
    const uploadClbck = (...args) => {
      console.log(args);
    }
    const res = await uploadFile(curFile.value, uploadClbck)
    console.log(res);
    // 开启上传会话
    // 开启上传分片
    // 分片上传结束
    // 断点续传
    // 上传结束
  } catch (error) {
    console.error(error);
    // ElMessage.error(error.message || error.msg || error);
  }
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
