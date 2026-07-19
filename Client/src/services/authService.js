import api from "./api";

export const login = (data) => {
  return api.post("/customers/login", data);
};