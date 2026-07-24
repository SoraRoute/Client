// Shared Module
// Authors: Nishtha & Pinki

import api from "./api";

export const login = (data) => {
    return api.post("/sellers/login", data);
};