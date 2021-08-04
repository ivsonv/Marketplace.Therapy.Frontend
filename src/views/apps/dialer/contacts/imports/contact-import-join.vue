<template>
  <div>
    <b-overlay :show="isloading" spinner-variant="primary" spinner-type="grow">
      <form-wizard
        :title="null"
        :subtitle="null"
        color="#333"
        finish-button-text="Salvar"
        back-button-text="Voltar"
        next-button-text="Próximo"
        class="mb-3"
        @on-complete="formSubmitted"
      >
        <!-- Import Excel tab -->
        <tab-content
          :title="`Escolha Excel`"
          icon="feather icon-file-text"
          :before-change="handleProcessExcel"
        >
          <b-row class="mb-1 mb-sm-0">
            <b-col md="6">
              <input
                type="file"
                ref="fileInput"
                :accept="'.xlsx, .xls'"
                @change="handleUpload"
              />
            </b-col>
          </b-row>
        </tab-content>

        <tab-content title="Escolha Campos" icon="feather icon-user">
          <b-table
            striped
            responsive
            class="mb-0"
            :items="list_select"
            :fields="fields_select"
            :busy="isloading"
          >
            <template #cell(include)="data">
              <b-form-checkbox
                v-model="data.item.include"
                :checked="data.item.include"
              />
            </template>
            <template #cell(phone)="data">
              <b-form-checkbox
                v-model="data.item.phone"
                :checked="data.item.phone"
              />
            </template>
          </b-table>
        </tab-content>

        <tab-content
          title="Confirma Campos"
          icon="feather icon-user"
          :before-change="handleInitConvert"
        >
          <b-table
            striped
            responsive
            class="mb-0"
            :items="list_select.filter((f) => f.include)"
            :fields="fields_select"
            :busy="isloading"
          >
            <template #cell(include)="data">
              {{ data.item.include ? "sim" : "não" }}
            </template>
            <template #cell(phone)="data">
              {{ data.item.phone ? "sim" : "não" }}
            </template>
          </b-table>
        </tab-content>

        <!-- Fields Required -->
        <tab-content title="Resumo Conversão" icon="feather icon-user">
          <b-row>
            <b-col cols="12">
              <b-card no-body class="border mt-1">
                <b-card-header class="p-1">
                  <b-card-title class="font-medium-2">
                    <feather-icon icon="LockIcon" size="18" />
                    <span
                      class="align-middle ml-50"
                      v-if="list && list.length > 0"
                      >{{ list.length }} Regitros
                    </span>
                  </b-card-title>
                </b-card-header>
                <b-table
                  striped
                  :sticky-header="true"
                  :per-page="perPage"
                  :current-page="currentPage"
                  responsive
                  class="mb-0"
                  :items="list"
                  :fields="fields_list"
                  :busy="isloading"
                />
              </b-card>
              <b-pagination
                v-model="currentPage"
                :total-rows="list.length"
                :per-page="perPage"
                align="center"
                size="sm"
                class="my-0"
              />
            </b-col>
          </b-row>
        </tab-content>
      </form-wizard>
    </b-overlay>
  </div>
</template>
<script>
import _contactservice from "@/services/dialer/contact-list-service";

import { FormWizard, TabContent } from "vue-form-wizard";
import "vue-form-wizard/dist/vue-form-wizard.min.css";

import { BListGroupItem } from "bootstrap-vue";
import draggable from "vuedraggable";

