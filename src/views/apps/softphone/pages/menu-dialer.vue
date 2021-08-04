<template>
  <main class="main-view">
    <!-- TECLADO -->
    <div class="container" v-if="!call.status">
      <v-keyboard />
    </div>

    <!-- INCOMING CALL (CHAMADA ACONTECENDO) -->
    <div class="container" v-if="call.status">
      <!-- LIGANDO OU RECENDO -->
      <div v-if="call.status === 'Establishing'">
        <b-alert variant="secondary" show class="p-3" style="margin-top: 30%">
          <div class="alert-body">
            <p class="text-center" style="font-size: 40px">
              {{ call.type === "o" ? "chamando..." : "Recebendo..." }}
            </p>
            <v-timer class="time" />
          </div>
        </b-alert>

        <!-- SHOW BOTOES -->
        <!-- LIGANDO  -->
        <div class="d-flex justify-content-center" v-if="call.type === 'o'">
          <!-- <b-button class="btn-icon rounded-circle" variant="danger" size="lg">
            <feather-icon icon="PhoneIcon" size="35" @click="onStopCall" />
          </b-button> -->
        </div>

        <!-- RECEBENDO  -->
        <div class="d-flex justify-content-center" v-if="call.type === 'i'">
          <b-button
            class="btn-icon rounded-circle mr-5"
            variant="success"
            size="lg"
            @click="onStartCall"
          >
            <feather-icon icon="PhoneIncomingIcon" size="40" />
          </b-button>
          <b-button
            class="btn-icon rounded-circle ml-5"
            variant="danger"
            size="lg"
            @click="onStopCall"
          >
            <feather-icon icon="PhoneIcon" size="35" />
          </b-button>
        </div>
      </div>

      <!-- LIGAÇÃO ESTABELECIDA -->
      <div v-if="call.status === 'Established'">
        <!-- Transferir RAMAIS -->
        <b-modal
          id="modal-transferir"
          cancel-variant="outline-secondary"
          ok-title="Confirmar"
          cancel-title="Fechar"
          centered
          title="Transferir Ligação"
          @ok="onClickTransfer"
          @hide="onHideTransfer"
        >
          <b-form>
            <b-form-group label="Ramal *">
              <v-select
                v-model="transferSelect"
                :options="transferRamals"
                autocomplete="off"
                :clearable="false"
              />
            </b-form-group>
          </b-form>
        </b-modal>

        <b-row>
          <b-col cols="12" class="text-center mt-5">
            <img :src="authorize.image" />
          </b-col>
        </b-row>

        <b-row class="mb-2">
          <b-col cols="12" class="text-center">
            <h2 class="mt-1" v-if="call.name">
              {{ call.name }}
            </h2>
            <h3>{{ call.number_call }}</h3>
          </b-col>
        </b-row>
        <hr />
        <v-timer class="time" />
        <b-row class="d-flex justify-content-center px-1 mt-3">
          <b-col
            cols="4"
            class="text-center cursor-pointer"
            v-b-modal.modal-transferir
          >
            <feather-icon icon="TrendingUpIcon" size="50" />
            <p class="mt-1">Transferir</p>
          </b-col>
          <b-col
            cols="4"
            class="text-center cursor-pointer"
            @click="onClickPause"
          >
            <feather-icon
              :icon="pause ? 'PlayCircleIcon' : 'PauseCircleIcon'"
              size="50"
            />
            <p class="mt-1">{{ pause ? "Aguardando" : "Em Espera" }}</p>
          </b-col>
          <b-col
            cols="4"
            class="text-center cursor-pointer"
            @click="onClickMute"
          >
            <feather-icon :icon="mute ? 'MicOffIcon' : 'MicIcon'" size="50" />
            <p class="mt-1">{{ mute ? "Ativar" : "Mute" }}</p>
          </b-col>
        </b-row>
      </div>
    </div>
  </main>
</template>

<script>
import keyboard from "../components/keyboard";
import { BAlert, BModal, VBModal } from "bootstrap-vue";
import time from "./time.vue";

import { mapState } from "vuex";
export default {
  components: {
    "v-keyboard": keyboard,
    "v-timer": time,
    BAlert,
    BModal,
    VBModal,
  },
  computed: {
    ...mapState(["authorize", "call"]),
  },
  data() {
    return {
      mute: false,
      pause: false,
      transferRamals: [
        { label: "Vendas - 100", value: "100" },
        { label: "Atendimento - 200", value: "200" },
        { label: "Financeiro - 300", value: "300" },
        { label: "Retenção - 500", value: "500" },
        { label: "Cadastro - 600", value: "600" },
        { label: "Recepção - 251", value: "251" },
        { label: "RH - 253", value: "253" },
      ],
      transferSelect: null,
    };
  },
  methods: {
    onClickTransfer() {
      console.log(this.transferSelect);
      this.StopCall();
    },
    onHideTransfer(evt) {
      if (evt.trigger === "backdrop") {
        evt.preventDefault();
      }
    },
    onClickMute() {
      this.mute = !this.mute;
    },
    onClickPause() {
      this.pause = !this.pause;
    },
  },
};
</script>
<style>
.time {
  padding: 10px !important;
  font-size: 20px;
  text-align: center;
}
</style>