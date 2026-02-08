import { useState, useEffect } from 'react';
import { getProducts, getAllUsers, deleteProduct, deleteUser } from '../services/db';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsData, usersData] = await Promise.all([
        getProducts(),
        getAllUsers()
      ]);
      setProducts(productsData);
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductDelete = async (id) => {
    if (confirm("Delete this product?")) {
      try {
        await deleteProduct(id);
        loadData();
      } catch (e) {
        console.error(e);
        alert("Failed to delete product");
      }
    }
  };

  const handleUserDelete = async (id) => {
    if (confirm("Delete this user?")) {
      try {
        await deleteUser(id);
        loadData();
      } catch (e) {
        console.error(e);
        alert("Failed to delete user");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Users Section */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Users ({users.length})</h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {users.map(user => (
              <div key={user.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                <div className="overflow-hidden">
                  <p className="font-semibold truncate" title={user.email}>{user.email}</p>
                  <p className="text-sm text-gray-500">Role: <span className="uppercase font-bold text-primary">{user.role}</span></p>
                </div>
                <button onClick={() => handleUserDelete(user.id)} className="btn btn-xs btn-error text-white ml-2">Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">All Products ({products.length})</h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {products.map(product => (
              <div key={product.id} className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                <div className="flex items-center gap-2 overflow-hidden">
                   <img src={product.image || 'https://placehold.co/50'} alt={product.name} className="w-10 h-10 object-cover rounded flex-shrink-0" />
                   <div className="overflow-hidden">
                     <p className="font-semibold truncate" title={product.name}>{product.name}</p>
                     <p className="text-xs text-gray-500 truncate">By: {product.sellerEmail || 'Unknown'}</p>
                   </div>
                </div>
                <button onClick={() => handleProductDelete(product.id)} className="btn btn-xs btn-error text-white ml-2">Delete</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
