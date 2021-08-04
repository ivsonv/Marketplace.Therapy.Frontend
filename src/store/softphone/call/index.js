const state = {
    number: 0,
    number_call: '',
    status: '',
    type: ''
};

// recuperar 
const getters = {
    status: (state) => state.status,
    number: (state) => state.number
};

// para mudar o estado usar o commit
const mutations = {
    SET_KEYBOARD_NUMBER(state, _newvalue) {
        state.number = _newvalue;
    },
    SET_CALL(state, _newvalue) {
        state.number_call = _newvalue.number;
        state.status = _newvalue.status;
        state.type = _newvalue.type;
        state.name = _newvalue.name;
    },
    SET_CALL_STATUS(state, _newvalue) {
        state.status = _newvalue;
    },
    SET_CALL_TYPE(state, _newvalue) {
        state.type = _newvalue;
    }
};

// disparar ação usar o dispatch
const actions = {
    setKeyboardNumber(context, payload) {
        context.commit('SET_KEYBOARD_NUMBER', payload);
    },
    setCall(context, payload) {
        context.commit('SET_CALL', payload);
    },
    setStatusCall(context, payload) {
        context.commit('SET_CALL_STATUS', payload);
    },
    setStopCall(context) {
        context.commit('SET_CALL', {
            status: '',
            number: 0,
            type: ''
        });
        context.commit('SET_KEYBOARD_NUMBER', 0);
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};