<template>
  <div class="page-container">
    <div class="table-card">
      <div class="toolbar">
        <span class="page-title">用户管理</span>
        <div class="toolbar-right">
          <el-button icon="el-icon-refresh" @click="fetchUsers">刷新</el-button>
        </div>
      </div>

      <el-table v-loading="loading" :data="list" border stripe size="medium">
        <el-table-column prop="id" label="ID" width="66" align="center" />
        <el-table-column label="用户" min-width="180">
          <template slot-scope="{ row }">
            <div class="user-cell">
              <span class="user-avatar">{{ row.nickname.slice(0, 1) }}</span>
              <span>{{ row.nickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="账号" min-width="140" />
        <el-table-column label="角色" width="130" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.role === '超级管理员' ? 'danger' : 'info'" size="small">
              {{ row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="170" />
        <el-table-column label="状态" width="110" align="center">
          <template slot-scope="{ row }">
            <el-switch
              :value="row.status"
              :active-value="1"
              :inactive-value="0"
              active-color="#67c23a"
              @change="value => handleStatusChange(row, value)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" class="danger-text" icon="el-icon-delete" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">
        共 {{ list.length }} 位用户，其中启用 {{ activeCount }} 位
      </div>
    </div>
  </div>
</template>

<script>
import { getUsers, setUserStatus, deleteUser } from '@/api'

export default {
  name: 'UserPage',
  data () {
    return {
      loading: false,
      list: []
    }
  },
  computed: {
    activeCount () {
      return this.list.filter(item => item.status === 1).length
    }
  },
  created () {
    this.fetchUsers()
  },
  methods: {
    fetchUsers () {
      this.loading = true
      getUsers()
        .then(res => {
          this.list = res.list
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleStatusChange (row, value) {
      setUserStatus(row.id, value).then(() => {
        row.status = value
        this.$message.success(value === 1 ? `已启用「${row.nickname}」` : `已禁用「${row.nickname}」`)
      })
    },

    handleDelete (row) {
      if (row.role === '超级管理员') {
        this.$message.warning('超级管理员账号不能删除')
        return
      }
      this.$confirm(`确定删除用户「${row.nickname}」吗？`, '删除确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row.id).then(() => {
          this.$message.success('删除成功')
          this.fetchUsers()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.page-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2d3d;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 50%;
  background: #ecf5ff;
  color: #409eff;
  font-size: 13px;
  flex-shrink: 0;
}

.danger-text {
  color: #f56c6c;
}

.table-footer {
  margin-top: 14px;
  font-size: 13px;
  color: #909399;
}
</style>
