import { createStore } from "vuex";
import createPersistedState from 'vuex-persistedstate'

import category from './modules/category'
export default createStore({
    modules:{
        category
    }
})