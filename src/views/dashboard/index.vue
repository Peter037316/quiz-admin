<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col v-for="card in cards" :key="card.label" :xs="24" :sm="12" :md="6">
        <div class="stat-card">
          <div class="stat-icon" :style="{ background: card.color }">
            <i :class="card.icon"></i>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-label">{{ card.label }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区 -->
    <el-row :gutter="16">
      <el-col :xs="24" :md="15">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">最近 7 天答题量</span>
            <span class="chart-sub">单位：次</span>
          </div>
          <div ref="trendChart" v-loading="loading" class="chart-body"></div>
        </div>
      </el-col>

      <el-col :xs="24" :md="9">
        <div class="chart-card">
          <div class="chart-header">
            <span class="chart-title">题目分类分布</span>
            <span class="chart-sub">共 {{ questionTotal }} 道题</span>
          </div>
          <div ref="pieChart" v-loading="loading" class="chart-body"></div>
        </div>
      </el-col>
    </el-row>

    <!-- 最新考试记录 -->
    <div class="table-card">
      <div class="chart-header">
        <span class="chart-title">最新考试记录</span>
        <el-button type="text" @click="$router.push('/records')">查看全部</el-button>
      </div>
      <el-table :data="recentRecords" size="medium">
        <el-table-column prop="user" label="用户" width="120" />
        <el-table-column label="得分" width="160">
          <template slot-scope="{ row }">
            <span class="score-text">
              {{ row.score }} / {{ row.total }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="用时" width="120">
          <template slot-scope="{ row }">{{ formatDuration(row.duration) }}</template>
        </el-table-column>
        <el-table-column prop="submittedAt" label="提交时间" min-width="170" />
        <el-table-column label="状态" width="110">
          <template slot-scope="{ row }">
            <el-tag :type="row.status === '已完成' ? 'success' : 'warning'" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getDashboard, getRecords } from '@/api'

export default {
  name: 'DashboardPage',
  data () {
    return {
      loading: false,
      questionTotal: 0,
      userTotal: 0,
      recordTotal: 0,
      avgScore: 0,
      recentRecords: [],
      trendChart: null,
      pieChart: null
    }
  },
  computed: {
    cards () {
      return [
        { label: '题目总数', value: this.questionTotal, icon: 'el-icon-document', color: '#409eff' },
        { label: '注册用户', value: this.userTotal, icon: 'el-icon-user', color: '#67c23a' },
        { label: '考试记录', value: this.recordTotal, icon: 'el-icon-tickets', color: '#e6a23c' },
        { label: '平均得分', value: this.avgScore, icon: 'el-icon-trophy', color: '#f56c6c' }
      ]
    }
  },
  mounted () {
    this.fetchData()
    window.addEventListener('resize', this.resizeCharts)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeCharts)
    if (this.trendChart) this.trendChart.dispose()
    if (this.pieChart) this.pieChart.dispose()
  },
  methods: {
    fetchData () {
      this.loading = true
      Promise.all([getDashboard(), getRecords()])
        .then(([stats, records]) => {
          this.questionTotal = stats.questionTotal
          this.userTotal = stats.userTotal
          this.recordTotal = stats.recordTotal
          this.avgScore = stats.avgScore
          this.recentRecords = records.list.slice(0, 5)
          this.$nextTick(() => {
            this.renderTrendChart(stats.trend)
            this.renderPieChart(stats.categoryData)
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    /* 折线图: 最近 7 天答题量 */
    renderTrendChart (trend) {
      this.trendChart = echarts.init(this.$refs.trendChart)
      this.trendChart.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: 40, right: 20, top: 30, bottom: 30 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: trend.dates,
          axisLine: { lineStyle: { color: '#dcdfe6' } },
          axisLabel: { color: '#909399' }
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: '#eef1f6' } },
          axisLabel: { color: '#909399' }
        },
        series: [
          {
            name: '答题量',
            type: 'line',
            smooth: true,
            symbolSize: 7,
            data: trend.counts,
            itemStyle: { color: '#409eff' },
            lineStyle: { width: 3, color: '#409eff' },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(64, 158, 255, 0.35)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.02)' }
              ])
            }
          }
        ]
      })
    },

    /* 环形图: 题目分类分布 */
    renderPieChart (categoryData) {
      this.pieChart = echarts.init(this.$refs.pieChart)
      this.pieChart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}: {c} 道 ({d}%)' },
        legend: { bottom: 0, icon: 'circle', textStyle: { color: '#606266' } },
        color: ['#409eff', '#67c23a', '#e6a23c', '#f56c6c'],
        series: [
          {
            name: '题目分类',
            type: 'pie',
            radius: ['45%', '68%'],
            center: ['50%', '44%'],
            avoidLabelOverlap: true,
            label: { formatter: '{b}\n{d}%', color: '#606266' },
            data: categoryData
          }
        ]
      })
    },

    resizeCharts () {
      if (this.trendChart) this.trendChart.resize()
      if (this.pieChart) this.pieChart.resize()
    },

    formatDuration (seconds) {
      const m = Math.floor(seconds / 60)
      const s = seconds % 60
      return `${m} 分 ${String(s).padStart(2, '0')} 秒`
    }
  }
}
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 18px rgba(0, 21, 41, 0.1);
}

.stat-icon {
  width: 52px;
  height: 52px;
  line-height: 52px;
  text-align: center;
  border-radius: 10px;
  font-size: 26px;
  color: #fff;
  flex-shrink: 0;
}

.stat-value {
  font-size: 26px;
  font-weight: 600;
  line-height: 1.2;
  color: #1f2d3d;
}

.stat-label {
  margin-top: 4px;
  font-size: 13px;
  color: #909399;
}

.chart-card {
  padding: 16px 20px 12px;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.06);
}

.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2d3d;
}

.chart-sub {
  font-size: 12px;
  color: #909399;
}

.chart-body {
  height: 300px;
}

.score-text {
  font-weight: 600;
  color: #409eff;
}
</style>
