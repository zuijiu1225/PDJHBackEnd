<template>
  <div class="app-container">
    <el-button type="text" @click="ShowdialogAddVisible" size="small"
      >新增诊室</el-button
    >
    <el-row>
      <el-col>
        <el-card>
          <el-table
            v-loading="loadingBool"
            :data="DeptData"
            style="width: 100%; margin-bottom: 20px"
            row-key="ID"
            border
            default-expand-all
            :tree-props="{ children: 'children' }"
          >
            <el-table-column prop="ID" label="ID" sortable width="280">
            </el-table-column>
            <el-table-column type="index" label="序号" sortable width="50">
            </el-table-column>
            <el-table-column prop="Name" label="诊室名称" width="180">
            </el-table-column>
             <el-table-column prop="MacAddr" label="Mac地址" width="180">
            </el-table-column>
            <el-table-column prop="IPAddr" label="IP地址" width="180">
            </el-table-column>
            <el-table-column prop="State" label="状态" width="180">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.State === 1 ? 'success' : 'error'"
                  disable-transitions
                  >{{ scope.row.State === 1 ? "启用" : "关闭" }}</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column prop="Queue" label="队列类别"> </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="ShowEditDept(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="RemoveDept(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 编辑诊室信息 -->
    <el-dialog
      title="编辑诊室"
      :visible.sync="dialogEditorVisible"
      width="40%"
      @close="dialogEditorVisibleClose"
    >
      <el-form
        ref="EditorDept"
        :rules="EditorRules"
        :model="EditorDept"
        label-width="80px"
      >
        <el-form-item label="诊室名称" prop="Name">
          <el-input v-model="EditorDept.Name"></el-input>
        </el-form-item>
        <el-form-item label="Mac地址" prop="MacAddr">
          <el-input v-model="EditorDept.MacAddr"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="IPAddr">
          <el-input v-model="EditorDept.IPAddr"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="State">
          <el-radio v-model="EditorDept.State" label="1" border size="medium"
            >启用</el-radio
          >
          <el-radio v-model="EditorDept.State" label="0" border size="medium"
            >关闭</el-radio
          >
        </el-form-item>

        <el-form-item label="队列类别" prop="Queue" v-show="QueueisShow">
          <el-input v-model="EditorDept.Queue"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditorVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditorDepts('EditorDept')"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 新增诊室 -->
    <el-dialog
      title="新增诊室"
      :visible.sync="dialogAddVisible"
      width="40%"
      @close="dialogAddVisibleClose"
    >
      <el-form
        :model="AddDept"
        :rules="AddDeptRules"
        ref="AddDeptForm"
        label-width="80px"
      >
        <el-form-item label="诊室名" prop="Name">
          <el-input v-model="AddDept.Name"></el-input>
        </el-form-item>
<el-form-item label="Mac地址" prop="MacAddr">
          <el-input v-model="AddDept.MacAddr"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" prop="IPAddr">
          <el-input v-model="AddDept.IPAddr"></el-input>
        </el-form-item>
        <el-form-item label="诊室级别" prop="DeptID">
          <el-cascader
            v-model="AddDept.DeptID"
            :options="DepartmentArry"
            :show-all-levels="true"
            :props="{ checkStrictly: true }"
            @change="AddDeptChange"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="状态" prop="State">
          <el-radio v-model="AddDept.State" label="1" border size="medium"
            >启用</el-radio
          >
          <el-radio v-model="AddDept.State" label="0" border size="medium"
            >禁用</el-radio
          >
        </el-form-item>

        <el-form-item label="队列" v-show="QueueisShow" prop="Queue">
          <el-input v-model="AddDept.Queue"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddDeparts('AddDeptForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DeptManages",
  data() {
    return {
      QueueisShow: false,
      loadingBool: false,
      QueueisShow: false,
      AddDept: {
        Name: "",
        Type: "",
        DeptID: "",
        State: "1",
        FatherID: "",
        Queue: "",
        MacAddr:"",
        IPAddr:""
      },
      AddDeptRules: {
        Name: [{ required: true, message: "此项不能为空", tigger: "change" }],
        DeptID: [{ required: true, message: "此项不能为空", tigger: "change" }],
        State: [{ required: true, message: "此项不能为空", tigger: "change" }],
        Queue: [{ required: true, message: "此项不能为空", tigger: "change" }],
      },
      EditorDept: {
        ID: "",
        Name: "",
        State: "0",
        Queue: " ",
        MacAddr:"",
        IPAddr:""
      },
      EditorRules: {
        Name: [{ required: true, message: "此项不能为空", tigger: "change" }],
        State: [{ required: true, message: "此项不能为空", tigger: "change" }],
        Queue: [{ required: true, message: "此项不能为空", tigger: "change" }],
      },
      DeptData: [],
      DepartmentArry: [],
      dialogEditorVisible: false,
      dialogAddVisible: false,
    };
  },
  methods: {
    //新增诊室
    AddDeparts(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("department/createDepartment", this.AddDept)
            .then((response) => {
              if (response) {
                this.$message({
                  type: "success",
                  message: "新增成功！",
                });
                this.GetDept();
                this.GetAllDepartment();
                this.dialogAddVisible = false;
              }
            })
            .catch((error) => {
              this.$message.error("新增失败");
            });
        } else {
          this.$message.error("修改错误!");
          return false;
        }
      });
    },
    //弹出新增诊室界面
    ShowdialogAddVisible() {
      this.dialogAddVisible = true;
    },
    //新增界面诊室下拉框值改变事件
    AddDeptChange(value) {
      if (value) {
        if (value.length == 1) {
          if (value == "true") {
            this.AddDept.Queue = null;
            this.AddDept.Type = "1";
            this.AddDept.DeptID = value[0];
            this.AddDept.FatherID = null;
            this.QueueisShow = true;
          } else {
            this.AddDept.DeptID = value[0];
            this.AddDept.FatherID = value[0];
            this.AddDept.Type = "2";
            this.AddDept.Queue = "song";
            this.QueueisShow = false;
          }
        } else {
          if (value.length > 1) {
            this.QueueisShow = false;
            this.AddDept.Queue = "song";
            this.AddDept.Type = "2";
            this.AddDept.DeptID = value[value.length - 1];
            this.AddDept.FatherID = value[value.length - 1];
          } else if (value.length == 0) {
            this.QueueisShow = false;
          }
        }
      }
    },
    //弹出修改诊室界面
    ShowEditDept(row) {
      if (row.Type == 1) {
        //能不能修改队列
        // this.QueueisShow = true;
        this.EditorDept.Queue = row.Queue;
      }
      this.EditorDept.ID = row.ID;
      this.EditorDept.Name = row.Name;
      this.EditorDept.State = row.State.toString();
      this.EditorDept.MacAddr=row.MacAddr;
      this.dialogEditorVisible = true;
    },
    //新增诊室弹窗关闭事件
    dialogAddVisibleClose() {
      this.AddDept.Name = "";
      this.AddDept.Type = "";
      this.AddDept.DeptID = "";
      this.AddDept.State = "1";
      this.AddDept.FatherID = "";
      this.AddDept.Queue = "";
    },
    //修改诊室弹窗关闭事件
    dialogEditorVisibleClose() {
      this.QueueisShow = false;
      this.EditorDept.Queue = " ";
    },
    //修改诊室信息
    EditorDepts(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$store
            .dispatch("department/editorDepartment", this.EditorDept)
            .then((response) => {
              if (response == true) {
                this.$message({
                  type: "success",
                  message: "修改成功！",
                });
                this.GetAllDepartment();
                this.RefreshDept();

                this.dialogEditorVisible = false;
              }
            })
            .catch((error) => {});
        } else {
          this.$message.error("修改错误!");
          return false;
        }
      });
    },
    //修改成功诊室信息 要刷新一遍 联级下拉框的值
    RefreshDept() {
      this.$store
        .dispatch("department/getAllDepartment")
        .then((response) => {
          //刷新患者队列里的诊室信息
          this.$Bus.$emit("RefreshDept", response);
        })
        .catch((error) => {
          Message.error("服务器错误！");
        });
    },
    //获取诊室信息 用于联级下拉框
    GetDept() {
      this.$store
        .dispatch("department/getAllDepartment")
        .then((response) => {
          this.DepartmentArry = response;
          this.DepartmentArry.filter((item) => {
            if (item.children.length == 0) {
              this.$delete(item, "children");
            }
          });
          this.DepartmentArry.unshift({
            label: "一级诊室",
            value: "true",
          });
        })
        .catch((error) => {});
    },
    //删除诊室
    RemoveDept(row) {
      var titletip = "";
      if (row.Type == 1) {
        if (row.children && row.children.length > 0) {
          titletip = `您确定要删除${row.Name}和旗下的所有分室吗？`;
        } else {
          titletip = `您确定要删除${row.Name}吗？`;
        }
      } else titletip = `您确定要删除${row.Name}吗？`;

      this.$confirm(titletip, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("department/removeDepartments", row.ID)
            .then((response) => {
              if (response == true) {
                this.$message({
                  type: "success",
                  message: "删除成功",
                });
                this.GetDept();
                this.GetAllDepartment();
                this.RefreshDept();
              }
            })
            .catch((error) => {
              this.$message.error("删除失败！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //获取所有诊室信息
    GetAllDepartment() {
      this.loadingBool = true;
      this.$store
        .dispatch("department/getAllDepartment2")
        .then((response) => {
          this.DeptData = response;
          this.loadingBool = false;
        })
        .catch((error) => {
          this.loadingBool = false;
        });
    },
  },
  mounted() {
    this.GetAllDepartment();
    this.GetDept();
  },
};
</script>

<style>
</style>