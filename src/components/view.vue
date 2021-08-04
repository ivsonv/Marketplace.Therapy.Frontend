<template>
  <div v-if="$utils.isPermited(permission)">
    <b-overlay :show="busy" spinner-variant="primary" spinner-type="grow">
      <slot></slot>
    </b-overlay>
  </div>
  <span v-else>-</span>
</template>

<script>
export default {
  props: {
    permission: {
      type: String,
      required: true,
    },
    busy: {
      type: Boolean,
      required: false,
    },
  },
};
</script>