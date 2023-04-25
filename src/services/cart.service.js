import createApiClient from "./api.service";
class CartService {
    constructor(baseUrl = "http://localhost:3001/api/cart") {
        this.api = createApiClient(baseUrl);
    }
    async getAll(username) {
        return (await this.api.get(`/get/${username}`)).data;
    }
    async get(id,user) {
        return (await this.api.post(`/${id}`, user)).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll(user) {
        console.log(user)
        return (await this.api.delete(`/order/${user}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
}
export default new CartService();