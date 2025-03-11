const router = require('express').Router();
const {addIncome, getIncomes, updateIncome, deleteIncome,getIncomesSum} = require('../controllers/income');

router.post('/add-income/:userId',addIncome);
router.get('/get-incomes/:userId',getIncomes);
router.get('/get-incomes-sum/:userId',getIncomesSum);
router.patch('/update-income/:userId/:incomeId',updateIncome);
router.delete('/delete-income/:userId/:incomeId', deleteIncome);

module.exports = router;


//if I want userId to be only ID, I need to chnage it at req.params at income in controllers (and wherever it is used)

//