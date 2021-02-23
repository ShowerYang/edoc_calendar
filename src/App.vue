<template>
<div id="calOuter" class="cal-outer">
  <!-- cal control -->
  <div class="cal-control-panel">
    <!-- section date -->
    
    <div class="switch-today">
      <q-btn 
        push 
        color="white"
        text-color="primary"
        label="今天"
        class="font-weight"
        @click.stop="setToday"
      >
        <q-tooltip class="today-tooltip"> 
          移至今天
        </q-tooltip>
      </q-btn>
    </div>
    <div class="switch-around">
      <div class="to-left">
        <q-btn
          :dense="mode == 1"
          push
          round
          size="sm"
          color="primary"
          icon="fas fa-chevron-left"              
          @click.stop="controlState(-1)"
        >
          <q-tooltip class="today-tooltip"> 
            上個月
          </q-tooltip>
        </q-btn>
      </div>  
      <div class="to-right">  
        <q-btn
          :dense="mode == 1"
          push
          round
          size="sm"
          color="primary"
          icon="fas fa-chevron-right"
          @click.stop="controlState(1)"
        >
          <q-tooltip class="today-tooltip"> 
            下個月
          </q-tooltip>
        </q-btn>
      </div> 
    </div>
    <div class="display-date">
      <div class="text-outer">
        <div v-if="mode == 1" class="text-container">
          <span class="yymm-content">{{ currentDateText }}</span>
        </div>         
      </div>
    </div>
  </div>
  <!-- cal display -->
  <div class="cal-display-boxes">
    <!-- <div class="cal-side-bar"></div> -->
    <!-- 月 -->
    <template v-show="mode == 1">
      <modeMonth ref="mainMonthContent" :propsMonthData="monthData" @monthSettingDay="monthSettingDay"></modeMonth>
    </template>
  </div>
  <!-- setting panel -->
  <settingPanel ref="settingPanel" @responseSaveDay="responseSaveDay" @onSaveDay="updateExceptionalDays" @clearFocusDay="clearFocusDay"></settingPanel>
  <!-- dialog -->
  <q-dialog
      v-model="msgOpen"
    >
    <q-card :style="{width: '300px', left: ''}">
      <q-card-section style="font-family: Microsoft JhengHei;">
        <div class="text-h6">訊息</div>
      </q-card-section>

      <q-card-section style="font-size: 14px; font-family: Microsoft JhengHei;">
        {{ msg }}
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-blue">
        <!-- <q-btn flat label="關閉" v-close-popup /> -->
        <q-btn 
          flat 
          label="關閉"
          v-close-popup
          style="font-weight: 900;"
          @click.stop="setDialogStatus(false)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</div>
</template>

