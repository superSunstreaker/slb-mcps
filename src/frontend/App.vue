<template>
  <div class="app">
    <el-container>
      <el-header height="60px">
        <h1 class="title">AI 提示工具</h1>
      </el-header>
      <el-container>
        <el-aside width="300px" class="aside">
          <el-menu
            default-active="1"
            class="el-menu-vertical-demo"
          >
            <el-menu-item index="1">
              <el-icon><ChatDotRound /></el-icon>
              <span>AI 对话</span>
            </el-menu-item>
            <el-menu-item index="2">
              <span>组件生成</span>
            </el-menu-item>
            <el-menu-item index="3">
              <el-icon><Tools /></el-icon>
              <span>API 优化</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <el-card v-if="activeTab === '1'" class="card">
            <template #header>
              <div class="card-header">
                <span>AI 对话</span>
              </div>
            </template>
            <div class="chat-container">
              <div class="chat-messages">
                <div v-for="(msg, index) in messages" :key="index" class="message" :class="{ 'user-message': msg.role === 'user', 'ai-message': msg.role === 'assistant' }">
                  <div class="message-content">{{ msg.content }}</div>
                </div>
              </div>
              <el-input
                v-model="inputMessage"
                placeholder="输入你的需求..."
                @keyup.enter="sendMessage"
              >
                <template #append>
                  <el-button @click="sendMessage">
                    Send
                  </el-button>
                </template>
              </el-input>
            </div>
          </el-card>
          
          <el-card v-if="activeTab === '2'" class="card">
            <template #header>
              <div class="card-header">
                <span>组件生成</span>
              </div>
            </template>
            <div class="component-generator">
              <el-form :model="componentForm" label-width="100px">
                <el-form-item label="组件类型">
                  <el-select v-model="componentForm.type" placeholder="选择组件类型">
                    <el-option label="Web Plus 按钮" value="wp-button" />
                    <el-option label="Web Plus 表格" value="wp-table" />
                    <el-option label="Web Plus 表单" value="wp-form" />
                    <el-option label="Web Plus 上传" value="wp-upload" />
                    <el-option label="Web Plus 预览" value="wp-preview" />
                    <el-option label="Web Plus 图标" value="wp-icon" />
                    <el-option label="Web Plus 布局" value="wp-layout" />
                    <el-option label="Web Plus 描述列表" value="wp-descriptions" />
                    <el-option label="Web Plus 树" value="wp-tree" />
                    <el-option label="Web Plus 地图" value="wp-map" />
                    <el-option label="Web Plus 直播" value="wp-live" />
                    <el-option label="Web Plus JSON编辑器" value="wp-jsonEditor" />
                    <el-option label="Web Plus 富文本编辑器" value="wp-editor" />
                    <el-option label="Web Plus 列表" value="wp-list" />
                    <el-option label="Web Plus 图表" value="wp-chart" />
                    <el-option label="Web Plus 回到顶部" value="wp-backTop" />
                    <el-option label="Web Plus 面包屑" value="wp-breadcrumb" />
                    <el-option label="Web Plus 菜单" value="wp-menu" />
                    <el-option label="Web Plus 确认框" value="wp-confirm" />
                    <el-option label="Web Plus 通知" value="wp-bellMessage" />
                    <el-option label="Web Plus 对话框" value="wp-dialog" />
                    <el-option label="Web Plus 打印" value="wp-print" />
                    <el-option label="Web Plus 容器" value="wp-containerBox" />
                    <el-option label="Web Plus 提示" value="wp-tooltip" />
                    <el-option label="LS 按钮" value="ls-button" />
                    <el-option label="LS 表格" value="ls-table" />
                    <el-option label="LS 表单" value="ls-form" />
                    <el-option label="LS 上传" value="ls-upload" />
                    <el-option label="LS 预览" value="ls-preview" />
                    <el-option label="Element Plus 按钮" value="button" />
                    <el-option label="Element Plus 输入框" value="input" />
                    <el-option label="Element Plus 表格" value="table" />
                    <el-option label="Element Plus 表单" value="form" />
                  </el-select>
                </el-form-item>
                <el-form-item label="组件配置">
                  <el-input
                    v-model="componentForm.config"
                    type="textarea"
                    rows="4"
                    placeholder="输入组件配置..."
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="generateComponent">生成组件</el-button>
                </el-form-item>
              </el-form>
              <div v-if="generatedComponent" class="generated-code">
                <h3>生成的组件代码：</h3>
                <el-scrollbar>
                  <pre><code>{{ generatedComponent }}</code></pre>
                </el-scrollbar>
              </div>
            </div>
          </el-card>
          
          <el-card v-if="activeTab === '3'" class="card">
            <template #header>
              <div class="card-header">
                <span>API 优化</span>
              </div>
            </template>
            <div class="api-optimizer">
              <el-form :model="apiForm" label-width="100px">
                <el-form-item label="API 代码">
                  <el-input
                    v-model="apiForm.code"
                    type="textarea"
                    rows="6"
                    placeholder="输入API代码..."
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="optimizeApi">优化 API</el-button>
                </el-form-item>
              </el-form>
              <div v-if="optimizedApi" class="optimized-code">
                <h3>优化后的 API 代码：</h3>
                <el-scrollbar>
                  <pre><code>{{ optimizedApi }}</code></pre>
                </el-scrollbar>
              </div>
            </div>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChatDotRound, Tools } from '@element-plus/icons-vue'

