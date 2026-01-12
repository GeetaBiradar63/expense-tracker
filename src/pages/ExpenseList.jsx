import { useExpenses } from '../context/ExpenseContext';
import { format, parseISO } from 'date-fns';
import { Trash2, Edit, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExpenseList = () => {
    const { expenses, deleteExpense } = useExpenses();
    const navigate = useNavigate();

    const handleExport = () => {
        // CSV Export
        const headers = ['Date,Category,Amount,Payment,Note'];
        const rows = expenses.map(e =>
            `${e.date},${e.category},${e.amount},${e.payment},"${e.note || ''}"`
        );
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "expenses_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Expenses</h1>
                <button className="btn btn-secondary" onClick={handleExport}>
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Category</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Payment</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Note</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>Amount</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No expenses recorded yet.
                                </td>
                            </tr>
                        ) : expenses.map(expense => (
                            <tr key={expense.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem' }}>{format(parseISO(expense.date), 'MMM dd, yyyy')}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '2rem',
                                        fontSize: '0.875rem',
                                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                                        color: 'var(--primary)'
                                    }}>
                                        {expense.category}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{expense.payment}</td>
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{expense.note}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                                    ₹{Number(expense.amount).toLocaleString()}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'center' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                                        <button
                                            className="btn"
                                            style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
                                            onClick={() => navigate('/add', { state: { expense } })}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className="btn"
                                            style={{ padding: '0.5rem', color: 'var(--danger)' }}
                                            onClick={() => deleteExpense(expense.id)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExpenseList;
