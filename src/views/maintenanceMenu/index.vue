<template>
  <div class="app-container">
    <el-button type="text" size="small" @click="ShowAddPage()"
      >新增菜单</el-button
    >
    <el-row>
      <el-col>
        <el-card>
          <el-table
            :data="MenuData"
            v-loading="loadingBool"
            style="width: 100%; margin-bottom: 20px"
            row-key="Id"
            border
            default-expand-all
            :tree-props="{ children: 'children' }"
          >
            <el-table-column type="index" label="序号" sortable width="50">
            </el-table-column>

            <el-table-column prop="PageShowName" label="菜单名称">
            </el-table-column>

            <el-table-column prop="PageUrl" label="路由"> </el-table-column>

            <el-table-column prop="Icon" label="图标">
              <template slot-scope="scope">
                <svg-icon
                  class-name="international-icon"
                  :icon-class="scope.row.Icon || ''"
                />
              </template>
            </el-table-column>

            <el-table-column prop="Redirect" label="重定向"> </el-table-column>

            <el-table-column prop="Redirect" label="是否显示">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.AlwaysShow === true ? 'success' : 'error'"
                  disable-transitions
                  >{{ scope.row.AlwaysShow === true ? "显示" : "隐藏" }}</el-tag
                >
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="ShowEditPage(scope.row)"
                ></el-button>
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="RemovePage(scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 修改菜单弹窗 -->
          <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogCreateOrEditorVisible"
            @close="dialogCreateOrEditorVisibleClose"
          >
            <el-form
              :model="EditorPage"
              label-width="80px"
              size="small"
              ref="EditorForm"
              :rules="EditorRules"
            >
              <el-row>
                <el-col :span="10">
                  <el-form-item label="页面路径" prop="PageUrl">
                    <el-input v-model="EditorPage.PageUrl"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row type="flex" justify="space-around">
                <el-col :span="10">
                  <el-form-item label="菜单名称" prop="PageShowName">
                    <el-input v-model="EditorPage.PageShowName"> </el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="上级菜单" prop="ParentPageId">
                    <el-cascader
                      style="width: 100%"
                      v-model="EditorPage.ParentPageId"
                      :options="MenuData2"
                      :show-all-levels="true"
                      :props="{ checkStrictly: true, emitPath: false }"
                      clearable
                    ></el-cascader>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row type="flex" justify="space-around">
                <el-col :span="10">
                  <el-form-item label="菜单图标" style="width: 70%">
                    <el-popover placement="bottom-start" trigger="click">
                      <icon-select @selected="SelectIcon" />
                      <el-input
                        slot="reference"
                        v-model="EditorPage.Icon"
                        placeholder="选择图标"
                        clearable
                      >
                        <svg-icon
                          v-if="EditorPage.Icon"
                          slot="prefix"
                          :icon-class="EditorPage.Icon"
                          style="height: 40px; width: 16px"
                        />
                        <span v-else slot="prefix" />
                      </el-input>
                    </el-popover>
                  </el-form-item>
                </el-col>

                <el-col :span="12">
                  <el-form-item label="是否显示" prop="AlwaysShow">
                    <el-select
                      v-model="EditorPage.AlwaysShow"
                      placeholder="请选择"
                    >
                      <el-option label="显示" :value="true"></el-option>
                      <el-option label="隐藏" :value="false"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="重定向">
                    <el-input v-model="EditorPage.Redirect"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="是否缓存" prop="NoCache">
                    <el-select
                      v-model="EditorPage.NoCache"
                      placeholder="请选择"
                    >
                      <el-option label="是" :value="true"></el-option>
                      <el-option label="不是" :value="false"></el-option>
                    </el-select>
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
                @click="CreateOrEditorPages('EditorForm')"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import IconSelect from "@/components/SvgSelect/index.vue";
