<template>
  <div class="main-view">TWILIO</div>
</template>

<script>
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
    return {};
  },
};
</script>

<style lang="scss">
.main-view {
  min-height: 100vh;
}
</style>