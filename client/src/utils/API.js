require('dotenv').config();

const axios = require("axios");

let key = "?api-key=80e7beca1e1746e79660ac53e7486d3a";

const api = {
    getArticles: (query, beginDate, endDate) =>
    {
        const URL = "https://api.nytimes.com/svc/search/v2/articlesearch.json";

        return query = axios.get(`${URL}${key}&q=${query}&sort=newest&begin_date=${beginDate}&end_date=${endDate}`);

    },

    saveArticle: (articleData) => {
        return axios.post("/api/articles", articleData)
    },

    getSavedArticles: () => {
        return axios.get("/api/articles");
    },

    deleteArticle: (id) => {
        return axios.delete(`/api/articles/${id}`);
    } 
};

export default api;