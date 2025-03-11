const router = require('express').Router();
const {addExpense, getExpenses, updateExpense, deleteExpense, getExpensesSum} = require('../controllers/expense');

router.post('/add-expense/:userId',addExpense);
router.get('/get-expenses/:userId',getExpenses);
router.get('/get-expenses-sum/:userId',getExpensesSum);
router.patch('/update-expense/:userId/:expenseId',updateExpense);
router.delete('/delete-expense/:userId/:expenseId', deleteExpense);


module.exports = router;


