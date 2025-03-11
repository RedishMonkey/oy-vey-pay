import api from "./api";

export const createIncome = async (payload) => {
  try {
    const { userId } = payload;
    const { data } = await api.post(`/add-income/${userId}`,payload);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "An error occured while creating the income. Please try again.";

    throw new Error(message);
  }
  
};



export const getIncomes = async (userId) => {
    try {
      const { data } = await api.get(`/get-incomes/${userId}`);
  
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occured while fetching the incomes. Please try again.";
  
      throw new Error(message);
    }
};

export const getIncomesSum = async (userId) => {
  try {
    const { data } = await api.get(`/get-incomes-sum/${userId}`);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "An error occured while fetching the incomes. Please try again.";

    throw new Error(message);
  }
};

export const deleteIncome = async (userId,incomeId) => {
  try {
    
    const { data } = await api.delete(`/delete-income/${userId}/${incomeId}`);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "An error occured while deleting the income. Please try again.";

    throw new Error(message);
  }
  
};

export const updateIncome = async (userId,incomeId,payload) => {
  try {
    const { data } = await api.patch(`/update-income/${userId}/${incomeId}`,payload);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "An error occured while updating the income. Please try again.";

    throw new Error(message);
  }
  
};