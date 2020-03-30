<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片区域-->
    <el-card>
      <!--添加角色按钮区域-->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false"
                  show-index index-text="" border :show-row-hover="false" class="treeTable">
        <!--是否有效 模版列-->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!--排序 模版列-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!--操作 模版列-->
        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!--添加分类对话框-->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed">
      <!--添加分类表单-->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!--options指定数据源-->
          <el-cascader v-model="selectKeys" :options="parentCateList" clearable
                       :props="cascaderProps" @change="parentCascaderChanged">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      data(){
        return {
          //查询条件
          querInfo: {
            type: 3,
            pagenum: 1,
            pagesize: 5
          },
          //商品分类数据列表
          catelist: [],
          //总数据条数
          total: 0,
          //treetable 列属性
          columns: [
            {label: '分类名称', prop: 'cat_name'},
            {
              label: '是否有效',
              //当前列定义为模版列
              type: 'template', template: 'isok'
            },
            {
              label: '排序',
              //当前列定义为模版列
              type: 'template', template: 'order'
            },
            {
              label: '操作',
              //当前列定义为模版列
              type: 'template', template: 'opt'
            }
          ],
          //添加用户对话框显示与隐藏
          addCateDialogVisible: false,
          //添加分类表单数据
          addCateForm: {
            //分类父级id
            cat_pid:0,
            //分类名称
            cat_name: '',
            //分类等级
            cat_level:0
          },
          //添加分类表单的规则
          addCateFormRules: {
            cat_name: [
              {required:true,message:'请输入分类名称',trigger:'blur'}
            ]
          },
          //父级分类的列表
          parentCateList:[],
          //指定级联选择器的配置对象
          cascaderProps:{
            expandTrigger: 'hover',
            checkStrictly:true,
            value:'cat_id',
            label:'cat_name',
            children:'children'
          },
          //选中分类的父级ID数组
          selectKeys:[]
        }
      },
      created() {
        this.getCateList()
      },
      methods:{
        //获取商品分类数据
        async getCateList(){
          const {data:res}=await this.$http.get('categories',{params:this.querInfo})
          if (res.meta.status!==200) return this.$message.error('商品分类数据获取失败！')
          this.catelist=res.data.result
          this.total=res.data.total
        },
        //监听pagesize改变事件
        handleSizeChange(newSize){
          this.querInfo.pagesize=newSize
          this.getCateList()
        },
        //监听页码值改变
        handleCurrentChange(newPage){
          this.querInfo.pagenum=newPage
          this.getCateList()
        },
        //添加分类对话框
        showAddCateDialog(){
          this.getParentCateList()
          this.addCateDialogVisible=true
        },
        //获取父级分类
        async getParentCateList(){
          const {data:res}=await this.$http.get('categories',{params:{type:2}})
          if (res.meta.status!==200) return this.$message.error('商品分类数据获取失败！')
          this.parentCateList=res.data
        },
        //联级选择器发生改变事件
        parentCascaderChanged(){
          //判断父级ID是否被选中 如果选中就去最后一个选中的ID
          if (this.selectKeys.length>0){
            //为当前分类 父级ID赋值
            this.addCateForm.cat_pid= this.selectKeys[this.selectKeys.length-1]
            //为当前分类等级赋值
            this.addCateForm.cat_level=this.selectKeys.length
            return
          }else {
            //为当前分类 父级ID赋值
            this.addCateForm.cat_pid= 0
            //为当前分类等级赋值
            this.addCateForm.cat_level=0
          }
        },
        //添加分类发起请求
        addCate(){
          this.$refs.addCateFormRef.validate(async valid=>{
            if (!valid) return
            const {data:res}=await this.$http.post('categories',this.addCateForm)
            if (res.meta.status!==201) return this.$message.error('商品分类添加失败！')
            this.$message.success('分类添加成功！')
            this.getCateList()
            this.addCateDialogVisible=false
          })
        },
        //关闭添加分类对话框 重置
        addCateDialogClosed(){
          this.$refs.addCateFormRef.resetFields()
          this.selectKeys=[]
          this.addCateForm.cat_level=0
          this.addCateForm.cat_pid=0
        }
      }
    }
</script>

<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}

.el-cascader{
  width: 100%;
}
</style>
