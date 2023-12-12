import createApiClient from "./api.service";
class OrderService {
    constructor(baseUrl = "http://localhost:3001/api/order") {
        this.api = createApiClient(baseUrl);
    }
    async getDetail(id) {
        return (await this.api.get(`/detail/${id}`)).data;
    }
    async get(accname) {
        return (await this.api.get(`/${accname}`)).data;
    }
    async getOrderById(id) {
        return (await this.api.get(`review/${id}`)).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async confirm(data) {
        return (await this.api.post("/confirm", data)).data;
    }
    async getByFilter(data) {
        return (await this.api.post("/filter", data)).data;
    }
    async reviewBook(data) {
        return (await this.api.post("/getreview", data)).data;
    }

    async statistic(data) {
        return (await this.api.post("/statistic", data)).data;
    }

    async detailstatistic(data) {
        return (await this.api.post("/detailstatistic", data)).data;
    }
    
    // async deleteAll() {
    //     return (await this.api.delete("/")).data;
    // }
    // async update(id, data) {
    //     return (await this.api.put(`/${id}`, data)).data;
    // }
    // async delete(id) {
    //     return (await this.api.delete(`/${id}`)).data;
    // }
}
export default new OrderService();