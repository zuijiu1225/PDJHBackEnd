<template>
  <div class="body" v-loading="BodayLoading">
    <!-- 第一行 -->
    <el-row class="row1s" style="border-bottom: 4px solid #7d80ee">
      <el-col :span="12">
        <div class="row1s_tittle">
          <span
            ><img
              src="@/assets/Sign_images/lsfbicon.png"
              alt=""
              style="
                width: 10%;
                vertical-align: middle;
                margin-right: 10px;
              " /></span
          >{{ Title }}
        </div>
      </el-col>
      <el-col :span="12">
        <div class="row1s_time">{{ nowDate }}</div>
        <div class="row1s_time">{{ nowTime }}</div>
      </el-col>
    </el-row>
    <!-- 第二行 -->
    <el-row class="row1daoji">
      <!-- <el-col :span="12" style="position: absolute; bottom: 0px; right: 0">
        <div class="row1_daojitime">{{ daojishi }}</div>
      </el-col> -->
    </el-row>

    <!-- 样式1 -->
    <div class="Patrow">
      <!-- <el-row
        class="row1"
        v-for="j in BtnList"
        :key="j.BtnID"
        v-if="BtnList.length <= 3"
        type="flex"
        justify="center"
      >
        <el-col class="row1_cols">
          <el-button @click="ClickInput(j.BtnID)">{{ j.BtnName }}</el-button>
        </el-col>
      </el-row> -->
      <div style="position: absolute; bottom: 0px; left: 0px">
        <img src="@/assets/Sign_images/国讯股份.png" alt="" />
      </div>
      <el-row class="row2" type="flex" justify="center">
        <el-col
          class="row2_col2"
          :xs="8"
          :sm="8"
          :md="8"
          :lg="8"
          :xl="8"
          v-for="(j, index) in BtnList"
          :key="j.BtnID"
        >
          <!-- <div class="el-button" @click="ClickInput(j.BtnID)">
            {{ j.BtnName }}
          </div> -->
          <el-button @click="ClickInput(j.BtnID)" v-html="j.BtnName">
            <!-- {{  }} -->
          </el-button>
        </el-col>
      </el-row>

      <!-- <el-row class="row2s">
        <div style="position: absolute; bottom: 0px; left: 0px">
          <img src="@/assets/Sign_images/国讯股份.png" alt="" />
        </div>
        <el-col class="row2s_col2" v-for="j in BtnList" :key="j.BtnID">
          <el-button @click="ClickInput(j.BtnID)">{{ j.BtnName }}</el-button>
        </el-col>
      </el-row> -->
    </div>
    <!-- 样式2 -->
    <!-- <el-row class="row2"> </el-row> -->
  </div>
</template>
 
