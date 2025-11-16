---
title: "Vue 3组合式API完全指南"
description: "深入理解Vue 3的组合式API，包括setup函数、响应式系统、生命周期钩子等核心概念"
date: "2024-01-20"
category: "frontend"
tags: ["Vue.js", "组合式API", "前端开发"]
image: "/images/vue3-composition-api.jpg"
---

# Vue 3组合式API完全指南

Vue 3引入的组合式API是Vue.js发展史上的一个重要里程碑。它提供了一种更灵活、更强大的方式来组织和复用组件逻辑。

## 什么是组合式API

组合式API（Composition API）是Vue 3中新增的一组基于函数的API，它让我们可以更灵活地组织组件逻辑。与选项式API（Options API）相比，组合式API提供了更好的逻辑复用和代码组织方式。

## 基本语法

### setup函数

`setup`函数是组合式API的入口点，它在组件创建之前执行：

```javascript
import { ref, reactive, computed, watch, onMounted } from 'vue'

export default {
  setup(props, context) {
    // 响应式数据
    const count = ref(0)
    const state = reactive({
      name: 'Vue 3',
      version: '3.0.0'
    })
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    const increment = () => {
      count.value++
    }
    
    // 生命周期钩子
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    // 监听数据变化
    watch(count, (newValue, oldValue) => {
      console.log(`count从${oldValue}变为${newValue}`)
    })
    
    // 返回模板中需要使用的数据和方法
    return {
      count,
      state,
      doubleCount,
      increment
    }
  }
}
```

### 响应式数据

#### ref

`ref`用于创建单个响应式数据：

```javascript
import { ref } from 'vue'

const count = ref(0)
const name = ref('Vue')

// 访问和修改
console.log(count.value) // 0
count.value = 1
```

#### reactive

`reactive`用于创建响应式对象：

```javascript
import { reactive } from 'vue'

const state = reactive({
  count: 0,
  name: 'Vue',
  user: {
    name: 'John',
    age: 25
  }
})

// 访问和修改
console.log(state.count) // 0
state.count = 1
```

### 计算属性

`computed`用于创建计算属性：

```javascript
import { ref, computed } from 'vue'

const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// 可写的计算属性
const fullName = computed({
  get() {
    return firstName.value + ' ' + lastName.value
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
```

### 监听器

#### watch

`watch`用于监听响应式数据的变化：

```javascript
import { ref, watch } from 'vue'

const count = ref(0)

watch(count, (newValue, oldValue) => {
  console.log(`count从${oldValue}变为${newValue}`)
})

// 监听多个数据源
watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
  console.log('数据发生了变化')
})
```

#### watchEffect

`watchEffect`会自动收集依赖并执行副作用：

```javascript
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  console.log(`当前count值为：${count.value}`)
})
```

## 生命周期钩子

组合式API提供了与选项式API对应的生命周期钩子：

| 选项式API | 组合式API |
|-----------|-----------|
| beforeCreate | 不需要 |
| created | 不需要 |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |
| errorCaptured | onErrorCaptured |
| renderTracked | onRenderTracked |
| renderTriggered | onRenderTriggered |

```javascript
import { onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
```

## 依赖注入

### provide和inject

`provide`和`inject`用于实现依赖注入：

```javascript
// 父组件
import { provide, ref } from 'vue'

export default {
  setup() {
    const theme = ref('light')
    
    provide('theme', theme)
    
    return {
      theme
    }
  }
}
```

```javascript
// 子组件
import { inject } from 'vue'

export default {
  setup() {
    const theme = inject('theme', 'dark') // 默认值'dark'
    
    return {
      theme
    }
  }
}
```

## 逻辑复用

### 组合式函数（Composables）

组合式函数是组合式API最强大的特性之一，它让我们可以提取和复用组件逻辑：

```javascript
// useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  
  const doubleCount = computed(() => count.value * 2)
  
  const increment = () => {
    count.value++
  }
  
  const decrement = () => {
    count.value--
  }
  
  return {
    count,
    doubleCount,
    increment,
    decrement
  }
}
```

```javascript
// 在组件中使用
import { useCounter } from './useCounter'

export default {
  setup() {
    const { count, doubleCount, increment, decrement } = useCounter(10)
    
    return {
      count,
      doubleCount,
      increment,
      decrement
    }
  }
}
```

### 常用组合式函数示例

#### useLocalStorage

```javascript
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue)
  
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })
  
  return data
}
```

#### useMouse

```javascript
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)
  
  const updateMouse = (event) => {
    x.value = event.pageX
    y.value = event.pageY
  }
  
  onMounted(() => {
    window.addEventListener('mousemove', updateMouse)
  })
  
  onUnmounted(() => {
    window.removeEventListener('mousemove', updateMouse)
  })
  
  return { x, y }
}
```

## 最佳实践

### 1. 组织代码结构

```javascript
export default {
  setup() {
    // 1. 定义响应式数据
    const state = reactive({ ... })
    
    // 2. 定义计算属性
    const computedValues = computed(() => { ... })
    
    // 3. 定义方法
    const methods = { ... }
    
    // 4. 定义生命周期钩子
    onMounted(() => { ... })
    
    // 5. 返回模板需要的数据
    return {
      ...state,
      ...computedValues,
      ...methods
    }
  }
}
```

### 2. 使用组合式函数

将相关逻辑提取到组合式函数中，提高代码复用性：

```javascript
export default {
  setup() {
    // 使用组合式函数
    const { user, login, logout } = useAuth()
    const { posts, loading, fetchPosts } = usePosts()
    
    onMounted(() => {
      fetchPosts()
    })
    
    return {
      user,
      login,
      logout,
      posts,
      loading
    }
  }
}
```

### 3. 类型支持

在TypeScript中使用组合式API：

```typescript
import { ref, computed, type Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

export function useUser() {
  const user: Ref<User | null> = ref(null)
  const isLoggedIn = computed(() => user.value !== null)
  
  const login = async (email: string, password: string): Promise<void> => {
    // 登录逻辑
  }
  
  return {
    user,
    isLoggedIn,
    login
  }
}
```

## 性能优化

### 1. 避免不必要的响应式

```javascript
// 不好的做法 - 整个对象都变成响应式
const largeData = reactive({
  items: new Array(10000).fill(0).map((_, i) => ({ id: i, data: 'data' }))
})

// 好的做法 - 只让需要的数据变成响应式
const selectedIds = ref(new Set())
const largeData = {
  items: new Array(10000).fill(0).map((_, i) => ({ id: i, data: 'data' }))
}
```

### 2. 使用shallowRef和shallowReactive

```javascript
import { shallowRef, shallowReactive } from 'vue'

// 对于深层嵌套的对象，使用浅层响应式
const obj = shallowReactive({
  nested: {
    count: 0
  }
})

// 对于外部库的对象，使用shallowRef
const chart = shallowRef(null)
```

## 总结

Vue 3的组合式API提供了更灵活、更强大的方式来组织和复用组件逻辑。通过合理使用ref、reactive、computed、watch等API，以及组合式函数，我们可以构建更加清晰、可维护的应用程序。

组合式API的主要优势：
- 更好的逻辑复用
- 更灵活的代码组织
- 更好的TypeScript支持
- 更小的打包体积
- 更好的性能

随着Vue 3生态系统的不断完善，组合式API将成为Vue开发的主流方式。掌握组合式API对于Vue开发者来说是必不可少的技能。

---

*希望这篇文章能帮助你更好地理解和使用Vue 3的组合式API。如果有任何问题，欢迎在评论区留言讨论。*