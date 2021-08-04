<template>
  <viewcard--c
    :title="$route.params.id > 0 ? 'Atualizar Fila' : 'Cadastrar Fila'"
    :btsave="$route.params.id > 0 ? btedit : btcreate"
    :btdelete="null"
    :btback="{}"
    :busy="isloading"
    @clicked-save="save"
  >
    <b-row class="mb-3">
      <b-col cols="6">
        <b-form-input
          v-model="record.queueName"
          placeholder="Digite o nome da fila..."
          autocomplete="off"
        />
      </b-col>
    </b-row>
    <h5>Vincular Agentes</h5>
    <small class="text-muted"
      >Arraste os agentes para adiconar ou remover. <br />
      Após a configuração clicar em 'Salvar tudo'</small
    >
    <hr />

    <b-row>
      <b-col md="6">
        <b-input-group>
          <b-form-input
            v-model="search_include"
            placeholder="filtrar na fila..."
            autocomplete="off"
            @keyup="filter"
          />
        </b-input-group>
        <hr />
        <div class="text-center">
          <h5 class="font-weight-bold mb-2">Agente(s) Incluído(s) na Fila</h5>
          <feather-icon icon="ArrowDownCircleIcon" size="25" />
        </div>

        <!-- draggable -->
        <draggable
          :list="listinclude"
          tag="ul"
          group="people"
          class="list-group list-group-flush cursor-move"
        >
          <b-list-group-item
            v-for="(listItem, index) in listinclude"
            :key="index"
            tag="li"
          >
            <div class="d-flex">
              <div class="ml-25">
                <b-card-text class="mb-0 font-weight-bold">
                  {{ listItem.name }}
                </b-card-text>
                <small>{{ listItem.ramal }}</small>
              </div>
            </div>
          </b-list-group-item>
        </draggable>
        <p
          class="text-center pt-1"
          v-if="!listinclude || listinclude.length <= 0"
        >
          Nenhum agente na fila
        </p>
      </b-col>

      <b-col md="6" class="mt-sm-2 mt-md-0">
        <b-input-group>
          <b-form-input
            placeholder="pesquise por Nome..."
            autocomplete="off"
            v-model="search_available"
          />
          <b-input-group-append>
            <b-button variant="gradient-info" @click="getAgentAvailable">
              Pesquisar
            </b-button>
          </b-input-group-append>
        </b-input-group>
        <b-overlay
          :show="isloadingAvail"
          spinner-variant="primary"
          spinner-type="grow"
        >
          <hr />
          <div class="text-center">
            <h5 class="font-weight-bold mb-2">Agentes Disponíveis</h5>
            <feather-icon icon="ArrowDownCircleIcon" size="25" />
          </div>

          <!-- draggable -->

          <draggable
            :list="listavailable"
            tag="ul"
            group="people"
            class="list-group list-group-flush cursor-move"
          >
            <b-list-group-item
              v-for="(listItem, index) in listavailable"
              :key="index"
              tag="li"
            >
              <div class="d-flex">
                <div class="ml-25">
                  <b-card-text class="mb-0 font-weight-bold">
                    {{ listItem.name }}
                  </b-card-text>
                  <small>{{ listItem.ramal }}</small>
                </div>
              </div>
            </b-list-group-item>
          </draggable>
          <p class="text-center pt-1" v-if="listavailable.length <= 0">
            Nenhum agente encontrado
          </p>
        </b-overlay>
      </b-col>
    </b-row>
  </viewcard--c>
</template>

<script>
import _pabxService from "@/services/pabx-service";
import _queuesService from "@/services/pabx/queues-service";
import { BListGroupItem } from "bootstrap-vue";
import draggable from "vuedraggable";

export default {
  components: {
    BListGroupItem,
    draggable,
  },
  data() {
    return {
      btedit: { permission: `permission.pabx.queue.edit` },
      btcreate: { permission: `permission.pabx.queue.create` },
      btdelete: { permission: `permission.pabx.queue.delete` },
      isloadingAvail: false,
      isloading: false,
      search_include: "",
      search_available: "",
      listavailable: [],
      listinclude: [],
      listAux: [],
      record: {
        name: "",
        queueName: "",
      },
    };
  },
  created() {
    this.getAgentAvailable();
  },
  mounted() {
    this.findqueueid();
  },
  methods: {
    findqueueid() {
      if (this.$route.params.id > 0) {
        this.isloading = true;
        _queuesService
          .find(this.$route.params.id)
          .then((res) => {
            if (res.content) {
              this.record.name = res.content.name;
              this.record.queueName = res.content.queueName;
              if (res.content.agents && res.content.agents.length > 0) {
                this.listinclude = res.content.agents.map((_map) => {
                  return {
                    name: _map.membername,
                    ramal: _map.interface,
                    id: _map.interface,
                  };
                });

                let result = this.listavailable.filter(
                  (o1) => !this.listinclude.some((o2) => o1.id === o2.id)
                );
                this.listavailable = result;
              }
            }
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
    getAgentAvailable() {
      this.isloadingAvail = true;
      _pabxService
        .show(1, this.search_available)
        .then((res) => {
          this.listavailable = res.content.map((_map) => {
            return {
              name: _map.callerid,
              ramal: _map.id,
              id: _map.id,
            };
          });
        })
        .catch((error) => this.$utils.toastError("Notificação", error))
        .finally(() => (this.isloadingAvail = false));
    },
    filter() {
      if (this.listAux == null || this.listAux.length == 0)
        this.listAux = this.listinclude;

      if (this.search_include) {
        this.listinclude = this.listAux.filter(
          (s) =>
            s.name.toLowerCase().includes(this.search_include.toLowerCase()) ||
            s.id.includes(this.search_include)
        );
      } else {
        this.listinclude = this.listAux;
      }
    },
    save() {
      if (this.search_include) {
        this.$utils.toastError(
          "Notificação",
          "Necessário limpar o filtro de Agente(s) Incluído(s) na Fila."
        );
      } else {
        if (this.listinclude) {
          this.record.agents = this.listinclude.map((m) => {
            return {
              membername: m.name,
              interface: m.id,
            };
          });
        }

        const payload = { data: { ...this.record } };
        const _createOrUpdate =
          this.record.name == ""
            ? _queuesService.create(payload)
            : _queuesService.update(payload);

        this.isloading = true;
        _createOrUpdate
          .then(() => {
            this.$utils.toast("Sucesso", "Atualizado com sucesso.");
            this.$router.go(-1);
          })
          .catch((error) => this.$utils.toastError("Notificação", error))
          .finally(() => (this.isloading = false));
      }
    },
  },
};
</script>