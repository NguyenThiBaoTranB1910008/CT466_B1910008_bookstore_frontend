import createApiClient from "./api.service";
class AddressService {
    constructor(baseUrl = "http://localhost:3001/api/address") {
        this.api = createApiClient(baseUrl);
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
}

export default new AddressService();