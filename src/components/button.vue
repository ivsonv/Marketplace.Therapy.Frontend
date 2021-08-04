<template>
  <b-button
    v-if="$utils.isPermited(permission)"
    @click="onclick"
    :to="to"
    :variant="variant"
  >
    <feather-icon v-if="icon" :icon="icon" :size="iconsize" />
    {{ title }}
  </b-button>
</template>

<script>
export default {
  props: {
    permission: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    to: {
      type: String,
      required: false,
    },
    variant: {
      type: String,
      required: false,
    },
    icon: {
      type: String,
      required: false,
    },
    iconsize: {
      type: String,
      required: false,
    },
  },
  methods: {
    onclick() {
      this.$emit("clicked");
    },
  },
};
</script>