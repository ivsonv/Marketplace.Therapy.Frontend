<template>
  <viewcard--c
    :title="($route.params.id > 0 ? 'Atualizar' : 'Cadastrar') + ' Psicólogo'"
    :btsave="btcreate"
    :btdelete="null"
    :btback="{}"
    :busy="loading"
    @clicked-save="save"
    @clicked-delete="onDelete"
  >
    <div v-if="!loading">
      <b-alert variant="warning" :show="!record.active">
        <h4 class="alert-heading">cadastro está inativo</h4>
      </b-alert>

      <b-alert variant="warning" :show="!record.completed">
        <h4 class="alert-heading">cadastro está Incompleto</h4>
      </b-alert>
    </div>

    <hr />
    <b-tabs pills id="tabs-provider" content-class="mt-2">
      <b-tab title="Dados pessoais">
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
            <b-form-group label="Nome Social">
              <b-form-input
                v-model="record.nickname"
                placeholder="Como gostaria de ser chamado ?"
                autocomplete="off"
              />
              <small class="text-muted"
                >* Sera usado para exibir em nosso site, se for
                preenchido</small
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
            <b-form-group label="CPF *">
              <b-form-input
                v-mask="$utils.masked.cpf"
                v-model="record.cpf"
                placeholder="cpf..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col cols="6" md="3">
            <b-form-group label="CNPJ (opcional)">
              <b-form-input
                v-mask="$utils.masked.cnpj"
                v-model="record.cnpj"
                placeholder="CNPJ"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col cols="12" md="6">
            <b-form-group label="Cadastro está completo ?">
              <b-form-checkbox
                class="custom-control-success"
                v-model="record.completed"
                name="check-button"
                switch
              >
                <span class="switch-icon-left">
                  <feather-icon icon="CheckIcon" />
                </span>
                <span class="switch-icon-right">
                  <feather-icon icon="XIcon" />
                </span>
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>

        <h1 class="py-1">Endereço</h1>
        <hr class="p-0 m-0 mb-1" />
        <b-row>
          <b-col md="3">
            <b-form-group label="CEP *">
              <!-- -->
              <b-input-group>
                <b-form-input
                  v-mask="$utils.masked.cep"
                  v-model="address.zipcode"
                  placeholder="cep..."
                  autocomplete="off"
                  maxlength="10"
                />
                <b-input-group-append>
                  <b-button
                    variant="gradient-info"
                    @click="getAddress(address.zipcode, address)"
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
            <b-form-group label="UF *">
              <v-select
                v-model="optionsUfSelected"
                :options="optionsUf"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>

          <b-col md="6"></b-col>
          <b-col md="6">
            <b-form-group label="Cidade *">
              <b-form-input
                v-model="address.city"
                placeholder="cidade..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Bairro *">
              <b-form-input
                v-model="address.neighborhood"
                placeholder="bairro..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Logradouro *">
              <b-form-input
                v-model="address.address"
                placeholder="Logradouro..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Complemento *">
              <b-form-input
                v-model="address.complement"
                placeholder="Complemento..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Número">
              <b-form-input
                v-model="address.number"
                placeholder="Número..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-tab>
      <b-tab title="Dados Profissionais">
        <div class="row">
          <b-col cols="12" class="text-center">
            <b-form-group class="d-flex justify-content-center">
              <div style="width: 200px">
                <img
                  class="img-fluid rounded-shadow cursor-pointer"
                  id="thumbnail-perfil"
                  v-if="urlImage"
                  :src="urlImage"
                />
                <!-- <b-button
                  class="d-flex align-items-center my-1 ml-2"
                  @click="$refs.fileInput.click()"
                  variant="info"
                >
                  <feather-icon icon="ImageIcon" size="22" />
                  <strong class="ml-25">{{
                    !urlImage
                      ? "Selecione uma Imagem Perfil"
                      : "Escolher outra Imagem"
                  }}</strong>
                </b-button> -->
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
          <b-col md="6">
            <b-form-group label="RESUMO SOBRE VOCÊ">
              <b-form-textarea
                rows="7"
                v-model="record.description"
                placeholder="Em poucas palavras, fale sobre da sua experiência. Aqui, você pode colocar a linha que atua e como pode ajuda o seus pacientes..."
              />
              <small class="text-muted"
                >*Em poucas palavras, fale sobre da sua experiência. Aqui, você
                pode colocar a linha que atua e como pode ajuda o seus
                pacientes.</small
              >
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="APRESENTAÇÃO PESSOAL (BIOGRÁFIA)">
              <b-form-textarea
                rows="7"
                v-model="record.biography"
                placeholder="Nesta fase, o paciente quer saber um pouco mais sobre você além do profissional. Explique o objetivo da sua linha de atuação, perfil nas redes e sua trajetória de forma mais detalhada. Crie um momento acolhedor com as palavras..."
              />
              <small class="text-muted"
                >*Nesta fase, o paciente quer saber um pouco mais sobre você
                além do profissional. Explique o objetivo da sua linha de
                atuação, perfil nas redes e sua trajetória de forma mais
                detalhada. Crie um momento acolhedor com as palavras</small
              >
            </b-form-group>
          </b-col>
        </div>
        <hr class="p-0 m-0 mb-1" />
        <div class="row">
          <div class="col-md-6">
            <b-form-group label="ESPECIALIDADES">
              <small>Até 3 Opções</small>
              <v-select
                v-model="optionsTopicsSelectd"
                :options="optionsTopics"
                multiple
              />
            </b-form-group>
          </div>
          <div class="col-md-6">
            <b-form-group label="EXPERIÊNCIAS">
              <small>Até 8 Opções</small>
              <v-select
                v-model="optionsTopicsExperienceSelectd"
                :options="optionsTopicsExperience"
                multiple
              />
            </b-form-group>
          </div>
          <div class="col-md-6">
            <h1 class="py-1">Idiomas</h1>
            <b-row>
              <div
                v-for="(lan, index) in optionsLanguages"
                :key="`lan-${index}`"
                class="col-4 col-md-3 mb-1"
              >
                <b-form-checkbox
                  class="custom-control-success"
                  v-model="lan.selected"
                  name="check-button"
                  switch
                >
                  <span class="switch-icon-left">
                    <feather-icon icon="CheckIcon" />
                  </span>
                  <span class="switch-icon-right">
                    <feather-icon icon="XIcon" />
                  </span>
                </b-form-checkbox>
                <span class="pt-1">{{ lan.name }}</span>
              </div>
            </b-row>
          </div>
        </div>
      </b-tab>
      <b-tab title="Dados Pagamentos">
        <h1 class="py-1">Dados Bancários</h1>
        <p>
          * Conta para receber o valor dos seus atendimentos online aqui na
          plataforma.
        </p>
        <hr class="p-0 m-0 mb-1" />
        <b-row
          v-for="(bcc, index) in record.bankAccounts"
          :key="`acc-${index}`"
        >
          <b-col md="6">
            <b-form-group label="Banco">
              <v-select
                v-model="optionsBankSelected"
                :loading="isLoadingBank"
                :options="bcc.options"
                searchable
                @search="
                  (_rs) => {
                    fetchBanks(bcc, _rs);
                  }
                "
              >
                <template v-slot:no-options="{ search, searching }">
                  <template v-if="searching">
                    Pesquisando ... <em>{{ search }}</em
                    >.
                  </template>
                  <em style="opacity: 0.5" v-else>nome do banco...</em>
                </template>
              </v-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Tipo de Conta">
              <v-select
                v-model="optionsTypeAccountSelected"
                :options="optionsAccountTypes"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Agencia *">
              <b-form-input
                v-model="bcc.agency_number"
                placeholder="agencia..."
                autocomplete="off"
                type="number"
              />
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Dig.Agencia *">
              <b-form-input
                v-model="bcc.agency_digit"
                placeholder="digito agencia..."
                autocomplete="off"
                maxlength="2"
              />
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="N° da Conta">
              <b-form-input
                v-model="bcc.account_number"
                placeholder="número da conta..."
                autocomplete="off"
                type="number"
              />
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Dig. Conta *">
              <b-form-input
                v-model="bcc.account_digit"
                placeholder="Digito da conta..."
                autocomplete="off"
                maxlength="2"
              />
            </b-form-group>
          </b-col>
          <b-col
            md="6"
            v-if="
              bcc.optionsBankSelected && bcc.optionsBankSelected.value === '104'
            "
          >
            <b-form-group label="Operação">
              <b-form-input
                v-model="bcc.operation"
                placeholder="Número..."
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <h1 class="py-1">Faturamento</h1>
        <hr class="p-0 m-0 mb-1" />
        <b-row>
          <b-col cols="6" md="3">
            <b-form-group label="Valor da Sessão (50 minutos)">
              <b-form-input
                v-mask="$utils.masked.money"
                v-model="record.price"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
        </b-row>

        <b-row
          v-for="(item, index) in record.receipts"
          :key="`receipts-${index}`"
        >
          <b-col md="12">
            <b-form-group label="RAZÃO SOCIAL (PARA EMPRESAS)">
              <b-form-input v-model="item.fantasy_name" autocomplete="off" />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="CPF">
              <b-form-input
                v-mask="$utils.masked.cpf"
                v-model="item.cpf"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="CNPJ (OPCIONAL)">
              <b-form-input
                v-mask="$utils.masked.cnpj"
                v-model="item.cnpj"
                autocomplete="off"
              />
            </b-form-group>
          </b-col>
          <b-col md="12">
            <b-form-group label="ASSINATURA">
              <img
                @click="$refs.fileInputSig[0].click()"
                :src="urlsignatureImage"
                v-if="urlsignatureImage"
                id="thumbnail-signature"
                class="img-fluid rounded-shadow cursor-pointer"
              />
              <input
                style="display: none"
                ref="fileInputSig"
                type="file"
                accept="image/*"
                @change="onFileChangeSignature"
              />
              <b-button
                @click="$refs.fileInputSig[0].click()"
                variant="info"
                class="d-flex align-items-center mb-25"
              >
                <feather-icon icon="PaperclipIcon" size="22" />
                <strong class="ml-25"
                  >{{
                    urlsignatureImage ? "ALTERAR" : "ENVIAR"
                  }}
                  ASSINATURA</strong
                >
              </b-button>
              <h5>
                Adicione uma imagem de sua assinatura para poder emitir recibos.
                Tire uma foto da sua assinatura em um papel branco.
              </h5>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="ENDEREÇO">
              <b-form-textarea
                rows="5"
                v-model="item.address"
                placeholder="Logradouro, CEP, Cidade..."
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-tab>
    </b-tabs>
    <hr />
    <b-row>
      <button--c
        permission="provider.merchant.create"
        title="Criar Estabelecimento (Nexxera)"
        variant="info"
        @clicked="createMerchant"
      />
    </b-row>
  </viewcard--c>