// 状态管理
const activeTab = ref('1')
const messages = ref([
  { role: 'assistant', content: '你好！我是AI提示工具，可以帮助你生成Element Plus组件代码和优化API。' }
])
const inputMessage = ref('')
const componentForm = ref({
  type: '',
  config: ''
})
const generatedComponent = ref('')
const apiForm = ref({
  code: ''
})
const optimizedApi = ref('')

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value) return
  
  // 添加用户消息
  messages.value.push({ role: 'user', content: inputMessage.value })
  const userMessage = inputMessage.value
  inputMessage.value = ''
  
  // 显示正在输入的状态
  const loadingMessageId = messages.value.length
  messages.value.push({ 
    role: 'assistant', 
    content: '正在生成组件代码...' 
  })
  
  try {
    // 分析用户需求，提取组件类型
    let componentType = 'wp-button' // 默认使用Web Plus组件
    
    // 简单的关键词匹配
    if (userMessage.includes('按钮')) {
      componentType = 'wp-button'
    } else if (userMessage.includes('输入框')) {
      componentType = 'input' // 使用Element Plus输入框
    } else if (userMessage.includes('表格')) {
      componentType = 'wp-table'
    } else if (userMessage.includes('表单')) {
      componentType = 'wp-form'
    } else if (userMessage.includes('上传')) {
      componentType = 'wp-upload'
    } else if (userMessage.includes('预览')) {
      componentType = 'wp-preview'
    } else if (userMessage.includes('图标')) {
      componentType = 'wp-icon'
    } else if (userMessage.includes('布局')) {
      componentType = 'wp-layout'
    } else if (userMessage.includes('描述') || userMessage.includes('列表')) {
      componentType = 'wp-descriptions'
    } else if (userMessage.includes('树')) {
      componentType = 'wp-tree'
    } else if (userMessage.includes('地图')) {
      componentType = 'wp-map'
    } else if (userMessage.includes('直播')) {
      componentType = 'wp-live'
    } else if (userMessage.includes('json') || userMessage.includes('JSON')) {
      componentType = 'wp-jsonEditor'
    } else if (userMessage.includes('编辑器')) {
      componentType = 'wp-editor'
    } else if (userMessage.includes('列表')) {
      componentType = 'wp-list'
    } else if (userMessage.includes('图表')) {
      componentType = 'wp-chart'
    } else if (userMessage.includes('回到顶部') || userMessage.includes('top')) {
      componentType = 'wp-backTop'
    } else if (userMessage.includes('面包屑')) {
      componentType = 'wp-breadcrumb'
    } else if (userMessage.includes('菜单')) {
      componentType = 'wp-menu'
    } else if (userMessage.includes('确认')) {
      componentType = 'wp-confirm'
    } else if (userMessage.includes('通知')) {
      componentType = 'wp-bellMessage'
    } else if (userMessage.includes('对话框') || userMessage.includes('弹窗')) {
      componentType = 'wp-dialog'
    } else if (userMessage.includes('打印')) {
      componentType = 'wp-print'
    } else if (userMessage.includes('容器')) {
      componentType = 'wp-containerBox'
    } else if (userMessage.includes('提示') || userMessage.includes('tooltip')) {
      componentType = 'wp-tooltip'
    }
    
    // 检查是否指定了组件库
    if (userMessage.includes('Element Plus') || userMessage.includes('el-')) {
      // 使用Element Plus组件
      if (componentType.startsWith('wp-')) {
        componentType = componentType.substring(3)
      }
    } else if (userMessage.includes('LS') || userMessage.includes('ls-')) {
      // 使用LS组件
      if (componentType.startsWith('wp-')) {
        componentType = 'ls-' + componentType.substring(3)
      }
    }
    
    // 调用后端API生成组件
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tool: 'ai-prompt',
        params: {
          action: 'generate-component',
          componentType: componentType,
          config: userMessage
        }
      })
    })
    
    const result = await response.json()
    
    // 更新消息
    messages.value[loadingMessageId] = {
      role: 'assistant',
      content: `根据你的需求，我生成了以下组件代码：\n\n\`\`\`html\n${result.result.code}\n\`\`\``
    }
    
    // 自动切换到组件生成标签页，并填充表单
    activeTab.value = '2'
    componentForm.value.type = result.result.componentType
  } catch (error) {
    // 更新消息为错误信息
    messages.value[loadingMessageId] = {
      role: 'assistant',
      content: `生成组件时遇到错误：${error.message}`
    }
  }
}

// 生成组件
const generateComponent = async () => {
  if (!componentForm.value.type) {
    ElMessage.warning('请选择组件类型')
    return
  }
  
  // 调用后端API生成组件
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tool: 'ai-prompt',
        params: {
          action: 'generate-component',
          componentType: componentForm.value.type,
          config: componentForm.value.config
        }
      })
    })
    
    const result = await response.json()
    generatedComponent.value = result.result.code
  } catch (error) {
    ElMessage.error(`生成组件时遇到错误：${error.message}`)
  }
}

// 优化API
const optimizeApi = async () => {
  if (!apiForm.value.code) {
    ElMessage.warning('请输入API代码')
    return
  }
  
  // 模拟API优化
  setTimeout(() => {
    optimizedApi.value = `// 优化后的API代码\n${apiForm.value.code}\n\n// 优化建议：\n// 1. 添加错误处理\n// 2. 优化参数验证\n// 3. 增加性能监控`
  }, 1000)
}
</script>

<style scoped>
.app {
  height: 100vh;
  background-color: #f5f7fa;
}

.title {
  color: #303133;
  margin: 0;
  line-height: 60px;
  text-align: center;
}

.aside {
  background-color: #fff;
  border-right: 1px solid #e4e7ed;
}

.main {
  padding: 20px;
  overflow: auto;
}

.card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-container {
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 4px;
  max-width: 80%;
}

.user-message {
  background-color: #ecf5ff;
  align-self: flex-end;
  margin-left: auto;
}

.ai-message {
  background-color: #f0f9eb;
  align-self: flex-start;
}

.generated-code, .optimized-code {
  margin-top: 20px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
}
</style>