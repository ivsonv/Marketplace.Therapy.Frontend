<template>
  <viewcard--c
    :title="
      $route.params.id > 0
        ? 'Atualizar Grupo Estudio'
        : 'Cadastrar Grupo Estudio'
    "
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="confirmDelete"
  >
    <b-form @submit.prevent>
      <b-row>
        <b-col md="6">
          <b-form-group label="Nome" label-for="name">
            <b-form-input v-model="record.name" placeholder="Nome do Estúdio" />
          </b-form-group>
        </b-col>
        <b-col md="6">
          <b-form-group label="E-mail">
            <div class="form-label-group">
              <b-form-input
                type="email"
                v-model="record.email"
                placeholder="Informe um e-mail"
              />
            </div>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Quantidade">
            <div class="form-label-group">
              <b-form-input
                v-model="record.quantity"
                placeholder="Quantidade"
              />
            </div>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Intervalo entre agendamentos">
            <div class="form-label-group">
              <b-form-input
                v-model="record.interval_appointments"
                placeholder="Informe os Minutos"
              />
            </div>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Capacidade">
            <div class="form-label-group">
              <b-form-input
                v-model="record.capacity"
                placeholder="Capacidade"
              />
            </div>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Localidade">
            <v-select
              v-if="places.length > 0 && placeSelected"
              v-model="placeSelected"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="places"
              autocomplete="off"
              :clearable="false"
            />
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Escala">
            <v-select
              v-if="scales.length > 0"
              v-model="scaleSelected"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="scales"
              autocomplete="off"
              :clearable="false"
              multiple
            />
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>
  </viewcard--c>
</template>
<script>
import _studioGroupService from "@/services/studios-group-service";
import _placesService from "@/services/places-service";
import _scalesService from "@/services/scales-service";
export default {
  data() {
    return {
      btedit: { permission: `permission.studiogroup.edit` },
      btcreate: { permission: `permission.studiogroup.create` },
      btdelete: { permission: `permission.studiogroup.delete` },
      loading: false,
      places: [],
      placeSelected: { label: "localidade....", value: "-3" },
      scaleSelected: null,
      scales: [],
      record: {
        id: 0,
        name: "",
        place: "",
        quantity: 0,
        capacity: 0,
        email: "",
        interval_appointments: 0,
      },
    };
  },
  created() {
    this.getplaces();
    this.getscales();
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    getplaces() {
      this.loading = true;
      _placesService
        .show()
        .then((res) => {
          this.places = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getscales() {
      this.loading = true;
      _scalesService
        .show()
        .then((res) => {
          this.scales = this.$utils.populardropdown(
            res.content,
            "name",
            "id",
            false,
            false
          );
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _studioGroupService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content;

            if (this.record.place) {
              this.placeSelected = {
                label: this.record.place.name,
                value: this.record.place.id,
              };
            }

            if (this.record.studiosGroupScales) {
              this.scaleSelected = this.record.studiosGroupScales.map((m) => {
                return {
                  label: m.scale.name,
                  value: m.scale.id,
                };
              });
              this.record.studiosGroupScales = null;
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      if (this.placeSelected) {
        this.record.place_id = this.$utils.getValueSelected(this.placeSelected);
        this.record.place = { name: this.placeSelected.label };
      }

      if (this.scaleSelected) {
        this.record.studiosgroupscales = [];
        this.scaleSelected.forEach((_scale) => {
          this.record.studiosgroupscales.push({
            scale_id: _scale.value,
          });
        });
      }

      const payload = { data: { ...this.record } };

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _studioGroupService.create(payload)
          : _studioGroupService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Registro salvo com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
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
      this.loading = true;
      _studioGroupService
        .delete(this.record.id)
        .then(() => {
          this.$utils.toast("Notificação", "Excluido com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>