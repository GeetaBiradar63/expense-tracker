import { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AddExpense = () => {
    const { addExpense, updateExpense } = useExpenses();
    const navigate = useNavigate();
    const location = useLocation();
    const editMode = location.state?.expense;

    const [formData, setFormData] = useState({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'Food',
        payment: 'UPI',
        note: ''
    });

    useEffect(() => {
        if (editMode) {
            setFormData(editMode);
        }
    }, [editMode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            updateExpense(editMode.id, formData);
        } else {
            addExpense(formData);
        }
        navigate('/expenses');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="page-header">
                <h1 className="page-title">{editMode ? 'Edit Expense' : 'Add New Expense'}</h1>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Amount (₹)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                            placement="0.00"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                            <label className="input-label">Date</label>
                            <input
                                type="date"
                                className="form-input"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Category</label>
                            <select
                                className="form-select"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="Food">Food</option>
                                <option value="Travel">Travel</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Bills">Bills</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Health">Health</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Payment Method</label>
                        <select
                            className="form-select"
                            value={formData.payment}
                            onChange={(e) => setFormData({ ...formData, payment: e.target.value })}
                        >
                            <option value="UPI">UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="Net Banking">Net Banking</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Note (Optional)</label>
                        <textarea
                            className="form-input"
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            rows="3"
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                            {editMode ? 'Update Expense' : 'Add Expense'}
                        </button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpense;