</template>

<script>
import _providerService from "@/services/providers-service";
import _merchantService from "@/services/merchant-service";
import _locationsService from "@/services/locations-service";
import _bankService from "@/services/bank-service";
import _languagesService from "@/services/languages-service";
import _topicsService from "@/services/topics-service";

export default {
  data() {
    return {
      btedit: { permission: `provider.edit` },
      btcreate: { permission: `provider.create` },
      btdelete: { permission: `provider.delete` },
      loading: false,
      isLoadingBank: false,
      optionsUf: [],
      optionsUfSelected: null,
      optionsSituarion: [],
      optionsSituarionUfSelected: null,
      optionsBanks: [],
      optionsBankSelected: null,
      optionsAccountTypes: [],
      optionsTypeAccountSelected: null,
      optionsLanguages: [],
      optionsTopics: [],
      optionsTopicsSelectd: null,
      optionsTopicsExperience: [],
      optionsTopicsExperienceSelectd: null,
      fileImageSelected: null,
      fileSignatureSelected: null,
      urlImage: require("@/assets/images/pages/sem-foto.png"),
      urlsignatureImage: null,
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
        completed: false,
      },
      address: {
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
    this.getLoadInit();
  },
  methods: {
    async getLoadInit() {
      this.loading = true;
      this.optionsUf = this.$utils.getStates();

      // promisse
      await this.fetchAccountTypes();
      await this.fetchLanguages();
      await this.fetchTopics();
      this.getRecord();
    },
    async fetchLanguages() {
      await _languagesService.show().then((res) => {
        this.optionsLanguages = res.content.map((m) => {
          return {
            selected: false,
            ...m,
          };
        });
      });
    },
    async fetchTopics() {
      await _topicsService.showAll().then((res) => {
        if (res.content.some((f) => !f.experience)) {
          this.optionsTopics = res.content
            .filter((f) => !f.experience)
            .map((m) => {
              return {
                label: m.name,
                value: m.id,
                ...m,
              };
            });
        }

        if (res.content.some((f) => f.experience)) {
          this.optionsTopicsExperience = res.content
            .filter((f) => f.experience)
            .map((m) => {
              return {
                label: m.name,
                value: m.id,
                ...m,
              };
            });
        }
      });
    },
    async fetchAccountTypes() {
      await _bankService.showAccountTypes().then((res) => {
        this.optionsAccountTypes = res;
      });
    },
    save() {
      if (this.optionsUfSelected) {
        this.address.uf = this.optionsUfSelected.value;
      }

      this.record.address = [];
      this.record.address.push(this.address);

      let _topics = [];
      if (this.optionsTopicsSelectd && this.optionsTopicsSelectd.length > 0) {
        _topics.push(...this.optionsTopicsSelectd);
      }

      if (
        this.optionsTopicsExperienceSelectd &&
        this.optionsTopicsExperienceSelectd.length > 0
      ) {
        _topics.push(...this.optionsTopicsExperienceSelectd);
      }

      this.record.topics = _topics.map((m) => {
        return {
          experience: m.experience,
          topic_id: m.id,
        };
      });

      // Experience 8 opções
      if (this.record.topics) {
        if (this.record.topics.filter((f) => !f.experience).length > 3) {
          this.$utils.toastError(
            "Notificação",
            "São pemitidos 3 especilidade."
          );
          return;
        }

        if (this.record.topics.filter((f) => f.experience).length > 8) {
          this.$utils.toastError(
            "Notificação",
            "São Pemitidos 8 experiências."
          );
          return;
        }
      }

      if (this.optionsLanguages) {
        this.record.languages = this.optionsLanguages
          .filter((f) => f.selected)
          .map((m) => {
            return {
              language_id: m.id,
            };
          });
      }

      this.record.bankAccounts.forEach((_bank) => {
        if (this.optionsTypeAccountSelected)
          _bank.account_bank_type = this.optionsTypeAccountSelected.value;

        if (this.optionsBankSelected)
          _bank.bank_code = this.optionsBankSelected.value;
      });
      if (this.record.price) {
        this.record.price = this.record.price.toString().replace(",", ".");
      }

      // let payload = new FormData();
      // if (this.fileImageSelected) {
      //   payload.append("profile", this.fileImageSelected);
      // }
      // if (this.fileSignatureSelected) {
      //   payload.append("sig", this.fileSignatureSelected);
      // }
      // payload.append("data", JSON.stringify(this.record));
      //this.$utils.toast("Notificação", "Função de atualizar não disponivel.");

      const payload = {
        data: this.record,
      };

      const _createOrUpdate = _providerService.update(payload);
      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getRecord() {
      this.loading = true;
      _providerService
        .find(this.$route.params.id)
        .then((res) => {
          this.record = res.content.provider[0];
          this.urlsignatureImage = this.record.signatureurl;
          this.urlImage = this.record.imageurl;

          if (this.record.price > 0) {
            this.record.price = this.record.price
              .toFixed(2)
              .toString()
              .replace(".", ",");
          }

          // situação provider
          this.optionsSituarionUfSelected = {
            label: this.record.ds_situation,
            value: this.record.situation,
          };

          // caso não tenha endereço.
          if (!this.record.address || this.record.address.length <= 0) {
            this.record.address = [];
            this.address.optionsUfSelected = null;
          } else {
            this.address = this.record.address[0];
            this.optionsUfSelected = this.optionsUf.filter(
              (f) => f.value === this.address.uf
            )[0];
          }

          // dados da conta.
          if (
            !this.record.bankAccounts ||
            this.record.bankAccounts.length <= 0
          ) {
            this.record.bankAccounts = [];
            this.record.bankAccounts.push({
              fetching: false,
              options: [],
              provider_id: this.record.id,
              agency_number: "",
              agency_digit: "",
              account_digit: "",
              account_number: "",
              bank_code: "",
              account_bank_type: 0,
            });
          } else {
            this.record.bankAccounts.forEach((_bank) => {
              // banco
              this.optionsBankSelected = {
                label: `${_bank.bank_code} - ${_bank.ds_bank}`,
                value: _bank.bank_code,
              };

              this.optionsTypeAccountSelected = this.optionsAccountTypes.filter(
                (f) => f.value === _bank.account_bank_type.toString()
              )[0];
            });
          }

          // assinatura
          if (!this.record.receipts || this.record.receipts.length <= 0) {
            this.record.receipts = [];

            let _address = "";
            if (this.record.address && this.record.address.length > 0) {
              if (this.record.address[0].address) {
                _address = this.record.address[0].address;

                if (this.record.address[0].number)
                  _address += ", " + this.record.address[0].number;

                if (this.record.address[0].complement)
                  _address += ", " + this.record.address[0].complement;

                if (this.record.address[0].zipcode)
                  _address += ", cep: " + this.record.address[0].zipcode;

                if (this.record.address[0].neighborhood)
                  _address += ", " + this.record.address[0].neighborhood;

                if (this.record.address[0].city)
                  _address += ", " + this.record.address[0].city;

                if (this.record.address[0].uf)
                  _address += " - " + this.record.address[0].uf;
              }
            }

            this.record.receipts.push({
              fantasy_name: `${this.record.fantasy_name} ${this.record.company_name}`,
              signature: "",
              address: _address,
              cnpj: this.record.cnpj,
              cpf: this.record.cpf,
            });
          } else {
          }

          if (this.record.languages && this.record.languages.length > 0) {
            // idiomas
            this.record.languages.forEach((_lan) => {
              if (
                this.optionsLanguages.some((s) => s.id === _lan.language_id)
              ) {
                this.optionsLanguages.filter(
                  (f) => f.id === _lan.language_id
                )[0].selected = true;
              }
            });
          }

          // Topics
          if (this.record.topics && this.record.topics.length > 0) {
            this.optionsTopicsExperienceSelectd = [];
            this.optionsTopicsSelectd = [];

            this.record.topics.forEach((_topi) => {
              if (this.optionsTopics.some((s) => s.id === _topi.topic_id)) {
                //selecionado
                const ll = this.optionsTopics.filter(
                  (f) => f.id === _topi.topic_id
                )[0];
                this.optionsTopicsSelectd.push(ll);
              }

              // experiencia
              if (
                this.optionsTopicsExperience.some(
                  (s) => s.id === _topi.topic_id
                )
              ) {
                //selecionado
                const ll = this.optionsTopicsExperience.filter(
                  (f) => f.id === _topi.topic_id
                )[0];
                this.optionsTopicsExperienceSelectd.push(ll);
              }
            });
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    fetchBanks(item, _search) {
      if (_search && _search.length >= 3) {
        setTimeout(() => {
          if (!this.isLoadingBank) {
            this.isLoadingBank = true;
            _bankService
              .show(1, _search)
              .then((res) => {
                item.options = this.$utils.populardrp(
                  res.content.banks,
                  "name_format",
                  "code"
                );
              })
              .catch((error) => this.$utils.toastError("Notificação", error))
              .finally(() => (this.isLoadingBank = false));
          }
        }, 500);
      }
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
    onFileChange(e) {
      e.preventDefault();
      this.fileImageSelected = e.target.files[0];
      this.urlImage = URL.createObjectURL(e.target.files[0]);
    },
    onFileChangeSignature(e) {
      e.preventDefault();
      this.fileSignatureSelected = e.target.files[0];
      this.urlsignatureImage = URL.createObjectURL(e.target.files[0]);
    },
    onDelete() {
      this.$utils.toast("Notificação", "Função não disponivel.");
      // this.loading = true;
      // _providerService
      //   .delete(this.record.id)
      //   .then(() => {
      //     this.$utils.toast("Notificação", "Excluido com sucesso.");
      //     this.$router.go(-1);
      //   })
      //   .catch((error) => this.$utils.toastError("Notificação", error))
      //   .finally(() => (this.loading = false));
    },
    createMerchant() {
      const payload = { data: { ...this.record } };
      this.loading = true;
      _merchantService
        .create(payload)
        .then(() => {
          this.$utils.toast(
            "Notificação",
            "Estabelecimento criado com  sucesso."
          );
          this.getRecord();
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
  },
};
</script>
<style>
#tabs-provider__BV_tab_controls_ li {
  font-size: 20px;
}
#thumbnail-signature {
  width: 300px;
  height: 200px;
  margin-bottom: 5px;
}
#thumbnail-perfil {
  border: 1px solid #999;
  width: 300px;
  height: 200px;
  border-radius: 50%;
}
#thumbnail-perfil:hover {
  opacity: 0.5;
}
</style>