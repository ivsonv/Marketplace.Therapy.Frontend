<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <!-- Form -->
    <b-form class="p-2" @submit.prevent v-if="record">
      <b-row>
        <b-col cols="6">
          <b-form-group label="Duração">
            <flat-pickr
              v-model="record.duration"
              placeholder="Duração"
              class="form-control"
              :config="{
                enableTime: true,
                noCalendar: true,
                dateFormat: 'H:i',
                time_24hr: true,
              }"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <button--c
          :variant="'info'"
          :iconsize="'20'"
          :icon="null"
          :permission="'permission.course.lesson.edit'"
          :title="'Salvar'"
          @clicked="save()"
          class="mr-1"
        />
    </b-form>
  </b-overlay>
</template>
<script>
import _lessonService from "@/services/lessons-service";
export default {
  props: {
    dto: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      debounceMilliseconds: 300,
      timeout: null,
      isloading: false,
      record: {},
    };
  },
  created() {
    this.getInitials();
    this.getRecord();
  },
  methods: {
    getInitials() {
      this.record = this.dto;
      this.record.duration = "";
    },
    getRecord() {
      if (this.dto.id > 0) {
        this.isloading = true;
        _lessonService
          .find(this.dto.id)
          .then((res) => {
            this.record = res.content;
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    save() {
      const payload = { data: { ...this.record } };
      _lessonService.update(payload)
        .then(() => {
          this.$utils.toast("Sucesso", "Atualizado com sucesso.");
          this.$emit("result", { status: "ok" });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
  },
};
</script>