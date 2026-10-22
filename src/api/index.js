/*
 * ============================================================
 * Quiz 后台管理系统 — 数据接口层
 * ============================================================
 * 说明:
 *   课程视频里的后台依赖真实服务端。为了让编译后的静态页面
 *   部署到 Vercel 后也能直接演示，这里用 localStorage 模拟接口，
 *   每个方法都返回 Promise，页面中的调用方式与真实接口一致。
 *   后续接入后端时，只需把方法内部替换成 axios 请求即可。
 * ============================================================
 */

const DB_KEY = 'quiz_admin_db'
const TOKEN_KEY = 'quiz_admin_token'
const USER_KEY = 'quiz_admin_user'

// ==================== 初始化数据 ====================
const seedQuestions = [
  {
    id: 1,
    content: '下列哪个关键字声明的变量具有块级作用域，且可以重新赋值？',
    category: 'JavaScript',
    difficulty: '简单',
    options: { A: 'var', B: 'let', C: 'const', D: 'function' },
    answer: 'B',
    analysis: 'let 声明的变量具有块级作用域且可以重新赋值；const 虽然也是块级作用域，但不可重新赋值。',
    updatedAt: '2026-10-21 09:12'
  },
  {
    id: 2,
    content: '执行 console.log(typeof null) 的输出结果是？',
    category: 'JavaScript',
    difficulty: '中等',
    options: { A: "'null'", B: "'object'", C: "'undefined'", D: "'number'" },
    answer: 'B',
    analysis: '这是 JavaScript 的历史遗留问题，typeof null 返回 "object"。',
    updatedAt: '2026-10-21 09:20'
  },
  {
    id: 3,
    content: '数组 [1, 2, 3].map(x => x * 2) 的执行结果是？',
    category: 'JavaScript',
    difficulty: '简单',
    options: { A: '[1, 2, 3]', B: '[2, 4, 6]', C: '[1, 4, 9]', D: '6' },
    answer: 'B',
    analysis: 'map 会遍历数组并把回调的返回值组成新数组，因此每个元素乘以 2。',
    updatedAt: '2026-10-20 15:40'
  },
  {
    id: 4,
    content: '关于 JavaScript 事件循环，下列说法正确的是？',
    category: 'JavaScript',
    difficulty: '困难',
    options: {
      A: '宏任务先于微任务执行',
      B: '微任务在当前宏任务结束后、下一个宏任务开始前执行',
      C: 'setTimeout 属于微任务',
      D: 'Promise.then 属于宏任务'
    },
    answer: 'B',
    analysis: '每执行完一个宏任务，会清空微任务队列，然后再取下一个宏任务；Promise.then 是微任务，setTimeout 是宏任务。',
    updatedAt: '2026-10-19 10:05'
  },
  {
    id: 5,
    content: 'JSON.parse() 方法的作用是？',
    category: 'JavaScript',
    difficulty: '简单',
    options: { A: '把对象转成字符串', B: '把 JSON 字符串转成对象', C: '深拷贝数组', D: '格式化数字' },
    answer: 'B',
    analysis: 'JSON.parse 用于将 JSON 字符串解析为 JavaScript 对象，与之对应的是 JSON.stringify。',
    updatedAt: '2026-10-18 14:22'
  },
  {
    id: 6,
    content: '以下哪个方法会改变原数组？',
    category: 'JavaScript',
    difficulty: '困难',
    options: { A: 'map', B: 'filter', C: 'slice', D: 'splice' },
    answer: 'D',
    analysis: 'splice 会直接修改原数组；map、filter、slice 都返回新数组，不改变原数组。',
    updatedAt: '2026-10-17 11:48'
  },
  {
    id: 7,
    content: '以下哪个不是 JavaScript 的基本数据类型？',
    category: 'JavaScript',
    difficulty: '简单',
    options: { A: 'string', B: 'number', C: 'array', D: 'boolean' },
    answer: 'C',
    analysis: 'array 属于引用类型（对象），基本数据类型包括 string、number、boolean、null、undefined、symbol、bigint。',
    updatedAt: '2026-10-16 16:30'
  },
  {
    id: 8,
    content: 'Vue 中实现表单双向数据绑定的指令是？',
    category: 'Vue',
    difficulty: '简单',
    options: { A: 'v-if', B: 'v-for', C: 'v-bind', D: 'v-model' },
    answer: 'D',
    analysis: 'v-model 在表单元素上创建双向数据绑定，本质是 v-bind 与 input 事件的语法糖。',
    updatedAt: '2026-10-21 10:02'
  },
  {
    id: 9,
    content: 'v-if 与 v-show 的主要区别是？',
    category: 'Vue',
    difficulty: '中等',
    options: {
      A: 'v-if 通过 CSS 控制显示，v-show 销毁元素',
      B: 'v-show 通过 CSS 的 display 控制显示，v-if 会销毁或重建元素',
      C: '两者完全一样',
      D: 'v-if 只能用于组件'
    },
    answer: 'B',
    analysis: 'v-if 是条件渲染，会销毁/重建元素；v-show 只是切换 display 属性，适合频繁切换的场景。',
    updatedAt: '2026-10-20 09:35'
  },
  {
    id: 10,
    content: '关于 computed 与 watch，下列说法正确的是？',
    category: 'Vue',
    difficulty: '中等',
    options: {
      A: 'computed 有缓存，依赖不变时不会重新计算',
      B: 'watch 有缓存',
      C: 'computed 不能返回值',
      D: 'watch 只能监听基本类型'
    },
    answer: 'A',
    analysis: '计算属性基于依赖缓存，依赖变化才重新求值；watch 更适合同步或异步的副作用处理。',
    updatedAt: '2026-10-19 15:18'
  },
  {
    id: 11,
    content: 'Vue 组件中，子组件向父组件传值应该使用？',
    category: 'Vue',
    difficulty: '困难',
    options: { A: 'props', B: '$emit', C: 'provide / inject', D: '$refs' },
    answer: 'B',
    analysis: '子组件通过 $emit 触发自定义事件，父组件用 v-on 监听并接收参数。',
    updatedAt: '2026-10-18 17:06'
  },
  {
    id: 12,
    content: 'Vue 组件中的 data 必须是一个？',
    category: 'Vue',
    difficulty: '简单',
    options: { A: '数组', B: '函数', C: '字符串', D: '数字' },
    answer: 'B',
    analysis: '组件复用时要保证每个实例的数据互相独立，因此 data 必须是返回对象的函数。',
    updatedAt: '2026-10-17 09:44'
  },
  {
    id: 13,
    content: 'ElementUI 中用于展示表格的组件是？',
    category: 'Vue',
    difficulty: '中等',
    options: { A: 'el-form', B: 'el-table', C: 'el-card', D: 'el-dialog' },
    answer: 'B',
    analysis: 'el-table 配合 el-table-column 使用，支持选择、排序、固定列、分页等常见后台场景。',
    updatedAt: '2026-10-16 10:26'
  },
  {
    id: 14,
    content: 'vue-router 中实现编程式路由跳转的方法是？',
    category: 'Vue',
    difficulty: '中等',
    options: { A: 'this.$router.push()', B: 'this.$route.push()', C: 'this.$push()', D: 'this.$link()' },
    answer: 'A',
    analysis: '$router 是路由实例，负责跳转；$route 是当前路由信息对象。',
    updatedAt: '2026-10-15 13:58'
  },
  {
    id: 15,
    content: 'HTML 中用于定义页面主要内容区域的标签是？',
    category: 'HTML/CSS',
    difficulty: '简单',
    options: { A: '<header>', B: '<main>', C: '<section>', D: '<article>' },
    answer: 'B',
    analysis: '<main> 表示文档的主体内容，一个页面中只应出现一次。',
    updatedAt: '2026-10-21 08:50'
  },
  {
    id: 16,
    content: 'CSS 中实现一维弹性布局的 display 取值是？',
    category: 'HTML/CSS',
    difficulty: '简单',
    options: { A: 'block', B: 'flex', C: 'inline', D: 'none' },
    answer: 'B',
    analysis: 'display: flex 开启弹性布局，通过 justify-content、align-items 控制主轴与交叉轴对齐。',
    updatedAt: '2026-10-20 14:12'
  },
  {
    id: 17,
    content: 'CSS 盒模型中，用于设置内边距的属性是？',
    category: 'HTML/CSS',
    difficulty: '简单',
    options: { A: 'margin', B: 'padding', C: 'border', D: 'outline' },
    answer: 'B',
    analysis: 'padding 是内边距，位于内容和边框之间；margin 是外边距。',
    updatedAt: '2026-10-19 09:16'
  },
  {
    id: 18,
    content: '以下选择器中优先级最高的是？',
    category: 'HTML/CSS',
    difficulty: '中等',
    options: { A: '元素选择器', B: '类选择器', C: 'ID 选择器', D: '通配符选择器' },
    answer: 'C',
    analysis: '优先级从高到低为：行内样式 > ID 选择器 > 类/属性/伪类 > 元素/伪元素 > 通配符。',
    updatedAt: '2026-10-18 11:34'
  },
  {
    id: 19,
    content: 'position: fixed 的定位基准是？',
    category: 'HTML/CSS',
    difficulty: '困难',
    options: { A: '最近的定位祖先元素', B: '浏览器视口', C: '父元素', D: '文档流中的原位置' },
    answer: 'B',
    analysis: 'fixed 相对于浏览器视口定位，页面滚动时元素位置不变，常用于顶部导航和悬浮按钮。',
    updatedAt: '2026-10-17 15:52'
  },
  {
    id: 20,
    content: 'HTML 中用于创建超链接的标签是？',
    category: 'HTML/CSS',
    difficulty: '简单',
    options: { A: '<link>', B: '<a>', C: '<href>', D: '<url>' },
    answer: 'B',
    analysis: '<a href="..."> 用于超链接；<link> 用于引入外部资源，如样式表。',
    updatedAt: '2026-10-16 12:08'
  },
  {
    id: 21,
    content: 'HTTP 状态码 200 表示？',
    category: '网络基础',
    difficulty: '简单',
    options: { A: '请求成功', B: '资源未找到', C: '服务器错误', D: '未授权' },
    answer: 'A',
    analysis: '2xx 表示成功，200 是最常见的成功状态码；404 是资源未找到，500 是服务器内部错误。',
    updatedAt: '2026-10-21 11:26'
  },
  {
    id: 22,
    content: 'HTTP 状态码 404 表示？',
    category: '网络基础',
    difficulty: '中等',
    options: { A: '请求成功', B: '资源未找到', C: '禁止访问', D: '请求超时' },
    answer: 'B',
    analysis: '404 Not Found 表示服务器找不到请求的资源，通常由路径写错或资源被删除导致。',
    updatedAt: '2026-10-20 16:45'
  },
  {
    id: 23,
    content: '使用 axios 发送 GET 请求的方法是？',
    category: '网络基础',
    difficulty: '简单',
    options: { A: 'axios.post()', B: 'axios.get()', C: 'axios.put()', D: 'axios.delete()' },
    answer: 'B',
    analysis: 'axios.get(url, config) 用于发起 GET 请求，参数通过 params 传递。',
    updatedAt: '2026-10-19 17:20'
  },
  {
    id: 24,
    content: '浏览器中出现跨域问题，主要是受什么限制？',
    category: '网络基础',
    difficulty: '困难',
    options: { A: '同源策略', B: 'HTTP 缓存', C: 'DNS 解析', D: 'TCP 三次握手' },
    answer: 'A',
    analysis: '浏览器的同源策略要求协议、域名、端口一致，不满足时跨域请求会被拦截，可通过 CORS 等方式解决。',
    updatedAt: '2026-10-18 10:38'
  }
]

