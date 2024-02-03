import axios from 'axios';

const baseUrl = 'https://localhost:7094';

export default {
    postData(endpoint, formData, options) {
        return axios.post(`${baseUrl}${endpoint}`, formData, options);
    },

    convertToXML(file, separator, secret) {
        const formData = new FormData();
        formData.append('document', file, file.name);
        formData.append('separator', separator);
        formData.append('key', secret);

        return this.postData('/document/xml', formData, { responseType: 'text' });
    },

    convertToJSON(file, separator, secret) {
        const formData = new FormData();
        formData.append('document', file, file.name);
        formData.append('separator', separator);
        formData.append('key', secret);

        return this.postData('/document/json', formData, { responseType: 'json' });
    },

    convertXMLToCSV(file, separator, secret) {
        const formData = new FormData();
        formData.append('document', file, file.name);
        formData.append('separator', separator);
        formData.append('key', secret);

        return this.postData('/document/CsvXml', formData, { responseType: 'text' });
    },

    convertJSONToCSV(file, separator, secret) {
        const formData = new FormData();
        formData.append('document', file, file.name);
        formData.append('separator', separator);
        formData.append('key', secret);

        return this.postData('/document/CsvJson', formData, { responseType: 'text' });
    }
};
