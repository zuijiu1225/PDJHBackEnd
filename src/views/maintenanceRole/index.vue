<template>
  <div class="app-container">
    <el-button type="text" @click.native="ShowCreateOrEditor" size="small"
      >新增角色</el-button
    >

    <!-- 内容部分  -->
    <el-card>
      <el-row>
        <el-col :span="16">
          <el-table
            :data="Roles"
            border
            @row-click="GetPermission"
            style="width: 100%"
          >
            <el-table-column prop="RoleName" label="角色名称" width="120">
            </el-table-column>
            <el-table-column prop="IsDelete" label="状态" width="120">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.IsDelete === false ? 'success' : 'error'"
                  disable-transitions
                  >{{ scope.row.IsDelete == false ? "启用" : "禁用" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="CreateDateTime" label="创建时间">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click.native="ShowEditorRole(scope.$index, scope.row)"
                >
                </el-button>

                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click.native="RemoveRole(scope.row)"
                >
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>

        <el-col :span="8">
          <div class="permission-div">
            <el-row>
              <el-col :span="12">
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="commitdisabled"
                  @click="CommitPermission()"
                >
                  <span>
                    保存权限
                    <i class="el-icon-upload el-icon--right"></i>
                  </span>
                </el-button>
              </el-col>
            </el-row>
          </div>
          <!-- 权限目录树 -->
          <div class="permission-tree">
            <el-tree
              :data="Pagedata"
              show-checkbox
              check-strictly
              node-key="id"
              ref="tree"
              v-loading="loadingBool"
              :default-expand-all="true"
              :default-checked-keys="checkedkeys"
              :props="defaultProps"
            >
            </el-tree>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 点击修改的弹窗 -->
    <el-dialog
      :title="CreateOrEditorTile"
      :visible.sync="CreateOrEditordialogVisible"
      @close="CreateOrEditorColose"
    >
      <el-form
        :model="EditorRole"
        label-position="right"
        :rules="rules"
        ref="form"
        size="small"
      >
        <el-form-item
          label="角色名称"
          prop="RoleName"
          :label-width="formLabelWidth"
        >
          <el-input v-model="EditorRole.RoleName"></el-input>
        </el-form-item>

        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-radio v-model="EditorRole.IsDelete" label="0" border size="medium"
            >启用</el-radio
          >
          <el-radio v-model="EditorRole.IsDelete" label="1" border size="medium"
            >禁用</el-radio
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="CreateOrEditordialogVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click.native="EditorRoles('form')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RoleMaintenance",
  data() {
    return {
      checkedkeys: [],
      Roles: [],
      RoleId: "",
      CreateOrEditordialogVisible: false,
      AdddialogVisible: false,
      commitdisabled: false,
      loadingBool: false,
      CreateOrEditorTile: "？",
      CreateOrEditor: false, //为true 新增 为false 修改
      formLabelWidth: "100px",
      EditorRole: {
        RoleId: "",
        RoleName: "",
        IsDelete: "1",
      },
      rules: {
        RoleName: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
      },

      Pagedata: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    //获取角色
    GetRole() {
      this.$store
        .dispatch("role/getRole")
        .then((response) => {
          response.filter((item) => {
            item.CreateDateTime = item.CreateDateTime.replace("T", " ");
          });
          this.Roles = response;
        })
        .catch((error) => {
          this.$message.error("服务器错误，无法获取角色信息！");
        });
    },
    //删除角色
    RemoveRole(row) {
      this.$confirm(`确定要删除${row.RoleName}角色？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("role/romoveRole", row.RoleId)
            .then((response) => {
              if (response == true) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.GetRole();
              } else {
                this.$message.error("删除失败！");
              }
            })
            .catch((error) => {
              this.$message.error("服务器错误，无法删除角色!");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //获取菜单数据 用于权限目录树
    GetPage() {
      this.loadingBool = true;
      this.$store
        .dispatch("page/getPage3")
        .then((response) => {
          this.Pagedata = response;
          this.loadingBool = false;
        })
        .catch((error) => {
          this.$message.error("无法加载权限目录树！");
          this.loadingBool = false;
        });
    },
    //保存权限
    CommitPermission() {
      if (this.RoleId && this.RoleId != "") {
        this.commitdisabled = true;
        this.loadingBool = true;

        var Parent = this.$refs.tree.getHalfCheckedKeys();

        var Son = this.$refs.tree.getCheckedKeys();

        Parent = Parent.concat(Son);

        this.$store
          .dispatch("role/commitPermission", {
            Pages: Parent,
            RoleId: this.RoleId,
          })
          .then((response) => {
            if (response == true) {
              this.$message({
                type: "success",
                message: "保存成功！",
              });
              this.commitdisabled = false;
              this.loadingBool = false;
              this.$store.dispatch("user/getInfo");
            }
          })
          .catch((error) => {
            this.commitdisabled = false;
            this.loadingBool = false;
            this.$message.error("保存失败！");
          });
      } else {
        this.$message({
          type: "warning",
          message: "请选择一个角色",
        });
      }
    },
    //每一行的点击事件
    GetPermission(row) {
      this.RoleId = row.RoleId;
      this.loadingBool = true;
      this.$store
        .dispatch("role/getPermission", row.RoleId)
        .then((response) => {
          this.$refs.tree.setCheckedKeys([]);
          this.checkedkeys = response;
          this.loadingBool = false;
        })
        .catch((error) => {
          this.$message.error(`无法获取${row.RoleName}的权限!`);
          this.loadingBool = false;
        });
    },
    //新增修改窗体关闭事件
    CreateOrEditorColose() {
      this.EditorRole.RoleName = "";
      this.EditorRole.IsDelete = "0";
    },
    //弹出新增窗体
    ShowCreateOrEditor() {
      this.CreateOrEditorTile = "新增角色";
      this.CreateOrEditor = true;
      this.CreateOrEditordialogVisible = true;
    },
    //弹出修改角色窗体
    ShowEditorRole(index, row) {
      this.CreateOrEditorTile = "修改角色";
      this.CreateOrEditor = false;
      this.EditorRole.RoleId = row.RoleId;
      this.EditorRole.RoleName = row.RoleName;
      this.EditorRole.IsDelete = row.IsDelete == false ? "0" : "1";
      this.CreateOrEditordialogVisible = true;
    },
    CreateRole() {},
    //新增/修改
    EditorRoles(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.CreateOrEditor) {
            this.Create();
          } else {
            this.Editor();
          }
        } else {
          this.$message.error("修改错误！");
          return false;
        }
      });
    },
    Create() {
      this.$store
        .dispatch("role/createRole", this.EditorRole)
        .then((response) => {
          if (response == true) {
            this.CreateOrEditordialogVisible = false;
            this.$message({
              message: "新增成功！",
              type: "success",
            });
            this.GetRole();
          } else {
            this.$message.error("新增失败！");
          }
        })
        .catch((error) => {
          this.$message.error("服务器错误，无法新增角色!");
        });
    },
    Editor() {
      this.$store
        .dispatch("role/editorRole", this.EditorRole)
        .then((response) => {
          if (response == true) {
            this.CreateOrEditordialogVisible = false;
            this.$message({
              message: "修改成功！",
              type: "success",
            });
            this.GetRole();
          } else {
            this.$message.error("修改失败！");
          }
        })
        .catch((error) => {
          this.$message.error("服务器错误，无法修改角色信息!");
        });
    },
    Init() {
      if (
        this.$store.state.role.RoleArry &&
        this.$store.state.role.RoleArry.length > 0
      ) {
        this.Roles = this.$store.state.role.RoleArry;
      } else {
        this.GetRole();
      }

      if (
        this.$store.state.page.PageMenuArry3 &&
        this.$store.state.page.PageMenuArry3.length > 0
      ) {
        this.Pagedata = this.$store.state.page.PageMenuArry3;
      } else {
        this.GetPage();
      }
    },
  },
  mounted() {
    this.Init();
  },
};
</script>

<style scoped>
.permission-div {
  padding-left: 10px;
}
.permission-tree {
  padding-left: 10px;
}
</style>