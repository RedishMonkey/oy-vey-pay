const { z } = require('zod');
const expense = require('../../models/expense');

const expenseIdValidation = z.string().regex(/^[0-9a-fA-F]{24}$/,{
    message: 'Invalid expense id',
});

const expenseSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    amount: z.number().positive(),
    tag: z.enum(['food',
        'rent',
        'transport',
        'entertainment',
        'clothing',
        'health',
        'education',
        'other',]),
    currency: z.enum(['ILS','USD','EUR']),
});

module.exports = {
expenseSchema,expenseIdValidation
};