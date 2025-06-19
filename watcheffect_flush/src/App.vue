<template>
  <div>
    <ProvinceCitySelector
      :provinces="provinces"
      :mockData="mockData"
      @update:province="province = $event"
      @update:city="city = $event"
    />
    > 人员：
     <select v-model="user"  >
      <option value="">请选择人员</option>
      <option v-for="r in result" :key="r" :value="r">{{ r }}</option>
    </select> 
    <p>接口调用: {{ msg }}</p>
    查询结果：{{result}}
   
  </div>
</template>

<script setup>
import { ref, watchEffect, watchPostEffect} from 'vue'
import ProvinceCitySelector from './components/CommonSelect.vue'

const province = ref('')
const city = ref('')
const user = ref('')
const result = ref([])
const msg = ref('')

const handleQuery = () => {
  result.value = []
  msg.value = `参数： ${province.value},${city.value} > 查询中... `
  setTimeout(() => {
    msg.value = ''
    const mockData = { 
      广东:  ['天河伟', '越秀楠',  '罗湖琳'],
      江苏: ['玄武然', '鼓楼哲', '建邺然'],
      浙江: ['西湖舒', '余杭帆', '拱墅晨'],
    }
    result.value = mockData[province.value]
  }, 2000)
} 

watchEffect(() => {
  if (province.value && city.value) {
    handleQuery()
  } else {
    user.value = ''
  }
}) //,{flush:'post'}
</script>
<style>
* {
  font-size: 30px;
}
</style>