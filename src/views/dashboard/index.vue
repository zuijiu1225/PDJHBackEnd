<template>
  <div class="app-container">
    <!-- 上面一行显示各部门排队人数   -->
    <el-row
      v-for="(i, RowIndex) in DepartmentRowLength"
      :key="RowIndex"
      class="RowCard"
      :gutter="8"
      :v-loading="loadingBool"
    >
      <el-col
        v-for="(item, index) in DepartmentsData[RowIndex]"
        :key="index"
        :span="24 / DepartmentsData[RowIndex].length"
        :xs="12"
      >
        <el-card
          :class="{
            caichao: item.sflbbigtype == 'US',
            xindian: item.sflbbigtype == '09',
            weijing: item.sflbbigtype == '30',
            zhongyao: item.sflbbigtype == 'ZYYP',
            cigongzhen: item.sflbbigtype == 'MRI',
            fangshe: item.sflbbigtype == 'CT',
            dr: item.sflbbigtype == 'XR',
            dr: item.sflbbigtype == 'DR',
            cs: item.sflbbigtype == 'CS',
            XYF: item.sflbbigtype == 'XYF',
            xindian: item.sflbbigtype == 'XD',
            jianyanchouxue: item.sflbbigtype == 'JYCX',
          }"
        >
          <span style="color: white">{{ item.Name }}</span>
          <el-row>
            <el-col :span="10" style="b">
              <p class="p1">
                <span
                  style="font-size: 23px; color: white; font-weight: bold"
                  >{{ item.Total }}</span
                >
                <span style="color: white">人</span>
              </p>
            </el-col>
            <el-col :span="14" style="text-align: right">
              <div class="yuan yuanColor">
                <svg-icon
                  class-name="international-icon"
                  :icon-class="item.sflbbigtype"
                />
              </div>
            </el-col>
          </el-row>
          <span style="color: white">当前排队人数</span>
        </el-card>
      </el-col>
    </el-row>

    <!-- 下面一行统计图 -->
    <el-row style="margin-top: 20px" :gutter="8">
      <!-- 折线图 -->
      <el-col :span="18" :xs="24">
        <el-card style="text-align: center">
          <div
            v-loading="eChartsLoadingBool"
            id="myChart"
            style="width: 100%; height: 300px"
          ></div>
        </el-card>
      </el-col>

      <!-- 选择往日日期统计 -->
      <el-col :span="6" :xs="24">
        <el-card>
          <div class="TimeRight">
            <div class="TipsText">可查看过去一周的统计</div>
            <el-date-picker
              v-model="value"
              align="right"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              :clearable="false"
              :picker-options="pickerOptions"
              @change="DateChange"
              style="margin-bottom: 30px"
            >
            </el-date-picker>

            <!-- 天气插件 -->
            <!-- <iframe
              scrolling="no"
              src="https://tianqiapi.com/api.php?style=ya&skin=pitaya"
              frameborder="0"
              width="250"
              height="150"
              allowtransparency="true"
            ></iframe> -->

            <el-divider></el-divider>
            <div class="TipsText" style="padding-bottom: 10px">
              可单独选择诊室查看
            </div>
            <el-checkbox-group v-model="CheckQueue" @change="changeS">
              <diV v-for="(item, index) in this.Departments" :key="index">
                <el-checkbox :label="item.Queue">{{ item.Name }}</el-checkbox>
              </diV>
            </el-checkbox-group>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      QueueingTime: "",
      CheckQueue: [],
      Departments: [],
      input1: "11日",
      loadingBool: false,
      eChartsLoadingBool: false,
      DepartmentsData: [],
      DepartmentRowLength: 0, //卡片行数
      pickerOptions: {
        disabledDate(time) {
          const date = new Date();
          return (
            time.getTime() > Date.now() ||
            time.getTime() < date.getTime() - 3600 * 1000 * 24 * 8
          );
        },
        shortcuts: [
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      value: new Date(),
      myCharts: {},
      option: {
        title: {
          text: "各时间段排队情况",
          textStyle: {
            fontSize: 15,
          },
        },
        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["06", "09", "30", "yf"],
        },
        grid: {
          left: "0%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
            magicType: {
              type: ["line", "bar", "stack"],
            },
          },
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "00:00",
            "02:00",
            "04:00",
            "06:00",
            "08:00",
            "10:00",
            "12:00",
            "14:00",
            "16:00",
            "18:00",
            "20:00",
            "22:00",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [],
      },
    };
  },
  methods: {
    //获取卡片上每个诊室的排队人数
    getDepartments() {
      this.loadingBool = true;
      this.$store
        .dispatch("dashboard/getDepartments")
        .then((response) => {
          // this.DepartmentsData = response;
          this.DepartmentRowLength = Math.ceil(response.length / 4);
          for (let index = 0; index < response.length; index++) {
            if (index % 4 == 0) {
              this.DepartmentsData.push(response.splice(0, 4));
            }
            if (index == response.length - 1) {
              this.DepartmentsData.push(response);
            }
          }
          this.loadingBool = false;
        })
        .catch((error) => {
          console.log("getDepartmentserror", error);
          this.$message.error("服务器错误，无法获取排队人数！");
          this.loadingBool = false;
        });
    },
    //获取折线图统计每个时间段每个诊室的排队人数情况
    getDepartmentQueueTime(QueueingTime, CheckQueue) {
      this.eChartsLoadingBool = true;
      this.$store
        .dispatch("dashboard/getDepartmentQueueTime", {
          QueueingTime,
          CheckQueue,
        })
        .then((response) => {
          if (response.Series.length == 0) {
            this.$message({
              message: "没有" + QueueingTime + "日的数据统计",
              type: "warning",
            });
            this.eChartsLoadingBool = false;
          }
          this.CheckQueue = response.Queue;
          this.option.legend.data = response.legend;
          this.option.series = response.Series;
          this.myCharts.clear();
          this.myCharts.setOption(this.option);
          this.eChartsLoadingBool = false;
        })
        .catch((error) => {
          this.$message.error("服务器错误，无法统计数据！"); //error
          this.eChartsLoadingBool = false;
        });
    },
    // 加载 统计图
    darwinl() {
      // 基于准备好的dom，初始化echarts实例
      let echarts = this.$echarts.init(document.getElementById("myChart"));
      this.myCharts = echarts;
      this.myCharts.setOption(this.option, true);
    },
    // 选择日期改变事件
    DateChange(date) {
      this.QueueingTime = date;
      this.getDepartmentQueueTime(date, this.CheckQueue);
    },
    //循环抓取每个时间段排队人数
    LoopQueueingData() {
      let nowDate = new Date();
      var sysTime =
        nowDate.getFullYear() +
        "-" +
        (nowDate.getMonth() + 1 >= 9
          ? nowDate.getMonth() + 1
          : "0" + (nowDate.getMonth() + 1)) +
        "-" +
        (nowDate.getDate() >= 10 ? nowDate.getDate() : "0" + nowDate.getDate());
      //获取折线图上的每个时间段得人数统计 这一次用作于初始第一次
      this.getDepartmentQueueTime(sysTime, null);
      this.QueueingTime = sysTime;
      setInterval(() => {
        //之后每隔20分钟触发一次
        this.getDepartmentQueueTime(sysTime, null);
      }, 1000 * 60 * 20);

      //每隔五分钟 抓取一次卡片上每个诊室的排队人数
      setInterval(() => {
        this.getDepartments();
      }, 1000 * 60 * 5);
    },
    //获取右边的所有诊室
    getAllDepartment() {
      this.$store
        .dispatch("department/getAllDepartment3")
        .then((response) => {
          response.filter((item) => {
            if (item.Type == 1) {
              var obj = {
                Name: item.Name,
                Queue: item.Queue,
              };
              this.Departments.push(obj);
            }
          });
        })
        .catch((error) => {});
    },
    //勾选诊室时改变事件
    changeS(CheckQueue) {
      console.log(CheckQueue);
      console.log(this.CheckQueue);
      this.getDepartmentQueueTime(this.QueueingTime, this.CheckQueue);
    },
  },
  mounted() {
    this.darwinl();
    //获取卡片上的诊室人数统计
    this.getDepartments();
    //开启定时器 循环获取时间段排队人数据
    this.LoopQueueingData();
    //获取右边的所有诊室
    this.getAllDepartment();
  },
  //actovated 函数 每次进入组件触发一次
  activated() {
    //每次触发都去抓取卡片上的排队人数
    this.getDepartments();
  },
};
</script>