const seedUsers = [
  { id: 1, nickname: '管理员', username: 'admin', role: '超级管理员', createdAt: '2026-09-01 10:00', status: 1 },
  { id: 2, nickname: '张三', username: 'zhangsan', role: '学员', createdAt: '2026-09-12 14:32', status: 1 },
  { id: 3, nickname: '李四', username: 'lisi', role: '学员', createdAt: '2026-09-15 09:18', status: 1 },
  { id: 4, nickname: '王五', username: 'wangwu', role: '学员', createdAt: '2026-09-20 16:45', status: 1 },
  { id: 5, nickname: '赵六', username: 'zhaoliu', role: '学员', createdAt: '2026-09-26 11:05', status: 0 },
  { id: 6, nickname: '孙七', username: 'sunqi', role: '学员', createdAt: '2026-10-02 19:22', status: 1 },
  { id: 7, nickname: '周八', username: 'zhouba', role: '学员', createdAt: '2026-10-08 08:40', status: 1 },
  { id: 8, nickname: '吴九', username: 'wujiu', role: '学员', createdAt: '2026-10-15 20:10', status: 1 }
]

const seedRecords = [
  { id: 1, user: '张三', score: 9, total: 10, duration: 356, submittedAt: '2026-10-22 20:15', status: '已完成' },
  { id: 2, user: '李四', score: 7, total: 10, duration: 420, submittedAt: '2026-10-22 19:48', status: '已完成' },
  { id: 3, user: '王五', score: 10, total: 10, duration: 288, submittedAt: '2026-10-22 18:30', status: '已完成' },
  { id: 4, user: '赵六', score: 6, total: 10, duration: 512, submittedAt: '2026-10-21 21:02', status: '已完成' },
  { id: 5, user: '孙七', score: 8, total: 10, duration: 395, submittedAt: '2026-10-21 16:26', status: '已完成' },
  { id: 6, user: '周八', score: 0, total: 10, duration: 62, submittedAt: '2026-10-21 10:14', status: '进行中' },
  { id: 7, user: '吴九', score: 9, total: 10, duration: 310, submittedAt: '2026-10-20 20:41', status: '已完成' },
  { id: 8, user: '张三', score: 8, total: 10, duration: 402, submittedAt: '2026-10-20 15:09', status: '已完成' },
  { id: 9, user: '李四', score: 6, total: 10, duration: 486, submittedAt: '2026-10-19 19:33', status: '已完成' },
  { id: 10, user: '王五', score: 9, total: 10, duration: 332, submittedAt: '2026-10-19 11:27', status: '已完成' },
  { id: 11, user: '孙七', score: 7, total: 10, duration: 450, submittedAt: '2026-10-18 20:58', status: '已完成' },
  { id: 12, user: '吴九', score: 10, total: 10, duration: 265, submittedAt: '2026-10-18 14:05', status: '已完成' },
  { id: 13, user: '赵六', score: 5, total: 10, duration: 540, submittedAt: '2026-10-17 18:22', status: '已完成' },
  { id: 14, user: '周八', score: 8, total: 10, duration: 376, submittedAt: '2026-10-17 09:47', status: '已完成' }
]

