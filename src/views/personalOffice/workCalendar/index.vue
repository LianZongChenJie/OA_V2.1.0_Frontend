<template>
  <div class="main-content">
    <div class="calendar-box">
      <el-calendar v-model="currentDate">
        <template #header="{ date }">
          <div class="calendar-toolbar">
            <el-select v-model="selectedUid" placeholder="请选择员工" clearable>
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.nickName"
                :value="item.userId"
              />
            </el-select>
          </div>
          <div class="calendar-toolbar-center">
            {{ date }}
          </div>
          <div class="calendar-toolbar-right">
            <el-button-group>
              <el-button @click="selectDate('prev-month')"> 上个月 </el-button>
              <el-button @click="selectDate('today')">当月</el-button>
              <el-button @click="selectDate('next-month')"> 下个月 </el-button>
            </el-button-group>
          </div>
        </template>
        <template #date-cell="{ data }">
          <div
            :class="['calendar-cell', { 'is-selected': isSelected(data.date) }]"
            @click.stop="toggleDate(data.date)"
          >
            <div class="calendar-cell-date">{{ data.day.split("-")[2] }}</div>
            <div class="calendar-cell-list">
              <div
                class="calendar-cell-content"
                v-for="item in dateList[getDateKey(data.date)]"
                :key="item.itemId"
                @click.stop="handleScheduleClick(item)"
              >
                {{ item.content }}
              </div>
            </div>
          </div>
        </template>
      </el-calendar>
    </div>

    <!-- 添加日程弹窗 -->
    <ScheduleModal ref="scheduleModalRef" @success="handleScheduleSuccess" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { ElCalendar, ElMessage } from "element-plus";
import { getDateList } from "@/api/personalOffice/workCalendar";
import { listUser } from "@/api/system/user";
import useUserStore from "@/store/modules/user";
import ScheduleModal from "./components/ScheduleModal.vue";

const userStore = useUserStore();
const selectedUid = ref(userStore.id);
const userOptions = ref([]);

// 加载员工列表
const loadUserOptions = () => {
  listUser({ pageNum: 1, pageSize: 1000 }).then((res) => {
    userOptions.value = res.rows || [];
  });
};

const currentDate = ref(new Date());

const isSelected = (date) => {
  return dateList.value[getDateKey(date)]?.length > 0;
};

// 判断日期是否属于当前显示的月份
const isCurrentMonth = (date) => {
  const d = new Date(date);
  return (
    d.getFullYear() === currentDate.value.getFullYear() &&
    d.getMonth() === currentDate.value.getMonth()
  );
};

// 判断日期是否属于当前日期之前的日期
const isBeforeCurrentDate = (date) => {
  const d = new Date(date);
  const currentDate = new Date();

  return (
    d.getFullYear() < currentDate.getFullYear() ||
    (d.getFullYear() === currentDate.getFullYear() &&
      d.getMonth() < currentDate.getMonth()) ||
    (d.getFullYear() === currentDate.getFullYear() &&
      d.getMonth() === currentDate.getMonth() &&
      d.getDate() < currentDate.getDate())
  );
};

const scheduleModalRef = ref(null);

const toggleDate = (date) => {
  // 禁止选中非当前月份的日期
  if (!isCurrentMonth(date)) {
    return;
  }
  // 禁止选中当前日期之前的日期
  if (isBeforeCurrentDate(date)) {
    ElMessage.warning("不能选择当前日期之前的日期");
    return;
  }
  // 打开添加日程弹窗
  scheduleModalRef.value?.open(date);
};

const handleScheduleClick = (item) => {
  scheduleModalRef.value?.openDetail(item.itemId);
};

// 日程添加成功回调
const handleScheduleSuccess = () => {
  loadCalendarData();
};

const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const getDateKey = (date) => {
  const d = new Date(date);
  const fomratDate = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `date_${fomratDate}`;
};

const dateList = ref({});

// 将接口返回数据转换为 dateList 格式
const transformDateList = (data) => {
  const result = {};

  data.forEach((item) => {
    const startDate = new Date(item.start);
    const endDate = new Date(item.end);

    // 遍历从开始日期到结束日期的每一天
    const current = new Date(startDate);
    while (current <= endDate) {
      const dateKey = `date_${current.getFullYear()}${String(current.getMonth() + 1).padStart(2, "0")}${String(current.getDate()).padStart(2, "0")}`;

      if (!result[dateKey]) {
        result[dateKey] = [];
      }

      result[dateKey].push({
        itemId: item.id,
        beginTime: item.start,
        endTime: item.end,
        content: item.title,
      });

      current.setDate(current.getDate() + 1);
    }
  });

  return result;
};

// 获取月份的第一天和最后一天
const getMonthRange = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  // 当月第一天
  const firstDay = new Date(year, month, 1);
  // 当月最后一天
  const lastDay = new Date(year, month + 1, 0);

  return {
    beginTime: formatDate(firstDay) ,
    endTime: formatDate(lastDay),
  };
};

// 加载日历数据
const loadCalendarData = () => {
  const { beginTime, endTime } = getMonthRange(currentDate.value);
  const params = { beginTime, endTime };
  if (selectedUid.value) {
    params.uid = selectedUid.value;
  }
  getDateList(params).then((res) => {
    if (res.rows) {
      dateList.value = transformDateList(res.rows);
    }
  });
};
const selectDate = (type) => {
  const now = new Date();

  if (type === "prev-month") {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() - 1,
      1,
    );
    if (
      currentDate.value.getMonth() === now.getMonth() &&
      currentDate.value.getFullYear() === now.getFullYear()
    ) {
      currentDate.value = new Date();
    }
  } else if (type === "next-month") {
    currentDate.value = new Date(
      currentDate.value.getFullYear(),
      currentDate.value.getMonth() + 1,
      1,
    );
    if (
      currentDate.value.getMonth() === now.getMonth() &&
      currentDate.value.getFullYear() === now.getFullYear()
    ) {
      currentDate.value = new Date();
    }
  } else if (type === "today") {
    currentDate.value = new Date();
  }
};
// 监听日期变化，切换月份时重新加载数据
watch(currentDate, () => {
  loadCalendarData();
});

// 监听员工选择变化，重新加载数据
watch(selectedUid, () => {
  loadCalendarData();
});

onMounted(() => {
  loadUserOptions();
  loadCalendarData();
});
</script>

<style scoped>
.calendar-toolbar,
.calendar-toolbar-right,
.calendar-toolbar-center {
  min-width: 300px;
  margin: 5px 0;
}
.calendar-toolbar-right {
  text-align: right;
}
.calendar-toolbar-center {
  text-align: center;
}
.calendar-box {
  width: 100%;
  height: calc(100% - 80px);
  background-color: #fff;
  border-radius: 4px;
}
.calendar-cell {
  width: 100%;
  height: 100%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  .calendar-cell-date {
    text-align: right;
    flex-shrink: 0;
  }
  .calendar-cell-list {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  .calendar-cell-content {
    background-color: var(--el-color-error);
    font-size: 13px;
    line-height: 20px;
    font-weight: bold;
    color: var(--el-bg-color);
    padding: 0 5px;
    margin-top: 5px;
  }
  .calendar-cell-content:hover {
    background-color: var(--el-color-error-light-3);
  }
}
:deep(.el-calendar-day) {
  min-height: 120px;
}
.is-selected {
  background-color: var(--el-color-error-light-9);
  /* color: var(--el-color-primary); */
  border-radius: 4px;
}
</style>
