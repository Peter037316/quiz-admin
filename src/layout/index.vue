<template>
  <el-container class="layout">
    <!-- 左侧导航 -->
    <el-aside width="210px" class="sidebar">
      <div class="logo">
        <i class="el-icon-s-data"></i>
        <span>Quiz 管理后台</span>
      </div>

      <el-menu
        :default-active="$route.path"
        router
        background-color="#1f2d3d"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item index="/dashboard">
          <i class="el-icon-data-line"></i>
          <span slot="title">数据概览</span>
        </el-menu-item>
        <el-menu-item index="/questions">
          <i class="el-icon-document"></i>
          <span slot="title">题目管理</span>
        </el-menu-item>
        <el-menu-item index="/users">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>
        <el-menu-item index="/records">
          <i class="el-icon-tickets"></i>
          <span slot="title">考试记录</span>
        </el-menu-item>
      </el-menu>

      <div class="sidebar-footer">
        Quiz Game · 后台管理系统
      </div>
    </el-aside>

    <!-- 右侧主体 -->
    <el-container class="right-container">
      <el-header class="header" height="60px">
        <div class="breadcrumb">
          <i class="el-icon-s-home"></i>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <el-dropdown trigger="click" @command="handleCommand">
          <span class="user-info">
            <span class="avatar">{{ avatarText }}</span>
            <span class="nickname">{{ user.nickname }}</span>
            <i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user">{{ user.role }}</el-dropdown-item>
            <el-dropdown-item command="logout" icon="el-icon-switch-button" divided>
              退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getCurrentUser, logout } from '@/api'

export default {
  name: 'LayoutIndex',
  data () {
    return {
      user: getCurrentUser()
    }
  },
  computed: {
    currentTitle () {
      return this.$route.meta.title || '数据概览'
    },
    avatarText () {
      return (this.user.nickname || 'A').slice(0, 1)
    }
  },
  methods: {
    handleCommand (command) {
      if (command !== 'logout') return
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        logout()
        this.$router.push('/login')
        this.$message.success('已退出登录')
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.layout {
  height: 100%;
}

/* ==================== 侧边栏 ==================== */
.sidebar {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #1f2d3d 0%, #2b3a4d 100%);
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.logo i {
  font-size: 22px;
  color: #409eff;
}

.sidebar .el-menu {
  border-right: none;
  flex: 1;
  padding-top: 8px;
}

.sidebar .el-menu-item {
  height: 52px;
  line-height: 52px;
  margin: 0 10px 4px;
  border-radius: 4px;
}

.sidebar .el-menu-item i {
  margin-right: 8px;
}

.sidebar .el-menu-item:hover {
  background-color: #263445 !important;
}

.sidebar .el-menu-item.is-active {
  background-color: #263445 !important;
  color: #409eff !important;
}

.sidebar-footer {
  flex-shrink: 0;
  padding: 16px 0;
  text-align: center;
  color: #7f8c9b;
  font-size: 12px;
}

/* ==================== 右侧区域 ==================== */
.right-container {
  min-width: 0;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 10;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  outline: none;
}

.user-info:hover {
  background: #f5f7fa;
}

.avatar {
  width: 32px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #6f9cff);
  color: #fff;
  font-size: 14px;
}

.nickname {
  font-size: 14px;
  color: #303133;
}

.main {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
