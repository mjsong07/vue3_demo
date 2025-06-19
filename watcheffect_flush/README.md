 # 1.背景需求
现在有个需求需要当省份和城市都选择的时候，显示对应的人员信息。

![00B276DD-01AF-4B43-B766-8C215117F1D5.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/60b5c8f5c4bc434486552d35c199659a~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1750407625&x-orig-sign=2QCdZM09y1Upwsor691P51yq7L4%3D)
# 2.逻辑实现
1. 有一个省市的通用组件，支持选择省份联动显示城市，并且当切换省份的时候，之前选中的城市会自动清空。
2. 利用这个组件，在父组件 通过 watchEffect方法监听当前 省和市 是否不为空，则发起接口请求，传入市的信息。
3. 接口返回用户列表并展示。

# 3.对应代码
src/components/CommonSelect.vue
```js
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
```

src/App.vue
```js
<template>
  <div>
    <ProvinceCitySelector
      :provinces="provinces"
      :mockData="mockData"
      @update:province="province = $event"
      @update:city="city = $event"
    />
    >
     <select v-model="user"  >
      <option value="">请选择人员</option>
      <option v-for="r in result" :key="r" :value="r">{{ r }}</option>
    </select> 
    <p>接口调用: {{ msg }}</p>
    查询结果：{{result}}
   
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
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
})
</script>
<style>
* {
  font-size: 30px;
}
</style>
```

# 4.问题
当选中广东和深圳后，再切换省份到江苏的时候，会触发接口请求,并且传递参数市江苏+深圳。

如下图所示

![Jun-19-2025 16-17-56.gif](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/dbc64e3593c1479b902f88af8192121c~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1750407513&x-orig-sign=qfs2n%2B4KXqCXXjLWTEcKoL5YjxE%3D)


## 分析
由于触发网络请求的入口在watchEffect，同时清空市的逻辑也是在watchEffect，重点排查watchEffect

## 定位
1. 由于通用select组件使用了watchEffect监听数据是否变化来重置市的信息如下

```js
watch(province, (newProvince) => {
  city.value = ''
  cities.value = props.mockData[newProvince] || []
  emit('update:province', newProvince)
})

```

2. 而在父组件，我们也写了watchEffect去处理不为空时候的发起请求

```js
watchEffect(() => {
  if (province.value && city.value) {
    handleQuery()
  } else {
    user.value = ''
  }
})
```

3. 这时候当响应式数据变化的时候，父子两个组件的watchEffect都会触发.
4. 当前由于组件的创建实例化顺序是先父组件-> 子组件，所以watchEffect的触发顺序也是先父后子。
5. 所以父组件的 watchEffect里的handleQuery会先执行。才出现江苏+深圳的请求参数
6. 然后子组件的watchEffect才再进行设置市为空

# 5.解决思路

## 方案1 改造组件
select组件不是一个受控组件，有副作用，并且自身还生产数据，数据应该都在外部产生，并且通过单向数据流方式传递。
- 优势：数据状态统一管理，所有逻辑也可以按需设计和有序执行。
- 缺点：如果select组件是别人封装好的就不好改，自己也需要重新实现原有组件逻辑。

## 方案2 组件暴露方法
由于问题是watchEffect先后执行的问题，解决思路也是如果调整他们的顺序
- 优势：可以精准控制触发时机，但是调整麻烦，
- 缺点：如果select组件是别人封装好的就不好改，调整可能会影响其他业务。


## 方案3 settimeout延迟执行？
可以通过延迟执行实际的查询，在执行的时候再次判断条件是否满足如何
- 缺点：代码看着就变扭
```js

watchEffect(() => {
  if (province.value && city.value) {
    setTimeout(() => {
      if (province.value && city.value) {
        handleQuery()
      } 
    }, 1000);
  } else {
    user.value = ''
  }
},{flush:'post'})
```

> 注意：watchEffect里面的异步代码是不能被依赖收集的

## 方案4 watchEffect的flush属性
在使用watchEffect，支持一个参数flush，先看看官方怎么描述：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e7acf1c8e9a049839d2228c6aba6ea95~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1750409360&x-orig-sign=THPnUBA%2B5SSTzKDLx5v23%2B6%2FdiY%3D)

默认情况下，侦听器将在组件渲染之前执行。设置 `flush: 'post'` 将会使侦听器延迟到组件渲染之后再执行。



所以如果要让上面父组件的watchEffect晚于子组件执行，只需要在父组件的watchEffect里加上`{flush:'post'}`即可。

在父组件src/App.vue 调整以下代码：
```js
watchEffect(() => {
  if (province.value && city.value) {
    handleQuery()
  } else {
    user.value = ''
  }
},{flush:'post'})
```


# 6.测试一把
nice～ 
--
![Jun-19-2025 16-21-59.gif](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/058c53f8d414432895339e4fadd34978~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgamFzb25feWFuZw==:q75.awebp?policy=eyJ2bSI6MywidWlkIjoiMjk3MjcwNDc5NTgwMjY1MyJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1750407741&x-orig-sign=Ze0UUGhyQenHdlOZP0IwkNYFs1g%3D)

# 总结
在实际开发中，往往会遇到渲染执行的顺序问题，我们可以先看看官方是否提供扩张的能力。找不到方案，再调整我们具体的代码逻辑，争取更多的时间摸鱼 哈。
 