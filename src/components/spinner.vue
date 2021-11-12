<template>
  <b-spinner :variant="variant" class="mr-1" />
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      required: false,
      default: () => "primary",
    },
  },
};
</script>