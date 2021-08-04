<template>
  <main class="main-view">
    <div class="px-2 mt-1">
      <div v-if="$store.getters.user">
        <strong class="d-block">{{ $store.getters.user.name }}</strong>
        <small class="text-muted">{{ $store.getters.user.ramal }} </small>
      </div>
      <hr />
    </div>
  </main>
</template>

<script>
export default {
  data: () => ({}),
  methods: {},
};
</script>
<style>
</style>