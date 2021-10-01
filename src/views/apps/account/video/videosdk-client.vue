<template>
  <div id="video-chat" class="main-view"></div>
</template>

<script>
import { VideoSDKMeeting } from "@videosdk.live/rtc-js-prebuilt";
export default {
  props: {
    room_id: {
      type: String,
      required: true,
    },
    room_name: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      redirect_exit: "https://www.cliqueterapia.com.br/",
    };
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
      brandLogoURL:
        "https://static.dicionariodesimbolos.com.br/upload/0a/a1/simbolo-da-psicologia-1_xl.png",
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