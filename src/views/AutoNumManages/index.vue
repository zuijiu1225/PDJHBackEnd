<template>
  <div class="app-container">
    <el-row>
      <el-button type="text" @click.native="ShowCreatedialog" size="small"
        >新增序列</el-button
      >
      <el-card>
        <!-- 条件搜索区域 -->
        <el-row>
          <el-form :model="Seach">
            <el-col :span="4"> </el-col>
          </el-form>
        </el-row>
        <!-- 内容区域 -->
        <el-row>
          <el-table
            :data="CallAutoNumData"
            height="400"
            border
            :stripe="true"
            style="width: 100%"
            v-loading="loadingBool"
          >
            <el-table-column prop="GID" label="Gid" width="290">
            </el-table-column>
            <el-table-column prop="Code" label="队列类别" width="100">
            </el-table-column>
            <el-table-column prop="DID" label="诊室ID" width="290">
            </el-table-column>
            <el-table-column prop="Name" label="诊室名" width="180">
            </el-table-column>
            <el-table-column prop="AutoDate" label="排队时间" width="180">
            </el-table-column>
            <el-table-column prop="TypeA" label="急诊序列号" width="100">
            </el-table-column>
            <el-table-column prop="TypeB" label="优先序列号" width="100">
            </el-table-column>
            <el-table-column prop="TypeC" label="普通序列号" width="100">
            </el-table-column>
            <el-table-column prop="InitNum" label="序号种子" width="100">
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="130">
              <template slot-scope="scope">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="编辑"
                  placement="top-start"
                >
                  <i
                    class="el-icon-edit"
                    style="font-size: 25px; color: #409eff; margin: 0px 10px"
                    @click="ShowEditordialog(scope.row)"
                  ></i>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="删除"
                  placement="top-start"
                >
                  <i
                    class="el-icon-delete"
                    style="font-size: 25px; color: red; margin: 0px 10px"
                    @click="RemoveAutoNum(scope.row)"
                  ></i>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <!-- <el-pagination
            @size-change="SizeChange"
            @prev-click.native="PagePrev"
            @next-click="PageNext"
            @current-change="CurrentChange"
            background
            :current-page="1"
            :page-sizes="[5, 10, 20, 30]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
          >
          </el-pagination> -->
        </el-row>

        <!-- 新增/修改 -->
        <el-dialog
          :title="CreateOrEditorTitle"
          :visible.sync="dialogCreateOrEditorVisible"
          @close="dialogCreateOrEditorColse"
        >
          <el-form
            :model="Editor"
            label-position="right"
            ref="editorForm"
            size="small"
            :rules="editorRules"
            label-width="110px"
          >
            <el-form-item label="诊室" prop="DeptID">
              <el-cascader
                :disabled="CreateOrEditordisabled"
                v-model="Editor.DeptID"
                :props="{ emitPath: false }"
                :options="DepartmentArry"
                :show-all-levels="false"
              ></el-cascader>
            </el-form-item>

            <el-form-item label="排队时间" prop="AutoDate">
              <el-date-picker
                v-model="Editor.AutoDate"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="序号种子" prop="AutoDate">
              <el-input
                style="width: 100px"
                v-model="Editor.InitNum"
              ></el-input>
              <span style="color: red; font-size: 16px"
                >(原有队列序号会加上这个数字)</span
              >
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="急诊队列序号" prop="TypeA">
                  <el-input v-model="Editor.TypeA"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="优先队列序号" prop="TypeB">
                  <el-input v-model="Editor.TypeB"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item label="普通队列序号" prop="TypeC">
                  <el-input v-model="Editor.TypeC"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCreateOrEditorVisible = false"
              >取 消</el-button
            >
            <el-button
              type="primary"
              @click="CreateOrEditorAutoNum('editorForm')"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "AutoNumManages",
  data() {
    return {
      Seach: {
        Name: "",
      },
      CreateOrEditorTitle: "",
      CreateOrEditordisabled: false,
      CreateOrEditor: false, //为true新增 为false修改
      Editor: {
        GID: "",
        DeptID: "",
        AutoDate: "",
        TypeA: 0,
        TypeB: 0,
        TypeC: 0,
        InitNum: 0,
      },
      editorRules: {
        DeptID: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        AutoDate: [
          { required: true, message: "此项不能为空", trigger: "change" },
        ],
        TypeA: [{ required: true, message: "此项不能为空", trigger: "change" }],
        TypeB: [{ required: true, message: "此项不能为空", trigger: "change" }],
        TypeC: [{ required: true, message: "此项不能为空", trigger: "change" }],
      },
      DepartmentArry: [], //诊室信息
      dialogCreateOrEditorVisible: false,
      PageIndex: 1,
      PageSize: 5,
      totalCount: 20,
      loadingBool: false,
      CallAutoNumData: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
        ],
      },
    };
  },
  methods: {
    //初始化序号队列信息
    InitData() {
      (this.loadingBool = true),
        this.$store
          .dispatch("callAutoNum/getAutoNum")
          .then((response) => {
            response.filter((item) => {
              item.AutoDate = item.AutoDate.replace("T", " ");
            });
            this.CallAutoNumData = response;

            this.loadingBool = false;
          })
          .catch((error) => {
            this.loadingBool = false;
          });
    },
    //修改
    CreateOrEditorAutoNum(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.CreateOrEditor == true) {
            this.Creates();
          } else {
            this.Editors();
          }
        } else {
          this.$message.error("请输入完整信息！");
        }
      });
    },
    //删除
    RemoveAutoNum(row) {
      this.$confirm(`是否将${row.Name}队列删除？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("callAutoNum/removeAutoNum", row.GID)
            .then((response) => {
              if (response == true) {
                this.$message({
                  type: "success",
                  message: "删除成功！",
                });
                this.InitData();
              } else {
                this.$message("删除失败！");
              }
            })
            .catch((error) => {
              this.$message.error("删除失败，服务器错误！");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //新增
    Creates() {
      this.$store
        .dispatch("callAutoNum/createAutoNum", this.Editor)
        .then((response) => {
          if (response == true) {
            this.$message({
              type: "success",
              message: "新增成功!",
            });
            this.InitData();
            this.dialogCreateOrEditorVisible = false;
          } else {
            this.$message("新增失败!");
          }
        })
        .catch((error) => {
          this.$message.error("新增失败,服务器失败!");
        });
    },
    //修改
    Editors() {
      this.$store
        .dispatch("callAutoNum/editorAutoNum", this.Editor)
        .then((response) => {
          if (response == true) {
            this.$message({
              type: "success",
              message: "修改成功！",
            });
            this.InitData();
            this.dialogCreateOrEditorVisible = false;
          } else {
            this.$message("删除失败!");
          }
        })
        .catch((error) => {
          this.$message.error("删除失败,服务器失败!");
        });
    },
    //弹出新增窗体
    ShowCreatedialog() {
      this.CreateOrEditorTitle = "新增队列信息";
      this.CreateOrEditordisabled = false;
      this.CreateOrEditor = true;
      if (this.DepartmentArry.length == 0) {
        this.GetAllDepartment();
      }
      this.dialogCreateOrEditorVisible = true;
    },
    //弹出修改窗体
    ShowEditordialog(row) {
      this.CreateOrEditorTitle = "修改队列信息";
      this.CreateOrEditordisabled = true;
      this.CreateOrEditor = false;
      this.Editor.GID = row.GID;
      this.Editor.DeptID = row.DID;
      this.Editor.AutoDate = row.AutoDate;
      this.Editor.TypeA = row.TypeA;
      this.Editor.TypeB = row.TypeB;
      this.Editor.TypeC = row.TypeC;
      if (this.DepartmentArry.length == 0) {
        this.GetAllDepartment();
      }
      this.dialogCreateOrEditorVisible = true;
    },
    //窗体关闭事件
    dialogCreateOrEditorColse() {
      this.Editor.DeptID = "";
      this.Editor.AutoDate = "";
      this.Editor.TypeA = 0;
      this.Editor.TypeB = 0;
      this.Editor.TypeC = 0;
    },
    //每页显示的条数改变事件
    SizeChange(size) {},
    //上一页
    PagePrev(index) {},
    //下一页
    PageNext(index) {},
    //当前页改变
    CurrentChange(index) {},
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
  },

  mounted() {
    this.InitData();

    this.$Bus.$on("RefreshAutoNum", () => {
      this.InitData();
    });
  },
};
</script>

<style scoped>
</style>