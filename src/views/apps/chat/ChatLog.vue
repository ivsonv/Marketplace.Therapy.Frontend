<template>
  <div class="chats">
    <div
      v-for="(msgGrp, index) in formattedChatData.formattedChatLog"
      :key="msgGrp.senderId + String(index)"
      class="chat"
      :class="{ 'chat-left': msgGrp.senderId != formattedChatData.contact.id }"
    >
      <div class="chat-avatar">
        <b-avatar
          size="36"
          :variant="
            msgGrp.senderId === formattedChatData.contact.id
              ? 'primary'
              : 'success'
          "
          :text="msgGrp.name_initial"
          :title="msgGrp.name"
        ></b-avatar>
      </div>
      <div class="chat-body">
        <div
          v-for="msgData in msgGrp.messages"
          :key="msgData.time"
          class="chat-content"
        >
          <p v-html="msgData.msg"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api";
import { BAvatar } from "bootstrap-vue";

export default {
  components: {
    BAvatar,
  },
  props: {
    chatData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const formattedChatData = computed(() => {
      const contact = {
        id: props.chatData.contact.id,
        avatar: props.chatData.contact.avatar,
      };

      let chatLog = [];
      if (props.chatData.chat) {
        chatLog = props.chatData.chat.chat;
      }

      const formattedChatLog = [];
      let chatMessageSenderId = chatLog[0] ? chatLog[0].senderId : undefined;
      let msgGroup = {
        senderId: chatMessageSenderId,
        name: "",
        name_initial: "",
        messages: [],
      };

      chatLog.forEach((msg, index) => {
        if (chatMessageSenderId === msg.senderId) {
          msgGroup.name = msg.userName;
          msgGroup.name_initial = msg.userNameInitial;
          msgGroup.messages.push({
            msg: msg.message,
            time: msg.time,
          });
        } else {
          chatMessageSenderId = msg.senderId;
          formattedChatLog.push(msgGroup);
          msgGroup = {
            senderId: msg.senderId,
            name: msg.userName,
            name_initial: msg.userNameInitial,
            messages: [
              {
                msg: msg.message,
                time: msg.time,
              },
            ],
          };
        }
        if (index === chatLog.length - 1) formattedChatLog.push(msgGroup);
      });

      return {
        formattedChatLog,
        contact,
      };
    });

    return {
      formattedChatData,
    };
  },
};
</script>

<style>
</style>
