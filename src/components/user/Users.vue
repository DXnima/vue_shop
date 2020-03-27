<template>
    <div>
      <!--面包屑导航区域-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!--卡片区域-->
      <el-card>
        <!--搜索区域-->
        <el-row :gutter="20">
          <el-col :span="10">
            <!--搜索区域-->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!--表格数据区域-->
        <el-table :data="userlist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态" prop="mg_state">
            <template slot-scope="scope">
              <!--scope.row获取对应行的数据-->
              <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--分页区域-->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <!--弹窗区域 添加用户对话框-->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
        <!--内容主体区域-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!--底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!--弹窗区域 修改用户信息-->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
    export default {
      //数据绑定
        data(){
          //验证邮箱自定义规则
          var checkEmail=(rule,value,cd)=>{
            const regEmail= /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
            if (regEmail.test(value)){
              return cd()
            }
            cd(new Error('请输入合法邮箱'))
          }
          //验证手机号自定义规则
          var checkMobile=(rule,value,cd)=>{
            const regMoblie=/^[1][3,4,5,7,8][0-9]{9}$/
            if (regMoblie.test(value)){
              return cd()
            }
            cd(new Error('请输入合法手机号'))
          }
          return{
            //获取用户参数对象
            queryInfo:{
              query:'',
              pagenum:1,
              pagesize:2
            },
            userlist:[],
            total:0,
            //控制用户添加弹窗开关
            addDialogVisible:false,
            //控制修改用户弹窗开关
            editDialogVisible:false,
            // 添加用户的表单数据
            addForm:{
              username:'',
              password:'',
              email:'',
              mobile:''
            },
            //添加用户表单验证规则
            addFormRules:{
              username:[
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 3, max: 15, message: '长度在 3~15 之间', trigger: 'blur' }
              ],
              //验证密码规则
              password:[
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 6, max: 15, message: '密码长度在 3~15 之间', trigger: 'blur' }
              ],
              //验证邮箱规则
              email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator:checkEmail,trigger: 'blur'}
              ],
              //验证手机规则
              mobile:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator:checkMobile,trigger: 'blur'}
              ]
            },
            //查询用户信息
            editForm:{},
            //修改用户表单验证规则
            editFormRules:{
              //验证邮箱规则
              email:[
                { required: true, message: '请输入邮箱', trigger: 'blur' },
                { validator:checkEmail,trigger: 'blur'}
              ],
              //验证手机规则
              mobile:[
                { required: true, message: '请输入手机号', trigger: 'blur' },
                { validator:checkMobile,trigger: 'blur'}
              ]
            }
          }
        },
      created() {
          this.getUserList()
      },
      methods:{
        async getUserList() {
            const {data:res}=await this.$http.get('users',{params:this.queryInfo})
            if (res.meta.status !==200) return this.$message.error('获取列表失败！')
            this.userlist=res.data.users
            this.total=res.data.total
          },
        //监听pagesize事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize
            this.getUserList()
        },
        //监听页码值改变事件
        handleCurrentChange(newPage){
            this.queryInfo.pagenum=newPage
            this.getUserList()
        },
        //监听switch开关状态改变
        async userStateChange(userInfo){
          const {data:res} = await this.$http.put( `users/${userInfo.id}/state/${userInfo.mg_state}`)
          if (res.meta.status !==200) {
            userInfo.mg_state=!userInfo.mg_state
            return this.$message.error('更新用户状态失败！')
          }
          this.$message.success('更新用户状态成功！')
        },
        //监听添加用户对话框关闭事件
        addDialogClosed() {
          this.$refs.addFormRef.resetFields()
        },
        //点击按钮添加新用户
        addUser() {
          this.$refs.addFormRef.validate(async valid=>{
            if (!valid) return
            //添加用户网络请求
            const {data:res}=await this.$http.post('users',this.addForm)
            if (res.meta.status !==201) return this.$message.error('添加用户失败！')
            this.$message.success('添加用户成功！')
            //关闭窗口
            this.addDialogVisible=false
            //刷新列表
            this.getUserList()
          })
        },
        //展示编辑用户的对话框
        async showEditDialog(row){
          const{data:res} =await this.$http.get('users/'+row.id)
          if (res.meta.status !==200) this.$message.error('查询用户信息失败！')
          this.editForm=res.data
          this.editDialogVisible=true
        },
        //监听编辑用户对话框关闭事件
        editDialogClosed() {
          this.$refs.editFormRef.resetFields()
        },
        //点击确定提交修改信息
        editUserInfo() {
          this.$refs.editFormRef.validate(async valid=>{
            if (!valid) return
            //发起修改用户请求
           const {data:res}=await this.$http.put('users/'+ this.editForm.id,{
              email:this.editForm.email,mobile:this.editForm.mobile
            })
            if (res.meta.status!==200) return this.$message.error('更新用户信息失败！')
            //关闭对话框
            this.editDialogVisible=false
            //刷新数据表
            this.getUserList()
            //提示成功
            this.$message.success('更新用户信息成功！')
          })
        },
        //根据ID删除对应用户
        async removeUserById(id) {
          const confirmResult=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err=>err)
          //用户确认删除 返回字符串 confirm
          //用户取消删除 返回字符串 cancel
          if (confirmResult !== 'confirm') return this.$message.info('用户已经取消删除！')
          const {data:res}=await this.$http.delete('users/' +id)
          if (res.meta.status!==200) return this.$message.error('删除用户失败！')
          this.getUserList()
          this.$message.success('用户已经确认删除！')
        }
      }
    }
</script>

<style scoped>

</style>