// 最近 7 天答题量（用于仪表盘折线图）
const seedTrend = {
  dates: ['10-16', '10-17', '10-18', '10-19', '10-20', '10-21', '10-22'],
  counts: [12, 18, 9, 23, 15, 31, 26]
}

// ==================== 本地存储工具 ====================
function createDB () {
  const db = {
    questions: JSON.parse(JSON.stringify(seedQuestions)),
    users: JSON.parse(JSON.stringify(seedUsers)),
    records: JSON.parse(JSON.stringify(seedRecords)),
    trend: JSON.parse(JSON.stringify(seedTrend))
  }
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  return db
}

function getDB () {
  const raw = localStorage.getItem(DB_KEY)
  if (!raw) return createDB()
  try {
    return JSON.parse(raw)
  } catch (e) {
    // 数据损坏时重新初始化，避免页面白屏
    return createDB()
  }
}

function saveDB (db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
}

// 统一模拟网络延迟，返回深拷贝，防止页面直接改到"数据库"
function response (data, delay = 260) {
  return new Promise(resolve => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay)
  })
}

function formatNow () {
  const d = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ==================== 登录 / 身份 ====================
export function login ({ username, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username !== 'admin' || password !== '123456') {
        reject(new Error('账号或密码错误'))
        return
      }
      const user = { username: 'admin', nickname: '管理员', role: '超级管理员' }
      const token = 'quiz-admin-token-' + Date.now()
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      resolve({ token, user })
    }, 400)
  })
}

