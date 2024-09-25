import { BASE_URL } from "../../utils/url";
import axios from "axios";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
const token = getUserFromStorage();
export const addTransactionAPI = async ({
  type,
  amount,
  description,
  category,
  date,
}) => {
  const response = await axios.post(
    `${BASE_URL}/transactions/create`,
    {
      type,
      amount,
      description,
      category,
      date,
    },
    {
      headers: {
        Authentication: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const listTransactionsAPI = async ({startDate, endDate, type, category}) => {
    const response = await axios.get(`${BASE_URL}/transactions/lists`, {
        params:{startDate, endDate, type, category},
        headers: {
        Authentication: `Bearer ${token}`,
      },
    });
    return response.data;
  };
