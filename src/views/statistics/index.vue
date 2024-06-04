<template>
  <div class="app-container">
    <el-card>
      <!-- 分割线 -->
      <el-divider content-position="left"
        ><span style="color: #409eff; font-size: 16px"
          >医生工作量</span
        ></el-divider
      >
      <!-- 条件查询区域 -->
      <el-row :gutter="10">
        <el-form :model="QueryForm">
          <el-col :span="6" :xs="24">
            <el-form-item label="用户名" label-width="60px">
              <el-input v-model="QueryForm.Name" placeholder="请输入用户名(支持模糊查询)" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="18">
            <el-form-item label="日期">
              <el-date-picker
                v-model="QueryForm.Date"
                align="right"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :clearable="true"
                :picker-options="pickerOptions"
                @change="DateChange"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="6">
            <el-button
              type="primary"
              icon="el-icon-search"
              circle
              @click.native="QueryClick"
            ></el-button>
          </el-col>
        </el-form>
      </el-row>
    
      <!-- 内容 -->
      <el-row :gutter="8">
        <el-col :span="24">
          <!-- 表格 -->
          <el-table :data="DoctorCallCountData" style="width: 100%">
            <el-table-column prop="UserNo" label="账户" width="180">
            </el-table-column>
            <el-table-column prop="Name" label="用户名"> </el-table-column>
            <el-table-column prop="Count" label="累计呼叫的人数"> </el-table-column>
            <!-- <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleClick(scope.row)"
                  type="primary"
                  size="small"
                  >查看详情</el-button
                >
              </template>
            </el-table-column> -->
          </el-table>
          <!-- 分页 -->
               <el-pagination
          background
          @size-change="SizeChange"
          @prev-click.native="PagePrev"
          @current-change="PageChange"
          @next-click="PageNext"
          :current-page="1"
          :page-sizes="[5, 10, 20, 30]"
          :page-size="PageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="TotalCount"
        >
        </el-pagination>
        </el-col>
      </el-row>


    </el-card>
  </div>
</template>

<script>
export default {
  name: "statistics",
  data() {
    return {
      PageIndex:1,
      PageSize:5,
      TotalCount:0,
      DoctorCallCountData: [],
      QueryForm: {
        Name: "",
        Date: "",
      },
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
         }
    };
  },
  methods: {
    //条件查询
    QueryClick() {
      this.getDoctorCallCount()
    },
    //每页显示的条数改变时
    SizeChange(size){
      this.PageSize=size
      this.getDoctorCallCount()
    },
    // 上一页
    PagePrev(index){
      this.PageIndex=index
      this.getDoctorCallCount()
    },
    //页码改变
    PageChange(index){
        this.PageIndex=index
        this.getDoctorCallCount()
    },
    //下一页
    PageNext(index){
        this.PageIndex=index
        this.getDoctorCallCount()
    },
    init() {
      const data = genData(3);
      let myecharts = this.$echarts.init(document.getElementById("myecharts"));
      var option = {
        title: {
          left: "center",
          text: "累计",
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: data.legendData,
        },
        series: [
          {
            name: "姓名",
            type: "pie",
            radius: "75%",
            center: ["40%", "50%"],
            data: data.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      var option2 = {
        legend: {
          top: "bottom",
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: [30, 100],
            center: ["50%", "50%"],
            roseType: "area",
            itemStyle: {
              borderRadius: 8,
            },
            data: [
              { value: 40, name: "rose 1" },
              { value: 38, name: "rose 2" },
              { value: 32, name: "rose 3" },
              { value: 30, name: "rose 4" },
              { value: 28, name: "rose 5" },
              { value: 26, name: "rose 6" },
              { value: 22, name: "rose 7" },
              { value: 18, name: "rose 8" },
            ],
          },
        ],
      };

      myecharts.setOption(option);
      function genData(count) {
        // prettier-ignore
        const nameList = [
        '赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危'
    ];
        const legendData = [];
        const seriesData = [];
        for (var i = 0; i < count; i++) {
          var name =
            Math.random() > 0.65
              ? makeWord(4, 1) + "·" + makeWord(3, 0)
              : makeWord(2, 1);
          legendData.push(name);
          seriesData.push({
            name: name,
            value: Math.round(Math.random() * 100000),
          });
        }
        return {
          legendData: legendData,
          seriesData: seriesData,
        };
        function makeWord(max, min) {
          const nameLen = Math.ceil(Math.random() * max + min);
          const name = [];
          for (var i = 0; i < nameLen; i++) {
            name.push(
              nameList[Math.round(Math.random() * nameList.length - 1)]
            );
          }
          return name.join("");
        }
      }
    },
    //统计报表 统计每个医生呼叫了多少人
    getDoctorCallCount() {
      var input={
        PageIndex:this.PageIndex,
        PageSize:this.PageSize,
        Name:this.QueryForm.Name,
        Date:this.QueryForm.Date
      }
      this.$store
        .dispatch("dashboard/getDoctorCallCount",input)
        .then((response) => {
          this.DoctorCallCountData = response.data;
          console.log("啊哈哈",response);
          this.TotalCount=response.pageInfo.totalCount
        })
        .catch((error) => {});
    },
  },
  mounted() {
    this.getDoctorCallCount();
    // this.init();
  },
};
</script>

<style scoped>
.row-con {
  display: flex;
  flex-flow: row wrap;
}
.row-con .card {
  height: 100%;
}
</style>