export function logout () {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isLoggedIn () {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function getCurrentUser () {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY)) || { nickname: '管理员', role: '超级管理员' }
  } catch (e) {
    return { nickname: '管理员', role: '超级管理员' }
  }
}

// ==================== 题目管理 ====================
export function getQuestions ({ page = 1, size = 8, keyword = '', category = '', difficulty = '' } = {}) {
  const db = getDB()
  let list = db.questions.slice()

  if (keyword) {
    const kw = keyword.trim().toLowerCase()
    list = list.filter(q => q.content.toLowerCase().includes(kw))
  }
  if (category) list = list.filter(q => q.category === category)
  if (difficulty) list = list.filter(q => q.difficulty === difficulty)

  const total = list.length
  const start = (page - 1) * size

  return response({ list: list.slice(start, start + size), total })
}

export function createQuestion (payload) {
  const db = getDB()
  const id = db.questions.reduce((max, q) => Math.max(max, q.id), 0) + 1
  db.questions.unshift({
    ...payload,
    id,
    updatedAt: formatNow()
  })
  saveDB(db)
  return response({ id })
}

export function updateQuestion (payload) {
  const db = getDB()
  const index = db.questions.findIndex(q => q.id === payload.id)
  if (index > -1) {
    db.questions[index] = { ...payload, updatedAt: formatNow() }
    saveDB(db)
  }
  return response({ id: payload.id })
}

