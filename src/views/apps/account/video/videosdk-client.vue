<template>
  <div class="main-view"></div>
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
    person_name: {
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
      containerId: null,
      redirectOnLeave: this.redirect_exit,
      micEnabled: true,
      webcamEnabled: true,
      participantCanToggleSelfWebcam: true,
      participantCanToggleSelfMic: true,
      chatEnabled: true,
      screenShareEnabled: true,
      pollEnabled: true,
      whiteBoardEnabled: true,
      raiseHandEnabled: false,
      recordingEnabled: false,
      recordingEnabledByDefault: false,
      recordingWebhookUrl: "",
      participantCanToggleRecording: true,
      brandingEnabled: true,
      brandLogoURL:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEMAAAA7CAMAAAAXZcftAAAAwFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACOoSlDAAAAP3RSTlMAi/wOBhei/psQ+JMSAZDtn/QEAs9IqTTe8Id41kFn43HTty8cOpeDbCfaywqlIAzC6b1PXKpVEccsfmKtsiOGmCPQAAAC/0lEQVRIx+3Xb5tqQBQAcCY1EgSCJKFQttv/2tq27/+troaKEurZ+zz3xZ6XZ44fBjMHhv1EiAQKgXnMPYSYqmGEW26In0M3FfpWMdzjeeH1bmfZKqaOkr3osAPHcTw4QY5UiEuFOdZ4AE/pgIDXVOtSIDitOTwBPjrWFzDM6Xa7LQNEVZPraRTLGx0l7qZATrJJzxpeL3QXjYHxKDpWSS4/NOfnwt00db+h46kXBPZ1JUyNubPzyNz6k55Yx0alIyEz2yafGLxFpAcEFuELJfNw6iSq1bJZV0qMQZDJO32U7biZbLMVXzOeydLrxDhmqz0KZdt0Jltj42IpzMhkYnzU0+lwBooM7jPXaGSMoA+LDH5TwVhyhQbVrWBY2qnQYCsYOl9ogHYFo0UVG50KBvm/G/BlA/6EQTYzRojHry9YVzDaiTHKfPoYsY/z4Ku6QeGZBQFjrPi9AccKxkds8Hsxu7qv5rFhVzDWscH5dzuEbMTGjCk3jvHcqcs7w5nF8zQhSg1iERsT5c6gO2gAGs1SozZB7wG06/e7nafFC/h3qTE1kMGz4v2WuUQTAudyqdGLtwx187DtNr/QzfDdUsPi0Owvto979wGtksAmSgyiQ6EL9nP2f/qLihCo9kqM4eBcBmw6r4noSee74RvNQqPW4tHzk3MbEWaFztA3awXGn8N5RuHYZJ50M5tddDvQ8F3xiSG6phRVUJOV+LQlUkYGBWF/tJwSOYbgyqwKITUmh0xBY1XbjCZaVNX2l8p0W7/uldPmVJF9ckBBXiI3dHF3xtC97ofEAc2wGyw+SQyJZRu2oQFO6uzlulje5IXfsql3dqpGUcniewIUpam7tW7K32HVXlHYBkN55XvX/gP3V/IwoIWXm87QbSRGJwhF7L14sgb9Gr8Giu3lHVu7bxv1RWLMpm8bQT8x+srbhgUu322XePNHTx5f/4HU5cvfHB18OrI3SP1HDXTZ+QxeeTyrhSSNufQPHdTGkjQ7vGD09FZe4PILBlHLDwL7V/EXxxHi5aM5MrkAAAAASUVORK5CYII=",
      brandName: "CLIQUE TERAPIA",
      poweredBy: true,

      participantCanLeave: true, // if false, leave button won't be visible
      // Live stream meeting to youtube
      livestream: {
        autoStart: true,
        outputs: [
          // {
          //   url: "rtmp://x.rtmp.youtube.com/live2",
          //   streamKey: "<STREAM KEY FROM YOUTUBE>",
          // },
        ],
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
  min-height: 100vh;
}
</style>