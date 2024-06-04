<template>
  <div class="app-container">
    <el-button type="text" @click="ShowAddUserDialog" size="small"
      >新增用户</el-button
    >

    <!-- 内容部分 -->

    <el-row>
      <el-col>
        <el-card
          v-loading="loadingBool"
          element-loading-background="rgba(250, 250, 250,0.9)"
        >
          <el-table
            ref="singleTable"
            :data="UserData"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%"
          >
          <el-table-column property="UserNo" label="登录账号" width="120">
             </el-table-column>
            <el-table-column property="UserName" label="用户名" width="120">
            </el-table-column>
            <el-table-column property="CreateDate" label="创建时间" width="250">
            </el-table-column>
            <el-table-column property="State" label="状态" width="80">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.State === 1 ? 'success' : 'error'"
                  disable-transitions
                  >{{ scope.row.State === 1 ? "启用" : "禁用" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column property="DeptID" label="诊室ID" width="350">
            </el-table-column>
            <el-table-column property="Role" label="角色"> </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="EditUser(scope.$index, scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="RemoveUser(scope.$index, scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            background
            @size-change="SizeChange"
            @prev-click.native="PagePrev"
            @current-change="PageChange"
            @next-click="PageNext"
            :current-page="1"
            :page-sizes="[5, 20, 30, 40]"
            :page-size="PageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="TotalCount"
          >
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增用户的弹窗 -->
    <el-dialog title="新增用户" :visible.sync="AddUserdialogVisible">
      <el-form
        :model="AddUser"
        :rules="AddUserRules"
        ref="AddForm"
        size="small "
      >
        <el-form-item label="账号" prop="UserNo" :label-width="formLabelWidth">
          <el-input
            placeholder="请输入账号"
            v-model="AddUser.UserNo"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input
            placeholder="请输入密码"
            v-model="AddUser.PassWord"
            show-password
          ></el-input>
        </el-form-item>

        <el-form-item
          label="用户名"
          prop="UserName"
          :label-width="formLabelWidth"
        >
          <el-input
            placeholder="请输入用户名"
            v-model="AddUser.UserName"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="State" :label-width="formLabelWidth">
          <el-radio v-model="AddUser.State" label="1" border size="medium"
            >启用</el-radio
          >
          <el-radio v-model="AddUser.State" label="0" border size="medium"
            >禁用</el-radio
          >
        </el-form-item>

        <el-row>
          <el-col :span="9">
            <el-form-item
              label="诊室"
              prop="DeptID"
              :label-width="formLabelWidth"
            >
              <el-cascader
                v-model="AddUser.DeptID"
                :options="DepartmentArry"
                :show-all-levels="false"
                @change="AddDeptChange"
                placeholder="请选择诊室"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="Role" label-width="80px">
              <el-select v-model="AddUser.RoleId" placeholder="请选择角色">
                <el-option
                  v-for="(item, index) in RoleArry"
                  :key="index"
                  :label="item.RoleName"
                  :value="item.RoleId"
                  :disabled="item.IsDelete"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="AddUserdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddUsers('AddForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户的弹窗 -->
    <el-dialog title="修改信息" :visible.sync="UpdateUserdialogVisible">
      <el-form
        :model="FromUser"
        :rules="EditorUserRules"
        ref="FromUser"
        size="small "
      >
        <el-form-item
          label="用户名"
          prop="UserName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="FromUser.UserName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="State" :label-width="formLabelWidth">
          <el-radio v-model="FromUser.State" label="1" border size="medium"
            >启用</el-radio
          >
          <el-radio v-model="FromUser.State" label="0" border size="medium"
            >禁用</el-radio
          >
        </el-form-item>

        <el-row>
          <el-col :span="9">
            <el-form-item
              label="诊室"
              prop="DeptID"
              :label-width="formLabelWidth"
            >
              <el-cascader
                v-model="FromUser.DeptID"
                :options="DepartmentArry"
                :show-all-levels="false"
                @change="EditorDeptChange"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="Role" label-width="80px">
              <el-select v-model="FromUser.RoleId" placeholder="请选择角色">
                <el-option
                  v-for="(item, index) in RoleArry"
                  :key="index"
                  :label="item.RoleName"
                  :value="item.RoleId"
                  :disabled="item.IsDelete"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="UpdateUserdialogVisible = false">取 消</el-button>
        <el-button type="danger" @click="ShowUpdatePassword('FromUser')"
          >修改密码</el-button
        >
        <el-button type="primary" @click="UpdateUser('FromUser')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="ShowUpdatePasswordVisible"
      width="40%"
      @close="ColseChangePwddialog"
    >
      <el-form :model="ChangePassWord" ref="ChangePwdForm" size="medium ">
        <!-- :rules="ChangePwdRules" -->
        <el-form-item label="用户名" label-width="80px">
          <el-input
            v-model="ChangePassWord.UserName"
            :disabled="true"
          ></el-input>
        </el-form-item>

        <el-form-item label="旧密码" label-width="80px" prop="OldPwd">
          <el-input v-model="ChangePassWord.OldPwd" show-password></el-input>
        </el-form-item>

        <el-form-item label="新密码" label-width="80px" prop="NewPwd">
          <el-input v-model="ChangePassWord.NewPwd" show-password></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ShowUpdatePasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="UpdatePassword('ChangePwdForm')"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from "element-ui";
export default {
  name: "UserManagement",
  data() {
    return {
      UserData: [],
      ChangePassWord: {
        UserNo: "",
        UserName: "",
        OldPwd: "",
        NewPwd: "",
      },
      ChangePwdRules: {
        OldPwd: [
          { required: true, message: "请输入旧密码", trigger: "change" },
        ],
        NewPwd: [
          { required: true, message: "请输入新密码", trigger: "change" },
        ],
      },
      AddUser: {
        UserNo: "",
        UserName: "",
        PassWord: "",
        State: "1",
        DeptID: "",
        RoleId: "",
      },
      FromUser: {
        UserName: "",
        DeptID: "",
        State: "",
        RoleId: "",
        UserNo: "",
      },
      EditorUserRules: {
        UserName: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        DeptID: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],

        RoleId: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],

        State: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      AddUserRules: {
        UserNo: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        PassWord: [
          {
            required: true,
            message: "此项不能为空",
            trigger: "change",
          },
        ],
        UserName: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        DeptID: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        RoleId: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
      },
      DepartmentArry: [], //诊室信息
      RoleArry: [], //角色信息
      UpdateUserdialogVisible: false, //控制修改用户的弹窗
      AddUserdialogVisible: false, //控制删除用户的弹窗
      ShowUpdatePasswordVisible: false, //控制修改密码的弹窗
      loadingBool: false,
      currentRow: null,
      PageIndex: 1,
      PageSize: 5,
      TotalCount: 0,
      formLabelWidth: "100px",
    };
  },

  methods: {
    //修密码
    UpdatePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("user/resetPassWord", this.ChangePassWord)
            .then((response) => {
              if (response == true) {
                this.$message({
                  message: "修改成功！",
                  type: "success",
                });
              }
              this.ShowUpdatePasswordVisible = false;
            })
            .catch((error) => {});
        } else {
          this.$message.error("修改错误！");
        }
      });
    },
    //修改密码弹窗
    ShowUpdatePassword() {
      this.ChangePassWord.UserNo = this.FromUser.UserNo;
      this.ChangePassWord.UserName = this.FromUser.UserName;
      this.ShowUpdatePasswordVisible = true;
    },
    ColseChangePwddialog() {
      this.ChangePassWord.OldPwd = "";
      this.ChangePassWord.NewPwd = "";
    },
    //选择诊室的更改事件 选出最后一次选择的诊室id
    EditorDeptChange(value) {
      this.FromUser.DeptID = value[1];
    },
    //选择诊室的更改事件 选出最后一次选择的诊室id
    AddDeptChange(value) {
      this.AddUser.DeptID = value[1];
    },
    //获取所有的角色信息
    GetAllRole() {
      this.$store
        .dispatch("role/getRole")
        .then((response) => {
          this.RoleArry = response;
        })
        .catch((error) => {
          Message.error("服务器错误！");
        });
    },

    //获取所有的诊室信息
    GetAllDepartment() {
      this.$store
        .dispatch("department/getAllDepartment")
        .then((response) => {
          this.DepartmentArry = response;
        })
        .catch((error) => {
          Message.error("服务器错误！");
        });
    },
    //修改用户信息
    UpdateUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("user/editorUser", this.FromUser)
            .then((response) => {
              this.PageInit(this.PageIndex, this.PageSize);
              this.$message({
                message: "修改成功！",
                type: "success",
              });
            })
            .catch((error) => {
              Message.error("服务器错误！");
            });

          //关闭弹窗
          this.UpdateUserdialogVisible = false;
        } else {
          this.$message.error("修改错误!");
          return false;
        }
      });
    },

    //新增用户
    AddUsers(formName) {
      console.log("新增用户", this.AddUser);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("user/addUser", this.AddUser)
            .then((response) => {
              this.PageInit(this.PageIndex, this.PageSize);
              this.$message({
                message: "新增成功！",
                type: "success",
              });
              this.AddUserdialogVisible = false;
            })
            .catch((error) => {
              this.$message.error(error.message);
            });
        } else {
          this.$message.error("无法新增!");
          return false;
        }
      });
    },

    //弹出新增用户界面
    ShowAddUserDialog() {
      //如果有诊室数据 那么就用vuex里的 没有数据我就去后端请求
      if (this.DepartmentArry.length <= 0) this.GetAllDepartment();
      //如果有角色数据 那么就是用vuex里的 没有数据我就去后端请求
      if (this.RoleArry.length <= 0) this.GetAllRole();
      this.AddUserdialogVisible = true;
    },

    //弹出修改界面
    EditUser(index, row) {
      //如果有诊室数据 那么就用vuex里的 没有数据我就去后端请求
      if (this.DepartmentArry.length <= 0) this.GetAllDepartment();
      //如果有角色数据 那么就是用vuex里的 没有数据我就去后端请求
      if (this.RoleArry.length <= 0) this.GetAllRole();

      //赋默认值
      this.UpdateUserdialogVisible = true;
      this.FromUser.UserName = row.UserName;
      this.FromUser.State = row.State.toString();
      this.FromUser.DeptID = row.DeptID;
      this.FromUser.RoleId = row.RoleId;
      this.FromUser.UserNo = row.UserNo;
    },

    //删除用户
    RemoveUser(index, row) {
      this.$confirm("是否删除此用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("user/removeUser", row.UserNo)
            .then((response) => {
              this.PageInit(this.PageIndex, this.PageSize);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            })
            .catch((error) => {
              this.$message.error("删除错误，服务器错误，无法删除该用户！");
            });
        })
        .catch((error) => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //点击表格的事件
    handleCurrentChange() {},
    //初始用户数据
    PageInit(pageindex, pagesize) {
      this.loadingBool = true;
      this.$store
        .dispatch("user/getAllUser", { pageindex, pagesize })
        .then((response) => {
           console.log(response);
          this.UserData = response.data;
          this.TotalCount = response.pageInfo.totalCount;
          this.loadingBool = false;
        })
        .catch(() => {
          this.loadingBool = false;
        });
    },
    //PageSize 改变
    SizeChange(Size) {
      this.PageSize = Size;
      this.PageInit(this.PageIndex, this.PageSize);
    },
    //上一页点击事件
    PagePrev(index) {
      this.PageIndex = index;
      this.PageInit(this.PageIndex, this.PageSize);
    },
    //点击下面的页码事件
    PageChange(index) {
      this.PageIndex = index;
      this.PageInit(this.PageIndex, this.PageSize);
    },
    //下一页点击事件
    PageNext(index) {
      this.PageIndex = index;
      this.PageInit(this.PageIndex, this.PageSize);
    },
  },
  mounted() {
    //初始化数据
    this.PageInit(this.PageIndex, this.PageSize);
  },
};
</script>

<style>
</style>