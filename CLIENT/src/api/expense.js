import api from "./api";

export const createExpense = async (payload) => {
  try {
    const { userId } = payload;
    const { data } = await api.post(`/add-expense/${userId}`,payload);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "An error occured while creating the expense. Please try again.";

    throw new Error(message);
  }
  
};



export const getExpenses = async (userId) => {
    try {
      const { data } = await api.get(`/get-expenses/${userId}`);
  
      return data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "An error occured while fetching the expenses. Please try again.";
  
      throw new Error(message);
    }
};

export const getExpensesSum = async (userId) => {
  try {
    const { data } = await api.get(`/get-expenses-sum/${userId}`);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "An error occured while fetching the expenses. Please try again.";

    throw new Error(message);
  }
};

export const deleteExpense = async (userId,expenseId) => {
  try {
    
    const { data } = await api.delete(`/delete-expense/${userId}/${expenseId}`);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "An error occured while deleting the expense. Please try again.";

    throw new Error(message);
  }
  
};

export const updateExpense = async (userId,expenseId,payload) => {
  try {
    const { data } = await api.patch(`/update-expense/${userId}/${expenseId}`,payload);

    return data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      "An error occured while updating the expense. Please try again.";

    throw new Error(message);
  }
  
};