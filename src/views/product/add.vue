<template>
  <div id="product-add">
    <!-- start 添加产品表单 -->
    <el-row type="flex" justify="start">
      <el-col
        :xs="20"
        :sm="20"
        :md="16"
        :lg="16"
        :xl="12"
        :push="1"
        style="margin-top: 30px"
      >
        <el-form ref="form" :model="productForm" label-width="80px" label-position="left">
          <el-form-item label="商品名称">
            <el-input v-model="productForm.product_name" />
          </el-form-item>
          <el-form-item label="商品分类">
            <el-col :span="16">
              <el-select v-model="productForm.product_category" placeholder="请选择商品类别">
                <el-option
                  v-for="(item, index) in categoryList"
                  :key="index"
                  :label="item.category_name"
                  :value="item.category_pinyin"
                />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-button type="text" @click="addCategoryDialog = true">添加分类</el-button>
            </el-col>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="productForm.product_price">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品库存">
            <el-input v-model="productForm.product_stock" />
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="productForm.product_status"
              active-value="1"
              inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"
            />
          </el-form-item>
          <el-form-item label="商品描述">
            <el-input
              v-model="productForm.product_description"
              type="textarea"
              maxlength="100"
              show-word-limit
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addProduct">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!-- end 添加产品表单 -->
    <!-- start 添加分类对话框 -->
    <el-dialog title="添加新分类" :visible.sync="addCategoryDialog">
      <el-form :model="categoryForm" label-width="80px" label-position="left">
        <el-form-item label="类别名称">
          <el-input v-model="categoryForm.category_name" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- end 添加分类对话框 -->
  </div>
</template>

<script type="text/ecmascript-6">
import productApi from '../../api/product'

export default {
  name: 'ProductAdd',
  components: {},
  data() {
    return {
      // 添加分类对话框
      addCategoryDialog: false,
      categoryList: [],
      productForm: {
        product_name: '商品123',
        product_price: '26.2',
        product_stock: 20,
        product_description: '这是商品123这是商品123这是商品123这是商品123',
        product_status: 0,
        product_category: 'naicha'
      },
      categoryForm: {
        category_name: ''
      }
    }
  },

  created() {
    productApi.fetchProductCategory().then((res) => {
      this.$set(this, 'categoryList', res.data['categoryList'])
      console.log('拉取分类数据完成')
    })
  },

  methods: {
    addProduct() {
      console.log(this.productForm)
      productApi.addProduct(this.productForm).then((res) => {
        if (res.status === 200) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          // this.productForm = {}
        } else {
          this.$message({
            message: '填写错误',
            type: 'error'
          })
        }
      })
    },
    addCategory() {}
  }
}
</script>

<style scoped>
.el-form {
  max-width: 500px;
}
</style>
