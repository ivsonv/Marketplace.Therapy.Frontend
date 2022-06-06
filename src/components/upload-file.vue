<template>
  <div>
    <div v-if="!multiple">
      <div class="p-0 mt-25">
        <!-- DOWNLOAD COMPLETO -->
        <b-avatar v-if="item.completed" variant="success" size="25">
          <feather-icon icon="CheckIcon" size="16" />
        </b-avatar>

        <!-- PROCESSAR UPLOAD -->
        <button--c
          v-if="item.url && !item.completed && !item.error && !item.inprogress"
          @clicked="onClickUpload(item)"
          icon="UploadCloudIcon"
          variant="primary"
          :title="`Confirmar (${item.name})`"
          size="sm"
          class="mb-25"
          :permission="permission"
        />
        <p v-if="item.inprogress">{{ item.percentage }}</p>

        <!-- REPROCESSAR UPLOAD ERRO -->
        <button--c
          v-if="item.error"
          @clicked="onClickUpload(item)"
          icon="RefreshCwIcon"
          variant="primary"
          title="Tentar Novamente"
          size="sm"
          key="btn-re-up"
          :permission="permission"
        />
        <b-avatar
          v-if="item.error"
          variant="danger"
          size="25"
          v-b-tooltip.hover
          class="ml-1 pull-up cursor-pointer"
          :title="item.error"
        >
          <feather-icon icon="XIcon" size="16" />
        </b-avatar>
      </div>

      <div class="p-0" @click="$refs.fileInput.click()">
        <div class="upload-file">
          <img
            class="rounded-shadow cursor-pointer thumbnail-upload-file"
            :style="stylecss"
            v-if="item.url || preview"
            :src="item.url || preview"
          />
          <feather-icon
            class="thumbnail-upload-file"
            icon="UploadCloudIcon"
            size="50"
            v-else
          />
          <input
            style="display: none"
            ref="fileInput"
            type="file"
            @change="onFileChangeSingle"
            :accept="accept"
          />
        </div>
      </div>
    </div>
    <!-- Lista de Upload -->
    <div class="row" v-else>
      <div class="col-12">
        <table>
          <thead>
            <th>Arquivo</th>
            <th>Status</th>
            <th>Ação</th>
          </thead>
          <tbody>
            <tr v-for="(it, i) in list" :key="i">
              <td>{{ it.filename }}</td>
              <td>{{ it.percentage }}</td>
              <td>
                <div v-if="!it.inprogress">
                  <!-- <icon--c icon="XIcon" /> -->
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { VBTooltip } from "bootstrap-vue";
import AWS from "aws-sdk";
export default {
  props: {
    accept: {
      type: String,
      required: false,
    },
    fix_name: {
      type: String,
      required: false,
    },
    preview: {
      type: String,
      required: false,
    },
    code_key: {
      type: String,
      required: false,
    },
    multiple: {
      type: Boolean,
      required: false,
    },
    permission: {
      type: String,
      required: true,
    },
    origin: {
      type: String,
      required: true,
    },
    stylecss: {
      type: String,
      required: true,
    },
  },
  directives: {
    "b-tooltip": VBTooltip,
  },
  created() {
    this.iniciarconfigs();

    if (this.preview) {
      this.item.url = this.preview;
    }

    if (this.code_key) {
      this.item.key = this.code_key;
    }
  },
  data() {
    return {
      list: [],
      item: {
        id: "",
        name: "",
        file: null,
        key: "",
        url: "",
        error: "",
        percentage: 0,
        inprogress: false,
        completed: false,
      },
    };
  },
  methods: {
    onClickUpload(_item) {
      if (!_item.completed) {
        _item.inprogress = true;
        _item.error = "";

        this.postAwsUploadFile(_item)
          .on("httpUploadProgress", (evt) => {
            _item.percentage = Math.round((evt.loaded / evt.total) * 100) + "%";
          })
          .send((err) => {
            _item.inprogress = false;
            if (err) {
              _item.error = "erro: " + err;
              _item.percentage = 0;
              return false;
            }
            _item.completed = true;
            _item.error = "";

            this.$emit("result", _item);
            return true;
          });
      }
    },
    onFileChangeSingle(e) {
      e.preventDefault();

      this.getFileItem(e.target.files[0]);
    },
    getFileItem(file) {
      if (this.fix_name) {
        this.item.id = this.fix_name;
        this.item.name = this.fix_name;
      } else {
        this.item.id = this.$utils.getGuidId();
        this.item.name = file.name;
      }

      this.item.key = `${this.origin}/${
        this.item.id
      }.${this.$utils.getExtension(file.name)}`;

      this.item.url = URL.createObjectURL(file);

      this.item.file = file;
    },

    iniciarconfigs() {
      AWS.config.update({
        accessKeyId: process.env.VUE_APP_AWS_ACESSKEY_ID,
        secretAccessKey: process.env.VUE_APP_AWS_ACESSKEY_SECRET,
      });
    },
    postAwsUploadFile(_post) {
      const mimetype = _post.file.type;

      const params = {
        Bucket: process.env.VUE_APP_AWS_BUCKET,
        ContentType: mimetype,
        Body: _post.file,
        Key: _post.key,
      };
      return new AWS.S3.ManagedUpload({
        params: params,
      });
    },
  },
};
</script>

<style scoped>
table {
  width: 100%;
}

.thumbnail-upload-file {
  border: 1px solid #999;
  cursor: pointer;
}
.thumbnail-upload-file:hover {
  opacity: 0.5;
}
</style>