
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { 
  ShieldCheck, 
  PackageSearch, 
  Users, 
  GripHorizontal,
  PlusCircle,
  Pencil,
  Trash2,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import products, { Product } from '@/data/products';

// Normally, this would come from the backend
const isAdmin = (userId: string) => {
  return userId === "admin123"; // For demo purposes
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();
  const [allProducts, setAllProducts] = useState<Product[]>(products);
  const [editing, setEditing] = useState<Product | null>(null);
  const [users, setUsers] = useState<any[]>([
    { id: "admin123", name: "Admin User", email: "admin@example.com", isAdmin: true },
    { id: "user456", name: "Regular User", email: "user@example.com", isAdmin: false },
  ]);

  useEffect(() => {
    // Redirect if not admin
    if (!loading && (!isAuthenticated || (user && !isAdmin(user.id)))) {
      toast.error("You don't have access to this page");
      navigate('/');
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleDeleteProduct = (id: number) => {
    // In a real app, this would be an API call
    setAllProducts(allProducts.filter(product => product.id !== id));
    toast.success("Product deleted successfully");
  };

  const handleEditProduct = (product: Product) => {
    setEditing(product);
    // In a real app, this would open a modal or redirect to an edit page
    toast.info("Editing product (demo only)");
  };

  const handleDeleteUser = (id: string) => {
    // In a real app, this would be an API call
    setUsers(users.filter(user => user.id !== id));
    toast.success("User deleted successfully");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-bloombook-900 mb-6 flex items-center">
            <ShieldCheck className="mr-3 h-6 w-6 text-bloombook-700" />
            Admin Dashboard
          </h1>

          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="products" className="flex items-center">
                <PackageSearch className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Products</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Categories</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Manage Products</CardTitle>
                      <CardDescription>Add, edit, or remove products from your inventory.</CardDescription>
                    </div>
                    <Button className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Product</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input placeholder="Search products..." className="max-w-sm" />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">In Stock</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allProducts.map((product) => (
                          <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm">{product.id}</td>
                            <td className="px-4 py-4 text-sm font-medium">{product.name}</td>
                            <td className="px-4 py-4 text-sm">${product.price.toFixed(2)}</td>
                            <td className="px-4 py-4 text-sm">{product.category}</td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {product.inStock ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="inline-flex items-center"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="inline-flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Manage Users</CardTitle>
                  <CardDescription>View and manage user accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ID</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-4 text-sm">{user.id}</td>
                            <td className="px-4 py-4 text-sm font-medium">{user.name}</td>
                            <td className="px-4 py-4 text-sm">{user.email}</td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                {user.isAdmin ? 'Admin' : 'User'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm text-right space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="inline-flex items-center"
                              >
                                <Pencil className="h-3.5 w-3.5 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="inline-flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                onClick={() => handleDeleteUser(user.id)}
                                disabled={user.id === "admin123"} // Prevent deleting the admin
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1" />
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Manage Categories</CardTitle>
                      <CardDescription>Add, edit, or remove product categories.</CardDescription>
                    </div>
                    <Button className="flex items-center gap-2">
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Category</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Products Count</th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium">Photo Albums</td>
                          <td className="px-4 py-4 text-sm">3</td>
                          <td className="px-4 py-4 text-sm text-right space-x-2">
                            <Button variant="outline" size="sm" className="inline-flex items-center">
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="inline-flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium">Digital Products</td>
                          <td className="px-4 py-4 text-sm">4</td>
                          <td className="px-4 py-4 text-sm text-right space-x-2">
                            <Button variant="outline" size="sm" className="inline-flex items-center">
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="inline-flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium">Cards</td>
                          <td className="px-4 py-4 text-sm">5</td>
                          <td className="px-4 py-4 text-sm text-right space-x-2">
                            <Button variant="outline" size="sm" className="inline-flex items-center">
                              <Pencil className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button variant="outline" size="sm" className="inline-flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
