import { useState, useMemo } from 'react';
import { useAppSelector } from '../../store/hooks';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}



export default function Sales() {
  const { user } = useAppSelector((state) => state.auth);
  const canCreateSale = user?.role === 'Admin' || user?.role === 'Manager' || user?.role === 'Employee';
  
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
      alert('Cannot sell more than available stock!');
      return;
    }

    const existingItem = cart.find(item => item.productId === product._id);
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stockQuantity) {
        alert('Cannot sell more than available stock!');
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
      alert('Please select a customer');
      return;
    }
    if (cart.length === 0) {
      alert('Cart is empty');
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
      alert(`Sale completed successfully! Total: ৳${grandTotal.toFixed(2)}`);
      setCart([]);
      setCustomer('');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error creating sale');
    }
  };

  if (!canCreateSale) {
    return <div>You don't have permission to create sales.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2 text-blue-600" />
          Create New Sale
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Customer</label>
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

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Add Products</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-slate-600 mb-1">Product</label>
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
                <label className="block text-xs font-medium text-slate-600 mb-1">Quantity</label>
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
                className="btn-primary flex items-center h-[42px]"
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </button>
            </div>
          </div>

          {cart.length > 0 && (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 text-sm font-semibold text-slate-600">Product</th>
                    <th className="py-3 px-4 text-sm font-semibold text-slate-600">Price</th>
                    <th className="py-3 px-4 text-sm font-semibold text-slate-600">Quantity</th>
                    <th className="py-3 px-4 text-sm font-semibold text-slate-600">Total</th>
                    <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cart.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                      <td className="py-3 px-4 text-slate-600">৳{item.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-600">{item.quantity}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">৳{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <button 
                          type="button"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-600">Grand Total</span>
                <span className="text-2xl font-bold text-blue-700">৳{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button type="submit" className="btn-primary px-8" disabled={cart.length === 0}>
              Complete Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
