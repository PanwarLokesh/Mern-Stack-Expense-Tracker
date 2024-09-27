import { BASE_URL } from "../../utils/url";
import axios from "axios";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
const user = getUserFromStorage();
const token = user?.token;
console.log("in service",user);
export const addCategoryAPI = async ({ name, type }) => {
  const response = await axios.post(
    `${BASE_URL}/categories/create`,
    {
      name,
      user,
      type,
    },
    {
      headers: {
        Authentication: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
export const listCategoriesAPI = async () => {
  const response = await axios.get(`${BASE_URL}/categories/lists`, {
    headers: {
      Authentication: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCategoryAPI = async ({ name, type, id }) => {
  const response = await axios.put(
    `${BASE_URL}/categories/update/${id}`,
    {
      name,
      type,
    },
    {
      headers: {
        Authentication: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const deleteCategoryAPI = async ( id ) => {
  const response = await axios.delete(
    `${BASE_URL}/categories/delete/${id}`,
    {
      headers: {
        Authentication: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
