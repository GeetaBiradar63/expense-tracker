const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get All Expenses
router.get('/', async (req, res) => {
    try {
        // In production, filter by user: { user: req.user.id }
        const expenses = await Expense.find().sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Add Expense
router.post('/', async (req, res) => {
    try {
        const newExpense = new Expense(req.body);
        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Expense
router.put('/:id', async (req, res) => {
    try {
        let expense = await Expense.findById(req.params.id);
        if (!expense) return res.status(404).json({ msg: 'Expense not found' });

        expense = await Expense.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(expense);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Delete Expense
router.delete('/:id', async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Expense removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
