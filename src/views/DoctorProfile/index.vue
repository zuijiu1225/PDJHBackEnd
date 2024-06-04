<template>
  <div class="app-container">
    <el-card>
      <!-- 查询条件 -->
      <el-row>
        <el-form>
          <el-col :span="3" :xs="6" :sm="4" :md="4" :lg="4" :xl="4">
            <el-form-item label="医生姓名">
              <el-input
                style="max-width: 70%"
                placeholder="支持模糊查询"
                v-model="IntrosPage.Intro2"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col
            :span="4"
            :xs="6"
            :sm="4"
            :md="4"
            :lg="4"
            :xl="4"
            style="text-align: center"
          >
            <el-button
              @click="GetIntrosList"
              type="primary"
              icon="el-icon-search"
              >搜索</el-button
            >
            <!-- <el-button type="success" @click.native="GetQueryCallList">查询</el-button> -->
          </el-col>
          <el-col
            :span="4"
            :xs="6"
            :sm="4"
            :md="4"
            :lg="4"
            :xl="4"
            style="text-align: center"
          >
            <el-button @click="AddIntros" type="primary"
              >新增医生信息</el-button
            >
            <!-- <el-button type="success" @click.native="GetQueryCallList">查询</el-button> -->
          </el-col>
        </el-form>
      </el-row>
      <el-row>
        <el-col>
          <el-card>
            <el-table
              v-loading="loadingBool"
              :data="IntrosPage.Data"
              style="width: 100%; margin-bottom: 20px"
              row-key="ID"
              border
              default-expand-all
              :tree-props="{ children: 'children' }"
            >
              <el-table-column
                type="ID"
                prop="ID"
                label="ID"
                sortable
                width="180"
              >
              </el-table-column>
              <el-table-column prop="ASID" label="医生工号" width="180">
              </el-table-column>
              <el-table-column prop="ASType" label="类型" width="180">
              </el-table-column>
              <!-- <el-table-column prop="ASType" label="类型" width="180">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.State === 1 ? 'success' : 'error'"
                  disable-transitions
                  >{{ scope.row.State === 1 ? "启用" : "关闭" }}</el-tag
                >
              </template>
            </el-table-column> -->
              <el-table-column prop="Intro1" label="图片地址" width="180">
              </el-table-column>
              <el-table-column prop="Intro2" label="医生姓名" width="180">
              </el-table-column>
              <el-table-column prop="Intro3" label="医生职称" width="180">
              </el-table-column>
              <el-table-column prop="Remarks" label="医生简介" width="180">
              </el-table-column>
              <!-- <el-table-column prop="Queue" label="队列类别"> </el-table-column> -->

              <el-table-column label="操作" width="180">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="UpdateIntros(scope.row)"
                  ></el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-delete"
                    @click="RemoveIntros(scope.row)"
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
              :current-page="0"
              :page-sizes="[5, 10, 20, 30]"
              :page-size="IntrosPage.Page"
              layout="total, sizes, prev, pager, next, jumper"
              :total="IntrosPage.Totle"
            >
            </el-pagination>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
    <!-- 新增修改 -->
    <el-dialog
      :before-close="beforeclose"
      :title="dialogTitle"
      :visible.sync="dialogAddUpdate"
    >
      <el-form :model="Intros" class="demo-form-inline">
        <el-row>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item
              prop="Intro2"
              :rules="[{ required: true, message: '医生姓名不能为空' }]"
              label="医生姓名"
            >
              <el-input style="width: 70%" v-model="Intros.Intro2"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item
              label="医生工号"
              prop="ASID"
              :rules="[{ required: true, message: '医生工号不能为空' }]"
            >
              <el-input v-model="Intros.ASID" style="width: 70%"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
            <el-form-item
              prop="Status"
              label="状态"
              :rules="[{ required: true, message: '必须选择状态' }]"
            >
              <el-select
                style="width: 85%"
                v-model="Intros.Status"
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
        </el-row>

        <el-row>
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item
              style="width: 100%"
              prop="Intro3"
              :rules="[{ required: true, message: '医生职称不能为空' }]"
              label="医生职称"
            >
              <el-input v-model="Intros.Intro3" style="width: 85%"></el-input>
            </el-form-item>
            
          </el-col>

          <el-col :xs="9" :sm="9" :md="9" :lg="9" :xl="9">
            <el-form-item
              label="账户类型"
              prop="ASType"
              :rules="[{ required: true, message: '必须选择账户类型' }]"
            >
              <el-select
                style="width: 85%"
                v-model="Intros.ASType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ASTypes"
                  :key="item.Value"
                  :label="item.Name"
                  :value="item.Value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="7" :sm="7" :md="7" :lg="7" :xl="7">
            <el-form-item
              style="width: 100%"
              prop="Duties"
              label="医生职务"
            >
              <el-input v-model="Intros.Duties" style="width: 85%"></el-input>
            </el-form-item>
            
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item prop="Remarks" label="医生简介" label-width="80px">
              <el-input
                type="textarea"
                v-model="Intros.Remarks"
                :autosize="{ minRows: 2, maxRows: 4 }"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item prop="ShowDeptmentName" label="诊室姓名" label-width="80px">
              <el-input
                v-model="Intros.ShowDeptmentName"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <div class="el-form-item__label" style="font-weight: bold">
              医生照片:
            </div>
            <el-upload
              list-type="picture-card"
              action=""
              :multiple="false"
              :auto-upload="false"
              :on-change="beforeupload"
              :on-remove="removeupload"
              :limit="1"
              ref="upload"
              :file-list="filelist"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="beforeclose">取 消</el-button>
        <el-button type="primary" @click="UploadIntrosAsync">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import request from "@/utils/request";
