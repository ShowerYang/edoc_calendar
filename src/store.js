import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// initial query string
var queryString = null;
try {
  queryString = `gGroups_i=${gGroups_i}&gSys_s=${gSys_s}&gFunc_s=${gFunc_s}`;
} catch(e) {
  // error
}

// initial api url
var isLocal = (location.host.indexOf('localhost') != -1)? true : false;
var apiPath = (isLocal)? '' : `//${location.host}/`;

export default new Vuex.Store({
  state: {
    // query string
    queryString: queryString,
    // api url 
    isLocal: isLocal,
    apiPath: apiPath,
    // control date
    controlYear: null,
    controlMonth: null,
    controlDate: null
  },
  mutations: {
    // query string
    setQueryString (state, value) {
      state.queryString = value;
    },
    // api url
    setIsLocal (state, value) {
      state.isLocal = value;
    },    
    setApiPath (state, value) {
      state.apiPath = value;
    },
    // control date
    initialDates (state) {
      var today = new Date();
      state.controlYear = today.getFullYear();
      state.controlMonth = today.getMonth() + 1;
      state.controlDate = today.getDate();     
    },
    setControlYear (state, value) {
      state.controlYear = value;
    },
    setControlMonth (state, value) {
      state.controlMonth = value;
    },
    setControlDate (state, value) {
      state.controlDate = value;
    }
  },
  getters: {
    getControlDateText: (state) => (type) => {
      var dateText = '';
      switch(type)
      {
        case 1:
          
          break;
        case 2:
          var month = (state.controlMonth.toString().length == 1)? '0' + state.controlMonth : state.controlMonth;
          dateText = `${state.controlYear}-${month}`;
          break;
      }
      return dateText;
    },
    getFullDate: (state) => {
      return `${state.controlYear}/${state.controlMonth}/${state.controlDate}`;
    }
  },
  actions: {

  }
})