export default {
  name: "MenuMaintenance",
  components: {
    IconSelect,
  },
  data() {
    return {
      MenuData: [],
      MenuData2: [],
      loadingBool: false,
      CreateOrEditor: false, //标识新增还是删除
      dialogTitle: "",
      dialogCreateOrEditorVisible: false,
      EditorPage: {
        Id: "",
        PageUrl: "",
        PageShowName: "",
        ParentPageId: "",
        Icon: "",
        AlwaysShow: "",
        Redirect: "",
        NoCache: "",
      },
      EditorRules: {
        PageUrl: [{ required: true, message: "此项不能为空", trigger: "blur" }],
        PageShowName: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        ParentPageId: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        AlwaysShow: [
          { required: true, message: "此项不能为空", trigger: "blur" },
        ],
        NoCache: [{ required: true, message: "此项不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    Init() {
      if (
        this.$store.state.page.PageMenuArry &&
        this.$store.state.page.PageMenuArry.length > 0
      ) {
        this.MenuData = this.$store.state.page.PageMenuArry;
      } else {
        this.InitData();
      }
      if (
        this.$store.state.page.PageMenuArry2 &&
        this.$store.state.page.PageMenuArry2.length > 0
      ) {
        this.MenuData2 = this.$store.state.page.PageMenuArry2;
      } else {
        this.InitData2();
      }
    },
    //初始菜单数据 用于表格
    InitData() {
      this.loadingBool = true;
      this.$store
        .dispatch("page/getPage")
        .then((response) => {
          this.MenuData = response;
          this.loadingBool = false;
        })
        .catch((error) => {
          this.$message.error("无法获取菜单数据！");
        });
    },
    //初识菜单数据 用于级联选择器
    InitData2() {
      this.$store
        .dispatch("page/getPage2")
        .then((response) => {
          response.unshift({
            label: "一级菜单",
            value: "0",
          });
          this.MenuData2 = response;
        })
        .catch((error) => {});
    },
    //删除菜单
    RemovePage(row) {
      this.$confirm(`你确定要删除 ${row.PageShowName} ?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("page/removePage", row.Id)
            .then((response) => {
              if (response == true) {
                this.$message({
                  type: "success",
                  message: "删除成功！",
                });
                this.InitData();
                this.InitData2();
                this.$store.dispatch("user/getInfo");
              }
            })
            .catch((error) => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //新增/修改菜单
    CreateOrEditorPages(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.CreateOrEditor) {
            this.$store
              .dispatch("page/createPage", this.EditorPage)
              .then((response) => {
                if (response == true) {
                  this.$message({
                    type: "success",
                    message: "创建成功！",
                  });
                  this.InitData();
                  this.InitData2();
                  this.dialogCreateOrEditorVisible = false;
                }
              })
              .catch((error) => {
                this.$message.error("创建失败！");
              });
          } else {
            this.$store
              .dispatch("page/editorPage", this.EditorPage)
              .then((response) => {
                if (response == true) {
                  this.$message({
                    type: "success",
                    message: "修改成功！",
                  });
                  this.InitData();
                  this.InitData2();
                  this.$store.dispatch("user/getInfo");
                  this.dialogCreateOrEditorVisible = false;
                  this.$store.dispatch("page/getPage3");
                }
              })
              .catch((error) => {
                this.$message.error("修改失败！");
              });
          }
        } else {
          this.$message.error("请填入完整的信息！");
          return false;
        }
      });
    },
    ShowAddPage() {
      this.dialogTitle = "新增菜单";
      this.CreateOrEditor = true;
      this.dialogCreateOrEditorVisible = true;
    },
    //弹出修改页面窗体
    ShowEditPage(row) {
      this.CreateOrEditor = false;
      this.dialogTitle = "修改菜单";
      this.EditorPage.Id = row.Id;
      this.EditorPage.PageUrl = row.PageUrl;
      this.EditorPage.PageShowName = row.PageShowName;
      if (row.ParentPageId == "0") {
        this.EditorPage.ParentPageId = "0";
      } else this.EditorPage.ParentPageId = row.ParentPageId;
      this.EditorPage.Icon = row.Icon;
      this.EditorPage.AlwaysShow = row.AlwaysShow;
      this.EditorPage.Redirect = row.Redirect;
      this.EditorPage.NoCache = row.NoCache;
      this.dialogCreateOrEditorVisible = true;
    },
    //关闭弹窗事件
    dialogCreateOrEditorVisibleClose() {
      this.EditorPage.Id = "";
      this.EditorPage.PageUrl = "";
      this.EditorPage.PageShowName = "";
      this.EditorPage.ParentPageId = "";
      this.EditorPage.Icon = "";
      this.EditorPage.AlwaysShow = "";
      this.EditorPage.Redirect = "";
      this.EditorPage.NoCache = "";
    },
    SelectIcon(name) {
      this.EditorPage.Icon = name;
    },
  },
  mounted() {
    this.Init();
  },
};
</script>

<style scoped>
.international-icon {
  font-size: 30px;
  color: #bfcbd9;
}
</style>