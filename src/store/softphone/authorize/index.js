import { UserAgent, Registerer } from "sip.js";
const state = {
    image: require('@/assets/images/logo/C4LL_logo.png'),
    userAgentRegisterer: null,
    userAgent: null,
    configs: {},
    pabx: null
};

// recuperar 
const getters = {
    userAgent: (state) => state.userAgent,
    userAgentRegisterer: (state) => state.userAgentRegisterer,
    pabxConfig: (state) => state.pabx,
};

// commit
const mutations = {
    SET_PABX(state, payload) {
        state.pabx = payload;
    },
    SET_AUTHORIZE(state, payload) {
        state.userAgentRegisterer = payload.register;
        state.userAgent = payload.agent;
    }
};

// disparar ação usar o dispatch
const actions = {
    setPabxConfigs(context, payload) {
        context.commit('SET_PABX', payload);
    },
    async authorizeAgentPABX(context, payload) {
        const _agent = new UserAgent({
            uri: UserAgent.makeURI(payload.configs.uri),
            transportOptions: payload.configs.transportOptions,
            authorizationPassword: payload.configs.authorizationPassword,
            authorizationUsername: payload.configs.authorizationUsername,
        });
        const _register = new Registerer(_agent);
        // alterar estado
        context.commit('SET_AUTHORIZE', {
            register: _register,
            agent: _agent
        });
    },

    // async setAuthorizes(context, payload) {
    //     const _agent = new UserAgent({
    //         uri: UserAgent.makeURI(payload.configs.uri),
    //         transportOptions: payload.configs.transportOptions,
    //         authorizationPassword: payload.configs.authorizationPassword,
    //         authorizationUsername: payload.configs.authorizationUsername,
    //     });
    //     const _register = new Registerer(_agent);
    //     // alterar estado
    //     context.commit('SET_AUTHORIZE', {
    //         register: _register,
    //         agent: _agent
    //     });
    // }
};

export default {
    state,
    getters,
    actions,
    mutations,
};