import createApiClient from "./api.service";
class ProductService {
    constructor(baseUrl = "http://localhost:3001/api/product") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async getByFilter(filter) {
        return (await this.api.post("/filter", filter)).data;
    }
    async upload(file) {
        return (await this.api.post("/upload", file)).data;
    }
    async getLimit() {
        return (await this.api.get("/new")).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async order(id, data) {
        return (await this.api.post(`/${id}`, data)).data;
    }
    async isUnique(data) {
        return (await this.api.post("/new", data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new ProductService();