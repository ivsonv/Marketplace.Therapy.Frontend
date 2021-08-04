const state = {
  navMenus: null,
  roles: null
};

// recuperar 
const getters = {
  roles: (state) => {
    state.roles = JSON.parse(localStorage.getItem("userData")).roles;
    return state.roles;
  },
  navMenus: (state) => state.navMenus,
};

// commit
const mutations = {
  SET_ROLES(state, payload) {
    state.roles = payload;
  },
  SET_NAV_MENUS(state, payload) {
    state.navMenus = payload;
  }
};

// disparar ação usar o dispatch
const actions = {
  setRoles(context, payload) {
    context.commit('SET_ROLES', payload);
  },
  setNavMenus(context, payload) {
    context.commit('SET_NAV_MENUS', payload);
  }
};

export default {
  state,
  getters,
  actions,
  mutations,
};