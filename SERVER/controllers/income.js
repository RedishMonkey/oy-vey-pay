const { z } = require("zod");
const User = require("../models/users");
const { userIdValidation } = require("../lib/validation/user");
const { IncomeSchema, incomeIdValidation } = require("../lib/validation/income");
const Income = require("../models/income");

const addIncome = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const { title, description, amount, tag, currency } = incomeSchema.parse(req.body);

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

        const income = new Income({
            title,
            description,
            amount,
            tag,
            currency,
            exchangedAmount,
        });

        await income.save();
        userExists.incomes.push(income);

        await userExists.save();

        return res.status(201).json({ message: 'Income added successfully', income });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400);
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const getIncomes = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const incomes = await Income.find({ _id: { $in: userExists.incomes } });

        return res.status(200).json(incomes);
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getIncomesSum = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const incomes = await Income.find({ _id: { $in: userExists.incomes } });

        const sum = incomes.reduce((incomeSum, income) => {
            return incomeSum + (income.exchangedAmount === 0 ? income.amount : income.exchangedAmount);
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


const updateIncome = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const incomeId = incomeIdValidation.parse(req.params.incomeId);

        const incomeExists = await Income.findOne({ _id: incomeId });

        if (!incomeExists) {
            return res.status(404).json({ message: 'Income not found' });
        }

        const { title, description, amount, tag, currency } = incomeSchema.parse(req.body);
        const BASE_CURRENCY = 'USD';

        let exchangedAmount = incomeExists.exchangedAmount;

        if (incomeExists.amount !== amount || incomeExists.currency !== currency) {
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

        if (!userExists.incomes.includes(incomeId)) {
            return res.status(404).json({ message: 'Income not found' });
        }

        const updatedIncome = await Income.findByIdAndUpdate(incomeId, {
            title,
            description,
            amount,
            tag,
            currency,
            exchangedAmount,
        }, { new: true });

        return res.status(200).json({ message: 'Income updated successfully', updatedIncome });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteIncome = async (req, res) => {
    try {
        if (req.user.id !== req.params.userId) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const userId = userIdValidation.parse(req.params.userId);
        const incomeId = incomeIdValidation.parse(req.params.incomeId);

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const incomeExists = await Income.findById(incomeId);
        if (!incomeExists) {
            return res.status(404).json({ message: 'Income not found' });
        }

        const incomeIndex = userExists.incomes.findIndex(income => income.toString() === incomeId);
        if (incomeIndex === -1) {
            return res.status(404).json({ message: 'Income not found in users list' });
        }

        userExists.incomes.splice(incomeIndex, 1);
        await incomeExists.deleteOne();
        await userExists.save();

        return res.status(204).json({ message: 'Income deleted successfully' });
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addIncome,
    getIncomes,
    updateIncome,
    deleteIncome,
    getIncomesSum,
};
