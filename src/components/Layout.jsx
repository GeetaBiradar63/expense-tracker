import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, PlusCircle, List, PieChart, LogOut, Wallet } from 'lucide-react';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
        { label: 'Add Expense', path: '/add', icon: <PlusCircle size={20} /> },
        { label: 'Expenses', path: '/expenses', icon: <List size={20} /> },
        { label: 'Analytics', path: '/analytics', icon: <PieChart size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                backgroundColor: 'var(--bg-card)',
                borderRight: '1px solid var(--border)',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', paddingLeft: '0.5rem' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        backgroundColor: 'var(--primary)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Wallet size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Smart Spend</h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '0.5rem',
                                    color: isActive ? 'white' : 'var(--text-muted)',
                                    backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                                    fontWeight: isActive ? '600' : '500',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <div style={{ padding: '0 0.5rem 1rem', color: 'var(--text-main)', fontSize: '0.875rem' }}>
                        <p>Signed in as</p>
                        <p style={{ fontWeight: '600' }}>{user?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            color: 'var(--danger)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
