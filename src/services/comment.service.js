import createApiClient from "./api.service";
class CommentService {
    constructor(baseUrl = "http://localhost:3001/api/comment") {
        this.api = createApiClient(baseUrl);
    }
    async get(idbook) {
        return (await this.api.get(`/${idbook}`)).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async upload(file) {
        return (await this.api.post("/upload", file)).data;
    }
}

export default new CommentService();