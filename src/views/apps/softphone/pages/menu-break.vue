<template>
  <main class="main-view">
    <div class="container">
      <b-alert variant="primary" show style="margin-top: 50%">
        <div class="alert-body">
          <v-timer class="time" />
          <p v-if="name" class="text-center">{{ name }}</p>
        </div>
      </b-alert>
      <div class="d-flex justify-content-center">
        <b-button block size="lg" variant="danger" @click="onClickExit">
          Sair da Pausa
        </b-button>
      </div>
    </div>
  </main>
</template>

<script>
import { BAlert } from "bootstrap-vue";
import time from "./time.vue";

export default {
  props: {
    name: {
      type: String,
      required: false,
    },
  },
  components: {
    "v-timer": time,
    BAlert,
  },
  data: () => ({}),
  methods: {
    onClickExit() {
      this.$emit("result");
    },
  },
};
</script>
<style>
.time {
  padding: 30px !important;
  font-size: 50px;
  text-align: center;
}
</style>