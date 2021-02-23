<template>
<div id="panelOuter" class="setting-panel-outer">
    <div id="panelContainer" class="setting-panel-container">
        <div id="panelSpace" class="setting-panel-space"></div>
        <div id="panelMain" class="setting-panel">    
            <div class="panel-container">
                <span class="close-panel" @click.stop="setPanelStatus(false)">
                    <i class="fas fa-times"></i>
                    <q-tooltip class="today-tooltip"> 
                        關閉
                    </q-tooltip>
                </span>                
                <div class="panel-body">
                    <div class="answer-container">
                        <div class="day-date"><span>{{ dayDate }}</span></div>
                        <div class="answer-item">
                            <div class="item-title pad-top">
                                <span class="required"></span>
                                <span class="title-content">
                                    <i class="fas fa-calendar-day"></i>
                                    <q-tooltip class="today-tooltip"> 
                                        狀態
                                    </q-tooltip>
                                </span>
                            </div>
                            <div class="item-content align-center">
                                <q-radio dense v-model="dayType" :val="1" class="day-type-btn" label="上班日" />
                                <q-radio dense v-model="dayType" :val="0" class="day-type-btn" label="休息日" />                                
                            </div>
                        </div>
                        <div class="answer-item">
                            <div class="item-title">
                                <span class="required"></span>
                                <span class="title-content">
                                    <i class="fas fa-sticky-note"></i>
                                    <q-tooltip class="today-tooltip"> 
                                        備註
                                    </q-tooltip>
                                </span>
                            </div>
                            <div class="item-content away-top">
                                <div class="reason-content">
                                    <q-input 
                                        v-model="dayNote"
                                        filled
                                        autogrow
                                        style="font-size: 16px;"
                                    />
                                    <!-- <textarea id="dayNote"></textarea> -->
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="panel-footer">
                    <div class="btn-container">
                        <q-btn color="primary" label="儲存" @click.stop="saveDay" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
// autosize.js
window.autosize = (window.autosize)? window.autosize : require('autosize');
import {commonFunctions} from '@/commonFunctions.js'
import { setTimeout } from 'timers';
export default {
    name: 'setting_panel',
    mixins: [commonFunctions],
    data () {
        return {
           isActive: false,
           // 目前關注日期
           dayDate: null,
           dayType: null,
           dayNote: null
        }
    },   
    created () { 
       
    },
    mounted () {
        const self = this;

        self.initialAutosize();
        $('#panelOuter').hide();
    }, 
    updated () {
        const self = this;

        self.initialAutosize();
    },    
    methods: {
        // 顯示/關閉
        setActive (status) {
            const self = this;
            
            self.isActive = status;
        },
        // 1. 設定輸入框的狀態
        // 2. 依目前關注日期的位置判斷 設定輸入框的位置(包含從左/從右顯示的動畫)
        setPanelStatus (open, day, wIndex, dIndex) {
            const self = this;

            if( open && !self.isActive )
            {
                self.isActive = true;

                // set target day data to panel...
                self.setDay(day);
               
                // setting panel position
                var dayDOM = $('#day' + day.iso);
                var dayOffset = dayDOM.offset();
                
                $('#panelOuter').show();                
                $('#panelOuter').css('opacity', 1);
                self.updateAutosize();                

                var rangeAnimation = 20;
                // set margin left
                var marginLeft = (Math.ceil(dayDOM.width()) * dIndex) - rangeAnimation;
                //console.log(marginLeft);
                var direction = null;
                if( (marginLeft + $('#panelMain').width()) < $('#calOuter').width() )
                {
                    //console.log(marginLeft, $('#panelMain').width(), $('#calOuter').width())
                    direction = 1;
                }
                else {
                    var panelMainShift = Math.ceil( $('#panelMain').width() - dayDOM.width() );
                    marginLeft = (Math.ceil(dayDOM.width()) * (dIndex - 2)) - panelMainShift + rangeAnimation;
                    direction = 2;                    
                }

                $('#panelOuter').css('margin-left', marginLeft + 'px');
                $('#panelSpace').css('height', dayOffset.top + 'px');

                if( direction == 1 )
                {
                    $('#panelContainer').css('right', '');
                    $('#panelContainer').css('left', 0 + 'px');
                    $('#panelContainer').animate({left: 10 + rangeAnimation + 'px'}, 150);
                }
                else {
                    $('#panelContainer').css('left', '');
                    $('#panelContainer').css('right', 0 + 'px'); 
                    $('#panelContainer').animate({right: 8 + rangeAnimation + 'px'}, 150);
                }               
            }
            else {
                $('#panelOuter').css('opacity', 0);
                setTimeout(() => {
                    $('#panelOuter').hide();
                    self.isActive = false;                    
                }, 210);
                // 往 app.vue 觸發事件
                self.$emit('clearFocusDay');
            }
        },
        // 設定目前關注的日期
        setDay (day) {
            const self = this;

            // var isoSplit = day.iso.split('-');
            // self.dayDate = isoSplit[0] + '/' + isoSplit[1] + '/' + isoSplit[2];
            self.dayDate = day.iso;
            self.dayType = day.dayType;
            self.dayNote = day.remark;
        },
        // 儲存目前關注日期的資料
        saveDay () {
            const self = this;
            
            var parameter = {
                special_day: self.dayDate,
                type: self.dayType,                
                remark: self.dayNote
            };            
            // self.ajaxPOST(`${self.$store.state.apiPath}edoc/kernel/interface_exceptional_days_save.php?${self.$store.state.queryString}`, parameter, self.responseSaveDay);
            self.$emit('onSaveDay', parameter);
            self.setPanelStatus(false);
        },
        responseSaveDay (data) {
            const self = this;

            // 往 app.vue 觸發事件
            self.$emit('responseSaveDay', data);
        },
        // autosize
        initialAutosize () {
            autosize( $('#dayNote') ); 
        },
        updateAutosize () {
            autosize.update( $('#dayNote') );
        },
        setAnswerContentFocus () {
            setTimeout(function(){
                $('#dayNote')[0].focus(); 
            }, 100);
        }
    },
    watch: {
        
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/setting-panel.scss';
</style>