export default {
  name: "ScreenManages",
  data() {
    return {
      loading: false,
      loadingBool: false,
      IntrosPage: {
        Totle: 0,
        PageCount: 0,
        Index: 1,
        Page: 10,
        Data: [],
        Intro2: "",
      },
      filelist: [],
      file: null,
      filepath: "",
      // imageUrl: [
      //   {
      //     name: "default",
      //     url: require("@/assets/xgt.png"),
      //   },
      // ],
      Intros: {
        ID: "",
        ASID: "",
        ASType: "",
        Intro1: "", //图片地址
        Intro2: "", //医生姓名
        Intro3: "", //医生职称
        Remarks: "", //医生简介
        Status: "", //状态，0-1
        CreateDate: "",
        Duties:"",//医生职务
        ShowDeptmentName:"",//医生显示诊室
      },
      States: [
        { Name: "请选择", Value: "" },
        { Name: "启用", Value: 1 },
        { Name: "冻结", Value: 0 },
      ],
      ASTypes: [
        { Name: "请选择", Value: "" },
        { Name: "医生", Value: "DOC" },
        { Name: "管理", Value: "PM" },
      ],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogAddUpdate: false,
      dialogTitle: "",
      dialogAddorUpdate: "",
      PageIndex: 1,
    };
  },
  methods: {
    GetIntrosList() {
      this.loading = true;
      this.loadingBool = true;
      this.$store
        .dispatch("Intros/GetIntrosList", this.IntrosPage)
        .then((response) => {
          console.log(response);
          this.IntrosPage = response;
          this.loading = false;
          this.loadingBool = false;
        })
        .catch((error) => {
          this.loading = false;
          this.loadingBool = false;
        });
    },
    InsertIntros() {
      this.$store
        .dispatch("Intros/InsertIntros", this.Intros)
        .then((response) => {
          console.log(response);
          if (response) {
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.GetIntrosList();
            this.dialogAddUpdate = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: "新增失败",
            type: "error",
          });
        });
    },
    ChangeIntros() {
      this.$store
        .dispatch("Intros/ChangeIntros", this.Intros)
        .then((response) => {
          console.log(response);
          if (response) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.GetIntrosList();
            this.dialogAddUpdate = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: "修改失败",
            type: "error",
          });
        });
    },
    DeleteIntros() {
      this.$store
        .dispatch("Intros/DeleteIntros", this.Intros)
        .then((response) => {
          console.log(response);
          if (response) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.GetIntrosList();
            this.dialogAddUpdate = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: "删除失败",
            type: "error",
          });
        });
    },
    UploadIntrosAsync() {
      // 构建FormData对象,通过该对象存储要上传的文件
      // this.$refs.upload.submit();
      var data = new FormData();
      if (this.dialogAddorUpdate === "Update") {
        if (this.filelist.length != 0) {
          console.log(this.filelist[0].raw == undefined);
          if (this.filelist[0].raw == undefined) {
            //说明没有更改图片，直接走修改接口
            this.ChangeIntros();
            return;
          }
        }
        //说明更改了图片
        if (this.file == null) {
          this.$message({
            message: "未选择医生照片！",
            type: "error",
          });
          return;
        }
        data.append("file", this.file.raw);
      } else {
        //新增走这里
        if (this.file == null) {
          this.$message({
            message: "未选择医生照片！",
            type: "error",
          });
          return;
        }
        data.append("file", this.file.raw);
      }

      axios
        .post(axios.defaults.baseURL + "/api/Intros/UploadIntrosAsync", data, {
          // 因为我们上传了图片,因此需要单独执行请求头的Content-Type
          headers: {
            // 表示上传的是文件,而不是普通的表单数据
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          var Path = res.data;
          if (Path != "" && Path != null) {
            this.Intros.Intro1 = Path;
            if (this.dialogAddorUpdate === "Add") {
              this.InsertIntros();
            } else if (this.dialogAddorUpdate === "Update") {
              this.ChangeIntros();
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
      // this.$store
      //   .dispatch("Intros/UploadIntrosAsync", data)
      //   .then((response) => {
      //     console.log(response);
      //     // this.IntrosPage = response;
      //   })
      //   .catch((error) => {
      //     // this.loading = false;
      //     // this.loadingBool = false;
      //   });
      // 调用后端接口,发送请求
    },
    AddIntros() {
      this.dialogTitle = "新增医生信息";
      this.dialogAddUpdate = true;
      this.dialogAddorUpdate = "Add";
      //上传图片
      //新增数据
      // this.Intros.Intro1 = this.imageUrl[0].url;
      // console.log(this.Intros);
      // this.$store
      //   .dispatch("Intros/InsertIntros", this.Intros)
      //   .then((response) => {
      //     console.log(response);
      //     // this.IntrosPage = response;
      //   })
      //   .catch((error) => {
      //     // this.loading = false;
      //     // this.loadingBool = false;
      //   });
    },
    UpdateIntros(row) {
      //修改信息
      this.dialogTitle = "修改医生信息";
      this.dialogAddUpdate = true;
      this.dialogAddorUpdate = "Update";
      console.log(row);
      this.Intros.ID = row.ID;
      this.Intros.ASID = row.ASID;
      this.Intros.ASType = row.ASType;
      this.Intros.Intro1 = row.Intro1;
      this.Intros.Intro2 = row.Intro2;
      this.Intros.Intro3 = row.Intro3;
      this.Intros.Remarks = row.Remarks;
      this.Intros.Status = row.Status;
      this.Intros.Duties = row.Duties;
      this.filelist = [
        { name: row.Intro2, url: axios.defaults.baseURL + row.Intro1 },
      ];
    },
    ShowEditIntros(row) {},
    RemoveIntros(row) {
      this.Intros.ID = row.ID;
      this.DeleteIntros();
    },
    beforeupload(file) {
      this.file = file;
    },
    removeupload(file) {
      this.file = null;
      this.filelist = [];
    },
    beforeclose() {
      this.dialogAddUpdate = false;
      this.Intros = {
        ID: "",
        ASID: "",
        ASType: "",
        Intro1: "", //图片地址
        Intro2: "", //医生姓名
        Intro3: "", //医生职称
        Remarks: "", //医生简介
        Status: "", //状态，0-1
        CreateDate: "",
        Duties:"",
      };
      this.file = null;
    },
    //上一页
    PagePrev(index) {
      this.PageIndex = index;
      this.IntrosPage.Index = index;
      this.GetIntrosList();
    },
    //点击下面的页数
    PageChange(index) {
      this.PageIndex = index;
      this.IntrosPage.Index = index;
      this.GetIntrosList();
    },
    //下一页
    PageNext(index) {
      this.PageIndex = index;
      this.IntrosPage.Index = index;
      this.GetIntrosList();
    },
    SizeChange(size) {
      this.Page = size;
      this.IntrosPage.Page = size;
      this.GetIntrosList();
    },
    // 处理图片路径
    setImgUrl(imgArr) {
      let arr = [];
      if (imgArr.length > 0) {
        for (let i = 0; i < imgArr.length; i++) {
          const element = imgArr[i];
          arr.push(element.response.data.url);
          //这个地方根据后台返回的数据进行取值，可以先打印一下
        }
        return arr.join();
      } else {
        return "";
      }
    },
    AUScreen() {
      //异常处理
      // if (this.ScreenInput.Name.trim() == "") {
      //   this.$message({
      //     message: "屏幕名称不能为空",
      //     type: "error",
      //   });
      //   return;
      // } else if (this.ScreenInput.CallCode.trim() == "") {
      //   this.$message({
      //     message: "呼叫代码不能为空",
      //     type: "error",
      //   });
      //   return;
      // } else if (this.ScreenInput.Subtitle.trim() == "") {
      //   this.$message({
      //     message: "副标题不能为空",
      //     type: "error",
      //   });
      //   return;
      // }
      // if (this.AUTiggle) {
      //新增屏幕信息
      //   this.$store
      //     .dispatch("ScreenManages/AddScreen", this.ScreenInput)
      //     .then((response) => {
      //       if (response.result) {
      //         this.$message({
      //           message: "新增成功",
      //           type: "success",
      //         });
      //       } else {
      //         this.$message({
      //           message: "新增失败" + response.message,
      //           type: "error",
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       this.$message.error("服务器异常，请联系后台工作人员");
      //     });
      // } else {
      //   //修改屏幕信息
      //   this.$store
      //     .dispatch("ScreenManages/UpdateScreen", this.ScreenInput)
      //     .then((response) => {
      //       if (response.result) {
      //         this.$message({
      //           message: "修改成功",
      //           type: "success",
      //         });
      //       } else {
      //         this.$message({
      //           message: "修改失败" + response.message,
      //           type: "error",
      //         });
      //       }
      //     })
      //     .catch((error) => {
      //       this.$message.error("服务器异常，请联系后台工作人员");
      //     });
      // }
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
    // CreatTimeRange() {
    //   if (this.CreatTimeRange != null) {
    //     this.ScreenInput.StartTime = this.CreatTimeRange[0];
    //     this.ScreenInput.EndTime = this.CreatTimeRange[1];
    //   } else {
    //     this.ScreenInput.StartTime = null;
    //     this.ScreenInput.EndTime = null;
    //   }
    // },
    // dialogSetting() {
    //   if (this.dialogSetting) {
    //     this.GetNotassociatedDepartments();
    //   }
    // },
  },
  mounted() {
    this.GetIntrosList();
  },
};
</script>

<style>
</style>