<script>
import modeMonth from '@/components/modeMonth';
import settingPanel from "@/components/settingPanel";
import { commonFunctions } from '@/commonFunctions.js';
import { setTimeout } from 'timers';
import CalendarDates from "calendar-dates";
import datesData from '@/assets/json/datesData.json';
export default {
  name: 'exceptional_days',
  components: { 
    modeMonth,
    settingPanel
  },
  mixins: [commonFunctions],
  data () {
    return {
      mode: 1, // 模式(1: 以月瀏覽)
      currentDateText: '',
      dateMatrix: [], // date matrix
      exceptionalDays: [],
      monthData: [],
      // move calendar
      onSwitch: false,
      // dialog
      msgOpen: false,
      msg: '',      
    }
  },
  created () {
    const self = this;
    
    self.iniExceptionalDays();
    self.$store.commit('initialDates');     
  },
  mounted () {
    const self = this;

    self.setCurrentDateText();
    self.getDateMatrix();

    // call parent to rebuild iframe's height
    // window.parent.postMessage('{"event": "changeHeight", "value": ' + document.body.scrollHeight + '}', '*'); 
  },
  updated () {
    const self = this;

    // call parent to rebuild iframe's height
    // window.parent.postMessage('{"event": "changeHeight", "value": ' + document.body.scrollHeight + '}', '*'); 
  },
  methods: {
    iniExceptionalDays () {
      const self = this;
      // console.log(datesData)

      self.exceptionalDays = [];
      if (datesData && datesData.length != 0) {
        datesData.forEach(item => {
          var findDay = self.exceptionalDays.find(ed => { return ed.special_day == item.special_day; });
          if (findDay == undefined) {
            item.type = parseInt(item.type);
            self.exceptionalDays.push(item);
          } 
        });
      }
    },
    updateExceptionalDays (data) {
      // console.log(data);
      const self = this;      
      
      var findDay = self.exceptionalDays.find(item => { return item.special_day == data.special_day; });
      if (findDay != undefined) {
        findDay.type = data.type;
        findDay.remark = data.remark;
      } else {
        var newDay = {
          special_day: data.special_day,
          type: data.type,
          remark: data.remark
        };
        self.exceptionalDays.push(newDay);
      }
      self.setExceptionalDays();
    },
    // 使用 calendar-dates 套件
    // 取得日期陣列資料
    async getDateMatrix () {
      const self = this;

      const calendarDates = new CalendarDates();
      const currentDate = new Date(self.$store.state.controlYear, self.$store.state.controlMonth - 1);
      
      self.dateMatrix = [];
      for (const meta of await calendarDates.getMatrix(currentDate)) {
        self.dateMatrix.push(meta);
      }
      // self.loadExceptionalDays();
      self.setExceptionalDays();
    },
    // load exceptional days
    loadExceptionalDays () {
      // console.log('loadExceptionalDays')
      const self = this;

      var monthRange = `${self.$store.state.controlMonth - 1}|${self.$store.state.controlMonth}|${self.$store.state.controlMonth + 1}`;
      var parameter = {
        year: self.$store.state.controlYear,
        month: monthRange
      };
      self.ajaxPOST(`${self.$store.state.apiPath}edoc/kernel/query_exceptional_days.php?${self.$store.state.queryString}`, parameter, self.setExceptionalDays); 
    },
    setExceptionalDays (data) {
      // console.log(data);
      const self = this;

      // if( data && data.result == 1 )
      // { 
        // self.exceptionalDays = [];
        // // set exceptional days
        // data.data.forEach((item) => { 
        //   var dateSplit = item.special_day.split('/');
        //   item.special_day = `${dateSplit[0]}-${dateSplit[1]}-${dateSplit[2]}`;
        //   self.exceptionalDays.push(item);
        // });

        // set month data
        self.monthData = [];
        for(var iWeek = 0; iWeek < 5; iWeek++)
        {
          var itemWeek = {
            order: iWeek + 1,
            dayCols: []
          };

          var days = self.dateMatrix[iWeek];
          for(var iDay = 0; iDay < days.length; iDay++)
          {
            // initial by week
            days[iDay].dayType = 1; // 1: 上班 0: 假日            
            days[iDay].remark = ''; 
            days[iDay].isFocus = false; 
            if( iDay == 0 || iDay == (days.length - 1) ){
              days[iDay].dayType = 0;              
            }

            // switch by exceptional days...
            var exDay = self.exceptionalDays.find((item) => { return item.special_day == days[iDay].iso; });
            if( exDay != undefined )
            {
              days[iDay].dayType = parseInt(exDay.type);
              days[iDay].remark = exDay.remark; 
            }

            itemWeek.dayCols.push(days[iDay]);
          }

          self.monthData.push(itemWeek);
        }
      // }
    },
    // set current date text
    setCurrentDateText () {
      const self = this;

      self.currentDateText = self.$store.state.controlYear + '年' + self.$store.state.controlMonth + '月';
    },
    controlState (state) {
      const self = this;

      switch( self.mode )
      {
        case 1:
          self.switchMonth(state);
          break;
      }     
    },
    // 移至今天
    setToday () {
      const self = this;

      var controlDateText = self.$store.getters.getControlDateText(2),
          currentDateText = self.getCurrentDateText(2, '-');
          //console.log(controlDateText, currentDateText)

      // reset
      self.$store.commit('initialDates'); 
      self.setCurrentDateText();
      switch( self.mode )
      {
        case 1:
          if( controlDateText != currentDateText ) {
            //console.log(`control: ${controlDateText}, current: ${currentDateText}`);
            self.moveCalendar( (controlDateText > currentDateText)? -1 : 1 );
          }
          self.getDateMatrix();
          break;
      }      
    },
    // 切換月份
    switchMonth (state) {
      const self = this;

      self.$refs.settingPanel.setPanelStatus(false);
      self.moveCalendar(state);
      if( state < 0 )
      {
        if( self.$store.state.controlMonth != 1 ) {
          self.$store.commit('setControlMonth', self.$store.state.controlMonth - 1);
        }
        else {
          self.$store.commit('setControlYear', self.$store.state.controlYear - 1);
          self.$store.commit('setControlMonth', 12);
        }
      }
      else {
        if( self.$store.state.controlMonth != 12 ) {
          self.$store.commit('setControlMonth', self.$store.state.controlMonth + 1); 
        }
        else {
          self.$store.commit('setControlYear', self.$store.state.controlYear + 1);
          self.$store.commit('setControlMonth', 1);
        }
      }
      self.setCurrentDateText();
      self.getDateMatrix();
    },
    // 產生行事曆左右移動的視覺效果
    moveCalendar (state) {
      // clone original calendar...
      var fakeMonthContent = $('#mainMonthContent').clone(); 

      // append fake calendar...      
      $('#monthTable').append(fakeMonthContent);
      fakeMonthContent.attr('id', 'fakeMonthContent');
      fakeMonthContent.css('zIndex', '0');
      $('#fakeMonthContent').addClass('to-disapper');

      // add class to main calendar
      // $('#mainMonthContent').addClass('to-appear');
      if( state < 0 ) {
        $('#mainMonthContent').addClass('from-left-position');
      }
      else {
        $('#mainMonthContent').addClass('from-right-position');
      }
      
      // remove fake calendar & class
      setTimeout(() => {
        $('#mainMonthContent').removeClass('to-appear');        
        // remove fake calendar...
        $('#fakeMonthContent').remove();
      }, 100);
      setTimeout(() => {
        $('#mainMonthContent').removeClass('from-left-position');
        $('#mainMonthContent').removeClass('from-right-position');        
      }, 200);
    },
    // setting day by modeMonth.vue
    monthSettingDay (data) {
      const self = this;

      self.$refs.settingPanel.setPanelStatus(true, data.target, data.wIndex, data.dIndex);
    },    
    // clearing focus day by settingPanel.vue
    clearFocusDay () {
      const self = this;

      self.$refs.mainMonthContent.clearFocusDay();
    },
    // responsing by settingPanel.vue
    responseSaveDay (data) {
      const self = this;

      if( data && data.result == 1 )
      {
        self.getDateMatrix();
      }
      else {
        self.msg = '設定失敗。';
        self.msgOpen = true;
      }
    },
    // dialog
    setDialogStatus (status) {
      const self = this;

      self.msgOpen = status;
    }  
  }
}
</script>

<style lang="scss">
@import '@/assets/scss/app.scss';
</style>
