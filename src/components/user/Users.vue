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
            <el-input placeholder="请输入内容">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button>
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
              <el-switch v-model="scope.row.mg_state"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180px">
            <template ><!--slot-scope="scope"-->
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
    export default {
        data(){
          return{
            //获取用户参数对象
            queryInfo:{
              query:'',
              pagenum:1,
              pagesize:2
            },
            userlist:[],
            total:0
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
          }
      }
    }
</script>

<style scoped>

</style>
