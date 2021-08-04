<template>
  <b-card>
    <b-row class="mb-1 mb-sm-0"> </b-row>
    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <b-table
        :items="list"
        :fields="fields"
        :busy="isloading"
        responsive
        hover
        style="font-size: 10px"
      >
        <template #cell(operator_id)="data">
          <div
            v-if="
              $utils.isPermited('permission.appointment.studio.operator.edit')
            "
          >
            <div
              class="text-nowrap"
              v-if="data.item.operator_id && data.item.operator_id > 0"
            >
              <span v-html="controlSizeName(data.item.operator_name)"></span>
              <feather-icon
                :id="`operators-row-${data.item.appointment_studio_id}`"
                icon="DeleteIcon"
                size="16"
                class="mx-1"
                @click="onBlurBackoffice(data.item, false, true)"
              />
            </div>
            <div class="text-nowrap" v-else>
              <b-form-group>
                <v-select
                  v-if="data.item.operators"
                  v-model="data.item.operatorsSelected"
                  :options="data.item.operators"
                  autocomplete="off"
                  :clearable="false"
                  @input="onBlurBackoffice(data.item, false, false)"
                />
              </b-form-group>
            </div>
          </div>
          <div v-else>
            <div
              class="text-nowrap"
              v-if="data.item.operator_id && data.item.operator_id > 0"
            >
              {{ data.item.operator_name }}
            </div>
            <div v-else>**********</div>
          </div>
        </template>
        <template #cell(operator_backup_id)="data">
          <div
            v-if="
              $utils.isPermited('permission.appointment.studio.operator.edit')
            "
          >
            <div
              class="text-nowrap"
              v-if="
                data.item.operator_backup_id && data.item.operator_backup_id > 0
              "
            >
              <span v-html="controlSizeName(data.item.operator_backup_name)"></span>
              <feather-icon
                :id="`operators-backup-row-${data.item.appointment_studio_id}`"
                icon="DeleteIcon"
                size="16"
                class="mx-1"
                @click="onBlurBackoffice(data.item, true, true)"
              />
            </div>
            <div class="text-nowrap" v-else>
              <b-form-group>
                <v-select
                  v-if="data.item.operators"
                  v-model="data.item.operatorsBackupSelected"
                  :options="data.item.operators"
                  autocomplete="off"
                  :clearable="false"
                  @input="onBlurBackoffice(data.item, true, false)"
                />
              </b-form-group>
            </div>
          </div>
          <div v-else>
            <div
              class="text-nowrap"
              v-if="
                data.item.operator_backup_id && data.item.operator_backup_id > 0
              "
            >
              {{ data.item.operator_backup_name }}
            </div>
            <div v-else>**********</div>
          </div>
        </template>
      </b-table>
      <hr />
      <div class="d-flex justify-content-center">
        <b-button @click="getLoadMore" variant="secondary" v-if="more" pill>
          Carregar mais
        </b-button>
      </div>
    </b-overlay>
    <!-- Filter -->
    <b-button
      class="btn-filter-appoitment btn-icon rounded-circle"
      :variant="containsFilter ? 'gradient-warning' : 'gradient-info'"
      @click="isActiveFilter = true"
    >
      <feather-icon icon="FilterIcon" size="25" />
    </b-button>
    <b-sidebar
      sidebar-class="sidebar-lg"
      bg-variant="white"
      v-model="isActiveFilter"
      right
      backdrop
      shadow
      no-header
    >
      <template #default="{ hide }" v-if="isActiveFilter">
        <div
          class="
            d-flex
            justify-content-between
            align-items-center
            content-sidebar-header
            px-2
            py-1
          "
        >
          <h5 class="mb-0">Filtros</h5>
          <div>
            <feather-icon
              class="ml-1 cursor-pointer"
              icon="XIcon"
              size="16"
              @click="hide"
            />
          </div>
        </div>
        <b-form class="px-1 mt-1">
          <b-row>
            <b-col cols="12">
              <b-form-group label="Data">
                <flat-pickr
                  v-model="dataFilter"
                  class="form-control"
                  :config="config"
                />
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group label="Empresa">
                <v-select
                  v-if="companies.length > 0"
                  v-model="companieSelected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="companies"
                  autocomplete="off"
                  multiple
                  :clearable="false"
                >
                  <template v-slot:option="option">
                    <div class="d-flex justify-content-between">
                      <h5 class="mb-0 text-uppercase">
                        {{ option.label }}
                      </h5>
                    </div>
                  </template>
                </v-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group label="Estúdio">
                <v-select
                  v-if="studios.length > 0"
                  v-model="studioSelected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="studios"
                  autocomplete="off"
                  :clearable="false"
                  multiple
                >
                  <template v-slot:option="option">
                    <div class="d-flex justify-content-between">
                      <h5 class="mb-0 text-uppercase">
                        {{ option.label }}
                      </h5>
                    </div>
                  </template>
                </v-select>
              </b-form-group>
            </b-col>

            <b-col cols="12">
              <b-form-group label="Operador">
                <v-select
                  v-if="operators.length > 0"
                  v-model="operatorsFilterSelected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="operators"
                  autocomplete="off"
                  :clearable="false"
                  multiple
                >
                  <template v-slot:option="option">
                    <div class="d-flex justify-content-between">
                      <h5 class="mb-0 text-uppercase">
                        {{ option.label }}
                      </h5>
                    </div>
                  </template>
                </v-select>
              </b-form-group>
            </b-col>
            <b-col cols="12">
              <b-form-group label="Operador Backup">
                <v-select
                  v-if="operators.length > 0"
                  v-model="operatorsBackupFilterSelected"
                  :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                  :options="operators"
                  autocomplete="off"
                  :clearable="false"
                  multiple
                >
                  <template v-slot:option="option">
                    <div class="d-flex justify-content-between">
                      <h5 class="mb-0 text-uppercase">
                        {{ option.label }}
                      </h5>
                    </div>
                  </template>
                </v-select>
              </b-form-group>
            </b-col>
            <b-col cols="9">
              <b-button @click="filter" variant="gradient-info" block>
                FILTRAR
              </b-button>
            </b-col>
            <b-col cols="3">
              <b-button @click="clearfilter" variant="gradient-primary" block>
                Limpar
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </template>
    </b-sidebar>
  </b-card>
