import { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem('finance_expenses');
        if (stored) {
            setExpenses(JSON.parse(stored));
        } else {
            // Seed some data for "WOW" effect if empty
            const initialData = [
                { id: 1, date: '2026-01-12', amount: 250, category: 'Food', payment: 'UPI', note: 'Lunch' },
                { id: 2, date: '2026-01-12', amount: 1200, category: 'Shopping', payment: 'Card', note: 'New Shirt' },
                { id: 3, date: '2026-01-11', amount: 500, category: 'Travel', payment: 'Cash', note: 'Taxi' },
                { id: 4, date: '2026-01-10', amount: 3500, category: 'Food', payment: 'Card', note: 'Dinner Party' },
                { id: 5, date: '2026-01-05', amount: 1500, category: 'Bills', payment: 'UPI', note: 'Electricity' },
            ];
            setExpenses(initialData);
            localStorage.setItem('finance_expenses', JSON.stringify(initialData));
        }
    }, []);

    const addExpense = (expense) => {
        const newExpense = { ...expense, id: Date.now() };
        const updated = [newExpense, ...expenses];
        setExpenses(updated);
        localStorage.setItem('finance_expenses', JSON.stringify(updated));
    };

    const deleteExpense = (id) => {
        const updated = expenses.filter(e => e.id !== id);
        setExpenses(updated);
        localStorage.setItem('finance_expenses', JSON.stringify(updated));
    };

    const updateExpense = (id, updatedData) => {
        const updated = expenses.map(e => (e.id === id ? { ...e, ...updatedData } : e));
        setExpenses(updated);
        localStorage.setItem('finance_expenses', JSON.stringify(updated));
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, updateExpense }}>
            {children}
        </ExpenseContext.Provider>
    );
};
