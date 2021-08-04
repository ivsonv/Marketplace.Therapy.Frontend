<template>
  <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
    <validation-observer ref="eventRules">
      <b-form class="px-1" @submit.prevent>
        <b-row>
          <b-col cols="12">
            <b-form-group label="Nome do evento *">
              <validation-provider
                #default="{ errors }"
                name="Nome do evento"
                rules="required"
              >
                <b-form-input
                  v-model="record.name"
                  placeholder="Nome do Evento"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label="Tipo do Evento *">
              <validation-provider
                #default="{ errors }"
                name="Tipo do Evento"
                rules="required"
              >
                <b-form-input
                  v-model="record.type"
                  placeholder="Tipo do Evento"
                />
                <small class="text-danger">{{ errors[0] }}</small>
              </validation-provider>
            </b-form-group>
          </b-col>
          <b-col cols="12">
            <b-form-group label="Descrição Evento">
              <div class="form-label-group">
                <quill-editor v-model="record.description" />
              </div>
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="Imagem Evento">
              <div class="form-label-group">
                <img
                  @click="$refs.fileInput.click()"
                  :src="urlImage"
                  id="thumbnail-youtube"
                  class="img-fluid rounded-shadow cursor-pointer"
                />
                <input
                  style="display: none"
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  @change="onFileChange"
                />
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="12">
            <button--c
              :variant="'info'"
              :iconsize="'20'"
              :icon="null"
              :permission="
                record.id > 0
                  ? 'permission.events.edit'
                  : 'permission.events.create'
              "
              :title="'Salvar'"
              @clicked="validationForm()"
              class="mr-1"
            />
            <button--c
              v-if="record.id > 0"
              :variant="'gradient-danger'"
              :iconsize="'20'"
              :icon="null"
              :permission="'permission.events.delete'"
              :title="'Excluir'"
              @clicked="confirmDelete()"
              class="mr-1"
            />
          </b-col>
        </b-row>
      </b-form>
    </validation-observer>
  </b-overlay>
</template>
<script>
import _eventService from "@/services/event-service";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import pt_br from "vee-validate/dist/locale/pt_BR.json";
import { required } from "@validations";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
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
      projects: [],
      selectedFile: null,
      urlImage: `${require("@/assets/images/pages/sem-foto.png")}`,
    };
  },
  created() {
    this.initials();
    this.getRecord();
    localize("pt_BR", pt_br);
  },
  methods: {
    validationForm() {
      this.$refs.eventRules.validate().then((success) => {
        if (success) {
          this.save();
        }
      });
    },
    initials() {
      this.record = this.dto;
      this.record.description = "";
      this.record.name = "";
    },
    getRecord() {
      if (this.dto.id > 0) {
        this.isloading = true;
        _eventService
          .find(this.dto.id)
          .then((res) => {
            this.record = res.content;
            if (this.record.image) {
              this.urlImage = `${res.pathimage}/${this.record.image}`;
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    save() {
      let payload = new FormData();

      if (this.selectedFile) {
        payload.append("thumbnail", this.selectedFile);
      }
      payload.append("dados", JSON.stringify(this.record));

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _eventService.create(payload)
          : _eventService.update(payload);

      this.isloading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Evento salvo com sucesso.");
          this.$emit("result", { status: "ok" });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    confirmDelete() {
      this.$swal({
        title: "Tem certeza?",
        text: "Isso não pode ser revertido!",
        icon: "error",
        showCancelButton: true,
        confirmButtonText: "Sim, quero excluir!",
        cancelButtonText: "Cancelar",
        customClass: {
          confirmButton: "btn btn-info",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.excluir();
        }
      });
    },
    excluir() {
      this.isloading = true;
      _eventService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$emit("result", "ok");
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    onFileChange(e) {
      e.preventDefault();
      this.selectedFile = e.target.files[0];
      this.urlImage = URL.createObjectURL(e.target.files[0]);
    },
  },
};
</script>
<style>
#thumbnail-youtube {
  border: 1px solid #999;
  width: 100px;
  height: 70px;
  border-radius: 10%;
}

#thumbnail-youtube:hover {
  opacity: 0.5;
}
</style>