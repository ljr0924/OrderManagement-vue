<template>
  <div id="product">
    <!-- start 表格数据筛选表单 -->
    <el-row :gutter="20">
      <el-form :inline="true" :model="filterForm" label-position="left" label-width="80px">
        <!-- 商品名称 -->
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6" :push="1">
          <el-form-item label="商品">
            <el-input v-model="filterForm.product_name" placeholder="请输入商品名称" style="width: 220px" />
          </el-form-item>
        </el-col>
        <!-- 商品分类 -->
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6" :push="1">
          <el-form-item label="商品分类">
            <el-select
              v-model="filterForm.product_category"
              clearable
              placeholder="请选择商品类别"
              style="width: 220px"
            >
              <el-option
                v-for="(item, index) in categoryList"
                :key="index"
                :label="item.category_name"
                :value="item.category_pinyin"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-form :inline="true" :model="filterForm" label-position="left" label-width="80px">
        <!-- 创建时间 -->
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6" :push="1">
          <el-form-item label="创建时间">
            <el-radio-group v-model="filterForm.create_time" size="medium">
              <el-radio-button :label="7">最近7天</el-radio-button>
              <el-radio-button :label="30">最近30天</el-radio-button>
              <el-radio-button :label="90">最近90天</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 修改时间 -->
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6" :push="1">
          <el-form-item label="修改时间">
            <el-radio-group v-model="filterForm.modify_time" size="medium">
              <el-radio-button :label="7">最近7天</el-radio-button>
              <el-radio-button :label="30">最近30天</el-radio-button>
              <el-radio-button :label="90">最近90天</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 上架状态 -->
        <el-col :xs="12" :sm="12" :md="12" :lg="8" :xl="6" :push="1">
          <el-form-item label="商品状态">
            <el-radio-group v-model="filterForm.product_status" size="medium">
              <el-radio-button :label="1">已上架</el-radio-button>
              <el-radio-button :label="0">已下架</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <el-row :gutter="20">
      <el-col :xs="12" :sm="12" :md="8" :lg="6" :push="1">
        <el-button type="primary" @click="fetchProductList">查询</el-button>
        <el-button type="info" @click="filterForm = {}">清空</el-button>
      </el-col>
    </el-row>
    <!-- end 表格数据筛选表单 -->

    <!-- start 订单表格 -->
    <el-row type="flex" justify="start" style="margin-top:30px">
      <el-col :span="22" :xs="24" :offset="1">
        <el-table :data="tableData" border>
          <el-table-column prop="product_id" label="ID" align="center" min-width="50" />
          <el-table-column prop="product_name" label="名称" align="center" min-width="100" />
          <el-table-column prop="product_category" label="分类" align="center" min-width="100" />
          <el-table-column prop="product_price" label="价格(元)" align="center" min-width="100" />
          <el-table-column prop="product_stock" label="库存" align="center" min-width="100" />
          <el-table-column prop="product_icon" label="小图" align="center" min-width="100">
            <template slot-scope="scope">
              <el-upload
                :action="uploadUrl"
                :limit="1"
                :file-list="file"
                :data="{product_id: scope.row.product_id}"
              >
                <el-button size="small" type="text">点击上传</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column prop="product_status" label="是否上架" align="center" min-width="100">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.product_status" type="success">上架中</el-tag>
              <el-tag v-else type="danger">未上架</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="product_description"
            label="描述"
            align="center"
            min-width="100"
            show-overflow-tooltip
          />
          <el-table-column prop="create_time" label="创建时间" align="center" min-width="100" />
          <el-table-column prop="modify_time" label="修改时间" align="center" min-width="100" />
          <el-table-column label="操作" align="center" min-width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                @click="editProduct(scope.row, scope.$index)"
              />
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteProduct(scope.row, scope.$index)"
              />
              <el-button
                v-if="scope.row.product_status"
                type="text"
                size="small"
                @click="changeProductStatus(scope.row, 0)"
              >下架</el-button>
              <el-button
                v-else
                type="text"
                size="small"
                @click="changeProductStatus(scope.row, 1)"
              >上架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- end 订单表格 -->

    <!-- start 分页 -->
    <el-row type="flex" style="margin: 20px 0" justify="center">
      <el-col :span="12">
        <el-pagination
          layout="total, prev, pager, next, jumper"
          :current-page="filterForm.page"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </el-row>
    <!-- end 分页 -->

    <!-- start 编辑商品对话框 -->
    <el-dialog title="编辑商品" :visible.sync="editDialogVisible" width="50%">
      <el-row type="flex" justify="center">
        <el-col :span="16" :xs="24">
          <el-form ref="form" :model="editForm" label-width="80px" label-position="left">
            <el-form-item label="商品名称">
              <el-input v-model="editForm.product_name" />
            </el-form-item>
            <el-form-item label="商品分类">
              <el-col :span="16">
                <el-select v-model="editForm.product_category" placeholder="请选择商品类别">
                  <el-option
                    v-for="(item, index) in categoryList"
                    :key="index"
                    :label="item.category_name"
                    :value="item.category_name"
                  />
                </el-select>
              </el-col>
            </el-form-item>
            <el-form-item label="商品价格">
              <el-input v-model="editForm.product_price">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品库存">
              <el-input v-model="editForm.product_stock" />
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input
                v-model="editForm.product_description"
                type="textarea"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitEdit">立即提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- end 编辑商品对话框 -->
  </div>
