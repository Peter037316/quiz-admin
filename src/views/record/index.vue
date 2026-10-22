<template>
  <div class="page-container">
    <div class="table-card">
      <div class="toolbar">
        <el-input
          v-model="keyword"
          placeholder="搜索用户"
          prefix-icon="el-icon-search"
          clearable
          style="width: 220px"
        />
        <el-select v-model="status" placeholder="全部状态" clearable style="width: 140px">
          <el-option label="已完成" value="已完成" />
          <el-option label="进行中" value="进行中" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
      </div>

      <el-table v-loading="loading" :data="filteredList" border stripe size="medium">
        <el-table-column prop="id" label="ID" width="66" align="center" />
        <el-table-column prop="user" label="用户" width="130" />
        <el-table-column label="得分" min-width="220">
          <template slot-scope="{ row }">
            <div class="score-cell">
              <el-progress
                :percentage="Math.round(row.score / row.total * 100)"
                :stroke-width="8"
                :color="scoreColor(row.score)"
                :show-text="false"
                class="score-bar"
              />
              <span class="score-label">{{ row.score }} / {{ row.total }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用时" width="130">
          <template slot-scope="{ row }">{{ formatDuration(row.duration) }}</template>
        </el-table-column>
        <el-table-column prop="submittedAt" label="提交时间" width="170" />
        <el-table-column label="状态" width="110" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" icon="el-icon-view" @click="openDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-footer">共 {{ filteredList.length }} 条考试记录</div>
    </div>

    <!-- 记录详情 -->
    <el-dialog title="考试记录详情" :visible.sync="detailVisible" width="460px">
      <div v-if="current" class="detail-list">
        <div class="detail-item">
          <span class="detail-label">用户</span>
          <span class="detail-value">{{ current.user }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">得分</span>
          <span class="detail-value strong">{{ current.score }} / {{ current.total }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">正确率</span>
          <span class="detail-value">{{ Math.round(current.score / current.total * 100) }}%</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">用时</span>
          <span class="detail-value">{{ formatDuration(current.duration) }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">提交时间</span>
          <span class="detail-value">{{ current.submittedAt }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">状态</span>
          <el-tag :type="current.status === '已完成' ? 'success' : 'warning'" size="small">
            {{ current.status }}
          </el-tag>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="detailVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRecords } from '@/api'

export default {
  name: 'RecordPage',
  data () {
    return {
      loading: false,
      list: [],
      keyword: '',
      status: '',
      searchKeyword: '',
      searchStatus: '',
      detailVisible: false,
      current: null
    }
  },
  computed: {
    filteredList () {
      return this.list.filter(item => {
        const matchUser = !this.searchKeyword || item.user.includes(this.searchKeyword)
        const matchStatus = !this.searchStatus || item.status === this.searchStatus
        return matchUser && matchStatus
      })
    }
  },
  created () {
    this.fetchRecords()
  },
  methods: {
    fetchRecords () {
      this.loading = true
      getRecords()
        .then(res => {
          this.list = res.list
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleSearch () {
      this.searchKeyword = this.keyword.trim()
      this.searchStatus = this.status
    },

    handleReset () {
      this.keyword = ''
      this.status = ''
      this.searchKeyword = ''
      this.searchStatus = ''
    },

    openDetail (row) {
      this.current = row
      this.detailVisible = true
    },

    formatDuration (seconds) {
      const m = Math.floor(seconds / 60)
      const s = seconds % 60
      return `${m} 分 ${String(s).padStart(2, '0')} 秒`
    },

    scoreColor (score) {
      if (score >= 8) return '#67c23a'
      if (score >= 6) return '#e6a23c'
      return '#f56c6c'
    }
  }
}
</script>

<style scoped>
.score-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.score-bar {
  width: 120px;
}

.score-label {
  font-weight: 600;
  color: #409eff;
}

.table-footer {
  margin-top: 14px;
  font-size: 13px;
  color: #909399;
}

.detail-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-item {
  display: flex;
  align-items: center;
  padding: 10px 4px;
  border-bottom: 1px solid #f0f2f5;
}

.detail-label {
  width: 90px;
  color: #909399;
  font-size: 13px;
}

.detail-value {
  color: #303133;
}

.detail-value.strong {
  font-size: 18px;
  font-weight: 600;
  color: #409eff;
}
</style>
