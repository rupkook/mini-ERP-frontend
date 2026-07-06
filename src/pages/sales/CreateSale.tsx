import { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Plus, Trash2, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/api';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function CreateSale() {
  const { user } = useAppSelector((state) => state.auth);
  const canCreateSale = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Employee';
  const navigate = useNavigate();

  const [customer, setCustomer] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { data: customers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const res = await api.get('/customers');
      return res.data.data;
    }
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data.data;
    }
  });

  const handleAddProduct = () => {
    if (!selectedProduct || !products) return;
    const product = products.find((p: any) => p._id === selectedProduct);
    if (!product) return;

    if (quantity > product.stockQuantity) {
      toast.error('Cannot sell more than available stock!');
      return;
    }

    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stockQuantity) {
        toast.error('Cannot sell more than available stock!');
        return;
      }
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        price: product.sellingPrice,
        quantity,
        stock: product.stockQuantity
      }]);
    }
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const grandTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      toast.error('Please select a customer');
      return;
    }
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    try {
      await api.post('/sales', {
        customer,
        items: cart.map(item => ({
          product: item.productId,
          quantity: item.quantity
        }))
      });
      toast.success(`Sale completed successfully! Total: ৳${grandTotal.toFixed(2)}`);
      setCart([]);
      setCustomer('');
      navigate('/sales');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error creating sale');
    }
  };

  if (!canCreateSale) {
    return <div>You don't have permission to create sales.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/sales')}
        className="flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Sales
      </button>

      <div className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <ShoppingCart className="w-5 h-5 mr-2 text-purple-600" />
          Create New Sale
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Customer</label>
            <select
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="input-field"
              required
            >
              <option value="">Select a customer</option>
              {customers?.map((c: any) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-[#F8F9FA] p-5 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-700 mb-4">Add Products</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Product</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select product...</option>
                  {products?.map((p: any) => (
                    <option key={p._id} value={p._id}>{p.name} (৳{p.sellingPrice} - Stock: {p.stockQuantity})</option>
                  ))}
                </select>
              </div>
              <div className="w-32">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="input-field"
                />
              </div>
              <button
                type="button"
                onClick={handleAddProduct}
                className="btn-outline flex items-center h-[42px]"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#F8F9FA] border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Product</th>
                    <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="py-3.5 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {cart.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5 font-semibold text-slate-800 text-sm">{item.name}</td>
                      <td className="py-3.5 px-5 text-slate-500 text-sm">৳{item.price.toFixed(2)}</td>
                      <td className="py-3.5 px-5 text-slate-500 text-sm">{item.quantity}</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-800 text-sm">৳{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-[#F8F9FA] px-5 py-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-slate-600 text-sm">Grand Total</span>
                <span className="text-2xl font-bold text-purple-600">৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button type="submit" className="btn-primary px-8" disabled={cart.length === 0}>
              Complete Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
