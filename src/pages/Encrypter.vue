<template>
  <div class="flex justify-center pt-12">
    <div class="w-full max-w-md p-16 mx-auto my-6 bg-gray-50 rounded-lg shadow-md">
      <div class="mt-8">
        <h1 class="text-3xl font-bold text-center text-neutral-900">File Encryption</h1>
        <p class="mt-2 text-sm text-center text-neutral-600">
          Upload a file to encrypt.
        </p>
      </div>
      <div class="mt-6">
        <form @submit.prevent="handleGenerateClick">
          <div class="input-group flex justify-center mb-3">
            <input
                type="file"
                id="formFileMultiple"
                class="mt-1 p-2 border rounded-md"
                accept=".csv"
                multiple
                @change="handleFileInputChange"
            />
          </div>
          <div class="form-group mt-3 flex justify-center items-center">
            <label for="fileType" class="block text-sm font-medium text-neutral-600 mr-2">Select Output File Type:</label>
            <select
                id="fileType"
                class="form-select p-2 border rounded-md bg-gray-100"
                aria-label="Select File Type"
                v-model="encryptForm.fileType"
            >
              <option value="xml">XML</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div class="form-group mt-3 flex justify-center items-center">
            <label for="delimiter" class="block text-sm font-medium text-neutral-600 mr-2">Select Character Delimiter:</label>
            <select
                id="delimiter"
                class="form-select p-2 border rounded-md bg-gray-100"
                aria-label="Select Character Delimiter"
                v-model="encryptForm.delimiter"
            >
              <option value=",">Comma (,)</option>
              <option value=".">Period (.)</option>
              <option value="-">Dash (-)</option>
              <option value=";">Semicolon (;)</option>
              <option value="_">Underscore (_) </option>
            </select>
          </div>

          <div class="mt-8">
            <button
                type="submit"
                class="flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white transition duration-500 ease-in-out transform bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Encrypt
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import CriptoService from '../services/cripto.services.js';
export default {

  async mounted() {
    const { default: Swal } = await import('sweetalert2');
    this.Swal = Swal;
  },
  data() {
    return {
      encryptForm: {
        fileType: 'json',
        file: null,
        delimiter: ',',
        secretKey: '',
      },
      selectedFile: null,
    };
  },
  methods: {
    handleFileInputChange(event) {
      const inputElement = event.target;
      if (inputElement.files && inputElement.files.length > 0) {
        this.selectedFile = inputElement.files[0];
      }
    },
    handleGenerateClick() {
      if (!this.selectedFile) {
        this.showAlert('error', 'Oops...', 'No file selected');
        return;
      }

      if (this.selectedFile.type !== 'text/csv') {
        this.showAlert('error', 'Error', 'Please select a CSV file for encryption.');
        return;
      }

      this.showSecretKeyInput()
          .then((enteredSecretKey) => {
            this.encryptForm.secretKey = enteredSecretKey;
            const { fileType, delimiter, secretKey } = this.encryptForm;
            const id = this.generateShortId();

            if (fileType === 'xml') {
              this.convertFileToXML(id,this.selectedFile, secretKey, delimiter);
            } else if (fileType === 'json') {
              this.convertFileToJSON(id,this.selectedFile, secretKey, delimiter);
            }
          })
          .catch((error) => {
            console.error('Error during SweetAlert2 operation:', error);
          });
    },
    convertFileToXML(id,file, secretKey, delimiter) {
      CriptoService.convertToXML(file,delimiter,secretKey)
          .then((response) => {
            const { data } = response;
            console.log(data);
            const { xml } = data;
            const blob = new Blob([xml], { type: 'text/xml' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${id}_encripted.xml`);
            document.body.appendChild(link);
            link.click();
          })
          .catch((error) => {
            console.error(error);
            this.showAlert('error', 'Error', 'An error occurred while encrypting the file.');
          });
    },
    convertFileToJSON(id, file, secretKey, delimiter) {
      CriptoService.convertToJSON(file,delimiter,secretKey)
          .then((response) => {
            const { data } = response;
            console.log(data);
            const { json } = data;
            const blob = new Blob([json], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${id}_encripted.json`);
            document.body.appendChild(link);
            link.click();
          })
          .catch((error) => {
            console.log(error);
            this.showAlert('error', 'Error', 'An error occurred while encrypting the file.');
          });
    },
    showAlert(icon, title, text) {
      this.Swal.fire({
        icon,
        title,
        text,
      });
    },
    showSecretKeyInput() {
      return this.Swal.fire({
        title: 'Enter Secret Key',
        input: 'password',
        inputPlaceholder: 'Enter your secret key',
        showCancelButton: true,
        confirmButtonText: 'Accept',
        cancelButtonText: 'Cancel',
        allowOutsideClick: false,
        inputValidator: (value) => {
          if (!value) {
            return 'Please enter a secret key';
          }
          return null;
        },
      }).then((result) => {
        if (result.isConfirmed) {
          return result.value;
        }
        return Promise.reject('Operation canceled');
      });
    },
    generateShortId() {
      return Math.random().toString(36).substring(2, 7);
    },
  },
};
</script>
