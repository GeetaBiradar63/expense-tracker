import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { useMemo } from 'react';
import { format, isSameMonth, parseISO, isSameDay } from 'date-fns';
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const { expenses } = useExpenses();

    const stats = useMemo(() => {
        const now = new Date();
        const thisMonthExpenses = expenses.filter(e => isSameMonth(parseISO(e.date), now));
        const todayExpenses = expenses.filter(e => isSameDay(parseISO(e.date), now));

        const totalMonth = thisMonthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const totalToday = todayExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

        // Calculate top category
        const categoryTotals = {};
        if (thisMonthExpenses.length > 0) {
            thisMonthExpenses.forEach(e => {
                categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
            });
            const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
            return { totalMonth, totalToday, count: thisMonthExpenses.length, topCategory: topCat ? `${topCat[0]} ($${topCat[1]})` : 'N/A' };
        }

        return { totalMonth, totalToday, count: 0, topCategory: 'N/A' };
    }, [expenses]);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back, {user?.name}</p>
                </div>
                <button className="btn btn-primary" onClick={() => window.location.href = '/add'}>
                    + Add New
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <SummaryCard
                    title="Total This Month"
                    value={`$${stats.totalMonth.toLocaleString()}`}
                    icon={<DollarSign size={24} color="#10b981" />}
                    trend="+12% vs last month"
                />
                <SummaryCard
                    title="Spent Today"
                    value={`$${stats.totalToday.toLocaleString()}`}
                    icon={<TrendingDown size={24} color="#f59e0b" />}
                    trend="Daily tracker"
                />
                <SummaryCard
                    title="Transactions"
                    value={stats.count}
                    icon={<CreditCard size={24} color="#8b5cf6" />}
                    trend="This month"
                />
                <SummaryCard
                    title="Top Category"
                    value={stats.topCategory}
                    icon={<TrendingUp size={24} color="#ef4444" />}
                    trend="Highest spending"
                />
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Transactions</h2>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Date</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Category</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Note</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.slice(0, 5).map(expense => (
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
                                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{expense.note}</td>
                                <td style={{ padding: '1rem', textAlign: 'right', fontWeight: '600' }}>
                                    ${Number(expense.amount).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, icon, trend }) => (
    <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {icon}
            </div>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{title}</span>
        </div>
        <div style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            {value}
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            {trend}
        </div>
    </div>
);

export default Dashboard;
