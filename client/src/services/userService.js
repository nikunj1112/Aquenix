import API from "../utils/db.js";

export const getAllUsers = () => {
  return API.get("/profile/get-all-users");
};

export const getUser = (email) => {
  return API.get(`/profile/get-user/${email}`);
};

export const addUser = (data) => {
  return API.post("/profile/add-user", data);
};

export const updateUser = (data) => {
  return API.put("/profile/update-user", data);
};

export const deleteUser = (email) => {
  return API.delete(`/profile/delete-user/${email}`);
};

export const updateRole = (data) => {
  return API.put("/profile/update-role", data);
};