import XLSX from "xlsx";
export default {
  components: {
    FormWizard,
    TabContent,
    draggable,
    BListGroupItem,
  },
  data() {
    return {
      perPage: 20,
      totalRows: 1,
      currentPage: 1,
      isloading: false,
      importlist: null,
      selectedfiles: null,
      record: null,
      config_reads: null,
      payloadContacts: [],

      fields_select: [
        { key: "campo", label: "Campo" },
        { key: "include", label: "Incluir campo ?" },
        { key: "phone", label: "Telefone" },
      ],
      list_select: [],
      fieldsConfig: null,
      fields_list: [],
      list: [],
    };
  },
  created() {},
  methods: {
    formSubmitted() {
      const payload = {
        data: {
          json: JSON.stringify(this.fieldsConfig),
          contacts: this.payloadContacts,
          id: this.$route.params.id,
        },
      };

      this.isloading = true;
      _contactservice
        .createImport(payload)
        .then(() => {
          this.$utils.toast("Notificação", "Importação com sucesso.");
          this.$router.go(-1);
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloading = false));
    },
    async handleProcessExcel() {
      this.isloading = true;
      setTimeout(() => this.readerData(this.selectedfiles), 500);
      return true;
    },

    handleUpload(e) {
      this.selectedfiles = e.target.files[0];
      if (!this.selectedfiles) {
        this.isloading = false;
        return;
      }
    },

    // EXCEL
    async readerData(rawFile) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const header = this.getHeaderRow(worksheet);
          const results = XLSX.utils.sheet_to_json(worksheet);
          //const results = [];
          const meta = { sheetName: firstSheetName };
          this.generateData({ header, results, meta });
          resolve();
        };
        reader.readAsArrayBuffer(rawFile);
      });
    },

    generateData({ header, results, meta }) {
      this.importlist = { header, results, meta };

      this.list_select = [];
      for (let index = 0; index < this.importlist.header.length; index++) {
        let _name = this.$utils.clearExcel(this.importlist.header[index]);
        let ff = {
          include: this.$utils.isPhone(_name),
          phone: this.$utils.isPhone(_name),
          campo: _name,
          value: _name,
          alias: "",
        };

        if (!this.list_select.some((s) => s.value === ff.value)) {
          this.list_select.push(ff);
        } else {
          ff.label += `_${index}`;
          ff.value += `_${index}`;
          ff.key += `_${index}`;
          this.list_select.push(ff);
        }
      }

      this.list_select.sort(function (a, _) {
        return !a.phone ? 1 : -1;
      });

      this.isloading = false;
    },

    handleInitConvert() {
      this.isloading = true;

      // separando campos avulsos de campos de telefone
      const othFileds = this.list_select.filter((f) => f.include && !f.phone);
      const phonesTypes = this.list_select.filter((f) => f.include && f.phone);

      const fields = othFileds.map((m) => {
        return { value: m.campo };
      });

      const phones = phonesTypes.map((m) => {
        return { value: m.campo };
      });
      // FIM separando campos avulsos de campos de telefone

      // fields Config
      this.fieldsConfig = { fields, phones };

      //fields
      this.getFields({ fields, phones });

      // Records
      this.getFieldRecords({ fields, phones });

      this.isloading = false;
      return true;
    },

    getFields(_jsonConfig) {
      // Todos os campos disponiveis
      let fieldsAvailable = _jsonConfig.fields;
      fieldsAvailable.push(..._jsonConfig.phones);

      // listar todas coluna do excel
      let fullFields = [];
      for (let index = 0; index < this.importlist.header.length; index++) {
        let _name = this.$utils.clearExcel(this.importlist.header[index]);
        let ff = {
          campo: _name,
          index: index,
          key: _name,
          label: _name,
        };

        // capturar campos apenas da configuração
        if (!fullFields.some((s) => s.campo === ff.campo)) {
          fullFields.push(ff);
        } else {
          ff.campo += `_${index}`;
          fullFields.push(ff);
        }
      }

      // Deixar apenas colunas configuradas
      this.fields_list = [];
      for (let index = 0; index < fullFields.length; index++) {
        // capturar campos apenas da configuração
        if (fieldsAvailable.some((s) => s.value === fullFields[index].campo)) {
          this.fields_list.push(fullFields[index]);
        }
      }
    },

    getFieldRecords(_jsonConfig) {
      this.list = [];

      let listformated = [];
      for (let [_, value] of Object.entries(this.importlist.results)) {
        // percorrer chaves padronizar
        let fields_temp = [];
        var index = 0;
        for (let _prop in value) {
          let _name = this.$utils.clearExcel(_prop);

          // renomear campo igual
          if (fields_temp.some((s) => s.name === _name)) {
            _name += `_${index}`;
          }

          // apenas campos configurados
          if (this.fields_list.some((s) => s.campo === _name)) {
            fields_temp.push({
              name: _name,
              value: value[_prop],
            });
          }
          index++;
        }

        // preparar objeto
        let contact = {};
        fields_temp.forEach((_contato) => {
          contact[_contato.name] = _contato.value;
        });

        // verifica se o campo pertence ao grupo telefone

        let contact_request = { phones: [] };
        fields_temp.forEach((ffo) => {
          // valida campo null
          if (!ffo.value) {
            ffo.value = "";
          }

          // verifica se e campo telefone (baseado na configuração)
          if (_jsonConfig.phones.some((s) => s.value === ffo.name)) {
            // e um campo telefone Monta ARRAY
            if (
              !contact_request.phones.some(
                (s) => s.value.toString().trim() === ffo.value.toString().trim()
              )
            ) {
              // add telefone
              contact_request.phones.push({
                value: ffo.value.toString().trim(),
              });
            }
          } else {
            // campo simples
            contact_request[ffo.name] = ffo.value;
          }
        });

        // incluir na lista para INSERT
        this.payloadContacts.push({ json: JSON.stringify(contact_request) });

        // listando objeto personalizado
        listformated.push(contact);
      }

      // montar lista INSERT
      this.list = listformated;
      console.log(this.payloadContacts);
    },

    getHeaderRow(sheet) {
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]);
      let C = undefined;
      const R = range.s.r;
      for (C = range.s.c; C <= range.e.c; ++C) {
        const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })];
        let hdr = `UNKNOWN_${C}`;
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        headers.push(hdr);
      }
      return headers;
    },
  },
};
</script>
<style lang="scss">
@import "@core/scss/vue/libs/vue-wizard.scss";
@import "@core/scss/vue/libs/vue-select.scss";
</style>
<style scoped>
.area-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>