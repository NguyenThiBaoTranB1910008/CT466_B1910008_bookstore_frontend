import createApiClient from "./api.service";
class AnnounceService {
    constructor(baseUrl = "http://localhost:3001/api/announment") {
        this.api = createApiClient(baseUrl);
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async seen(data) {
        return (await this.api.post(`/${data.accname}`, data)).data;
    }
    async newNotify(accname) {
        return (await this.api.get(`/new/${accname}`)).data;
    }
}

export default new AnnounceService();