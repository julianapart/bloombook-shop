
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { 
  ShieldCheck, 
  PackageSearch, 
  Users, 
  Tag,
  PlusCircle,
  Pencil,
  Trash2,
  Save,
  X
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Product type
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  gender?: string | null;
}

// User profile type
interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: 'admin' | 'user';
  email?: string; // Added for UI
  address?: string | null;
}

// Category type
interface Category {
  name: string;
  count: number;
}

// State for product dialog
interface ProductDialogState {
  isOpen: boolean;
  product: Product | null;
  isNew: boolean;
}

// State for category dialog
interface CategoryDialogState {
  isOpen: boolean;
  category: string;
  isNew: boolean;
}

// State for user dialog
interface UserDialogState {
  isOpen: boolean;
  user: Profile | null;
}

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [productDialog, setProductDialog] = useState<ProductDialogState>({
    isOpen: false,
    product: null,
    isNew: false
  });
  const [categoryDialog, setCategoryDialog] = useState<CategoryDialogState>({
    isOpen: false,
    category: '',
    isNew: false
  });
  const [userDialog, setUserDialog] = useState<UserDialogState>({
    isOpen: false,
    user: null
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Redirect if not admin
    if (!loading && (!isAuthenticated || !isAdmin)) {
      toast.error("You don't have access to this page");
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;

    setLoadingData(true);
    try {
      // Fetch products from Supabase
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');

      if (productsError) throw productsError;
      setProducts(productsData);

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Get emails for profiles by fetching auth users
      const usersWithRoles: Profile[] = profilesData.map(profile => ({
        ...profile,
        role: profile.role || 'user' // Default to 'user' if role is missing
      }));
      
      setUsers(usersWithRoles);

      // Calculate categories by grouping products
      if (productsData.length > 0) {
        const categoryMap = productsData.reduce((acc, product) => {
          if (!acc[product.category]) {
            acc[product.category] = 0;
          }
          acc[product.category]++;
          return acc;
        }, {} as Record<string, number>);

        const categoryList = Object.entries(categoryMap).map(([name, count]) => ({
          name,
          count
        }));

        setCategories(categoryList);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoadingData(false);
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, isAdmin, fetchData]);

  // Product CRUD operations
  const handleAddProduct = () => {
    setProductDialog({
      isOpen: true,
      product: {
        id: '',
        name: '',
        price: 0,
        category: '',
        description: '',
        images: [],
        gender: 'Unisex'
      },
      isNew: true
    });
  };

  const handleEditProduct = (product: Product) => {
    setProductDialog({
      isOpen: true,
      product,
      isNew: false
    });
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleSaveProduct = async () => {
    if (!productDialog.product) return;

    try {
      const product = productDialog.product;
      
      if (productDialog.isNew) {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert([{
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            images: product.images,
            gender: product.gender
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        setProducts([...products, data]);
        toast.success("Product created successfully");
      } else {
        // Update existing product
        const { data, error } = await supabase
          .from('products')
          .update({
            name: product.name,
            price: product.price,
            category: product.category,
            description: product.description,
            images: product.images,
            gender: product.gender
          })
          .eq('id', product.id)
          .select()
          .single();
        
        if (error) throw error;
        
        setProducts(products.map(p => p.id === product.id ? data : p));
        toast.success("Product updated successfully");
      }
      
      setProductDialog({ isOpen: false, product: null, isNew: false });
      fetchData(); // Refresh categories
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Failed to save product');
    }
  };

  // Category operations
  const handleAddCategory = () => {
    setCategoryDialog({
      isOpen: true,
      category: '',
      isNew: true
    });
  };

  const handleEditCategory = (category: string) => {
    setCategoryDialog({
      isOpen: true,
      category,
      isNew: false
    });
  };

  const handleSaveCategory = async () => {
    if (!categoryDialog.category) return;
    
    try {
      const newCategory = categoryDialog.category;
      const oldCategory = categoryDialog.isNew ? '' : categoryDialog.category;
      
      if (!categoryDialog.isNew) {
        // Update category for all products with this category
        const { error } = await supabase
          .from('products')
          .update({ category: newCategory })
          .eq('category', oldCategory);
        
        if (error) throw error;
        
        // Update products in state
        setProducts(products.map(product => 
          product.category === oldCategory 
            ? { ...product, category: newCategory } 
            : product
        ));
        
        // Update categories in state
        setCategories(categories.map(cat => 
          cat.name === oldCategory 
            ? { ...cat, name: newCategory } 
            : cat
        ));
        
        toast.success("Category updated successfully");
      } else {
        // Just close the dialog, the category will be created when a product uses it
        toast.success("Category created successfully");
      }
      
      setCategoryDialog({ isOpen: false, category: '', isNew: false });
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    try {
      // Check if products use this category
      const productsUsingCategory = products.filter(p => p.category === categoryName);
      
      if (productsUsingCategory.length > 0) {
        return toast.error(`Cannot delete category. It is used by ${productsUsingCategory.length} products.`);
      }
      
      // Remove from categories list
      setCategories(categories.filter(c => c.name !== categoryName));
      toast.success("Category deleted successfully");
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  // User operations
  const handleEditUser = (userProfile: Profile) => {
    setUserDialog({
      isOpen: true,
      user: userProfile
    });
  };

  const handleSaveUser = async () => {
    if (!userDialog.user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: userDialog.user.full_name,
          role: userDialog.user.role,
          phone: userDialog.user.phone,
          address: userDialog.user.address
        })
        .eq('id', userDialog.user.id);
      
      if (error) throw error;
      
      // Update users in state
      setUsers(users.map(u => 
        u.id === userDialog.user?.id 
          ? userDialog.user
          : u
      ));
      
      toast.success("User updated successfully");
      setUserDialog({ isOpen: false, user: null });
    } catch (error: any) {
      console.error('Error saving user:', error);
      toast.error(error.message || 'Failed to save user');
    }
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || loadingData) {
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
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle>Manage Products</CardTitle>
                      <CardDescription>Add, edit, or remove products from your inventory.</CardDescription>
                    </div>
                    <Button className="flex items-center gap-2" onClick={handleAddProduct}>
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Product</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Input 
                      placeholder="Search products..." 
                      className="max-w-sm" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Gender</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                              {searchTerm ? 'No products found matching your search.' : 'No products found. Add your first product!'}
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredProducts.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell className="font-mono text-xs">{product.id.substring(0, 8)}...</TableCell>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>${product.price.toFixed(2)}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>{product.gender || 'Unisex'}</TableCell>
                              <TableCell className="text-right space-x-2">
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
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
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
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              No users found.
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((profile) => (
                            <TableRow key={profile.id}>
                              <TableCell className="font-mono text-xs">{profile.id.substring(0, 8)}...</TableCell>
                              <TableCell className="font-medium">{profile.full_name || 'User'}</TableCell>
                              <TableCell>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  profile.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {profile.role}
                                </span>
                              </TableCell>
                              <TableCell>{profile.phone || '-'}</TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="inline-flex items-center"
                                  onClick={() => handleEditUser(profile)}
                                >
                                  <Pencil className="h-3.5 w-3.5 mr-1" />
                                  Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <CardTitle>Manage Categories</CardTitle>
                      <CardDescription>Add, edit, or remove product categories.</CardDescription>
                    </div>
                    <Button className="flex items-center gap-2" onClick={handleAddCategory}>
                      <PlusCircle className="h-4 w-4" />
                      <span>Add Category</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Products Count</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                              No categories found. Add your first category!
                            </TableCell>
                          </TableRow>
                        ) : (
                          categories.map((category) => (
                            <TableRow key={category.name}>
                              <TableCell className="font-medium">{category.name}</TableCell>
                              <TableCell>{category.count}</TableCell>
                              <TableCell className="text-right space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="inline-flex items-center"
                                  onClick={() => handleEditCategory(category.name)}
                                >
                                  <Pencil className="h-3.5 w-3.5 mr-1" />
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="inline-flex items-center text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                  onClick={() => handleDeleteCategory(category.name)}
                                  disabled={category.count > 0}
                                >
                                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Product Dialog */}
      <Dialog 
        open={productDialog.isOpen} 
        onOpenChange={(open) => !open && setProductDialog({ isOpen: false, product: null, isNew: false })}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{productDialog.isNew ? 'Add New Product' : 'Edit Product'}</DialogTitle>
            <DialogDescription>
              {productDialog.isNew 
                ? 'Fill in the details to add a new product to your inventory.' 
                : 'Update the product information.'}
            </DialogDescription>
          </DialogHeader>
          
          {productDialog.product && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input 
                  id="name" 
                  value={productDialog.product.name} 
                  onChange={(e) => setProductDialog({
                    ...productDialog,
                    product: { ...productDialog.product!, name: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={productDialog.product.price} 
                    onChange={(e) => setProductDialog({
                      ...productDialog,
                      product: { ...productDialog.product!, price: parseFloat(e.target.value) || 0 }
                    })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category" 
                    value={productDialog.product.category} 
                    onChange={(e) => setProductDialog({
                      ...productDialog,
                      product: { ...productDialog.product!, category: e.target.value }
                    })}
                    list="categories"
                  />
                  <datalist id="categories">
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name} />
                    ))}
                  </datalist>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={productDialog.product.gender || 'Unisex'} 
                  onValueChange={(value) => setProductDialog({
                    ...productDialog,
                    product: { ...productDialog.product!, gender: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Boy">Boy</SelectItem>
                    <SelectItem value="Girl">Girl</SelectItem>
                    <SelectItem value="Unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  rows={3} 
                  value={productDialog.product.description} 
                  onChange={(e) => setProductDialog({
                    ...productDialog,
                    product: { ...productDialog.product!, description: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="images">Image URLs (one per line)</Label>
                <Textarea 
                  id="images" 
                  rows={3} 
                  value={productDialog.product.images.join('\n')} 
                  onChange={(e) => setProductDialog({
                    ...productDialog,
                    product: { 
                      ...productDialog.product!, 
                      images: e.target.value.split('\n').filter(url => url.trim() !== '') 
                    }
                  })}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setProductDialog({ isOpen: false, product: null, isNew: false })}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Category Dialog */}
      <Dialog 
        open={categoryDialog.isOpen} 
        onOpenChange={(open) => !open && setCategoryDialog({ isOpen: false, category: '', isNew: false })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{categoryDialog.isNew ? 'Add New Category' : 'Edit Category'}</DialogTitle>
            <DialogDescription>
              {categoryDialog.isNew 
                ? 'Enter a name for the new category.' 
                : 'Update the category name. This will update all products using this category.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="categoryName">Category Name</Label>
              <Input 
                id="categoryName" 
                value={categoryDialog.category} 
                onChange={(e) => setCategoryDialog({
                  ...categoryDialog,
                  category: e.target.value
                })}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialog({ isOpen: false, category: '', isNew: false })}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Dialog */}
      <Dialog 
        open={userDialog.isOpen} 
        onOpenChange={(open) => !open && setUserDialog({ isOpen: false, user: null })}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and permissions.
            </DialogDescription>
          </DialogHeader>
          
          {userDialog.user && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="userName">Full Name</Label>
                <Input 
                  id="userName" 
                  value={userDialog.user.full_name || ''} 
                  onChange={(e) => setUserDialog({
                    ...userDialog,
                    user: { ...userDialog.user!, full_name: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="userPhone">Phone</Label>
                <Input 
                  id="userPhone" 
                  value={userDialog.user.phone || ''} 
                  onChange={(e) => setUserDialog({
                    ...userDialog,
                    user: { ...userDialog.user!, phone: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="userAddress">Address</Label>
                <Input 
                  id="userAddress" 
                  value={userDialog.user.address || ''} 
                  onChange={(e) => setUserDialog({
                    ...userDialog,
                    user: { ...userDialog.user!, address: e.target.value }
                  })}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="userRole">Role</Label>
                <Select 
                  value={userDialog.user.role} 
                  onValueChange={(value: 'admin' | 'user') => setUserDialog({
                    ...userDialog,
                    user: { ...userDialog.user!, role: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialog({ isOpen: false, user: null })}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Admin;
