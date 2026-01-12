import { createContext, useContext, useState, useEffect } from 'react';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

export const ExpenseProvider = ({ children }) => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch expenses from Backend
    const fetchExpenses = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/expenses');
            const data = await res.json();
            setExpenses(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching expenses:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const addExpense = async (expense) => {
        try {
            const res = await fetch('http://localhost:5000/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense)
            });
            const newExpense = await res.json();
            setExpenses([newExpense, ...expenses]);
        } catch (error) {
            console.error('Error adding expense:', error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/expenses/${id}`, { method: 'DELETE' });
            setExpenses(expenses.filter(e => e._id !== id));
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const updateExpense = async (id, updatedData) => {
        try {
            const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });
            const updated = await res.json();
            setExpenses(expenses.map(e => (e._id === id ? updated : e)));
        } catch (error) {
            console.error('Error updating expense:', error);
        }
    };

    return (
        <ExpenseContext.Provider value={{ expenses, addExpense, deleteExpense, updateExpense, loading }}>
            {children}
        </ExpenseContext.Provider>
    );
};
