// src/pages/admin/AdminLoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { adminLogin } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await adminLogin(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brown px-4">
      <div className="bg-cream rounded-sm p-8 md:p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="font-display italic text-2xl text-maroon">House of Jaee</span>
          <h1 className="font-display text-xl text-brown mt-3">Admin Panel Login</h1>
          <p className="text-sm text-brown-light mt-1">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="admin@houseofjaee.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-brown mb-1.5">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="••••••••" />
          </div>
          <Button type="submit" size="lg" className="mt-2" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