<script>
import {
  GetSignInfoBtnByCode,
  GetCreditCardBtnData,
  VerifyPatientSign,
  ConfirmPatientBtnSign,
  GetDataTime,
} from "@/api/singin2";
export default {
  data() {
    return {
      Title: "排队叫号签到端", //签到端标题
      nowDate: "",
      nowTime: "",
      ProtCode: "02",
      BodayLoading: false,
      BtnList: [
        // {
        //   BtnID: "213132",
        //   BtnName: "门诊住院签到dasdasdassdadasdas",
        // },
        // {
        //   BtnID: "21311312332",
        //   BtnName: "体检签到",
        // },
        // {
        //   BtnID: "21311311112332",
        //   BtnName: "体检1签到",
        // },
        // {
        //   BtnID: "21311311112332",
        //   BtnName: "体检1签到",
        // },
      ], //科室按钮数组
      nowtimer: null,
    };
  },
  methods: {
    gettime() {
      //this.nowDate = new Date().toLocaleString();
      var date = new Date(); //时间对象
      var year = date.getFullYear(); //返回年
      var month = date.getMonth() + 1; //返回0~11 月份
      var day = date.getDate(); //返回天
      var hour = date.getHours(); //返回小时
      var minutes = date.getMinutes(); //返回分
      var second = date.getSeconds(); //返回秒
      var time =
        year +
        "年" +
        month +
        "月" +
        day +
        "日" +
        hour +
        ":" +
        minutes +
        ":" +
        second;
      this.nowDate = time;
    },
    //获取签到端信息
    GetSignInfoBtnByCode() {
      this.BodayLoading = true;
      GetSignInfoBtnByCode(this.ProtCode)
        .then((res) => {
          console.log("获取签到端信息", res, this.ProtCode);
          if (res && res.result == true) {
            const { data } = res;
            this.BtnList = data.SignBtns;
            // if (this.BtnList.length == 0) {
            //   this.$router.replace({ path: "/Singin0/" + this.ProtCode });
            // }

            this.Title = data.Title;
            // this.Gid = data.Gid;
            // this.GetCreditCardDataInput.Gid = data.Gid;
          } else {
            // this.ShowTip = "无法查询到签到端信息。";
            // this.TimingTip();
            this.$message.error(res.msg);
            // this.$message.error("无法查询到签到端信息。");
          }
          this.BodayLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.BodayLoading = false;
          this.$message.error("服务器错误，无法查询到签到端信息！");
        });
    },
    ClickInput(BtnID) {
      clearInterval(this.nowtimer); //停止定时
      localStorage.setItem("BtnID", BtnID); //存储BtnID
      this.$router.push({ path: "/Singin2/" + this.ProtCode });
    },
    //获取时间
    GetDataTime() {
      GetDataTime()
        .then((res) => {
          // console.log("GetDataTime", res);
          let resDate = JSON.parse(res.data);
          this.nowDate =
            resDate.Year + "年" + resDate.Month + "月" + resDate.Day + "日";
          this.nowTime = resDate.Hour24 + ":" + resDate.Minute;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  created() {
    this.ProtCode = this.$route.params.code;
    // console.log('this.ProtCode', this.ProtCode, this.$route.params.code)
  },
  mounted() {
    this.GetDataTime();
    this.nowtimer = setInterval(() => {
      this.GetDataTime();
    }, 60000);
    this.GetSignInfoBtnByCode();
  },
};
</script>
 
<style lang="scss" scoped>
.body {
  width: 100%;
  height: 100%;
  padding: 15px 0px;
  // background-color: #e1f3ff;
  background: url("../../assets/Sign_images/背景图2.png") no-repeat;
  background-size: cover;
}
.row1s {
  // margin: 15px 0px 50px 0px;
  padding-bottom: 20px;
  border-bottom: 4px solid #7d80ee;

  .row1s_tittle {
    font-size: 24px;
    margin-left: 35px;
  }

  .row1s_time {
    font-size: 24px;
    text-align: right;
    margin-right: 25px;
  }
}
.row1daoji {
  padding-bottom: 20px;
  background: url("../../assets/Sign_images/banner1.png");
  background-size: cover;
  height: 300px;
}
.Patrow {
  // margin: 20px auto;
}
.row1 {
  width: 100%;
  // margin: 15px 0px 50px 0px;
  margin: 0px auto;
  padding-bottom: 20px;
  // height: 100%;
  // border-bottom: 4px solid #7d80ee;
  .row1_cols {
    width: 60%;
    height: 100%;
    margin: 0% auto;
    .el-button {
      width: 100%;
      height: 100%;
      font-size: 20px;
      background: url("../../assets/Sign_images/button3.png") no-repeat;
      background-size: cover;
      color: white;
    }
  }
  .row1_col {
    margin-left: 10px;
    margin-right: 10px;
    width: 30%;

    height: 100%;
    // margin: 0% auto;
    .el-button {
      width: 100%;
      height: 100%;
      font-size: 20px;
      background: url("../../assets/Sign_images/button3.png") no-repeat;
      background-size: cover;
      color: white;
    }
  }
  // .row1_tittle {
  //   font-size: 24px;
  //   margin-left: 35px;
  // }

  // .row1_time {
  //   font-size: 24px;
  //   text-align: right;
  //   margin-right: 25px;
  // }
}

.row2 {
  margin-top: 5%;
  // padding: 0px 20%;
flex-wrap: wrap;
  .row2_col1 {
    .row2_input {
      // width: 68%;
      // margin-left: 50px;
      margin-bottom: 20px;

      ::v-deep .el-input__inner {
        height: 50px;
      }
    }

    .row2_tip {
      font-size: 22px;
      // margin-left: 50px;
      margin-top: 10%;
      color: red;
    }
  }

  .row2_col2 {
    // margin-top: 90%;
    width: 30%;
    height: 300px;
    // margin-top: 10%;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 28px;
    .el-button {
      width: 100%;
      height: 100%;
      font-size: 25px;
      background: url("../../assets/Sign_images/button3.png") no-repeat;
      background-size: cover;
      color: white;
      white-space: pre-wrap;
    }
  }
}

// .row2s {
//   margin-top: 5%;
//   padding: 0px 20%;

//   .row2s_col2 {
//     // margin-top: 90%;
//     width: 30%;
//     height: 200px;
//     // margin-top: 10%;
//     margin-left: 10px;
//     margin-right: 10px;
//     .el-button {
//       width: 100%;
//       height: 100%;
//       font-size: 25px;

//       background: url("../../assets/Sign_images/button3.png") no-repeat;
//       background-size: cover;
//       color: white;
//     }
//   }
// }
</style>