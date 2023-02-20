import createApiClient from "./api.service";
class UserService {
    constructor(baseUrl = "http://localhost:3001/api/user") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async get(accname) {
        return (await this.api.get(`/${accname}`)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async checkAcc(accname) {
        return (await this.api.get(`/check/${accname}`)).data;
    }
    async loginCheck(data) {
        return (await this.api.post(`/check/${data.accname}`,data)).data;
    }
    async getByFilter(filter) {
        return (await this.api.post("/filter", filter)).data;
    }
    async updateAdmin(data) {
        return (await this.api.post(`/${data.id}`, data)).data;
    }
    async update(data) {
        return (await this.api.put(`/${data.id}`, data)).data;
    }
}
export default new UserService();