<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!--卡片区域-->
      <el-card>
        <!--警告区域-->
        <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
        <!--商品分类选择区域-->
        <el-row class="cat_opt">
          <el-col>
            <span>选择商品分类：</span>
            <el-cascader v-model="selectCateKeys" :options="catelist" :props="cateProps" @change="handleChange"></el-cascader>
          </el-col>
        </el-row>
        <!--tag 页签区域-->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!--动态参数区域-->
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加参数</el-button>
            <!--动态参数表格-->
            <el-table :data="manyTableData" border stripe>
              <!--展开列-->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item,i) in scope.row.attr_vals"
                          :key="i" closable @close="handleClosed(i,scope.row)">{{item}}</el-tag>
                  <!--添加新标签-->
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                            size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <!--索引列-->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!--静态属性区域-->
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible=true">添加属性</el-button>
            <!--静态属性表格-->
            <el-table :data="onlyTableData" border stripe>
              <!--展开列-->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag v-for="(item,i) in scope.row.attr_vals"
                          :key="i" closable @close="handleClosed(i,scope.row)">{{item}}</el-tag>
                  <!--添加新标签-->
                  <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                            size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <!--索引列-->
              <el-table-column type="index"></el-table-column>
              <el-table-column label="属性名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeParams(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>

      <!--添加属性参数对话框-->
      <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParams">确 定</el-button>
        </span>
      </el-dialog>
      <!--编辑属性参数对话框-->
      <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  export default {
    data() {
      return {
        //商品分类
        catelist:[],
        //级联选择器props配置
        cateProps:{
          expandTrigger: 'hover',
          value:'cat_id',
          label:'cat_name',
          children:'children'
        },
        //选中分类的父级ID数组
        selectCateKeys:[],
        //被激活页签名称
        activeName:'many',
        //动态数据列表
        manyTableData:[],
        //静态数据列表
        onlyTableData:[],
        //控制添加属性对话框隐藏显示
        addDialogVisible:false,
        //添加参数表单数据对象
        addForm:{
          attr_name:''
        },
        //添加数据验证规则
        addFormRules: {
          attr_name:[
            {required:true,message:'请输入参数名称',trigger:'blur'}
          ]
        },
        //控制修改属性对话框隐藏显示
        editDialogVisible:false,
        //修改参数表单数据对象
        editForm:{},
        //修改数据验证规则
        editFormRules: {
          attr_name:[
            {required:true,message:'请输入参数名称',trigger:'blur'}
          ]
        }
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      //获取所有商品分类
      async getCateList(){
        const {data:res}=await this.$http.get('categories')
        if (res.meta.status!==200) return this.$message.error('获取商品分类失败！')
        this.catelist=res.data
      },
      //联级选择器改变事件
      async handleChange(){
        this.getParamsData()
      },
      //tab页签点击事件
      handleTabClick(){
        this.getParamsData()
      },
      //获取参数列表数据
      async getParamsData(){
        //判断选择的是不是三级分类
        if (this.selectCateKeys.length!==3){
          this.selectCateKeys=[]
          this.manyTableData=[]
          this.onlyTableData=[]
          return
        }
        //获取对应ID的参数和属性
        const {data:res}=await this.$http.get( `categories/${this.cateId}/attributes`,
          {params:{sel:this.activeName}})
        if (res.meta.status!==200) return this.$message.error('获取参数列表失败！')
        //将字符串分割成数组
        res.data.forEach(item=>{
          item.attr_vals=item.attr_vals ?
            item.attr_vals.split(' ') : []
          //控制输入框显示隐藏
          item.inputVisible=false
          //输入框默认数据
          item.inputValue=''
        })
        if ( this.activeName == 'many' ) this.manyTableData=res.data
        else this.onlyTableData=res.data
      },
      //关闭对话框重置
      addDialogClosed(){
        this.$refs.addFormRef.resetFields()
      },
      //对话框确定添加属性
      addParams(){
        //表单验证
        this.$refs.addFormRef.validate(async valid=>{
          if(!valid) return
          const {data:res}=await this.$http.post(`categories/${this.cateId}/attributes`,
            {attr_name:this.addForm.attr_name, attr_sel:this.activeName})
          if (res.meta.status!==201) return this.$message.error('添加参数失败！')
          this.$message.success('添加参数成功！')
          this.addDialogVisible=false
          this.getParamsData()
        })
      },
      //显示编辑参数对话框
      async showEditDialog(attr_id){
        const {data:res}=await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,
          {params:{attr_sel:this.activeName,}})
        if (res.meta.status!==200) return this.$message.error('获取参数失败！')
        this.editForm=res.data
        this.editDialogVisible=true
      },
      //关闭对话框重置
      editDialogClosed(){
        this.$refs.editFormRef.resetFields()
      },
      //对话框确定修改属性
      editParams(){
        //表单验证
        this.$refs.editFormRef.validate(async valid=>{
          if(!valid) return
          const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {attr_name:this.editForm.attr_name, attr_sel:this.activeName})
          if (res.meta.status!==200) return this.$message.error('修改参数失败！')
          this.$message.success('修改参数成功！')
          this.editDialogVisible=false
          this.getParamsData()
        })
      },
      //显示删除对话框
      async removeParams(attr_id){
        const confirmResult=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
        //用户取消了删除操作
        if (confirmResult !== 'confirm')
          return this.$message.info('用户取消了删除操作！')
        const {data:res}=await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if (res.meta.status!==200) return this.$message.error('修改参数失败！')
        this.$message.success('删除参数成功！')
        this.getParamsData()
      },
      //输入框标签  焦点事件
      handleInputConfirm(row){
        //如果输入内容为空文本则返回
        if (row.inputValue.trim().length===0){
          row.inputValue=''
          row.inputVisible=false
          return
        }
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue=''
        row.inputVisible=false
        //发起请求保存参数
        this.saveAttrVals(row)
      },
      //发起请求保存参数
      async saveAttrVals(row){
        const {data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
          {attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')})
        if (res.meta.status!==200) return this.$message.error('参数项修改失败！')
        this.$message.success('参数项修改成功！')
      },
      //显示input
      showInput(row){
        row.inputVisible=true
        //让文本框自动获得焦点
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //删除标签
      handleClosed(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrVals(row)
      }
    },
    computed:{
      //如果按钮禁用 返回true 否则false
      isBtnDisabled(){
        if (this.selectCateKeys.length!==3) return true
        return false
      },
      //当前选中的三级ID
      cateId(){
        if (this.selectCateKeys.length===3) return this.selectCateKeys[2]
        return null
      },
      //动态对话框标题
      titleText(){
        if (this.activeName==='many') return'动态参数'
        return '静态属性'
      }
    }
  }
</script>

<style lang="less" scoped>
.cat_opt{
  margin: 15px 0;
}

.el-tag{
  margin: 8px;
}

.input-new-tag{
  width: 120px;
}
</style>
