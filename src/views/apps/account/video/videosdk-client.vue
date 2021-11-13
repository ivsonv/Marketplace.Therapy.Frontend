<template>
  <div id="video-chat" class="main-view"></div>
</template>

<script>
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
export default {
  props: {
    app_id: {
      type: String,
      required: true,
    },
    room_id: {
      type: String,
      required: true,
    },
    room_traveled: {
      type: Number,
      required: false,
    },
    room_name: {
      type: String,
      required: true,
    },
    customer: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      redirect_exit: "",
      centesimas: 0,
      segundos: 0,
      minutos: `0` + 0,
      horas: `0` + 0,
      timer: "",
      myTimer: null,
      isAlerta: false,
    };
  },
  destroyed() {
    clearInterval(this.myTimer);
  },
  created() {
    if (this.customer) {
      this.redirect_exit = `${window.location.origin}/sou-paciente/agendamento/${this.app_id}/finalizado`;
    } else {
      this.redirect_exit = `${window.location.origin}/account/appointment/${this.app_id}/finish`;
    }
    this.cronometro();
  },
  mounted: async function () {
    const apiKey = process.env.VUE_APP_VIDEOSDK_API_KEY;
    const meetingId = this.room_id;
    const name = this.room_name;

    const config = {
      name: name,
      meetingId: meetingId,
      apiKey: apiKey,
      containerId: "video-chat",
      redirectOnLeave: this.redirect_exit,
      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      chatEnabled: true,
      screenShareEnabled: true,
      pollEnabled: false,
      whiteBoardEnabled: false,
      raiseHandEnabled: false,
      recordingEnabled: false,
      recordingEnabledByDefault: false,
      recordingWebhookUrl: "",
      participantCanToggleRecording: false,
      brandingEnabled: true,
      brandLogoURL: "https://imagem.cliqueterapia.com.br/terms/logo-def.png",
      brandName: "CLIQUE TERAPIA",
      poweredBy: false,

      participantCanLeave: true, // if false, leave button won't be visible
      // Live stream meeting to youtube
      livestream: {
        autoStart: true,
        outputs: [],
      },
      joinScreen: {
        title: "Para Iniciar Sessão Clique no botão 'JOIN'",
        visible: true,
      },
      permissions: {
        askToJoin: false, // Ask joined participants for entry in meeting
        toggleParticipantMic: true, // Can toggle other participant's mic
        toggleParticipantWebcam: true, // Can toggle other participant's webcam
      },
    };

    const meeting = new VideoSDKMeeting();
    meeting.init(config);
  },
  methods: {
    cronometro() {
      // horas já percorrida da sessão
      this.minutos = this.room_traveled;

      // iniciar contador.
      this.myTimer = setInterval(() => {
        if (this.centesimas < 99) {
          this.centesimas++;
          if (this.centesimas < 10) {
            this.centesimas = "0" + this.centesimas;
          }
        }
        if (this.centesimas == 99) {
          this.centesimas = -1;
        }
        if (this.centesimas == 0) {
          this.segundos++;
          if (this.segundos < 10) {
            this.segundos = "0" + this.segundos;
          }
        }
        if (this.segundos == 59) {
          this.segundos = -1;
        }
        if (this.centesimas == 0 && this.segundos == 0) {
          this.minutos++;
          if (this.minutos < 10) {
            this.minutos = "0" + this.minutos;
          }
        }
        if (this.minutos == 59) {
          this.minutos = -1;
        }
        if (this.centesimas == 0 && this.segundos == 0 && this.minutos == 0) {
          this.horas++;
          if (this.horas < 10) {
            this.horas = "0" + this.horas;
          }
        }

        // format
        this.timer = `${this.horas}:${this.minutos}:${this.segundos}`;
        this.checkTimeVideo(this.minutos);
      }, 10);
    },
    checkAlert(_hora) {
      if (parseInt(_hora) === 40) {
        if (this.isAlerta) {
          this.$utils.toastError(
            "ALERTA",
            "Falta 10 min, para sua sessão encerrar."
          );
          this.isAlerta = false;
        }
      } else if (parseInt(_hora) === 45) {
        if (this.isAlerta) {
          this.$utils.toastError(
            "ALERTA",
            "Falta 5 min, para sua sessão acabar."
          );
          this.isAlerta = false;
        }
      } else if (parseInt(_hora) === 48) {
        if (this.isAlerta) {
          this.$utils.toastError(
            "ALERTA",
            "Sua Sessão vai ser encerrada a qualquer momento."
          );
          this.isAlerta = false;
        }
      } else if (parseInt(_hora) === 59) {
        if (this.isAlerta) {
          this.$utils.toastError(
            "ALERTA",
            "Estamos encerrando sua sessão em 1 minuto."
          );
          this.isAlerta = false;
        }
      } else {
        this.isAlerta = true;
      }
    },
    checkTimeVideo(_hora) {
      this.checkAlert(_hora);
      if (parseInt(_hora) >= 60) {
        if (this.customer) {
          this.$router.push({
            name: "sou-paciente-appointments-finish",
            params: { id: this.app_id },
          });
        } else {
          this.$router.push({
            name: "sou-provider-appointments-finish",
            params: { id: this.app_id },
          });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.main-view {
  height: 100vh;
  width: 100%;
}
#video-chat {
  background: black;
}

.MuiFormHelperText-root .MuiFormHelperText-contained .MuiFormHelperText-filled {
  display: none;
}
</style>