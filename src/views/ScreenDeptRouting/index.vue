<template>
  <div class="app-container">
    <el-card>
      <!-- 查询条件 -->
      <el-row>
        <el-form>
          <el-col :span="7" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="屏幕名称">
              <el-input
                style="max-width: 70%"
                placeholder="支持模糊查询"
                v-model="selectScreensIPMappingsInput.ScreensName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="诊室名称">
              <el-input
                style="max-width: 70%"
                placeholder="支持模糊查询"
                v-model="selectScreensIPMappingsInput.DepartmentName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
            :xs="3"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
            style="text-align: center"
          >
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="SelectScreensIPMappingPage"
              >搜索</el-button
            >
            <!-- <el-button type="success" @click.native="GetQueryCallList">查询</el-button> -->
          </el-col>
          <el-col
            :span="4"
            :xs="2"
            :sm="2"
            :md="2"
            :lg="2"
            :xl="2"
            style="text-align: center"
          >
            <el-button @click="dialogAUScreen('Add')" type="primary"
              >添加屏幕关联诊室路由</el-button
            >
            <!-- <el-button type="success" @click.native="GetQueryCallList">查询</el-button> -->
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          v-loading="loading"
          :data="ScreensIPMappingPage"
          max-height="400"
          height="400"
          border
          style="width: 100%"
        >
          <el-table-column prop="IPAddr" label="IP地址" width="180">
          </el-table-column>
          <el-table-column prop="ScreensName" label="屏幕名称" width="220">
          </el-table-column>
          <el-table-column prop="DeptName" label="诊室名称" width="220">
          </el-table-column>
          <el-table-column prop="Route" label="路由地址" width="180">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-edit"
                @click="dialogAUScreen(scope.row)"
              >
              </el-button>
              <el-button
                type="danger"
                size="small"
                icon="el-icon-delete"
                @click="DelScreen(scope.row)"
              ></el-button>
              <!-- <el-button type="success" size="small"> 解冻 </el-button> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-card>
    <!-- 新增修改 -->
    <el-dialog
      :before-close="CancelAUScreen"
      :title="dialogTitle"
      :visible.sync="dialogAddUpdate"
    >
      <el-form :model="ScreensIPMappingsInput" class="demo-form-inline">
        <el-row>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item
              prop="IPAddr"
              :rules="[{ required: true, message: 'IP不能为空' }]"
              label="IP地址"
            >
              <el-input
                style="width: 70%"
                v-model="ScreensIPMappingsInput.IPAddr"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item
              prop="ScreensID"
              label="屏幕"
              :rules="[{ required: true, message: '必须选择屏幕' }]"
            >
              <el-select
                style="width: 85%"
                v-model="ScreensIPMappingsInput.ScreensID"
                placeholder="请选择屏幕"
                @change="GetselectClinicoptions"
              >
                <el-option
                  v-for="item in Screens"
                  :key="item.ID"
                  :label="item.Name"
                  :value="item.ID"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item prop="DeptID" label="诊室">
              <el-select
                style="width: 85%"
                v-model="ScreensIPMappingsInput.DeptID"
                placeholder="请选择诊室"
              >
                <el-option
                  v-for="item in Departments"
                  :key="item.DeptId"
                  :label="item.DeptName"
                  :value="item.DeptId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item prop="Route" label="路由">
              <el-input
                style="width: 85%"
                v-model="ScreensIPMappingsInput.Route"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CancelAUScreen">取 消</el-button>
        <el-button type="primary" @click="AUScreen">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "ScreenDeptRouting",
  data() {
    return {
      loading: false,
      Screens: [],
      ScreensIPMappingPage: [],
      Departments: [
        {
          ID: "",
          Name: "请选择",
        },
      ],
      ScreenInput: {
        ID: "",
        Name: "",
        State: "",
        StartTime: null,
        EndTime: null,
        CallNum: 1,
        CallCode: "",
        Bulletin: "",
        ScrollTime: 1,
        Subtitle: "",
        Rate: 0,
        MaxNum: 1,
        CallContent: "请{0}{1}，到{2}检查",
        IsNum: null,
      },
      selectScreensIPMappingsInput: {
        IPAddr: "",
        Route: "",
        DepartmentName: "",
        ScreensName: "",
      },
      ScreensIPMappingsInput: {
        IPAddr: "",
        ScreensID: "",
        DeptID: "",
        Route: "",
      },
      States: [
        { Name: "请选择", Value: "" },
        { Name: "启用", Value: 1 },
        { Name: "冻结", Value: 0 },
      ],
      dialogAddUpdate: false,
      dialogTitle: "",
      AUTiggle: true,
      dialogSettingTitle: "",
      dialogSetting: false,
      dialogSettingRow: null,
      DepartmentData: [], //诊室集合
      ScreenDeptMapData: [], //屏幕管理诊室集合
    };
  },
  methods: {
    SelectScreensIPMappingPage() {
      this.loading = true;
      this.$store
        .dispatch(
          "ScreenDeptRouting/SelectScreensIPMappingPage",
          this.selectScreensIPMappingsInput
        )
        .then((response) => {
          this.ScreensIPMappingPage = response.data;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    GetScreens() {
      // this.Screens.splice(0, this.Screens.length);
      this.loading = true;
      this.$store
        .dispatch("ScreenManages/GetScreens", this.ScreenInput)
        .then(async (response) => {
          // response.data.forEach((item, index) => {
          //   item.CreateDate = this.formatDate({
          //     date: item.CreateDate,
          //     formatStr: "yyyy-MM-dd HH:mm:ss",
          //   });
          //   this.Screens.push(item);
          // });

          this.Screens = response.data;
          console.log("this.Screens", this.Screens);
          // await this.GetselectClinicoptions(this.Screens[0].ID);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    //根据选择诊区获取诊室信息
    async GetselectClinicoptions() {
      this.Departments = [
        {
          ID: "",
          Name: "请选择",
        },
      ];
      await this.$store
        .dispatch("patientCheckIn/GetScreenDeptInfo", {
          screenId: this.ScreensIPMappingsInput.ScreensID,
        })
        .then((response) => {
          console.log("selectClinicoptions", response);
          this.Departments = response;
        })
        .catch((error) => {})
        .finally(() => {});
    },
    async dialogAUScreen(row) {
      this.dialogAddUpdate = true;
      if (row != "Add") {
        this.AUTiggle = false;
        this.dialogTitle = "修改屏幕关联诊室路由";
        console.log(row);
        this.ScreensIPMappingsInput = row;
        if (
          this.ScreensIPMappingsInput.DeptID ==
          "00000000-0000-0000-0000-000000000000"
        ) {
          this.ScreensIPMappingsInput.DeptID = "";
          console.log(11111111);
        }
        await this.GetselectClinicoptions();
      } else {
        this.AUTiggle = true;
        this.dialogTitle = "添加屏幕关联诊室路由";
      }
    },
    CancelAUScreen() {
      this.dialogAddUpdate = false;
      this.ScreensIPMappingsInput = {
        IPAddr: "",
        ScreensID: "",
        DeptID: "",
        Route: "",
      };
      this.Departments = [
        {
          ID: "",
          Name: "请选择",
        },
      ];
    },
    AUScreen() {
      //异常处理
      if (this.ScreensIPMappingsInput.IPAddr.trim() == "") {
        this.$message({
          message: "IP地址不能为空",
          type: "error",
        });
        return;
      } else if (this.ScreensIPMappingsInput.ScreensID.trim() == "") {
        this.$message({
          message: "必须选择屏幕",
          type: "error",
        });
        return;
      }
      if (this.AUTiggle) {
        //新增屏幕信息
        this.$store
          .dispatch(
            "ScreenDeptRouting/AddScreensIPMapping",
            this.ScreensIPMappingsInput
          )
          .then((response) => {
            if (response.result) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.CancelAUScreen();
              this.SelectScreensIPMappingPage();
              // this.GetScreens();
            } else {
              this.$message({
                message: "新增失败" + response.message,
                type: "error",
              });
            }
          })
          .catch((error) => {
            console.log("AddScreensIPMappingError", error);
            this.$message.error("服务器异常，请联系后台工作人员");
          });
      } else {
        //修改屏幕信息
        this.$store
          .dispatch(
            "ScreenDeptRouting/updateScreensIPMapping",
            this.ScreensIPMappingsInput
          )
          .then((response) => {
            if (response.result) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.CancelAUScreen();
              this.SelectScreensIPMappingPage();
            } else {
              this.$message({
                message: "修改失败" + response.message,
                type: "error",
              });
            }
          })
          .catch((error) => {
            this.$message.error("服务器异常，请联系后台工作人员");
          });
      }
    },
    DelScreen(row) {
      //删除屏幕信息
      this.$confirm("此操作将永久删除该屏幕信息, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("ScreenDeptRouting/DeleteScreensIPMapping", row)
            .then((response) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.SelectScreensIPMappingPage();
            })
            .catch((error) => {
              this.$message.error("服务器异常，请联系后台工作人员");
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //格式化时间
    formatDate(params) {
      let defalutParams = {
        date: new Date(),
        formatStr: "yyyy-MM-dd HH:mm:ss",
      };
      params = { ...defalutParams, ...params };
      let date = params.date;
      let formatStr = params.formatStr;
      // 传入日期字符串 - 转成时间戳 - 转成标准时间
      let timeStamp = new Date(date).getTime();
      date = new Date(timeStamp);
      formatStr = formatStr.replace(
        new RegExp("yyyy"),
        `${date.getFullYear()}`
      );
      const month = date.getMonth() + 1;
      formatStr = formatStr.replace(
        new RegExp("MM"),
        `${month > 9 ? month : "0" + month}`
      );
      const day = date.getDate();
      formatStr = formatStr.replace(
        new RegExp("dd"),
        `${day > 9 ? day : "0" + day}`
      );
      const hour = date.getHours();
      formatStr = formatStr.replace(
        new RegExp("HH"),
        `${hour > 9 ? hour : "0" + hour}`
      );
      const min = date.getMinutes();
      formatStr = formatStr.replace(
        new RegExp("mm"),
        `${min > 9 ? min : "0" + min}`
      );
      const sec = date.getSeconds();
      formatStr = formatStr.replace(
        new RegExp("ss"),
        `${sec > 9 ? sec : "0" + sec}`
      );
      return formatStr;
    },
  },
  watch: {
    dialogSetting() {
      if (this.dialogSetting) {
        this.GetNotassociatedDepartments();
      }
    },
  },
  mounted() {
    this.GetScreens();
    this.SelectScreensIPMappingPage();
  },
};
</script>

<style>
</style>