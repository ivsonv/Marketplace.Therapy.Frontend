<template>
  <main class="main-view">
    <b-row class="mb-2">
      <b-col cols="12" class="text-center mt-1">
        <img :src="authorize.image" />
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center mt-3">
      <b-col cols="12" sm="9">
        <b-row>
          <b-col v-for="(line, index) in linesnumber" :key="index" cols="4">
            <p
              @click="eventButton(line)"
              :class="
                line.value === '*'
                  ? 'softphone-linenumber_'
                  : 'softphone-linenumber'
              "
            >
              {{ line.value }}
            </p>
          </b-col>
        </b-row>
      </b-col>
      <b-col cols="11" sm="8" class="text-center">
        <b-input-group>
          <b-form-input
            placeholder="Digite telefone..."
            v-model="number"
            autocomplete="off"
            type="number"
            size="lg"
            @keyup="eventDigitButton"
            style="background: rgba(0, 0, 0, 0.03) !important; font-size: 25px"
          />
          <b-input-group-append
            is-text
            v-show="number"
            @click="eventDelete"
            class="cursor-pointer"
          >
            <feather-icon icon="DeleteIcon" size="15" class="cursor-pointer" />
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
  </main>
</template>

<script>
import { VBTooltip } from "bootstrap-vue";
import { mapState } from "vuex";

export default {
  directives: {
    "b-tooltip": VBTooltip,
  },
  data() {
    return {
      number: "",
      linesnumber: [
        { value: "1" },
        { value: "2" },
        { value: "3" },
        { value: "4" },
        { value: "5" },
        { value: "6" },
        { value: "7" },
        { value: "8" },
        { value: "9" },
        { value: "*" },
        { value: "0" },
        { value: "#" },
      ],
    };
  },
  computed: {
    ...mapState(["authorize"]),
  },
  methods: {
    eventDelete() {
      dtmfTone.play();
      if (this.number) {
        this.number = this.number.slice(0, -1);
        this.$store.dispatch("setKeyboardNumber", this.number);
      }
    },
    eventButton(key) {
      dtmfTone.play();
      this.number += key.value;
      this.$store.dispatch("setKeyboardNumber", this.number);
    },
    eventDigitButton(e) {
      dtmfTone.play();
      switch (e.key) {
        case "Backspace":
          break;
        default:
          this.$store.dispatch("setKeyboardNumber", this.number);
          break;
      }
    },
  },
};
</script>
<style>
.softphone-linenumber {
  font-size: 2.2rem;
  text-align: center;
  padding-bottom: 1rem;
  line-height: 2.5rem;
  font-weight: 500;
  font-family: open sans, sans-serif;
  cursor: pointer;
}
.softphone-linenumber_ {
  font-size: 4.5rem;
  text-align: center;
  line-height: 4.4rem;
  font-family: open sans, sans-serif;
  cursor: pointer;
}
</style>