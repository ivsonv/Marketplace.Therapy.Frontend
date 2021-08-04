<template>
  <b-overlay :show="busy" spinner-variant="primary" spinner-type="grow">
    <b-card>
      <template #header>
        <h4 class="mb-0">
          {{ title }}
          <small v-if="subtitle" class="d-block">{{ subtitle }}</small>
        </h4>
        <b-row v-if="btnew || btsave || btdelete || btback">
          <b-col cols="12">
            <!-- NOVO REGISTRO -->
            <button--c
              :variant="btnew.variant || 'info btn-icon'"
              :iconsize="btnew.iconsize || '20'"
              :icon="btnew.icon || 'PlusIcon'"
              :permission="btnew.permission"
              :title="btnew.title || ''"
              :to="btnew.to"
              class="mr-1"
              v-if="btnew"
            />

            <!-- SAVE -->
            <button--c
              :variant="btsave.variant || 'info btn-icon'"
              :iconsize="btsave.iconsize || '20'"
              :icon="btsave.icon || 'SaveIcon'"
              :permission="btsave.permission"
              :title="btsave.title || ''"
              @clicked="onclicksave"
              v-if="btsave"
              class="mr-1"
            />

            <!-- DELETE -->
            <button--c
              :variant="btdelete.variant || 'danger btn-icon'"
              :iconsize="btdelete.iconsize || '20'"
              :icon="btdelete.icon || 'Trash2Icon'"
              :permission="btdelete.permission"
              :title="btdelete.title || ''"
              @clicked="onclickdelete"
              v-if="btdelete"
              class="mr-1"
            />

            <button--c
              :variant="'secondary'"
              :iconsize="'20'"
              :icon="'ArrowLeftIcon'"
              :title="''"
              @clicked="onclickGo"
              :permission="btback.permission"
              v-if="btback && btback.permission && btback.click"
              class="btn-icon"
            />
            <b-button
              @click="$router.go(-1)"
              variant="secondary"
              class="btn-icon"
              v-if="btback && !btback.permission"
            >
              <feather-icon icon="ArrowLeftIcon" size="20" />
            </b-button>
          </b-col>
        </b-row>
      </template>

      <!-- conteudo -->
      <slot></slot>
    </b-card>
  </b-overlay>
</template>

<script>
import button from "@/components/button.vue";
export default {
  components: {
    "button--c": button,
  },
  props: {
    title: {
      type: String,
      required: false,
    },
    subtitle: {
      type: String,
      required: false,
    },
    busy: {
      type: Boolean,
      required: false,
    },
    btnew: {
      type: Object,
      required: false,
    },
    btsave: {
      type: Object,
      required: false,
    },
    btdelete: {
      type: Object,
      required: false,
    },
    btback: {
      type: Object,
      required: false,
    },
  },
  methods: {
    onclicksave() {
      this.$emit("clicked-save");
    },
    onclickdelete() {
      this.$emit("clicked-delete");
    },
    onclickGo() {
      this.$emit("clicked-go");
    },
  },
};
</script>