export function deleteQuestion (id) {
  const db = getDB()
  db.questions = db.questions.filter(q => q.id !== id)
  saveDB(db)
  return response({ id })
}

export function deleteQuestions (ids) {
  const db = getDB()
  db.questions = db.questions.filter(q => !ids.includes(q.id))
  saveDB(db)
  return response({ count: ids.length })
}

// ==================== 用户管理 ====================
export function getUsers () {
  const db = getDB()
  return response({ list: db.users })
}

export function setUserStatus (id, status) {
  const db = getDB()
  const user = db.users.find(u => u.id === id)
  if (user) {
    user.status = status
    saveDB(db)
  }
  return response({ id, status })
}

export function deleteUser (id) {
  const db = getDB()
  db.users = db.users.filter(u => u.id !== id)
  saveDB(db)
  return response({ id })
}

// ==================== 考试记录 ====================
export function getRecords () {
  const db = getDB()
  return response({ list: db.records })
}

// ==================== 数据概览 ====================
export function getDashboard () {
  const db = getDB()

  const questionTotal = db.questions.length
  const userTotal = db.users.length
  const recordTotal = db.records.length

  // 只统计已完成的记录，进行中的 0 分不计入平均分
  const finished = db.records.filter(r => r.status === '已完成')
  const avgScore = finished.length
    ? Number((finished.reduce((sum, r) => sum + r.score, 0) / finished.length).toFixed(1))
    : 0

  // 按分类统计题目数量
  const categoryMap = {}
  db.questions.forEach(q => {
    categoryMap[q.category] = (categoryMap[q.category] || 0) + 1
  })
  const categoryData = Object.keys(categoryMap).map(name => ({ name, value: categoryMap[name] }))

  return response({
    questionTotal,
    userTotal,
    recordTotal,
    avgScore,
    trend: db.trend,
    categoryData
  })
}
