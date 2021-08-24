<template>
  <viewcard--c title="MINHA CONTA" :busy="loading">
    <b-tabs id="tabs-provider" content-class="mt-2" justified>
      <b-tab title="DADOS PESSOAIS">
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
        </b-row>

        <h1 class="py-1">Endereço</h1>
        <hr class="p-0 m-0 mb-1" />
        <b-row
          v-for="(item, index) in record.address"
          :key="`address-${index}`"
        >
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

        <h1 class="py-1">Dados Bancários</h1>
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
      </b-tab>
      <b-tab title="PROFISSIONAL">
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
        <hr class="p-0 m-0 mb-1" />
        <div class="row">
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
      </b-tab>
      <b-tab title="PAGAMENTOS"> </b-tab>
    </b-tabs>
    <hr />
    <b-row>
      <b-col cols="12">
        <b-button size="lg" @click="save" variant="gradient-info">
          Salvar Alterações
        </b-button>
      </b-col>
    </b-row>
  </viewcard--c>
</template>

<script>
import _account from "@/services/account-provider-service";
export default {
  data() {
    return {
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
    this.getLoadInit();
  },
  methods: {
    async getLoadInit() {
      this.loading = true;
      this.optionsUf = this.$utils.getStates();

      // promiss
      await this.fetchLanguages();
      await this.fetchTopics();

      // buscar principal
      this.getRecord();
    },
    async fetchLanguages() {
      await _account.fetchLanguages().then((res) => {
        this.optionsLanguages = res.content.languages.map((m) => {
          return {
            selected: false,
            ...m,
          };
        });
      });
    },
    async fetchTopics() {
      await _account.fetchTopics().then((res) => {
        if (res.content.topics.some((f) => !f.experience)) {
          this.optionsTopics = res.content.topics
            .filter((f) => !f.experience)
            .map((m) => {
              return {
                label: m.name,
                value: m.id,
                ...m,
              };
            });
        }

        if (res.content.topics.some((f) => f.experience)) {
          this.optionsTopicsExperience = res.content.topics
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
    save() {
      if (this.optionsTopics) {
        let _topics = [];
        if (this.optionsTopicsSelectd) {
          _topics.push(this.optionsTopicsSelectd);
        }

        if (this.optionsTopicsExperienceSelectd) {
          _topics.push(this.optionsTopicsExperienceSelectd);
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

      const payload = { data: { ...this.record } };

      const _createOrUpdate =
        this.record.id <= 0
          ? _account.create(payload)
          : _account.update(payload);

      this.loading = true;
      _createOrUpdate
        .then(() => {
          this.$utils.toast("Notificação", "Salvo com sucesso.");
          this.$router.push({ name: "account-appointments" });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getRecord() {
      this.loading = true;
      _account
        .find()
        .then((res) => {
          this.record = res.content.provider.provider[0];

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

          // idiomas
          if (this.record.languages && this.record.languages.length > 0) {
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
                if (!ll.experience) {
                  this.optionsTopicsSelectd.push(ll);
                } else {
                  this.optionsTopicsExperienceSelectd.push(ll);
                }
              }
            });
          }
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.loading = false));
    },
    getSituations() {
      _providerService
        .showSituations()
        .then((res) => {
          this.optionsSituarion = res;
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    getAccountTypes() {
      _bankService
        .showAccountTypes()
        .then((res) => {
          this.optionsAccountTypes = res;
        })
        .catch((error) => this.$utils.toastError("Notificação", error));
    },
    fetchBanks(item, _search) {
      if (_search && _search.length >= 3) {
        setTimeout(() => {
          if (!this.isLoadingBank) {
            this.isLoadingBank = true;
            _account
              .fetchBanks(_search)
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
  },
};
</script>
<style>
#tabs-provider__BV_tab_controls_ li {
  font-size: 20px;
}
</style>