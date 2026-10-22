<template>
  <div class="page-container">
    <div class="table-card">
      <!-- 搜索工具栏 -->
      <div class="toolbar">
        <el-input
          v-model="query.keyword"
          placeholder="搜索题干关键字"
          prefix-icon="el-icon-search"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleSearch"
        />
        <el-select v-model="query.category" placeholder="全部分类" clearable style="width: 150px">
          <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="query.difficulty" placeholder="全部难度" clearable style="width: 130px">
          <el-option v-for="item in difficulties" :key="item" :label="item" :value="item" />
        </el-select>
        <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>

        <div class="toolbar-right">
          <el-button type="danger" plain icon="el-icon-delete" :disabled="!selection.length" @click="handleBatchDelete">
            批量删除
          </el-button>
          <el-button type="primary" icon="el-icon-plus" @click="openCreate">新增题目</el-button>
        </div>
      </div>

      <!-- 题目表格 -->
      <el-table
        v-loading="loading"
        :data="list"
        border
        stripe
        size="medium"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column prop="id" label="ID" width="66" align="center" />
        <el-table-column prop="content" label="题干" min-width="300" show-overflow-tooltip />
        <el-table-column label="分类" width="120" align="center">
          <template slot-scope="{ row }">
            <el-tag size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="难度" width="96" align="center">
          <template slot-scope="{ row }">
            <el-tag :type="difficultyType(row.difficulty)" size="small">
              {{ row.difficulty }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="正确答案" width="100" align="center">
          <template slot-scope="{ row }">
            <span class="answer-text">{{ row.answer }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="150" />
        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template slot-scope="{ row }">
            <div class="table-actions">
              <el-button type="text" icon="el-icon-edit" @click="openEdit(row)">编辑</el-button>
              <el-button type="text" class="danger-text" icon="el-icon-delete" @click="handleDelete(row)">
                删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          background
          :current-page.sync="query.page"
          :page-size.sync="query.size"
          :page-sizes="[8, 10, 20]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="fetchList"
          @current-change="fetchList"
        />
      </div>
    </div>

    <!-- 新增 / 编辑题目弹窗 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="680px"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form ref="questionForm" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="题干" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="3"
            maxlength="200"
            show-word-limit
            placeholder="请输入题目内容"
          />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
                <el-option v-for="item in categories" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="form.difficulty" placeholder="请选择难度" style="width: 100%">
                <el-option v-for="item in difficulties" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="选项 A" prop="options.A">
          <el-input v-model="form.options.A" placeholder="请输入选项 A 的内容" />
        </el-form-item>
        <el-form-item label="选项 B" prop="options.B">
          <el-input v-model="form.options.B" placeholder="请输入选项 B 的内容" />
        </el-form-item>
        <el-form-item label="选项 C" prop="options.C">
          <el-input v-model="form.options.C" placeholder="请输入选项 C 的内容" />
        </el-form-item>
        <el-form-item label="选项 D" prop="options.D">
          <el-input v-model="form.options.D" placeholder="请输入选项 D 的内容" />
        </el-form-item>

        <el-form-item label="正确答案" prop="answer">
          <el-radio-group v-model="form.answer">
            <el-radio v-for="key in ['A', 'B', 'C', 'D']" :key="key" :label="key">{{ key }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="答案解析">
          <el-input
            v-model="form.analysis"
            type="textarea"
            :rows="2"
            placeholder="选填，答题后向用户展示的解析"
          />
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="saving" @click="submitForm">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  deleteQuestions
} from '@/api'

function emptyForm () {
  return {
    id: null,
    content: '',
    category: 'JavaScript',
    difficulty: '简单',
    options: { A: '', B: '', C: '', D: '' },
    answer: 'A',
    analysis: ''
  }
}

export default {
  name: 'QuestionPage',
  data () {
    return {
      loading: false,
      saving: false,
      list: [],
      total: 0,
      selection: [],
      categories: ['JavaScript', 'Vue', 'HTML/CSS', '网络基础'],
      difficulties: ['简单', '中等', '困难'],
      query: {
        page: 1,
        size: 8,
        keyword: '',
        category: '',
        difficulty: ''
      },
      dialogVisible: false,
      form: emptyForm(),
      rules: {
        content: [
          { required: true, message: '请输入题干', trigger: 'blur' },
          { min: 5, message: '题干至少 5 个字', trigger: 'blur' }
        ],
        category: [{ required: true, message: '请选择分类', trigger: 'change' }],
        difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }],
        'options.A': [{ required: true, message: '请输入选项 A', trigger: 'blur' }],
        'options.B': [{ required: true, message: '请输入选项 B', trigger: 'blur' }],
        'options.C': [{ required: true, message: '请输入选项 C', trigger: 'blur' }],
        'options.D': [{ required: true, message: '请输入选项 D', trigger: 'blur' }],
        answer: [{ required: true, message: '请选择正确答案', trigger: 'change' }]
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.form.id ? '编辑题目' : '新增题目'
    }
  },
  created () {
    this.fetchList()
  },
  methods: {
    fetchList () {
      this.loading = true
      getQuestions(this.query)
        .then(res => {
          this.list = res.list
          this.total = res.total
          // 删除后当前页可能为空，自动回到上一页
          if (!res.list.length && this.query.page > 1) {
            this.query.page -= 1
            this.fetchList()
          }
        })
        .finally(() => {
          this.loading = false
        })
    },

    handleSearch () {
      this.query.page = 1
      this.fetchList()
    },

    handleReset () {
      this.query = { page: 1, size: this.query.size, keyword: '', category: '', difficulty: '' }
      this.fetchList()
    },

    handleSelectionChange (selection) {
      this.selection = selection
    },

    openCreate () {
      this.form = emptyForm()
      this.dialogVisible = true
    },

    openEdit (row) {
      // 深拷贝，避免弹窗中修改直接影响表格数据
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogVisible = true
    },

    resetForm () {
      this.form = emptyForm()
      this.$refs.questionForm && this.$refs.questionForm.clearValidate()
    },

    submitForm () {
      this.$refs.questionForm.validate(valid => {
        if (!valid) return
        this.saving = true
        const request = this.form.id ? updateQuestion(this.form) : createQuestion(this.form)
        request
          .then(() => {
            this.$message.success(this.form.id ? '题目已更新' : '题目已添加')
            this.dialogVisible = false
            this.fetchList()
          })
          .catch(() => {
            this.$message.error('保存失败，请重试')
          })
          .finally(() => {
            this.saving = false
          })
      })
    },

    handleDelete (row) {
      this.$confirm(`确定删除题目「${row.content.slice(0, 18)}...」吗？`, '删除确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteQuestion(row.id).then(() => {
          this.$message.success('删除成功')
          this.fetchList()
        })
      }).catch(() => {})
    },

    handleBatchDelete () {
      const ids = this.selection.map(item => item.id)
      this.$confirm(`确定删除选中的 ${ids.length} 道题目吗？`, '批量删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteQuestions(ids).then(() => {
          this.$message.success(`已删除 ${ids.length} 道题目`)
          this.fetchList()
        })
      }).catch(() => {})
    },

    difficultyType (difficulty) {
      return { 简单: 'success', 中等: 'warning', 困难: 'danger' }[difficulty] || 'info'
    }
  }
}
</script>

<style scoped>
.answer-text {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  border-radius: 50%;
  background: #ecf5ff;
  color: #409eff;
  font-weight: 600;
}

.danger-text {
  color: #f56c6c;
}

.danger-text:hover {
  color: #f78989;
}
</style>
