<template>
  <div class="app-container">
    <el-card>
      <!-- 查询条件 -->
      <el-row>
        <el-form>
          <el-col :span="5" :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item label="查询范围">
              <el-date-picker
                v-model="CreatTimeRange"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd hh:mm:ss"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7" :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item label="状态">
              <el-select v-model="ScreenInput.State" placeholder="请选择">
                <el-option
                  v-for="item in States"
                  :key="item.Value"
                  :label="item.Name"
                  :value="item.Value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3" :xs="6" :sm="4" :md="4" :lg="4" :xl="4">
            <el-form-item label="名称">
              <el-input
                style="max-width: 70%"
                placeholder="支持模糊查询"
                v-model="ScreenInput.Name"
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
            <el-button @click="GetScreens" type="primary" icon="el-icon-search"
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
              >添加屏幕信息</el-button
            >
            <!-- <el-button type="success" @click.native="GetQueryCallList">查询</el-button> -->
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-table
          v-loading="loading"
          :data="Screens"
          max-height="400"
          height="400"
          border
          style="width: 100%"
        >
          <el-table-column prop="ID" label="ID" width="180"> </el-table-column>
          <el-table-column
            format="yyyy 年 MM 月 dd 日"
            prop="CreateDate"
            label="创建日期"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="Name" label="屏幕名称" width="180">
          </el-table-column>
          <el-table-column prop="stateModel" label="状态"> </el-table-column>
          <el-table-column prop="CallCode" label="呼叫代码"> </el-table-column>
          <el-table-column prop="MaxNum" label="最大诊室数" width="180">
          </el-table-column>
          <el-table-column prop="CallNum" label="呼叫次数"> </el-table-column>
          <el-table-column prop="Bulletin" label="公告内容"> </el-table-column>

          <el-table-column prop="ScrollTime" label="滚动间隔">
          </el-table-column>
          <el-table-column prop="Subtitle" label="副标题"> </el-table-column>
          <el-table-column prop="Rate" label="语速(-10-10)"> </el-table-column>
          <el-table-column prop="IsNum" label="是否显示序号"> </el-table-column>
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
              <el-button
                type="info"
                size="small"
                icon="el-icon-setting"
                @click="dialogSet(scope.row)"
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
      <el-form :model="ScreenInput" class="demo-form-inline">
        <el-row>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item
              prop="Name"
              :rules="[{ required: true, message: '屏幕名称不能为空' }]"
              label="屏幕名称"
            >
              <el-input
                style="width: 70%"
                v-model="ScreenInput.Name"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item prop="State" label="状态">
              <el-select
                style="width: 85%"
                v-model="ScreenInput.State"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in States"
                  :key="item.Value"
                  :label="item.Name"
                  :value="item.Value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item prop="IsNum" label="是否显示序号，1不显示">
              <el-input
                style="width: 70%"
                v-model="ScreenInput.IsNum"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-form-item
              style="width: 100%"
              prop="CallCode"
              :rules="[{ required: true, message: '呼叫代码不能为空' }]"
              label="呼叫代码"
            >
              <el-input
                v-model="ScreenInput.CallCode"
                style="width: 85%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="10" :sm="10" :md="10" :lg="10" :xl="10">
            <el-form-item
              prop="Subtitle"
              :rules="[{ required: true, message: '副标题不能为空' }]"
              label="副标题"
            >
              <el-input
                v-model="ScreenInput.Subtitle"
                style="width: 85%"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item
              label="最大诊室数"
              prop="MaxNum"
              :rules="[{ type: 'number', message: '最大诊室数必须为数字值' }]"
            >
              <el-input
                :max="5"
                :min="0"
                type="number"
                v-model.number="ScreenInput.MaxNum"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item
              label="呼叫次数"
              prop="CallNum"
              :rules="[{ type: 'number', message: '呼叫次数必须为数字值' }]"
            >
              <el-input
                type="number"
                :min="1"
                v-model.number="ScreenInput.CallNum"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
            <el-form-item
              label="屏幕滚动时间间隔"
              prop="ScrollTime"
              :rules="[
                { type: 'number', message: '屏幕滚动时间间隔必须为数字值' },
              ]"
            >
              <el-input
                type="number"
                :min="1"
                v-model.number="ScreenInput.ScrollTime"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5">
            <el-form-item
              label="语速(-10-10)"
              prop="Rate"
              :rules="[{ type: 'number', message: '语速必须为数字值' }]"
            >
              <el-input
                :max="10"
                :min="-10"
                type="number"
                v-model.number="ScreenInput.Rate"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item label="患者姓名脱敏(1-隐藏,0-不隐藏)" prop="Rate">
              <el-input v-model="ScreenInput.NameHiding"></el-input>
              <!-- <el-switch v-model="ScreenInput.NameHiding" /> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-form-item
              prop="CallContent"
              :rules="[{ required: true, message: '语音播报不能为空' }]"
              label="语音播报"
              label-width="80px"
            >
              <el-input
                type="text"
                v-model="ScreenInput.CallContent"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item
              prop="Bulletin"
              :rules="[{ required: true, message: '公告内容不能为空' }]"
              label="公告内容"
              label-width="80px"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-model="ScreenInput.Bulletin"
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
    <!-- 设置屏幕对应诊室 -->

    <el-dialog
      :show-close="false"
      v-loading="loading"
      :title="dialogSettingTitle"
      :visible.sync="dialogSetting"
      width="80%"
    >
      <div style="text-align: center">
        <el-transfer
          style="text-align: left; display: inline-block"
          v-model="ScreenDeptMapData"
          :titles="['可选诊室', '当前屏幕关联诊室']"
          :button-texts="['删除诊室', '添加诊室']"
          :filterable="true"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}',
          }"
          @change="handleChange"
          :data="DepartmentData"
        >
          <span slot-scope="{ option }">
            {{ option.label }}
          </span>
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSetting = false">取 消</el-button>
        <el-button type="primary" @click="RelevancyScreenAndDepts"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "ScreenManages",
  data() {
    return {
      loading: false,
      Screens: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      CreatTimeRange: "",
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
        NameHiding: 0,
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
    GetScreens() {
      this.Screens.splice(0, this.Screens.length);
      this.loading = true;
      this.$store
        .dispatch("ScreenManages/GetScreens", this.ScreenInput)
        .then((response) => {
          response.data.forEach((item, index) => {
            item.CreateDate = this.formatDate({
              date: item.CreateDate,
              formatStr: "yyyy-MM-dd HH:mm:ss",
            });
            this.Screens.push(item);
          });

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    dialogAUScreen(row) {
      this.dialogAddUpdate = true;
      if (row != "Add") {
        this.AUTiggle = false;
        this.dialogTitle = "修改屏幕信息";
        this.$store
          .dispatch("ScreenManages/GetScreensSingle", row)
          .then((response) => {
            this.ScreenInput = response.data;
          })
          .catch((error) => {
            this.$message.error("服务器错误！");
          });
      } else {
        this.AUTiggle = true;
        this.dialogTitle = "添加屏幕信息";
      }
    },
    CancelAUScreen() {
      this.dialogAddUpdate = false;
      this.ScreenInput = {
        ID: "",
        Name: "",
        State: "",
        StartTime: null,
        EndTime: null,
        CallNum: 0,
        CallCode: "",
        Bulletin: "",
        ScrollTime: 0,
        Subtitle: "",
        MaxNum: 1,
        Rate: 0,
        CallContent: "请{0}{1}，到{2}检查",
        NameHiding: 0,
      };
    },
    AUScreen() {
      //异常处理
      if (this.ScreenInput.Name.trim() == "") {
        this.$message({
          message: "屏幕名称不能为空",
          type: "error",
        });
        return;
      } else if (this.ScreenInput.CallCode.trim() == "") {
        this.$message({
          message: "呼叫代码不能为空",
          type: "error",
        });
        return;
      } else if (this.ScreenInput.Subtitle.trim() == "") {
        this.$message({
          message: "副标题不能为空",
          type: "error",
        });
        return;
      }
      if (this.AUTiggle) {
        //新增屏幕信息
        this.$store
          .dispatch("ScreenManages/AddScreen", this.ScreenInput)
          .then((response) => {
            if (response.result) {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.CancelAUScreen();
              this.GetScreens();
            } else {
              this.$message({
                message: "新增失败" + response.message,
                type: "error",
              });
            }
          })
          .catch((error) => {
            this.$message.error("服务器异常，请联系后台工作人员");
          });
      } else {
        //修改屏幕信息
        this.$store
          .dispatch("ScreenManages/UpdateScreen", this.ScreenInput)
          .then((response) => {
            if (response.result) {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.CancelAUScreen();
              this.GetScreens();
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
            .dispatch("ScreenManages/DelScreen", row)
            .then((response) => {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.GetScreens();
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

    handleChange(value, direction, movedKeys) {
      if (direction == "right") {
        if (value.length > this.dialogSettingRow.MaxNum) {
          value.splice(
            this.dialogSettingRow.MaxNum,
            value.length - this.dialogSettingRow.MaxNum
          );
          this.$message({
            message: "警告，屏幕最大诊室数量已达上线",
            type: "warning",
          });
        }
      }
    },
    GetNotassociatedDepartments() {
      this.loading = true;
      this.DepartmentData.splice(0, this.DepartmentData.length);
      this.ScreenDeptMapData.splice(0, this.ScreenDeptMapData.length);
      this.$store
        .dispatch("ScreenManages/GetDepartments", this.dialogSettingRow)
        .then((response) => {
          response.data.forEach((item, index) => {
            this.DepartmentData.push({
              key: item.ID,
              label: item.Name,
              disabled: item.disabled,
            });
          });
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });

      this.$store
        .dispatch(
          "ScreenManages/GetHasassociatedDepartments",
          this.dialogSettingRow
        )
        .then((response) => {
          response.data.forEach((item, index) => {
            this.ScreenDeptMapData.push(item.ID);
          });
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    dialogSet(row) {
      this.dialogSetting = true;
      this.dialogSettingTitle = row.Name;
      this.dialogSettingRow = row;
    },
    RelevancyScreenAndDepts() {
      this.loading = true;
      this.$store
        .dispatch("ScreenManages/RelevancyScreenAndDepts", {
          departmentInputKeys: this.ScreenDeptMapData,
          ScreenInput: this.dialogSettingRow.ID,
        })
        .then((response) => {
          this.$message({
            type: "success",
            message: "设置成功!",
          });
          this.loading = false;
          this.GetNotassociatedDepartments();
        })
        .catch((error) => {
          this.loading = false;

          this.loading = false;
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
    CreatTimeRange() {
      if (this.CreatTimeRange != null) {
        this.ScreenInput.StartTime = this.CreatTimeRange[0];
        this.ScreenInput.EndTime = this.CreatTimeRange[1];
      } else {
        this.ScreenInput.StartTime = null;
        this.ScreenInput.EndTime = null;
      }
    },
    dialogSetting() {
      if (this.dialogSetting) {
        this.GetNotassociatedDepartments();
      }
    },
  },
  mounted() {
    this.GetScreens();
  },
};
</script>

<style>
</style>