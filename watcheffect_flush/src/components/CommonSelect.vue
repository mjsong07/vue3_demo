<template>
    省：<select v-model="province">
      <option value="">请选择省份</option>
      <option v-for="p in provinces" :key="p" :value="p">{{ p }}</option>
    </select>
    > 
   市：<select v-model="city">
      <option value="">请选择城市</option>
      <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
    </select> 
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue'

const props = defineProps({
  provinces: {
    type: Array,
    default: () => ['广东', '江苏', '浙江']
  },
  mockData: {
    type: Object,
    required: true,
    default: { 
    广东: ['广州', '深圳', '珠海'],
    江苏: ['南京', '苏州', '无锡'],
    浙江: ['杭州', '宁波', '温州'],
    }
  }
})

const emit = defineEmits(['update:province', 'update:city', 'query'])

const province = ref('')
const city = ref('')
const cities = ref([]) 

watch(province, (newProvince) => {
  city.value = ''
  cities.value = props.mockData[newProvince] || []
  emit('update:province', newProvince)
})

watch(city, (newCity) => {
  emit('update:city', newCity)
})

</script>

<style scoped>
.province-city-selector {
  margin-bottom: 20px;
}
</style>