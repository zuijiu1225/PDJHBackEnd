<template>
  <div
    class="patientCheckIn"
    element-loading-text="加载中，请稍后..."
    element-loading-spinner="el-icon-loading"
    v-loading.fullscreen.lock="fullscreenLoading"
  >
    <div class="patientCheckInInfo" :style="'height:' + innerHeight + 'px;'">
      <div>就诊卡号/门急诊号:</div>
      <div>
        <el-input
          v-model="CardNo"
          placeholder="请输入就诊卡号/门急诊号"
          @change="GetGuideCardBtnData()"
        ></el-input>
      </div>
      <div>
        <el-card style="line-height: 40px">
          <div style="display: flex; align-items: center">
            <div style="width: 80px; height: 80px">
              <img
                style="width: 100%; height: 100%"
                src="@/assets/Sign_images/nan.png"
                alt=""
                v-if="patient.patinetVisitInfo.Sex == 1"
              />
              <img
                style="width: 100%; height: 100%"
                src="@/assets/Sign_images/nv.png"
                alt=""
                v-else
              />
            </div>
            <div>
              <div class="patientName">
                {{ patient.patinetVisitInfo.PatientName }}
              </div>
              <span class="patientSex">
                <span v-if="patient.patinetVisitInfo.Sex == 1">男</span>
                <span v-else-if="patient.patinetVisitInfo.Sex == 2">女</span>
                <span v-else>性别</span>
              </span>
              <span class="patientAge">{{
                patient.patinetVisitInfo.AgeStr
              }}</span>
            </div>
          </div>

          <div>门急诊号:{{ patient.patinetVisitInfo.PatientCode }}</div>
          <div>门诊卡号:{{ patient.patinetVisitInfo.PatientCard }}</div>
          <!-- <div>就诊卡号:{{ patient.CardNumber }}</div> -->
          <div>挂号科室:{{ patient.patinetVisitInfo.DeptName }}</div>
          <div>挂号医生:{{ patient.patinetVisitInfo.DoctorName }}</div>
          <div>预约就诊时间:{{ patient.patinetVisitInfo.RegTime }}</div>
        </el-card>
      </div>
      <div>
        <div class="VisitArea">
          <span>就诊诊区:</span>
          <el-select
            v-model="VisitArea.ScreensID"
            placeholder="请选择"
            @change="changeVisitArea()"
          >
            <el-option
              v-for="item in VisitAreaoptions"
              :key="item.ScreensID"
              :label="item.ScreensName"
              :value="item.ScreensID"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Clinic">
          <span>就诊诊室:</span>
          <!-- {{ patient.PatientInfo.DepartmentID }} -->
          <el-select
            v-model="patient.PatientInfo.DepartmentID"
            placeholder="请选择"
          >
            <el-option
              v-for="item in Clinicoptions"
              :key="item.DeptId"
              :label="item.DeptName"
              :value="item.DeptId"
            >
            </el-option>
          </el-select>
        </div>
        <div class="Clinic">
          <span>排队队列:</span>
          <!-- {{ patient.PatientInfo.DepartmentID }} -->
          <el-select
            v-model="patient.PatientInfo.SourceType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in xhlboptions"
              :key="item.xhlbName"
              :label="item.xhlbName"
              :value="item.xhlbName"
            >
            </el-option>
          </el-select>
        </div>
        <div>
          <el-checkbox v-model="checked">自动签到</el-checkbox>
        </div>
        <el-button
          type="primary"
          class="primarybutton"
          @click="ConfirmPatientBtnSign"
          >签到</el-button
        >
      </div>
    </div>
    <div class="consultationAreaInfo">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="汇总" name="first">
          <div class="selectDetails">
            <div>
              <span>诊区: </span>
              <el-select
                placeholder="请选择"
                v-model="VisitAreaDetails.ScreensID"
                @change="changeVisitAreaDetails()"
              >
                <el-option
                  v-for="item in VisitAreaoptionsDetails"
                  :key="item.ScreensID"
                  :label="item.ScreensName"
                  :value="item.ScreensID"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <span class="selectText"
                >候诊:<span style="font-size: 20px">{{
                  VisitAreaWaitingNum
                }}</span
                >人</span
              >
              <span class="selectText"
                >未签到:<span style="font-size: 20px">{{
                  VisitAreaNotCheckInNum
                }}</span
                >人</span
              >
              <span class="selectText"
                >已完成:<span style="font-size: 20px">{{
                  VisitAreaCompletedNum
                }}</span
                >人</span
              >
            </div>
          </div>
          <div :style="'height:' + huizonginnerHeight + 'px;overflow: auto;'">
            <div
              style="
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
              "
            >
              <el-card
                class="box-card"
                v-for="(item, index) in DepartmentDetails"
                :key="index"
              >
                <div slot="header" class="clearfix">
                  <span
                    >{{ item.DeptName }}(<span v-if="item.Doctor != null">{{
                      item.Doctor
                    }}</span
                    ><span v-else>医生未开诊</span>)</span
                  >
                </div>
                <div class="text item">
                  <div class="textdiv">
                    <div
                      @click="changeSecond(item, 0)"
                      class="texthouzhen textnum"
                    >
                      {{ item.WaitingNum }}
                    </div>
                    <div>候诊</div>
                  </div>
                  <div class="textdiv" v-if="item.Doctor != null">
                    <div
                      @click="changeSecond(item, -1)"
                      class="textweiqiandao textnum"
                    >
                      <!-- v-if="item.Doctor != null" -->
                      {{ item.NotCheckInNum }}
                    </div>
                    <div>未签到</div>
                  </div>
                  <div class="textdiv">
                    <div
                      @click="changeSecond(item, 2)"
                      class="textyiwancheng textnum"
                    >
                      {{ item.CompletedNum }}
                    </div>
                    <div>已完成</div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="详情" name="second">
          <div>
            <div
              style="font-size: 24px; background: white; padding: 15px 15px 0"
            >
              正在呼叫:
              <b style="margin-right: 12px">{{
                CallPeople.ShowNo == undefined
                  ? "&nbsp;"
                  : CallPeople.ShowNo + "号"
              }}</b>
              <b
                >{{ CallPeople.PatientName }}
                <span v-if="CallPeople != null && CallPeople != undefined">
                  {{
                    CallPeople.remark == "过号" || CallPeople.remark == "已延后"
                      ? "(过)"
                      : CallPeople.remark == "回诊"
                      ? "(回)"
                      : CallPeople.remark == "急诊"
                      ? "(急)"
                      : CallPeople.remark == "优先"
                      ? "(优)"
                      : ""
                  }}</span
                >
              </b>
            </div>
          </div>
          <div class="selectInfo">
            <!-- <div class="DateOfEnquiry">
              <span>日期:</span>
              <el-date-picker
                class="DateOfEnquirypicker"
                v-model="selectInfo.DateOfEnquiry"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div> -->

            <div class="selectVisitArea">
              <span>诊区:</span>
              <el-select
                class="selectVisitAreaoption"
                placeholder="请选择"
                v-model="selectInfo.selectVisitArea"
                @change="changeselectVisitArea()"
              >
                <el-option
                  v-for="item in selectVisitAreaoptionsDetails"
                  :key="item.ScreensID"
                  :label="item.ScreensName"
                  :value="item.ScreensID"
                >
                </el-option>
              </el-select>
            </div>
            <div class="selectClinic">
              <span>诊室:</span>
              <el-select
                placeholder="请选择"
                class="selectClinicoption"
                v-model="selectInfo.selectClinic"
                @change="changeselectClinic()"
              >
                <el-option
                  v-for="item in selectClinicoptions"
                  :key="item.DeptId"
                  :label="item.DeptName"
                  :value="item.DeptId"
                >
                </el-option>
              </el-select>
            </div>
            <div class="selectDoc">
              <span>医生:</span>
              <div class="selectDocoption">{{ selectInfo.selectDoc }}</div>
            </div>
            <div class="selectStatus">
              <span>状态:</span>
              <el-select
                placeholder="请选择"
                class="selectStatusoption"
                v-model="selectInfo.selectStatus"
                @change="changeSelectStatus"
              >
                <el-option
                  v-for="item in selectStatusoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="selectPatientInfos()"
                >查询</el-button
              >
            </div>
          </div>
          <div>
            <!-- :data="tableData" -->
            <el-table
              style="width: 100%"
              :data="tableData"
              :max-height="xiangqinginnerHeight"
              :height="xiangqinginnerHeight"
              border
              v-if="this.selectInfo.selectStatus != -1"
            >
              <el-table-column prop="id" label="ID" width="80">
              </el-table-column>
              <el-table-column prop="ShowNo" label="序号" width="80">
              </el-table-column>
              <el-table-column prop="xhlb" label="序号类别" width="80">
                <template slot-scope="scope">
                  {{
                    scope.row.xhlb == "A"
                      ? "急诊"
                      : scope.row.xhlb == "B"
                      ? "优先"
                      : scope.row.xhlb == "C"
                      ? "普通"
                      : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="PatientCode" label="门急诊号" width="100">
              </el-table-column>
              <el-table-column prop="remark" label="状态" width="80">
              </el-table-column>
              <el-table-column prop="PatientName" label="患者姓名" width="100">
              </el-table-column>
              <el-table-column prop="Doctors" label="医生姓名" width="100">
              </el-table-column>
              <el-table-column prop="OutPatientOffice" label="诊室" width="100">
              </el-table-column>
              <el-table-column
                prop="RecordsTime"
                label="签到时间"
                :formatter="formatDate"
                width="180"
              >
              </el-table-column>
              <!-- <el-table-column
                prop="name"
                label="预约挂号时间"
                sortable
                width="180"
              >
              </el-table-column> -->
              <el-table-column
                prop="EndDate"
                label="完成时间"
                :formatter="formatDate"
                width="180"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                fixed="right"
                width="180"
                align="center"
              >
                <template slot-scope="scope" v-if="scope.row.state == 0">
                  <!-- <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >取消排队</el-button
                  > -->
                  <el-popover placement="right" width="400" trigger="click">
                    <el-select placeholder="请选择" v-model="stateModule">
                      <el-option
                        v-for="item in states"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        type="text"
                        @click="visible = false"
                        >取消</el-button
                      >
                      <el-button
                        type="primary"
                        size="mini"
                        @click="handleDelete(scope.$index, scope.row)"
                        >确定</el-button
                      >
                    </div>
                    <el-button slot="reference">修改状态</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <el-table
              style="width: 100%"
              :data="tableData"
              border
              :max-height="xiangqinginnerHeight"
              :height="xiangqinginnerHeight"
              v-else
            >
              <el-table-column prop="PatientName" label="患者姓名" width="180">
              </el-table-column>
              <el-table-column prop="Sex" label="性别" width="80">
                <template slot-scope="scope">
                  {{
                    scope.row.Sex == 1 ? "男" : scope.row.Sex == 2 ? "女" : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="Sex" label="性别" width="80">
                <template slot-scope="scope">
                  {{
                    scope.row.Sex == 1 ? "男" : scope.row.Sex == 2 ? "女" : ""
                  }}
                </template>
              </el-table-column>
              <el-table-column prop="AgeStr" label="年龄" width="80">
              </el-table-column>
              <el-table-column prop="Doctors" label="医生姓名" width="180">
              </el-table-column>
              <el-table-column prop="Department" label="科室" width="180">
              </el-table-column>

              <el-table-column
                prop="RecordDate"
                :formatter="formatDate"
                label="预约就诊时间"
                width="180"
              >
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="patientInfoShow"
      width="50%"
      :before-close="handleClose"
      center
    >
      <span
        style="
          color: black;
          line-height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
        "
        v-if="msg == null"
      >
        <!-- <div>
          <span class="patientName dialogName">{{
            patient.patinetVisitInfo.PatientName
          }}</span>
          <span class="patientSex dialogSex"
            ><span v-if="patient.patinetVisitInfo.Sex == 1">男</span
            ><span v-else-if="patient.patinetVisitInfo.Sex == 2">女</span
            ><span v-else>性别</span></span
          >
          <span class="patientAge dialogAge">{{
            patient.patinetVisitInfo.AgeStr
          }}</span>
        </div> -->
        <div style="width: 50%">
          <div style="display: flex; align-items: center">
            <div style="width: 80px; height: 80px">
              <img
                style="width: 100%; height: 100%"
                src="@/assets/Sign_images/nan.png"
                alt=""
                v-if="patient.patinetVisitInfo.Sex == 1"
              />
              <img
                style="width: 100%; height: 100%"
                src="@/assets/Sign_images/nv.png"
                alt=""
                v-else
              />
            </div>
            <div>
              <div class="patientName dialogName">
                {{ patient.patinetVisitInfo.PatientName }}
              </div>
              <span class="patientSex dialogSex">
                <span v-if="patient.patinetVisitInfo.Sex == 1">男</span>
                <span v-else-if="patient.patinetVisitInfo.Sex == 2">女</span>
                <span v-else>性别</span>
              </span>
              <span class="patientAge dialogAge">{{
                patient.patinetVisitInfo.AgeStr
              }}</span>
            </div>
          </div>
          <div>
            门急诊号:<span>{{ patient.patinetVisitInfo.PatientCode }}</span>
          </div>
          <div>
            就诊卡号:<span>{{ patient.patinetVisitInfo.PatientCard }}</span>
          </div>
          <div>
            挂号科室:<span>{{ patient.patinetVisitInfo.DeptName }}</span>
          </div>
          <div>
            挂号医生:<span>{{ patient.patinetVisitInfo.DoctorName }}</span>
          </div>
          <div>
            预约就诊时间:<span>{{ patient.patinetVisitInfo.RegTime }}</span>
          </div>
        </div>
        <div
          style="
            width: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            line-height: 80px;
            border-left: 1px solid #ededed;
          "
        >
          <div>
            <span class="dialogVisitAreaID">{{ VisitArea.ScreensName }}</span>
            <span class="dialogClinicID">{{
              patient.PatientInfo.Department
            }}</span>
          </div>
          <div
            style="display: flex; align-items: center; justify-content: center"
          >
            <div v-if="PatientSign.IsSign" class="dialogTips">
              <span>候诊中</span>
            </div>
            <div class="dialogTips" v-else-if="CheckIn">
              <span>签到</span>
              <span>成功！</span>
            </div>
          </div>
          <div>
            <span style="margin-left: 40px">
              序号
              <span style="font-size: 24px">{{ PatientSign.xh }}</span>
            </span>
            <span style="margin-left: 40px">
              前面还有大约
              <span style="font-size: 24px; color: red">{{
                PatientSign.TopOrder
              }}</span>
              人候诊
            </span>
          </div>
          <div style="width: 100%; display: flex; justify-content: center">
            <el-button
              style="width: 80%"
              type="primary"
              @click="clickInItPatient()"
              >确 定</el-button
            >
          </div>
        </div>
      </span>
      <span v-else>{{ msg }}</span>
      <span v-if="msg != null" slot="footer" class="dialog-footer">
        <el-button style="width: 80%" type="primary" @click="clickInItPatient()"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
 <script>
export default {
  data() {
    return {
      input: "",
      fullscreenLoading: false,
      VisitAreaWaitingNum: 0,
      VisitAreaNotCheckInNum: 0,
      VisitAreaCompletedNum: 0,
      VisitArea: {
        ScreensName: "挂号诊区",
        ScreensID: "",
      },
      VisitAreaDetails: {
        ScreensName: "",
        ScreensID: "",
      },
      DepartmentDetails: [
        {
          DeptId: "诊室ID",
          DeptName: "诊室名称",
          DeptQueue: "诊室代码",
        },
      ],
      patient: {
        PatientInfo: {
          PatientName: "患者姓名",
          Sex: "男",
          AgeStr: "年龄",
          // EmergencyRoomNumber: "门急诊号",
          // CardNumber: "就诊卡号",
          // RegistrationOffice: "挂号科室",
          Doctors: "挂号医生",
          RecordDate: "预约就诊时间",
          VisitAreaID: "选项1", //就诊诊区ID
          DepartmentID: "", //就诊诊室ID
          Department: "挂号科室",
          IdCardNo: "身份证号",
          PatientID: "门急诊号",
          SourceType: "普通",
        },
        patinetVisitInfo: {
          AgeStr: "年龄",
          DeptName: "诊室名称",
          DoctorName: "医生姓名",
          PatientCard: "门诊卡号",
          PatientCode: "门急诊号",
          PatientName: "患者姓名",
          RegTime: "预约就诊时间",
          Sex: "",
        },
        SignState: "",
      },
      CheckIn: false,
      VisitAreaoptions: [
        {
          value: "选项1",
          label: "诊区一",
        },
        {
          value: "选项2",
          label: "诊区二",
        },
      ],
      xhlboptions: [
        {
          xhlbvalue: "普通",
          xhlbName: "普通",
        },
        {
          xhlbvalue: "优先",
          xhlbName: "优先",
        },
        {
          xhlbvalue: "急诊",
          xhlbName: "急诊",
        },
      ],
      Clinicoptions: [
        {
          DeptId: "诊室ID",
          DeptName: "诊室一",
          DeptQueue: "",
        },
      ],
      VisitAreaoptionsDetails: [
        {
          value: "选项1",
          label: "诊区一",
        },
        {
          value: "选项2",
          label: "诊区二",
        },
      ],
      selectVisitAreaoptionsDetails: [
        {
          value: "选项1",
          label: "诊区一",
        },
        {
          value: "选项2",
          label: "诊区二",
        },
      ],
      selectClinicoptions: [
        {
          value: "选项1",
          label: "诊室一",
        },
        {
          value: "选项2",
          label: "诊室二",
        },
      ],
      selectStatusoptions: [
        {
          value: 0,
          label: "候诊",
        },
        {
          value: -1,
          label: "未签到",
        },
        {
          value: 2,
          label: "已完成",
        },
      ],
      activeName: "first",
      selectInfo: {
        // DateOfEnquiry: new Date(), //查询日期
        selectVisitArea: "", //查询诊区
        selectClinic: "", //查询诊室
        selectStatus: "", //查询状态
        selectDoc: "医生姓名", //查询医生姓名
        selectDocCode: "", //查询医生工号
      },
      GetSignInfoBtnOutput: {
        Gid: "",
        IsShowInfo: 0,
        Name: "门诊导诊签到",
        ShowText: "",
        SignBtns: [],
        Title: "全州县人民医院门诊导诊签到",
      },
      CardNo: "",
      patientInfoShow: false,
      msg: null,

      tableData: [],
      PatientSign: {
        IsSign: true,
        xh: 0,
        xhlb: "string",
        TopOrder: 0,
        CallId: 0,
        OneDeptName: "string",
        TwoDeptName: "string",
        CallTime: "2024-01-09T03:04:04.084Z",
        Mark: "string",
      },
      CallPeople: {},
      MetData: [],
      innerHeight: "",
      huizonginnerHeight: "",
      xiangqinginnerHeight: "",
      checked: true,
      stateModule: "",
      states: [
        {
          value: 0,
          label: "候诊",
        },
        {
          value: 4,
          label: "候诊(迟到)",
        },
        {
          value: 5,
          label: "候诊(复诊)",
        },
        {
          value: 3,
          label: "过号",
        },
        {
          value: 2,
          label: "完成就诊",
        },
        {
          value: 6,
          label: "取消排队",
        },
      ],
    };
  },
  methods: {
    GetCallPeople() {
      this.CallPeople =
        this.MetData.filter((a) => a.state == 1)[0] == undefined
          ? { PatientName: "暂无患者" }
          : this.MetData.filter((a) => a.state == 1)[0];
    },
    clickInItPatient() {
      this.patientInfoShow = false;
      this.CardNo = "";
      // this.inItPatient();
    },
    //初始话患者数据
    async inItPatient() {
      this.CardNo = "";
      this.VisitArea.ScreensID = this.VisitAreaoptions[0].ScreensID;
      this.patient = {
        PatientInfo: {
          PatientName: "患者姓名",
          Sex: "男",
          AgeStr: "年龄",
          // EmergencyRoomNumber: "门急诊号",
          // CardNumber: "就诊卡号",
          // RegistrationOffice: "挂号科室",
          Doctors: "挂号医生",
          RecordDate: "预约就诊时间",
          VisitAreaID: "选项1", //就诊诊区ID
          DepartmentID: "", //就诊诊室ID
          Department: "挂号科室",
          IdCardNo: "身份证号",
          PatientID: "门急诊号",
        },
        patinetVisitInfo: {
          AgeStr: "年龄",
          DeptName: "诊室名称",
          DoctorName: "医生姓名",
          PatientCard: "门诊卡号",
          PatientCode: "门急诊号",
          PatientName: "患者姓名",
          RegTime: "预约就诊时间",
          Sex: "",
        },
        SignState: "",
      };
      await this.GetScreenDeptInfo(this.VisitArea.ScreensID);
    },
    async handleClick(tab, event) {
      console.log(tab, tab.paneName);
      if (this.activeName == "first") {
        await this.GetVisitAreaoptionsDetails();
      }
    },
    handleClose() {},
    async GetSignInfoBtnByCode() {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetSignInfoBtnByCode", {
          code: localStorage.getItem("SignCode"),
        })
        .then((response) => {
          console.log(response);
          this.GetSignInfoBtnOutput = response;
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    async GetGuideCardBtnData() {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetGuideCardBtnData", {
          Gid: this.GetSignInfoBtnOutput.Gid,
          BtnID: this.GetSignInfoBtnOutput.SignBtns[0].BtnID,
          CardNo: this.CardNo.trim(),
        })
        .then(async (response) => {
          console.log("GetGuideCardBtnData", response);
          var Ischeck = this.checked; //是否启动签到
          if (response.data == null) {
            this.patientInfoShow = true;
            this.msg = response.msg;
            this.inItPatient();
          } else {
            this.patient = response.data;
            this.patient.PatientInfo.SourceType = "普通";
            this.msg = null;
            //有些状态没有诊室ID，手动选择诊区和诊室
            var index = this.Clinicoptions.findIndex((item) => {
              return item.DeptId == this.patient.PatientInfo.DepartmentID;
            });
            if (
              this.patient.SignState == 95 ||
              this.patient.SignState == 96 ||
              this.patient.SignState == 97 ||
              this.patient.SignState == 99 ||
              this.patient.SignState == 98
            ) {
              var title =
                this.patient.SignState == 95
                  ? "没挂医生,"
                  : this.patient.SignState == 96
                  ? "医生未配置叫号,"
                  : this.patient.SignState == 97
                  ? "诊室未配置,"
                  : this.patient.SignState == 98
                  ? "医生未开诊,"
                  : "";
              this.$alert(title + "请手动选择就诊诊室", "提示", {
                confirmButtonText: "确定",
                callback: (action) => {},
              });
              this.patient.PatientInfo.DepartmentID =
                this.Clinicoptions[0].DeptId;
              Ischeck = false; //不能自动签到需要手动签到
            } else if (index == -1) {
              //该诊区没有该诊室的话手动选择诊室
              this.$alert(
                "该患者" +
                  this.patient.PatientInfo.PatientName +
                  "不在本诊区就诊，请手动选择就诊诊室",
                "提示",
                {
                  confirmButtonText: "确定",
                  callback: (action) => {},
                }
              );
              this.patient.PatientInfo.DepartmentID =
                this.Clinicoptions[0].DeptId;
              Ischeck = false; //不能自动签到需要手动签到
            }

            await this.VerifyPatientSign(Ischeck);
            // this.SignState = response.data.SignState;
          }
          // this.GetSignInfoBtnOutput = response.data;
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //验证患者是否签到
    async VerifyPatientSign(Ischeck) {
      this.fullscreenLoading = true;
      var CheckType = this.Clinicoptions.find((item) => {
        return item.DeptId == this.patient.PatientInfo.DepartmentID;
      }).DeptQueue;
      await this.$store
        .dispatch("patientCheckIn/VerifyPatientSign", {
          PatientID: this.patient.PatientInfo.PatientID,
          CheckType: CheckType,
          RecordDate: this.patient.PatientInfo.RecordDate,
        })
        .then(async (response) => {
          console.log("VerifyPatientSign", response);
          this.PatientSign = response;
          if (this.PatientSign.IsSign) {
            this.patientInfoShow = true;
          }
          if (Ischeck) {
            //自动签到
            await this.ConfirmPatientBtnSign();
          }
        })
        .catch((error) => {
          console.log("VerifyPatientSignerr", error);
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据登录账号获取登记诊区信息
    async GetGuideScreensInfo() {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetGuideScreensInfo", {
          guideCode: localStorage.getItem("UserNo"),
        })
        .then(async (response) => {
          console.log("GetGuideScreensInfo", response);
          this.VisitAreaoptions = response;
          this.VisitArea.ScreensID = this.VisitAreaoptions[0].ScreensID;
          console.log(this.VisitAreaoptions);
          await this.GetScreenDeptInfo(this.VisitAreaoptions[0].ScreensID);
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据登录账号获取汇总诊区信息
    async GetVisitAreaoptionsDetails() {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetGuideScreensInfo", {
          guideCode: localStorage.getItem("UserNo"),
        })
        .then(async (response) => {
          console.log("GetVisitAreaoptionsDetails", response);
          this.VisitAreaoptionsDetails = response;
          this.VisitAreaDetails.ScreensID = this.VisitAreaoptions[0].ScreensID;
          await this.GetDepartmentDetails(this.VisitAreaDetails.ScreensID);
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据登录账号获取详情诊区信息
    async GetselectVisitAreaoptionsDetails() {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetGuideScreensInfo", {
          guideCode: localStorage.getItem("UserNo"),
        })
        .then(async (response) => {
          console.log("GetselectVisitAreaoptionsDetails", response);
          this.selectVisitAreaoptionsDetails = response;

          this.selectInfo.selectVisitArea =
            this.selectVisitAreaoptionsDetails[0].ScreensID;
          await this.GetselectClinicoptions(this.selectInfo.selectVisitArea);
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据登记选择的诊区信息获取诊室信息
    async GetScreenDeptInfo(screenId, state) {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetScreenDeptInfo", {
          screenId: screenId,
        })
        .then((response) => {
          console.log("GetScreenDeptInfo", response);
          this.Clinicoptions = response;
          if (this.patient.PatientInfo.DepartmentID == "") {
            this.patient.PatientInfo.DepartmentID =
              this.Clinicoptions[0].DeptId;
          }
          if (state == "change") {
            this.patient.PatientInfo.DepartmentID =
              this.Clinicoptions[0].DeptId;
          }
          console.log(this.Clinicoptions);
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据汇总选择的诊区信息显示诊室信息
    async GetDepartmentDetails(screenId) {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetScreenDeptInfo", {
          screenId: screenId,
        })
        .then(async (response) => {
          console.log("GetDepartmentDetails", response);
          this.DepartmentDetails = response;
          console.log(this.Clinicoptions);
          this.VisitAreaWaitingNum = 0;
          this.VisitAreaNotCheckInNum = 0;
          this.VisitAreaCompletedNum = 0;
          this.DepartmentDetails.filter(async (item) => {
            await this.GetDocIntro(item);
            await this.GetCallListInputTotleDept(item, 0); //获取候诊人数
            await this.GetCallListInputTotleDept(item, 2); //获取已完成人数
            this.VisitAreaWaitingNum +=
              item.WaitingNum == undefined ? 0 : item.WaitingNum;
            this.VisitAreaNotCheckInNum +=
              item.NotCheckInNum == undefined ? 0 : item.NotCheckInNum;
            this.VisitAreaCompletedNum +=
              item.CompletedNum == undefined ? 0 : item.CompletedNum;
          });
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据详情页的诊区信息获取诊室信息
    async GetselectClinicoptions(screenId, state) {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetScreenDeptInfo", {
          screenId: screenId,
        })
        .then((response) => {
          console.log("selectClinicoptions", response);
          this.selectClinicoptions = response;
          if (state != "change") {
            this.selectInfo.selectClinic = this.selectClinicoptions[0].DeptId;
          }

          console.log(this.Clinicoptions);
          //根据查询诊区诊室获取医生信息
          this.GetselectDocIntro();
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据输入的患者信息的诊室信息查诊区，并且选择到相应诊室
    async GetDocScreenInfo(DeptId) {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetDocScreenInfo", {
          deptid: DeptId,
        })
        .then(async (response) => {
          console.log("GetDocScreenInfo", response);
          this.VisitArea = {
            ScreensID: response.ID,
            ScreensName: response.Name,
          };
          await this.GetScreenDeptInfo(this.VisitArea.ScreensID);
          console.log(this.VisitArea);
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //汇总获取医生信息
    async GetDocIntro(DepartmentDetailsItem) {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetDocIntro", {
          ID: this.VisitAreaDetails.ScreensID,
          DeptID: DepartmentDetailsItem.DeptId,
        })
        .then(async (response) => {
          this.$set(DepartmentDetailsItem, "Doctor", response.Intro2);
          this.$set(DepartmentDetailsItem, "DoctorNo", response.ASID);
          console.log("GetDocIntro", response);
          //获取未签到
          await this.GetNotSignDataNum(DepartmentDetailsItem, response.ASID);
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },

    //详情页获取医生信息
    GetselectDocIntro(state) {
      this.fullscreenLoading = true;
      this.$store
        .dispatch("patientCheckIn/GetDocIntro", {
          ID: this.selectInfo.selectVisitArea,
          DeptID: this.selectInfo.selectClinic,
        })
        .then((response) => {
          console.log("GetselectDocIntro", response);
          if (response != null) {
            this.selectInfo.selectDoc = response.Intro2;
            this.selectInfo.selectDocNo = response.ASID;
          } else {
            this.selectInfo.selectDoc = "医生未开诊";
            this.selectInfo.selectDocNo = "";
          }
          //更换医生信息后，根据医生是否开诊判断状态
          this.changeselectDoc(state);
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    async selectPatientInfos() {
      if (this.selectInfo.selectStatus == -1) {
        //未签到
        await this.GetNotSignData();
      } else {
        //候诊/已完成
        await this.GetCallListInputPage();
      }
    },
    //根据屏幕和诊室获取所有该诊室的患者信息
    GetCallListInput() {
      this.fullscreenLoading = true;
      this.$store
        .dispatch("patientCheckIn/GetCallListInput", {
          ID: this.selectInfo.selectVisitArea,
          DeptID: this.selectInfo.selectClinic,
        })
        .then(async (response) => {
          console.log("GetCallListInput", response);
          this.MetData = response;
          this.GetCallPeople(); //获取正在呼叫
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据查询信息查询患者信息
    async GetCallListInputPage() {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetCallListInputPage", {
          index: 1,
          page: 2000,
          state: this.selectInfo.selectStatus,
          ScreensID: this.selectInfo.selectVisitArea,
          DeptId: this.selectInfo.selectClinic,
        })
        .then(async (response) => {
          console.log("GetCallListInputPage", response);
          this.tableData = response.Data;
          await this.GetCallListInput(); //获取正在呼叫
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //根据汇总信息查询患者信息数量
    async GetCallListInputTotleDept(DepartmentDetailsItem, state) {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/GetCallListInputTotleDept", {
          state: state,
          DeptId: DepartmentDetailsItem.DeptId,
        })
        .then((response) => {
          console.log("GetCallListInputTotleDept", response);
          if (state == 2) {
            //已完成
            this.$set(DepartmentDetailsItem, "CompletedNum", response);
          }
          if (state == 0) {
            //候诊
            this.$set(DepartmentDetailsItem, "WaitingNum", response);
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //详情获取未签到数据(导诊)
    GetNotSignData() {
      this.fullscreenLoading = true;
      var Queue = this.selectClinicoptions.find((item) => {
        return item.DeptId == this.selectInfo.selectClinic;
      }).DeptQueue;
      this.$store
        .dispatch("patientCheckIn/GetNotSignData", {
          SignBtnID: this.GetSignInfoBtnOutput.SignBtns[0].BtnID,
          Queue: [Queue],
          DeptID: this.selectInfo.selectClinic,
          DoctorCode: this.selectInfo.selectDocNo,
        })
        .then((response) => {
          console.log("GetNotSignData", response);
          this.tableData = response;
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //汇总获取未签到数据(导诊)
    GetNotSignDataNum(DepartmentDetailsItem, DoctorNo) {
      console.log(DoctorNo);
      this.fullscreenLoading = true;
      this.$store
        .dispatch("patientCheckIn/GetNotSignData", {
          SignBtnID: this.GetSignInfoBtnOutput.SignBtns[0].BtnID,
          Queue: [DepartmentDetailsItem.DeptQueue],
          DeptID: DepartmentDetailsItem.DeptId,
          DoctorCode: DoctorNo,
        })
        .then((response) => {
          console.log("GetNotSignDataNum", response.length);
          this.$set(DepartmentDetailsItem, "NotCheckInNum", response.length);
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //按钮确认签到
    async ConfirmPatientBtnSign() {
      this.fullscreenLoading = true;
      var CheckType = this.Clinicoptions.find((item) => {
        return item.DeptId == this.patient.PatientInfo.DepartmentID;
      });
      this.patient.PatientInfo.Department = CheckType.DeptName;
      this.patient.PatientInfo.CheckType = CheckType.DeptQueue;
      this.patient.PatientInfo.RecordDate = new Date(); //登记时将登记时间设为当天
      console.log(
        "this.patient.PatientInfo.RecordDate",
        this.patient.PatientInfo.RecordDate
      );
      await this.$store
        .dispatch("patientCheckIn/ConfirmPatientBtnSign", {
          Gid: this.GetSignInfoBtnOutput.Gid,
          BtnID: this.GetSignInfoBtnOutput.SignBtns[0].BtnID,
          PatientInfo: this.patient.PatientInfo,
          Belate: true,
          Further: true,
          Priority: true,
        })
        .then(async (response) => {
          console.log("ConfirmPatientBtnSign", response);

          if (response.result) {
            this.CheckIn = true;
            this.patientInfoShow = true;
            this.PatientSign = response.data;
            //跳转到详情页并且切换到患者相应诊室
            this.activeName = "second";

            this.selectInfo.selectStatu = 0;
            this.selectInfo.selectVisitArea = this.VisitArea.ScreensID;
            this.selectInfo.selectClinic =
              this.patient.PatientInfo.DepartmentID;
            //更新诊室
            await this.GetselectClinicoptions(
              this.selectInfo.selectVisitArea,
              "change"
            );
            await this.GetselectDocIntro();
            await this.GetCallListInputPage();
          } else {
            this.$message({
              showClose: true,
              message: response.msg,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$message({
            showClose: true,
            message: error.msg,
            type: "error",
          });
        })
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    //点击人数跳转详情
    async changeSecond(item, state) {
      this.activeName = "second";
      console.log(state);
      this.selectInfo.selectVisitArea = this.VisitAreaDetails.ScreensID;
      this.selectInfo.selectClinic = item.DeptId;
      //更新诊室
      await this.GetselectClinicoptions(
        this.selectInfo.selectVisitArea,
        "change"
      );
      await this.GetselectDocIntro(state);
    },
    //更换诊区
    async changeVisitArea() {
      //更换签到中中诊区更换签到诊室
      await this.GetScreenDeptInfo(this.VisitArea.ScreensID, "change");
    },
    async changeVisitAreaDetails() {
      //更换汇总中诊区更换诊室显示
      await this.GetDepartmentDetails(this.VisitAreaDetails.ScreensID);
    },
    async changeselectVisitArea() {
      //更换详情中查询诊区更换查询诊室
      await this.GetselectClinicoptions(this.selectInfo.selectVisitArea);
    },
    async changeselectClinic() {
      //更换详情中查询诊室更换查询医生
      this.GetselectDocIntro();
    },
    async changeselectDoc(state) {
      //医生如果未开诊只能查询候诊
      if (this.selectInfo.selectDocNo == "") {
        this.selectStatusoptions = [
          {
            value: 0,
            label: "候诊",
          },
          {
            value: 2,
            label: "已完成",
          },
        ];
        this.selectInfo.selectStatus =
          state != undefined ? state : this.selectStatusoptions[0].value;
      } else {
        //有医生三种状态
        this.selectStatusoptions = [
          {
            value: 0,
            label: "候诊",
          },
          {
            value: -1,
            label: "未签到",
          },
          {
            value: 2,
            label: "已完成",
          },
        ];
        this.selectInfo.selectStatus =
          state != undefined ? state : this.selectStatusoptions[0].value;
      }
      //初始话患者信息数据
      await this.selectPatientInfos();
    },
    async changeSelectStatus() {
      //初始话患者信息数据
      await this.selectPatientInfos();
    },
    async DeleteCallById(id) {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/DeleteCallById", {
          Id: id,
        })
        .then(async (response) => {
          console.log("DeleteCallById", response);
          if (response) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            await this.GetCallListInputPage();
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    async UpdateCallListStatus(id) {
      this.fullscreenLoading = true;
      await this.$store
        .dispatch("patientCheckIn/UpdateCallListStatus", {
          CallId: id,
          Status:
            this.stateModule == 4 || this.stateModule == 5
              ? 0
              : this.stateModule,
          BeLate: this.stateModule == 4,
          FurtherVisit: this.stateModule == 5,
        })
        .then(async (response) => {
          console.log("UpdateCallListStatus", response);
          if (response) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            await this.GetCallListInputPage();
          }
        })
        .catch((error) => {})
        .finally(() => {
          this.fullscreenLoading = false;
        });
    },
    handleDelete(index, row) {
      console.log(index, row);
      //取消排队
      if (this.stateModule == 6) {
        this.$confirm("是否取消该患者" + row.PatientName + "的排队", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.DeleteCallById(row.id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
      } else {
        this.$confirm(
          "是否更改该患者" +
            row.PatientName +
            "的状态为" +
            this.states.find((item) => item.value == this.stateModule).label,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            this.UpdateCallListStatus(row.id);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作",
            });
          });
      }
    },
    //时间格式化
    formatDate(row, column) {
      // 获取单元格数据
      let data = row[column.property];
      if (data == null) {
        return null;
      }
      let dt = new Date(data);
      return (
        dt.getFullYear() +
        "-" +
        (dt.getMonth() + 1) +
        "-" +
        dt.getDate() +
        " " +
        dt.getHours() +
        ":" +
        dt.getMinutes() +
        ":" +
        dt.getSeconds()
      );
    },
  },
  async mounted() {
    //根据登录工号获取签到btn信息
    await this.GetSignInfoBtnByCode();
    //签到中获取诊区诊室信息
    await this.GetGuideScreensInfo();
    //汇总中获取诊区诊室信息
    await this.GetVisitAreaoptionsDetails();
    //详情中获取诊区诊室信息
    await this.GetselectVisitAreaoptionsDetails();
    this.innerHeight = window.innerHeight - 80;
    this.huizonginnerHeight = window.innerHeight - 80 - 66 - 68;
    this.xiangqinginnerHeight = window.innerHeight - 80 - 65 - 65 - 115;
  },
  watch: {
    async VisitArea() {
      //更换诊区
    },
  },
};
</script>
<style lang="scss" scoped>
.text {
  font-size: 14px;
  // text-decoration: underline;
  // color: red;
  cursor: pointer;
}
.textdiv {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.textnum {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  text-align: center;
  line-height: 60px;
}
.texthouzhen {
  background: #409eff;
  color: white;
}
.textweiqiandao {
  background: #fafcff;
  color: #409eff;
  border: 1px solid #b4d9ff;
}
.textyiwancheng {
  background: #f2f2f2;
  color: #898989;
}
.item {
  margin-bottom: 18px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.clearfix {
  text-align: center;
}

.box-card {
  width: 31%;
  margin: 10px;
}

.patientCheckIn {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: #898989;
}

.patientCheckInInfo {
  width: 25%;
  // height: 100%;
  // height: 880px;
  padding: 20px;
  line-height: 60px;
  background-color: #f5faff;
}

.consultationAreaInfo {
  width: 75%;
  height: 100%;
  // padding: 20px;
  line-height: 50px;
  // margin: 10px;
}

.primarybutton {
  width: 100%;
}

.VisitArea,
.Clinic {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selectDetails {
  display: flex;
  align-items: center;
  // margin-bottom: 20px;
  border-bottom: 1px solid #e4e7ed;
  background: white;
  padding: 15px 15px 0;
}
::v-deep .el-tabs__header {
  background: white;
  margin: 0;
  padding: 15px 15px 0;
}
.selectText {
  margin-left: 20px;
}

.selectInfo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  padding: 15px 15px 0;
}
.DateOfEnquiry,
.selectVisitArea,
.selectClinic,
.selectStatus,
.selectDoc {
  width: 16%;
}
.patientAge {
  margin-left: 10px;
}

.patientName {
  font-weight: bold;
  font-size: 18px;
}

.dialogTips {
  font-size: 36px;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-content: stretch;
  justify-content: center;
  line-height: 40px;
  color: #43a543;
}

.dialogClinicID {
  margin-left: 20px;
}
.dialogVisitAreaID,
.dialogClinicID {
  font-size: 30px;
  font-weight: bold;
}

::v-deep .selectStatusoption,
.selectClinicoption,
.selectVisitAreaoption,
.DateOfEnquirypicker,
.selectDocoption {
  width: 140px;
}
::v-deep .el-table__body {
  line-height: 20px;
}
::v-deep .el-table__header {
  line-height: 20px;
}
</style>