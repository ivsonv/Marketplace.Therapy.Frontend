const state = {
    id: "",
    name: "",
    ramal: "",
    token: ""
};

// recuperar 
const getters = {
    user: (state) => state
};

// commit
const mutations = {
    SET_USER(state, payload) {
        state.ramal = payload.ramal;
        state.token = payload.token;
        state.name = payload.name;
        state.id = payload.id;
    }
};

// disparar ação usar o dispatch
const actions = {
    setLogin(context, payload) {
        context.commit('SET_USER', payload);
    }
};

export default {
    state,
    getters,
    actions,
    mutations,
};