<template>
  <main class="main-view">
    <menu-break
      :name="reasonsBreakSelected.label"
      @result="onBreakClose"
      v-if="isbreak"
    />

    <!-- LAYOUT MOBILE -->
    <!-- class="d-block d-xl-none" -->
    <section v-if="!isbreak">
      <!-- POPOVER BREAK -->
      <b-popover
        id="popover-break-index"
        :show.sync="popoverShow"
        target="popover-break"
        triggers="hover"
        placement="top"
      >
        <template v-slot:title>
          <div class="d-flex justify-content-between align-items-center">
            <span>Selecione a Pausa</span>
            <b-button
              class="close"
              variant="transparent"
              aria-label="Close"
              @click="onBreakClose"
            >
              <span class="d-inline-block text-white pl-5" aria-hidden="true"
                >&times;</span
              >
            </b-button>
          </div>
        </template>
        <b-form-group class="mt-1">
          <ul>
            <li
              v-for="(rea, i) in reasonsBreak"
              :key="i"
              class="cursor-pointer mb-1"
              @click="onBreakConfirm(rea)"
            >
              {{ rea.label }}
            </li>
          </ul>
        </b-form-group>
      </b-popover>

      <!-- container -->
      <div class="container">
        <div
          class="row"
          :style="
            call.status == 'Establishing'
              ? `background: url(${require('@/assets/images/pages/background-dotted.png')})`
              : ''
          "
        >
          <!-- TECLADO -->
          <div class="col-12" v-if="menuActive === 'phone'">
            <menu-dialer />
          </div>

          <!-- Filter -->
          <div class="col-12" v-if="menuActive === 'filter'">
            <menu-filter />
          </div>

          <!-- Notifications -->
          <div class="col-12" v-if="menuActive === 'notifications'">
            <menu-notifications />
          </div>
        </div>
      </div>

      <!-- Menu Footer -->
      <div class="footer fixed-bottom">
        <div class="py-1 shadow" style="background: var(--light)">
          <div class="row align-items-center">
            <div class="col d-flex justify-content-center">
              <feather-icon
                color="var(--secondary)"
                class="cursor-pointer"
                icon="CoffeeIcon"
                id="popover-break"
                size="25"
              />
            </div>
            <div
              class="col d-flex justify-content-center"
              @click="setMenu('filter')"
            >
              <feather-icon
                class="cursor-pointer"
                icon="FilterIcon"
                color="var(--secondary)"
                size="25"
              />
            </div>
            <!-- BOTÃO LIGAR -->
            <!-- LIGAR PARA NUMERO DIGITADO -->

            <div
              class="col d-flex justify-content-center"
              v-if="!call.status && (call.number || call.number > 0)"
              @click="onStartCall"
            >
              <b-button
                class="btn-icon rounded-circle"
                variant="success"
                size="lg"
              >
                <feather-icon icon="PhoneIcon" size="35" @click="onStopCall" />
              </b-button>
            </div>
            <!-- STOP DESLIGAR -->
            <div
              class="col d-flex justify-content-center"
              v-else-if="
                call.status === 'Established' || call.status === 'Establishing'
              "
              @click="onStopCall"
            >
              <b-button
                class="btn-icon rounded-circle"
                variant="danger"
                size="lg"
              >
                <feather-icon icon="PhoneIcon" size="35" @click="onStopCall" />
              </b-button>
            </div>
            <!-- VIEW TECLADO -->
            <div
              class="col d-flex justify-content-center"
              @click="setMenu('phone')"
              v-else
            >
              <feather-icon
                class="cursor-pointer"
                icon="PhoneCallIcon"
                color="var(--success)"
                size="40"
              />
            </div>
            <!-- FIM BOTÃO LIGAR -->
            <div
              class="col d-flex justify-content-center"
              @click="setMenu('notifications')"
            >
              <feather-icon
                class="cursor-pointer"
                icon="BellIcon"
                color="var(--secondary)"
                size="25"
              />
              <!-- badge="2"
                badge-classes="badge-warning" -->
            </div>
            <div class="col d-flex justify-content-center">
              <feather-icon
                class="cursor-pointer"
                icon="MenuIcon"
                color="var(--secondary)"
                size="30"
                @click="
                  () => {
                    popoverShow = false;
                    isActiveOptions = true;
                  }
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- LAYOUT DESK -->
    <section></section>

    <!-- Configurações -->
    <b-sidebar
      sidebar-class="sidebar-lg"
      bg-variant="white"
      v-model="isActiveOptions"
      right
      backdrop
      shadow
      no-header
    >
      <template #default="{ hide }" v-if="isActiveOptions">
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 class="mb-0">Configurações</h5>
          <div>
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>
        <menu-configuration />
      </template>
    </b-sidebar>
  </main>
