<template>
    <div>
        <b-embed
            type="iframe"
            aspect="16by9"
            v-if="this.iframeUrl"
            :src="getDashboard(appConfig.layout.skin)"
            allowfullscreen
        />
    </div>
</template>
<script>

import {
  BEmbed
} from "bootstrap-vue";
import jwt from "jsonwebtoken";
import store from '@/store/index'
import { mapState } from "vuex";
var METABASE_SITE_URL = "https://metabase.atentoti.tech";
var METABASE_SECRET_KEY = "fe9e568c29accdbc721d72380dabbc372554f571a631eb16e67fa0933d311c53";

export default {
  components: {
    BEmbed
  },
  computed: {
    ...mapState(["appConfig"]),
  },
  data() {
    return {
      iframeUrl: ""
    };
  },
  created() {
    this.getDashboard();
  },
  methods: {
    getDashboard(skin) {
        var payload = {
            resource: { dashboard: 14 },
            params: {},
            exp: Math.round(Date.now() / 1000) + 10 * 60 // 10 minute expiration
        };

        var token = jwt.sign(payload, METABASE_SECRET_KEY);

        var theme = skin === "dark" ? "&theme=night" : "";

        this.iframeUrl = METABASE_SITE_URL + 
                         "/embed/dashboard/" + 
                         token + 
                         "#bordered=false&titled=false" +
                         theme;
        
        return this.iframeUrl;
    }
  }
}
</script>