</template>

<script>
import { VBToggle } from "bootstrap-vue";
import _appointmentService from "@/services/appointment-service";
import _operatorsService from "@/services/operators-service";
import _companyService from "@/services/company-service";
import _studiosGroupService from "@/services/studios-group-service";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";

export default {
  props: {
    projectId: {
      type: Object,
      default: null,
    },
  },
  directives: {
    "b-toggle": VBToggle,
  },
  data() {
    return {
      isActiveFilter: false,
      more: false,
      isloading: false,
      currentePage: 1,
      search: "",
      size: 12,
      fields: [
        { key: "appointment_id", label: "ID" },
        { key: "company", label: "Empresa" },
        { key: "start", label: "Início" },
        { key: "end", label: "Fim" },
        { key: "course_event", label: "Curso/Evento" },
        { key: "studio", label: "Estúdio" },
        {
          key: "operator_id",
          label: "Operador",
          class: "td-min-column",
        },
        {
          key: "operator_backup_id",
          label: "Operador Backup",
          class: "td-min-column",
        },
      ],
      list: [],
      debounceMilliseconds: 300,
      timeout: null,
      operators: [],
      companies: [],
      companieSelected: [],
      studios: [],
      studioSelected: [],
      operatorsFilterSelected: [],
      operatorsBackupFilterSelected: [],
      dataFilter: null,
      config: {
        dateFormat: "d-m-Y",
        altFormat: "d/m/Y",
        minDate: "today",
        locale: Portuguese,
      },
    };
  },
  created() {
    this.initiDateNow();
    this.getOperators();
    this.getCompanies();
    this.getStudios();
  },
  computed: {
    containsFilter() {
      var companyid = this.companieSelected
        ? this.companieSelected.map((m) => m.value)
        : ["-1"];

      var groupstudioid = this.studioSelected
        ? this.studioSelected.map((m) => m.value)
        : ["-1"];

      var operadorsid = this.operatorsFilterSelected
        ? this.operatorsFilterSelected.map((m) => m.value)
        : ["-1"];

      var operadorBakcupsid = this.operatorsBackupFilterSelected
        ? this.operatorsBackupFilterSelected.map((m) => m.value)
        : ["-1"];

      return (
        this.dataFilter ||
        companyid.some((s) => s !== "-1") ||
        groupstudioid.some((s) => s !== "-1") ||
        operadorsid.some((s) => s !== "-1") ||
        operadorBakcupsid.some((s) => s !== "-1")
      );
    },
  },
  methods: {
    initiDateNow() {
      const today = new Date();
      this.dataFilter = `${today.getDate()}-${
        today.getMonth() + 1
      }-${today.getFullYear()}`;
    },
    getOperators() {
      _operatorsService
        .showOperatorsAll()
        .then((res) => {
          if (res.content && res.content.length > 0) {
            this.operators = this.$utils.populardropdown(
              res.content,
              "name",
              "id",
              false,
              false,
              false
            );
            this.getRecords(this.currentePage);
          } else {
            this.$utils.toastError(
              "Notificação",
              "Sem nenhum operador encontrado."
            );
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    getRecords(_page, params = null) {
      this.isloading = true;
      _appointmentService
        .showScaleOperators(_page, params)
        .then((res) => {
          if (res.content) {
            res.content.forEach((element) => {
              element.operators = this.operators;
              element.operatorsSelected = null;
              element.operatorsBackupSelected = null;
            });

            this.more = res.content.length >= this.size;
            this.list.push(...res.content);
            this.currentePage = _page;
            console.log(this.list.length);
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    getLoadMore(_page) {
      let params = this.getParams();
      this.getRecords(this.currentePage + 1, params);
    },
    getParams() {
      let params = {};
      if (this.dataFilter) {
        let dates = this.dataFilter.split("-");
        params.date = `${dates[2]}-${dates[1]}-${dates[0]}`;
      }
      if (this.companieSelected && this.companieSelected.length > 0) {
        params.company_id = [];
        this.companieSelected.forEach((element) => {
          params.company_id.push(element.value);
        });
      }

      if (this.studioSelected && this.studioSelected.length > 0) {
        params.group_studio_id = [];
        this.studioSelected.forEach((element) => {
          params.group_studio_id.push(element.value);
        });
      }

      if (
        this.operatorsFilterSelected &&
        this.operatorsFilterSelected.length > 0
      ) {
        params.operator_id = [];
        this.operatorsFilterSelected.forEach((element) => {
          params.operator_id.push(element.value);
        });
      }

      if (
        this.operatorsBackupFilterSelected &&
        this.operatorsBackupFilterSelected.length > 0
      ) {
        params.operator_backup_id = [];
        this.operatorsBackupFilterSelected.forEach((element) => {
          params.operator_backup_id.push(element.value);
        });
      }

      return params;
    },
    filter() {
      this.currentePage = 1;
      this.list = [];
      let params = this.getParams();
      this.getRecords(this.currentePage, params);
    },
    onBlurBackoffice(item, backup, cancel) {
      let upsert = {
        studiosOperator: {},
      };
      this.list.forEach((element) => {
        if (element.appointment_studio_id == item.appointment_studio_id) {
          if (cancel) {
            if (!backup) {
              element.operator_id = 0;
              element.operator_name = "";
              item.operatorsSelected = null;
            } else {
              element.operator_backup_id = 0;
              element.operator_backup_name = "";
              item.operatorsBackupSelected = null;
            }
          } else {
            if (!backup) {
              element.operator_id = item.operatorsSelected.value;
              element.operator_name = item.operatorsSelected.label;
              item.operatorsSelected = null;

              //Preencher
              upsert.studiosOperator.appointment_studio_id =
                item.appointment_operator_id;
              upsert.studiosOperator.operator_id = element.operator_id;
              upsert.studiosOperator.operator_backup = false;
              if (
                upsert.studiosOperator.appointment_studio_id == null ||
                upsert.studiosOperator.appointment_studio_id == 0
              ) {
                upsert.example_id = true;
                upsert.studiosOperator.appointment_studio_id =
                  item.appointment_operator_backup_id;
              }
            } else {
              element.operator_backup_id = item.operatorsBackupSelected.value;
              element.operator_backup_name = item.operatorsBackupSelected.label;
              item.operatorsBackupSelected = null;
              //Preencher
              upsert.studiosOperator.appointment_studio_id =
                item.appointment_operator_backup_id;
              upsert.studiosOperator.operator_id = element.operator_backup_id;
              upsert.studiosOperator.operator_backup = true;

              if (
                upsert.studiosOperator.appointment_studio_id == null ||
                upsert.studiosOperator.appointment_studio_id == 0
              ) {
                upsert.example_id = true;
                upsert.studiosOperator.appointment_studio_id =
                  item.appointment_operator_id;
              }
            }
          }
        }
      });

      if (!cancel) {
        const payload = { data: { ...upsert } };
        //promisse
        const _createOrUpdate =
          _appointmentService.upSertScaleOperators(payload);

        this.isloading = true;
        _createOrUpdate
          .then((res) => {
            this.$utils.toast("SUCESSO", "Operador vinculado com sucesso");
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    getCompanies() {
      _companyService
        .showAll()
        .then((res) => {
          if (res.content && res.content.length > 0) {
            this.companies = this.$utils.populardropdown(
              res.content,
              "name",
              "id",
              false,
              false,
              false
            );
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    getStudios() {
      _studiosGroupService
        .showAll()
        .then((res) => {
          if (res.content && res.content.length > 0) {
            res.content.forEach((element) => {
              if (element.place && element.place.name) {
                element.name = `${element.name} - ${element.place.name}`;
              }
            });
            this.studios = this.$utils.populardropdown(
              res.content,
              "name",
              "id",
              false,
              false,
              false
            );
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    clearfilter() {
      this.initiDateNow();
      this.companieSelected = null;
      this.studioSelected = null;
      this.operatorsFilterSelected = null;
      this.operatorsBackupFilterSelected = null;
      this.filter();
    },
    controlSizeName(name) {
      let newName = "";
      if (name) {
        var names = name.split(" ");
        names.forEach((element) => {
          newName += `${element} <br>`;
        });
        newName = newName.slice(0, -1)
      }
      return newName;
    },
  },
};
</script>
<style >
.td-min-column {
  min-width: 200px;
}
.btn-filter-appoitment {
  position: fixed;
  bottom: 5%;
  right: 45px;
  z-index: 99;
}
</style>
