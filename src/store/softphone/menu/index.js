const state = {
    name: 'call'
};

// recuperar
const getters = {
    menu: (state) => state.name
};

// para mudar o estado usar o commit
const mutations = {
    SET_MENU_CURRENT(state, _newvalue) {
        state.name = _newvalue;
    }
};

// disparar ação usar o dispatch
const actions = {
    async setMenu(context, _nameMenu) {
        context.commit('SET_MENU_CURRENT', _nameMenu);
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};