<template>
  <div class="flex justify-center pt-12">
    <div class="w-full max-w-md p-16 mx-auto my-6 bg-gray-50 rounded-lg shadow-md">
      <div class="mt-8">
        <h1 class="text-3xl font-bold text-center text-neutral-900">File Decryption</h1>
        <p class="mt-2 text-sm text-center text-neutral-600">
          Upload a file to decrypt.
        </p>
      </div>
      <div class="mt-6">
        <form @submit.prevent="handleGenerateClick">
          <div class="input-group flex justify-center mb-3">
            <input
                type="file"
                id="formFileMultiple"
                class="mt-1 p-2 border rounded-md"
                accept=".json, .xml"
                multiple
                @change="handleFileInputChange"
            />
          </div>
          <div class="form-group mt-3 flex justify-center items-center">
            <label for="delimiter" class="block text-sm font-medium text-neutral-600 mr-2"
            >Select Character Delimiter:</label
            >
            <select
                id="delimiter"
                class="form-select p-2 border rounded-md bg-gray-100"
                aria-label="Select Character Delimiter"
                v-model="decryptForm.delimiter"
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
              Decrypt
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
      decryptForm: {
        file: null,
        delimiter: ',',
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
        console.log('No file selected');
        this.showAlert('error', 'Oops...', 'No file selected');
        return;
      }

      if (this.selectedFile.type !== 'text/xml' && this.selectedFile.type !== 'application/json') {
        this.showAlert('error', 'Error', 'Please select a JSON or XML file for decryption.');
        return;
      }

      this.showSecretKeyInput()
          .then((enteredSecretKey) => {
            const { delimiter } = this.decryptForm;
            const id = this.generateShortId();

            if (this.selectedFile.type === 'text/xml') {
              this.convertXMLToCSV(id, this.selectedFile, enteredSecretKey, delimiter);
            } else if (this.selectedFile.type === 'application/json') {
              this.convertJsonToCSV(id, this.selectedFile, enteredSecretKey, delimiter);
            }
          })
          .catch((error) => {
            console.error('Error during SweetAlert2 operation:', error);
          });
    },
    convertXMLToCSV(id, file, secretKey, delimiter) {
      CriptoService.convertXMLToCSV(file, delimiter, secretKey)
          .then((response) => {
            const convertedFileName = `${id}_decrypted.csv`;
            this.saveFileLocally(response, convertedFileName);
            this.showAlert('success', 'File Decryption Success', `Decrypted File Name: ${convertedFileName}`);
          })
          .catch((error) => {
            this.showAlert('error', 'File Decryption Error', error.message || 'An error occurred while decrypting the file.');
          });
    },
    convertJsonToCSV(id, file, secretKey, delimiter) {
      CriptoService.convertJSONToCSV(file, delimiter, secretKey)
          .then((response) => {
            const convertedFileName = `${id}_decrypted.csv`;
            this.saveFileLocally(response, convertedFileName);
            this.showAlert('success', 'File Decryption Success', `Decrypted File Name: ${convertedFileName}`);
          })
          .catch((error) => {
            this.showAlert('error', 'File Decryption Error', error.message || 'An error occurred while decrypting the file.');
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
    saveFileLocally(content, fileName) {
      const blob = new Blob([content], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    },
    generateShortId() {
      return Math.random().toString(36).substring(2, 7);
    },
  },
};
</script>
