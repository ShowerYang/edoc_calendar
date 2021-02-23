<template>
<div id="monthTable" class="month-table">
    <div id="mainMonthContent" class="month-content">   
        <!-- section week title -->
        <div class="section-week-title">
            <div class="title-item">
                <span class="item-name">週日</span>
            </div>
            <div class="title-item">
                <span class="item-name">週一</span>
            </div>
            <div class="title-item">
                <span class="item-name">週二</span>
            </div>
            <div class="title-item">
                <span class="item-name">週三</span>
            </div>
            <div class="title-item">
                <span class="item-name">週四</span>
            </div>
            <div class="title-item">
                <span class="item-name">週五</span>
            </div>
            <div class="title-item">
                <span class="item-name">週六</span>
            </div>
        </div>
        <!-- section week edits -->
        <div class="section-week-edits">
            <div class="week-row" v-for="(week, wIndex) in monthData" :key="'week' + week.order">
                <div class="group-days-datas">
                    <div class="cell-day" 
                        v-for="(day, dIndex) in week.dayCols"
                        :id="'day' + day.iso"
                        :key="'day' + day.iso"
                        :class="{
                            'holiday': day.dayType == 0,
                            'today': currentFullDate == day.iso
                        }"
                        @click.stop="settingDay(day, (wIndex + 1), (dIndex + 1))">
                        <div class="day-info">
                            <div class="day-date">{{ day.date }}<q-tooltip class="today-tooltip">{{ day.iso }}</q-tooltip></div>
                            <div class="day-number"></div>
                        </div>
                        <div class="day-event">
                            <div v-if="day.remark" class="state-list">
                                <div class="state-item">
                                    <span class="item-content">{{ day.remark }}</span>
                                </div>
                            </div>
                            <div v-if="day.isFocus" class="spinner-item">
                                <q-spinner-dots color="blue-6" size="md" />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="group-days-event">
                </div>
            </div>
        </div>
    </div>    
</div>
</template>

<script>
import {commonFunctions} from '@/commonFunctions.js'
export default {
    name: 'modeMonth',
    components: {},
    mixins: [commonFunctions],
    props: ['propsMonthData'],
    data () {
        return {            
            monthData: [], // week data
            currentFullDate: null,
            targetDay: null
        }
    },   
    created () { 
        const self = this;
        
        self.currentFullDate = self.getCurrentDateText(1, '-'); 
        self.initialMonthData();
    },
    mounted () {

    }, 
    updated () {
        
    },    
    methods: {
        // initial week rows
        initialMonthData () {
            const self = this;

            self.monthData = [];
            let parseData = JSON.parse(JSON.stringify(self.propsMonthData));
            parseData.forEach((item) => {
                self.monthData.push(item);
            });
        },
        clearFocusDay () {
            const self = this;

            //self.targetDay.isFocus = false;
            self.monthData.forEach((week) => {
                week.dayCols.forEach((day) => {                    
                    day.isFocus = false;
                });
            });
        },
        // 設定目前關注日期
        settingDay (target, wIndex, dIndex) {
            const self = this;            
            
            self.targetDay = target;
            self.targetDay.isFocus = true;
            var passData = {
                target: target,
                wIndex: wIndex,
                dIndex: dIndex
            };
            // 往 app.vue 觸發事件
            self.$emit('monthSettingDay', passData);
        }
    },
    watch: {
        propsMonthData () {
            this.initialMonthData();
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/month-table.scss';
</style>
