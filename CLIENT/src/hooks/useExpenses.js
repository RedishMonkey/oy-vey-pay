import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getExpenses, createExpense } from '../api/expense.js'



export const useExpenses = (user) => {
    return useQuery({
        queryKey: ['expenses'],
        queryFn: ()=> getExpenses(user.id)
      });
}



export const useCreateExpense = (resetFields) => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ['create-expense'],
        mutationFn: (payload)  => createExpense(payload),
        onSuccess: () => {
          toast.success(data.message);
          resetFields();
          queryClient.invalidateQueries({queryKey:['expenses']})
        },
        onError: (error) => {toast.error(error.message)},
      })
} 



export const useDeleteExpense = (resetFields) => {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationKey: ['delete-expense'],
        mutationFn: (userId, expenseId)  => deleteExpense(userId, expenseId),
        onSuccess: () => {
          toast.success(data.message);
          resetFields();
          queryClient.invalidateQueries({queryKey:['expenses']})
        },
        onError: (error) => {toast.error(error.message)},
      })
} 

