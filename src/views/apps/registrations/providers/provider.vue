<template>
  <viewcard--c
    :title="($route.params.id > 0 ? 'Atualizar' : 'Cadastrar') + ' Psicólogo'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="$route.params.id > 0 ? btdelete : null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="confirmDelete"
  >
    <hr class="p-0 m-0 mb-1" />
    <b-row>
      <b-col md="6">
        <b-form-group label="Nome *">
          <b-form-input
            v-model="record.fantasy_name"
            placeholder="Nome do Psicólogo"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Sobrenome *">
          <b-form-input
            v-model="record.company_name"
            placeholder="Nome do Psicólogo"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Apelido">
          <b-form-input
            v-model="record.nickname"
            placeholder="Nome do Psicólogo"
            autocomplete="off"
          />
          <small class="text-muted"
            >* Sera usado para exibir em nosso site, se for preenchido</small
          >
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Email *">
          <b-form-input
            v-model="record.email"
            placeholder="E-mail"
            autocomplete="off"
            type="email"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Biografia">
          <b-form-textarea
            rows="7"
            v-model="record.biography"
            placeholder="Biografia"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Formação Acadêmico">
          <b-form-textarea
            rows="7"
            v-model="record.academic_training"
            placeholder="Formação Acadêmico"
          />
        </b-form-group>
      </b-col>
      <b-col cols="6" md="4">
        <b-form-group label="Telefone">
          <b-form-input
            v-mask="$utils.masked.phone"
            v-model="record.phone"
            placeholder="Telefone"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col cols="6" md="2">
        <b-form-group label="CRP">
          <b-form-input
            v-model="record.crp"
            placeholder="CRP"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>

      <b-col cols="6" md="3">
        <b-form-group label="CPF">
          <b-form-input
            v-mask="$utils.masked.cpf"
            v-model="record.cpf"
            placeholder="cpf..."
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col cols="6" md="3">
        <b-form-group label="CNPJ">
          <b-form-input
            v-mask="$utils.masked.cnpj"
            v-model="record.cnpj"
            placeholder="CNPJ"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>

      <b-col md="3">
        <b-form-group label="Situação">
          <v-select
            v-model="optionsSituarionUfSelected"
            :options="optionsSituarion"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-card-text class="mb-0"> Ativo </b-card-text>
        <b-form-checkbox
          class="custom-control-success mt-1"
          name="check-button"
          switch
          v-model="record.active"
        >
          <span class="switch-icon-left">
            <feather-icon icon="CheckIcon" />
          </span>
          <span class="switch-icon-right">
            <feather-icon icon="XIcon" />
          </span>
        </b-form-checkbox>
      </b-col>
    </b-row>

    <h1 class="py-1">Endereço</h1>
    <hr class="p-0 m-0 mb-1" />
    <b-row v-for="(item, index) in record.address" :key="index">
      <b-col md="3">
        <b-form-group label="CEP *">
          <!-- -->
          <b-input-group>
            <b-form-input
              v-mask="$utils.masked.cep"
              v-model="item.zipcode"
              placeholder="cep..."
              autocomplete="off"
              maxlength="10"
            />
            <b-input-group-append>
              <b-button
                variant="gradient-info"
                @click="getAddress(item.zipcode, item)"
              >
                <feather-icon
                  class="cursor-pointer"
                  color="var(--white)"
                  icon="SearchIcon"
                />
              </b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>
      <b-col md="3">
        <b-form-group label="UF">
          <v-select
            v-model="item.optionsUfSelected"
            :options="optionsUf"
            autocomplete="off"
          />
        </b-form-group>
      </b-col>

      <b-col md="6"></b-col>
      <b-col md="6">
        <b-form-group label="Cidade *">
          <b-form-input
            v-model="item.city"
            placeholder="cidade..."
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Bairro *">
          <b-form-input
            v-model="item.neighborhood"
            placeholder="bairro..."
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="6">
        <b-form-group label="Logradouro *">
          <b-form-input
            v-model="item.address"
            placeholder="Logradouro..."
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="4">
        <b-form-group label="Complemento *">
          <b-form-input
            v-model="item.complement"
            placeholder="Complemento..."
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
      <b-col md="2">
        <b-form-group label="Número">
          <b-form-input
            v-model="item.number"
            placeholder="Número..."
            autocomplete="off"
          />
        </b-form-group>
      </b-col>
    </b-row>
  </viewcard--c>
</template>
<script>
import _providerService from "@/services/providers-service";
import _locationsService from "@/services/locations-service";

export default {
  data() {
    return {
      btedit: { permission: `provider.edit` },
      btcreate: { permission: `provider.create` },
      btdelete: { permission: `provider.delete` },
      loading: false,
      optionsUf: [],
      optionsUfSelected: null,
      optionsSituarion: [],
      optionsSituarionUfSelected: null,
      record: {
        id: 0,
        nickname: "",
        fantasy_name: "",
        company_name: "",
        email: "",
        phone: "",
        cnpj: "",
        cpf: "",
        crp: "",
        description: "",
        curriculum: "",
        biography: "",
        academic_training: "",
        active: true,
        situation: 0,
      },
      address: {
        optionsUfSelected: null,
        address: "",
        city: "",
        complement: "",
        neighborhood: "",
        number: "",
        uf: "",
        zipcode: "",
      },
    };
  },
  created() {
    this.optionsUf = this.$utils.getStates();
    this.getSituations();
  },
  mounted() {
    this.getRecord();
  },
  methods: {
    getSituations() {
      _providerService
        .showSituations()
        .then((res) => {
          this.optionsSituarion = res;
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    getRecord() {
      if (this.$route.params.id > 0) {
        this.loading = true;
        _providerService
          .find(this.$route.params.id)
          .then((res) => {
            this.record = res.content.provider[0];

            // situação provider
            this.optionsSituarionUfSelected = {
              label: this.record.ds_situation,
              value: this.record.situation,
            };

            // caso não tenha endereço.
            if (!this.record.address || this.record.address.length <= 0) {
              this.address.optionsUfSelected = this.optionsUf.filter(
                (f) => f.value === this.address.uf
              )[0];

              this.record.address = [];
              this.record.address.push({ ...this.address });
            } else {
              this.record.address.forEach((_address) => {
                _address.optionsUfSelected = this.optionsUf.filter(
                  (f) => f.value === _address.uf
                )[0];
              });
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.loading = false));
      }
    },
    save() {
      const payload = { data: { ...this.record } };

      //promisse
      const _createOrUpdate =
        this.record.id <= 0
          ? _providerService.create(payload)
          : _providerService.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Tema salvo com sucesso.");
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
    getAddress(zipcode, item) {
      this.loading = true;
      _locationsService
        .findZipCode(zipcode)
        .then((res) => {
          if (res.content && res.content.address) {
            item.neighborhood = res.content.address.neighborhood;
            item.address = res.content.address.address;
            item.city = res.content.address.city;
            item.uf = res.content.address.uf;
            if (item.uf) item.uf = item.uf.toUpperCase();

            //
            if (this.optionsUf.some((s) => s.value === item.uf)) {
              item.optionsUfSelected = this.optionsUf.filter(
                (f) => f.value === item.uf
              )[0];
            }
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    excluir() {
      this.loading = true;
      _providerService
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