<style lang="scss" scoped>
.RowCard {
  margin: 3px 0px;
}
.p1 {
  margin: 10px 0px;
}
.el-divider {
  margin: 0px 0px 16px 0px;
}
.TimeRight {
  width: 100%;
  height: 300px;
  line-height: 20px;
  .TipsText {
    color: #409eff;
    font-size: 14px;
  }
}
.yuan {
  width: 45;
  height: 45px;
  border-radius: 50%;
  background-color: white;
  text-align: center;
  line-height: 45px;
  display: inline-block;
  .international-icon {
    font-size: 45px;
    font-weight: bolder;
    vertical-align: middle;
  }
}
.caichao {
  background-color: #0097e6;
  .yuanColor {
    background-color: #00a8ff;
  }
}
.XYF {
  background-color: #c3a9a9;
  .yuanColor {
    background-color: #b59696;
  }
}
.jianyanchouxue {
  background-color: #e90b0b;
  .yuanColor {
    background-color: #960707;
  }
}
.cs {
  background-color: #000000;
  .yuanColor {
    background-color: #3f3e3e;
  }
}
.xindian {
  background-color: #eb3b5a;
  .yuanColor {
    background-color: #fc5c65;
  }
}

.weijing {
  background-color: #8854d0;
  .yuanColor {
    background-color: #a55eea;
  }
}

.zhongyao {
  background-color: #20bf6b;
  .yuanColor {
    background-color: #26de81;
  }
}
.cigongzhen {
  background-color: #303952;
  .yuanColor {
    background-color: #596275;
  }
}
.fangshe {
  background-color: #84817a;
  .yuanColor {
    background-color: #d1ccc0;
  }
}
.dr {
  background-color: #01a3a4;
  .yuanColor {
    background-color: #00d2d3;
  }
}
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
