import { useExpenses } from '../context/ExpenseContext';
import { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, parseISO, isSameDay } from 'date-fns';

const COLORS = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#6366f1'];

const Analytics = () => {
    const { expenses } = useExpenses();

    const categoryData = useMemo(() => {
        const totals = {};
        expenses.forEach(e => {
            totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
        });
        return Object.keys(totals).map(key => ({ name: key, value: totals[key] }));
    }, [expenses]);

    const dailyData = useMemo(() => {
        // Get all days in current month (or minimal range based on data if we wanted, but month is good)
        const now = new Date(); // Or derive from expenses range
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        const days = eachDayOfInterval({ start, end });

        return days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const dayTotal = expenses
                .filter(e => isSameDay(parseISO(e.date), day))
                .reduce((sum, e) => sum + Number(e.amount), 0);
            return {
                date: format(day, 'dd MMM'),
                amount: dayTotal
            };
        });
    }, [expenses]);

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Analytics</h1>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {/* Category Pie Chart */}
                <div className="card">
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Category Splitting</h2>
                    <div style={{ height: '300px' }}>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {categoryData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `₹${value}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                                No data to display
                            </div>
                        )}
                    </div>
                </div>

                {/* Daily Bar Chart */}
                <div className="card">
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Daily Spending (This Month)</h2>
                    <div style={{ height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dailyData.filter(d => d.amount > 0 || true).slice(0, 30)}> {/* Show all or filter empty? Show all for bar feel */}
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                                    itemStyle={{ color: 'var(--text-main)' }}
                                    formatter={(value) => [`₹${value}`, 'Spent']}
                                />
                                <Bar dataKey="amount" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