</template>

<script type="text/ecmascript-6">
import productApi from '../../api/product'

export default {
  components: {},
  data() {
    return {
      uploadUrl: 'http://127.0.0.1:8000/files/upload/',
      file: [],
      categoryList: [],
      tableData: [],
      // 编辑部分数据
      editDialogVisible: false,
      // 商品编辑表单
      editForm: {},
      formFields: [
        'product_name',
        'product_category',
        'product_price',
        'product_stock',
        'product_description',
        'product_id',
        'product_status'
      ],
      currentEditIndex: null,
      // 表格数据筛选表单
      filterForm: {
        product_name: '',
        product_category: '',
        create_time: '',
        modify_time: '',
        product_status: '',
        page: 1
      },
      total: 0
    }
  },

  watch: {
    tableData: {
      handler(val) {
        if (val.length === 0) {
          this.fetchProductList()
        }
      }
    }
  },

  created() {
    // 获取商品数据 获取商品种类
    Promise.all([
      productApi.fetchProductList({ page: 1 }),
      productApi.fetchProductCategory()
    ])
      .then(res => {
        console.log(res[0])
        this.$set(this, 'tableData', res[0].data['productList'])
        this.$set(this, 'total', res[0].data['productCount'])
        console.log('拉取表格数据完成')
        this.$set(this, 'categoryList', res[1].data['categoryList'])
        console.log('拉取分类数据完成')
        console.log('全部数据加载完成')
      })
      .catch(err => {
        console.log('数据拉取失败')
        console.log(err)
      })
  },

  methods: {
    // 表格筛选
    fetchProductList() {
      console.log(this.filterForm)
      productApi.fetchProductList(this.filterForm).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.$set(this, 'tableData', res.data['productList'])
          this.$set(this, 'total', res.data['productCount'])
        }
      })
    },
    // 编辑商品
    editProduct(row, index) {
      this.editDialogVisible = true
      this.currentEditIndex = index
      this.formFields.forEach(field => {
        this.$set(this.editForm, field, row[field])
      })
    },
    // 提交编辑
    submitEdit() {
      console.log('提交了', this.editForm)
      productApi.editProduct(this.editForm).then(res => {
        if (res.status === 200) {
          this.formFields.forEach(field => {
            this.$set(
              this.tableData[this.currentEditIndex],
              field,
              this.editForm[field]
            )
          })
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        }
      })
    },
    // 删除商品
    deleteProduct(row, index) {
      this.$confirm(`是否要删除ID为${row.product_id}的商品`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productApi.deleteProduct(row.product_id).then(res => {
          if (res.status === 200) {
            this.tableData.splice(index, 1)
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else if (res.status === 400) {
            this.$message({
              message: '不存在该商品',
              type: 'error'
            })
          }
        })
        console.log('删除了', row)
      })
    },

    // 商品上架或下架
    changeProductStatus(row, status) {
      this.formFields.forEach(field => {
        this.$set(this.editForm, field, row[field])
      })
      this.$set(this.editForm, 'product_status', status)
      console.log(this.editForm)
      console.log(`商品${row.product_id}`, status)
      productApi.editProduct(this.editForm).then(res => {
        if (res.status === 200) {
          this.$message({
            message: `${status ? '上架' : '下架'}成功`,
            type: 'success'
          })
          row.product_status = status
        } else {
          this.$message({
            message: '操作失败',
            type: 'error'
          })
        }
      })
    },

    // 当前页改变响应函数
    handleCurrentChange(val) {
      this.filterForm.page = val
      this.fetchProductList()
    }
  }
}
</script>

<style scoped>
#product > :first-child {
  margin-top: 30px;
}

.el-input__inner {
  width: 200px !important;
}
</style>
