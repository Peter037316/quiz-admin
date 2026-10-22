<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="brand">
      <div class="brand-logo">
        <i class="el-icon-s-data"></i>
      </div>
      <h1>Quiz 后台管理系统</h1>
      <p class="brand-desc">在线答题平台的一站式管理后台</p>
      <ul class="brand-list">
        <li><i class="el-icon-check"></i> 题库管理，支持分类与难度维护</li>
        <li><i class="el-icon-check"></i> 用户状态管理，一键启用或禁用</li>
        <li><i class="el-icon-check"></i> 考试记录与成绩数据可视化</li>
      </ul>
      <div class="brand-footer">Web 开发技术 · 第五次课作业</div>
    </div>

    <!-- 右侧登录表单 -->
    <div class="login-panel">
      <div class="login-card">
        <h2>账号登录</h2>
        <p class="login-tip">欢迎回来，请登录后台管理系统</p>

        <el-form
          ref="loginForm"
          :model="form"
          :rules="rules"
          label-position="top"
          @keyup.enter.native="handleLogin"
        >
          <el-form-item label="账号" prop="username">
            <el-input
              v-model="form.username"
              prefix-icon="el-icon-user"
              placeholder="请输入账号"
              clearable
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>

          <el-button
            class="login-btn"
            type="primary"
            :loading="loading"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form>

        <div class="demo-account">
          <i class="el-icon-info"></i>
          演示账号：admin　密码：123456
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '@/api'

export default {
  name: 'LoginPage',
  data () {
    return {
      loading: false,
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        this.loading = true
        login(this.form)
          .then(() => {
            this.$message.success('登录成功')
            this.$router.push('/dashboard')
          })
          .catch(err => {
            this.$message.error(err.message || '登录失败')
          })
          .finally(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100%;
  background: #f5f7fa;
}

/* ==================== 左侧品牌区 ==================== */
.brand {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10%;
  color: #fff;
  background: linear-gradient(135deg, #1f3a5f 0%, #2f6fb5 55%, #409eff 100%);
  overflow: hidden;
}

/* 装饰圆 */
.brand::before,
.brand::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
}

.brand::before {
  width: 420px;
  height: 420px;
  top: -140px;
  right: -120px;
}

.brand::after {
  width: 260px;
  height: 260px;
  bottom: -100px;
  left: -60px;
}

.brand-logo {
  width: 56px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.16);
  font-size: 30px;
  margin-bottom: 24px;
}

.brand h1 {
  margin: 0 0 12px;
  font-size: 34px;
  letter-spacing: 2px;
}

.brand-desc {
  margin: 0 0 32px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
}

.brand-list {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 15px;
  line-height: 2.4;
  color: rgba(255, 255, 255, 0.88);
}

.brand-list i {
  margin-right: 8px;
  color: #a7e6c1;
}

.brand-footer {
  position: absolute;
  bottom: 28px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

/* ==================== 右侧表单区 ==================== */
.login-panel {
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 360px;
  padding: 36px 32px 28px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 30px rgba(31, 45, 61, 0.08);
}

.login-card h2 {
  margin: 0 0 6px;
  font-size: 24px;
  color: #1f2d3d;
}

.login-tip {
  margin: 0 0 26px;
  font-size: 13px;
  color: #909399;
}

.login-card ::v-deep .el-form-item__label {
  padding-bottom: 4px;
  font-size: 13px;
  color: #606266;
}

.login-btn {
  width: 100%;
  height: 42px;
  margin-top: 8px;
  font-size: 15px;
  letter-spacing: 4px;
}

.demo-account {
  margin-top: 20px;
  padding: 10px 12px;
  background: #f4f8ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  font-size: 13px;
  color: #409eff;
}

/* 小屏时隐藏品牌区，只保留登录表单 */
@media (max-width: 900px) {
  .brand {
    display: none;
  }

  .login-panel {
    width: 100%;
  }
}
</style>