</template>
<script>
import { SessionState, UserAgent, Registerer, Inviter } from "sip.js";
import * as audioload from "../../../helpers/audio-load.js";

const mediaElement = document.getElementById("audio_remote");
const remoteStream = new MediaStream();
import { mapState } from "vuex";

// pages
import menuBreak from "./pages/menu-break.vue";
import menuFilter from "./pages/menu-filter.vue";
import menuNotifications from "./pages/menu-notifications.vue";
import menuDialer from "./pages/menu-dialer.vue";
import menuConfiguration from "./pages/menu-configuration.vue";

import { BPopover } from "bootstrap-vue";

export default {
  components: {
    "menu-configuration": menuConfiguration,
    "menu-notifications": menuNotifications,
    "menu-filter": menuFilter,
    "menu-break": menuBreak,
    "menu-dialer": menuDialer,
    BPopover,
  },
  computed: {
    ...mapState(["authorize", "call"]),
  },
  data() {
    return {
      isloading: false,
      isActiveOptions: false,
      menuActive: "phone",
      reasonsBreak: [
        { label: "Banheiro", value: "Banheiro" },
        { label: "Lanche", value: "Lanche" },
        { label: "Treinamento", value: "Treinamento" },
        { label: "Avaliação", value: "Avaliação" },
        { label: "Almoço", value: "Almoço" },
      ],
      reasonsBreakSelected: null,
      isbreak: false,
      popoverShow: false,
      curentSession: null,
    };
  },
  created() {
    if (!this.$store.getters.pabxConfig) {
      // Tela Login
      this.$router.push({
        name: "auth-softphone-login",
        params: {
          clientid: 123, // pegar do localstorage se tiver
        },
      });
      return;
    }

    // autorizar - carregado no login
    this.$store
      .dispatch("authorizeAgentPABX", this.$store.getters.pabxConfig)
      .then((res) => {
        console.log("setAuthorizes - OK");
        this.addListenerReceiveCall();
      })
      .catch((error) => this.$utils.toastError("Notificação", error));
  },

  methods: {
    addListenerReceiveCall() {
      console.log("addListenerReceiveCall - OK");

      // map state
      const _userAgent = this.authorize.userAgent;
      const _userAgentRegisterer = this.authorize.userAgentRegisterer;

      let $this = this;

      _userAgent.start().then(() => {
        _userAgentRegisterer.register();

        // listener (RECEBENDO LIGAÇÃO)
        _userAgent.delegate = {
          onInvite(invitation) {
            const incomingSession = invitation;
            incomingSession.delegate = {
              onRefer(referral) {},
            };

            // Handle incoming session state changes.
            incomingSession.stateChange.addListener((newState) => {
              $this.startCall({
                status: newState,
                destination: "N/d",
                name: "--",
                type: "i",
              });

              switch (newState) {
                case SessionState.Establishing:
                  ringbacktone.play();
                  break;
                case SessionState.Established:
                  debugger;
                  ringbacktone.pause();
                  $this.assignStream(incomingSession);
                  break;
                case SessionState.Terminated:
                  $this.StopCall();
                  $this.cleanupMedia();
                  break;
                default:
                  break;
              }
            });

            // Handle incoming INVITE request.
            let constrainsDefault = {
              audio: true,
              video: false,
            };

            const options = {
              sessionDescriptionHandlerOptions: {
                constraints: constrainsDefault,
              },
            };

            incomingSession.accept(options);
          },
        };
      });
    },
    assignStream(session) {
      session.sessionDescriptionHandler.peerConnection
        .getReceivers()
        .forEach((receiver) => {
          if (receiver.track) {
            remoteStream.addTrack(receiver.track);
          }
        });
      mediaElement.srcObject = remoteStream;
      mediaElement.play();
    },
    cleanupMedia() {
      mediaElement.srcObject = null;
      mediaElement.pause();
    },
    setMenu(name) {
      if (!this.call.status) {
        this.menuActive = name;
        this.popoverShow = false;
      } else {
        this.$utils.toastError(
          "OPS!!!",
          "Voce tem uma ligação ativa no momento."
        );
      }
    },
    onStartCall() {
      debugger;
      this.$swal({
        title: `${this.call.number}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ligar",
        cancelButtonText: "Não",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          // efetuar ligação
          this.startCall({
            destination: this.call.number,
            status: "Establishing",
            name: "--",
            type: "o",
          });
        }
      });
    },
    startCall(payload) {
      debugger;
      this.$store.dispatch("setCall", {
        number: payload.destination,
        status: payload.status,
        name: payload.name,
        type: payload.type,
      });
      this.menuActive = "phone";
      this.popoverShow = false;
      const _userAgentRegisterer = this.authorize.userAgentRegisterer;
      const _userAgent = this.authorize.userAgent;
      let $this = this;

      _userAgent.start().then(() => {
        _userAgentRegisterer.register();

        const target = UserAgent.makeURI(
          `sip:${payload.destination}@dev-pabx-01.c4ll.app`
        );
        if (!target) {
          throw new Error("Failed to create target URI.");
        }

        const inviter = new Inviter(_userAgent, target, {
          sessionDescriptionHandlerOptions: {
            constraints: { audio: true, video: false },
          },
        });

        this.curentSession = inviter;

        inviter.stateChange.addListener((newState) => {
          switch (newState) {
            case SessionState.Establishing:
              ringbacktone.play();
              break;
            case SessionState.Established:
              $this.$store.dispatch("setStatusCall", newState);
              ringbacktone.pause();
              this.assignStream(inviter);
              break;
            case SessionState.Terminated:
              ringbacktone.pause();
              this.cleanupMedia();
              this.StopCall();
              break;
            default:
              break;
          }
        });

        inviter
          .invite()
          .then(() => {
            // INVITE sent
          })
          .catch((error) => {
            // INVITE did not send
          });
      });
    },
    onStopCall() {
      this.$swal({
        title: "Encerrar ligação?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Não",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.StopCall();
        }
      });
    },
    StopCall() {
      this.$store.dispatch("setStopCall");
      this.menuActive = "phone";
      this.popoverShow = false;
      this.curentSession.bye();
    },
    onshow() {
      this.popoverShow = true;
    },
    onBreakClose() {
      this.popoverShow = false;
      this.isbreak = false;
    },
    onBreakConfirm(item) {
      if (!this.call.status) {
        this.reasonsBreakSelected = item;
        this.popoverShow = false;
        this.isbreak = true;
      } else {
        this.$utils.toastError(
          "OPS!!!",
          "Voce tem uma ligação ativa no momento."
        );
        this.popoverShow = false;
      }
    },
  },
};
</script>
<style>
.main-view {
  min-height: 100vh;
}

.phone-icone {
  position: absolute;
  margin-bottom: 30px;
}

#popover-break-index {
  top: 0vh !important;
}
</style>