<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Banner' : 'Cadastrar Banner'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="onDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <b-row>
      <b-col md="6">
        <b-form-group label="Tipo de Banner">
          <v-select v-model="typeSelected" :options="typeList" />
        </b-form-group>
      </b-col>
      <b-col md="12">
        <b-form-group label="Imagem">
          <upload-file--c
            origin="image/banner"
            accept="image/*"
            :preview="urlImage"
            :multiple="false"
            @result="onUpdateImage"
            class="p-0"
            stylecss="max-height: 300px; max-width: 95%"
            permission="banner.create"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </viewcard--c>
</template>
<script>
import _bannerService from "@/services/banner-service";
import uploadFile from "@/components/upload-file.vue";
export default {
  components: {
    "upload-file--c": uploadFile,
  },
  data() {
    return {
      btedit: { permission: `banner.edit` },
      btcreate: { permission: `banner.create` },
      btdelete: { permission: `banner.delete` },
      loading: false,

      typeList: [],
      typeSelected: null,
      urlImage: "",
      record: {
        id: 0,
        image: "",
      },
    };
  },
  mounted() {
    this.getTypes();
  },
  methods: {
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _bannerService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;
            this.urlImage = res.content.imageurl;
            this.typeSelected = this.typeList.filter(f => f.value === res.content.type.toString())[0]
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      if (this.typeSelected) {
        this.record.type = this.typeSelected.value;
      }

      const payload = { data: { ...this.record } };

      const _createOrUpdate =
        this.record.id <= 0
          ? _bannerService.create(payload)
          : _bannerService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    onDelete() {
      this.loading = true;
      _bannerService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getTypes() {
      _bannerService.allTypes().then((res) => {
        this.typeList = res;
        this.typeSelected = res[0];
        this.getRecord();
      });
    },
    onUpdateImage(item) {
      this.record.image = item.key.split("/")[2];
      this.save();
    },
  },
};
</script>