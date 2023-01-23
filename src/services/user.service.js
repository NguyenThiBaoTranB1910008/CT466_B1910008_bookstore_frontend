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
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async checkAcc(accname) {
        return (await this.api.get(`/check/${accname}`)).data;
    }
    async loginCheck(data) {
        return (await this.api.post("/check",data)).data;
    }
}
export default new UserService();