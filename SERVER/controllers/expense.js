const { z } = require("zod");
const User = require("../models/users");
const { userIdValidation } = require("../lib/validation/user");
const { expenseSchema, expenseIdValidation } = require("../lib/validation/expense");
const Expense = require("../models/expense");

const addExpense = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const { title, description, amount, tag, currency } = expenseSchema.parse(req.body);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const BASE_CURRENCY = 'USD';

        let exchangedAmount;
        if (currency !== BASE_CURRENCY) {
            const response = await fetch(
                `https://v6.exchangerate-api.com/v6/${process.env.CURR_SECRET}/pair/${currency}/${BASE_CURRENCY}/${amount}`
            );
            if (!response.ok) {
                return res.status(400).json({ message: 'Failed to exchange amount' });
            }
            const data = await response.json();
            exchangedAmount = data.conversion_result;
        }

        const expense = new Expense({
            title,
            description,
            amount,
            tag,
            currency,
            exchangedAmount,
        });

        await expense.save();
        userExists.expenses.push(expense);

        await userExists.save();

        return res.status(201).json({ message: 'Expense added successfully', expense });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400);
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getExpenses = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expenses = await Expense.find({ _id: { $in: userExists.expenses } });

        return res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getExpensesSum = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expenses = await Expense.find({ _id: { $in: userExists.expenses } });

        const sum = expenses.reduce((expenseSum, expense) => {
            return expenseSum + (expense.exchangedAmount === 0 ? expense.amount : expense.exchangedAmount);
          }, 0);

        return res.status(200).json(sum);
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const updateExpense = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const expenseId = expenseIdValidation.parse(req.params.expenseId);

        const expenseExists = await Expense.findOne({ _id: expenseId });

        if (!expenseExists) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const { title, description, amount, tag, currency } = expenseSchema.parse(req.body);
        const BASE_CURRENCY = 'USD';

        let exchangedAmount = expenseExists.exchangedAmount;

        if (expenseExists.amount !== amount || expenseExists.currency !== currency) {
            if (currency !== BASE_CURRENCY) {
                const response = await fetch(
                    `https://v6.exchangerate-api.com/v6/${process.env.CURR_SECRET}/pair/${currency}/${BASE_CURRENCY}/${amount}`
                );
                if (!response.ok) {
                    return res.status(400).json({ message: 'Failed to exchange amount' });
                }
                const data = await response.json();
                exchangedAmount = data.conversion_result;
            } else {
                exchangedAmount = amount;
            }
        }

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!userExists.expenses.includes(expenseId)) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, {
            title,
            description,
            amount,
            tag,
            currency,
            exchangedAmount,
        }, { new: true });

        return res.status(200).json({ message: 'Expense updated successfully', updatedExpense });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteExpense = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const expenseId = expenseIdValidation.parse(req.params.expenseId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const expenseExists = await Expense.findById(expenseId);
        if (!expenseExists) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const expenseIndex = userExists.expenses.findIndex(expense => expense.toString() === expenseId);
        if (expenseIndex === -1) {
            return res.status(404).json({ message: 'Expense not found in users list' });
        }

        userExists.expenses.splice(expenseIndex, 1);
        await expenseExists.deleteOne();
        await userExists.save();

        return res.status(204).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getExpensesSum,
};
