
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  ShoppingBag, 
  Settings,
  Save,
  Shield,
  AlertTriangle
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { profileService } from '@/services/profileService';
import type { Profile, ProfileUpdate } from '@/types/profile';

// Form schema
const profileSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z.string().optional(),
  address: z.string().optional(),
});

// Update the ExtendedProfile type to use Supabase types
type ExtendedProfile = Profile;

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  console.log("Profile page rendering");
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, isAdmin } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPromotingToAdmin, setIsPromotingToAdmin] = useState(false);
  const [adminExists, setAdminExists] = useState(true); // Default to true to hide the admin section until we confirm

  // Form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
      address: '',
    },
  });

  // Redirect if not authenticated after auth is done loading
  useEffect(() => {
    console.log("Auth state in profile:", { isAuthenticated, authLoading });
    if (!authLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate('/login', { state: { from: { pathname: '/profile' } } });
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch user profile when authenticated
  useEffect(() => {
    if (isAuthenticated && user && !authLoading) {
      console.log("User authenticated, fetching profile");
      fetchProfile();
      checkAdminExists();
    }
  }, [isAuthenticated, user, authLoading]);

  const checkAdminExists = async () => {
    try {
      const exists = await profileService.checkIfAdminExists();
      setAdminExists(exists);
      console.log("Admin exists:", exists);
    } catch (error) {
      console.error("Error checking if admin exists:", error);
      // Default to true if there's an error to hide admin promotion section
      setAdminExists(true);
    }
  };

  const fetchProfile = async () => {
    try {
      console.log("Starting profile fetch");
      setProfileLoading(true);
      setProfileError(null);
      
      // Get profile from service
      const profileData = await profileService.getCurrentProfile();
      
      if (profileData) {
        console.log("Profile data retrieved:", profileData);
        setProfile(profileData);
        form.reset({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
        });
      } else {
        console.error("Failed to fetch profile data");
        setProfileError("We couldn't load your profile. Please try again.");
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileError("An unexpected error occurred. Please try again.");
      toast.error('Failed to load profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Make sure to include the user id in the update data
      const updateData: ProfileUpdate = {
        id: user.id,
        full_name: data.full_name,
        phone: data.phone,
        address: data.address,
      };

      const updatedProfile = await profileService.updateProfile(updateData);
      
      if (updatedProfile) {
        // Update local profile state
        setProfile({
          ...profile!,
          ...updateData,
        });
        
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const promoteToAdmin = async () => {
    if (!user) return;
    
    try {
      setIsPromotingToAdmin(true);
      
      const success = await profileService.setAdminRole(user.id, true);
      
      if (success) {
        // Update local profile state
        setProfile({
          ...profile!,
          role: 'admin',
        });
        
        // Update admin exists state to hide the section from other users
        setAdminExists(true);
        
        toast.success('You are now an admin! Please refresh the page or log out and log back in to see admin features.');
      }
    } catch (error: any) {
      console.error('Error promoting to admin:', error);
      toast.error(error.message || 'Failed to promote to admin');
    } finally {
      setIsPromotingToAdmin(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase() || 'U';
  };

  console.log("Auth loading:", authLoading, "Profile loading:", profileLoading);

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading authentication status...</div>
        </div>
        <Footer />
      </div>
    );
  }

  // If not authenticated, we'll redirect in the useEffect
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-medium mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please sign in to view your profile</p>
          <Button onClick={() => navigate('/login')} className="bg-bloombook-600 hover:bg-bloombook-700">
            Sign In
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // Show profile error state
  if (profileError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center p-4">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-medium mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 mb-6 text-center">{profileError}</p>
          <p className="text-gray-600 mb-6 text-center">
            Try refreshing the page or signing out and back in.
          </p>
          <div className="flex space-x-4">
            <Button onClick={() => window.location.reload()} variant="outline">
              Refresh Page
            </Button>
            <Button onClick={() => fetchProfile()} className="bg-bloombook-600 hover:bg-bloombook-700">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show profile loading state
  if (profileLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading profile data...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile?.avatar_url} alt={profile?.full_name} />
                        <AvatarFallback className="text-lg">
                          {getInitials(profile?.full_name || '')}
                        </AvatarFallback>
                      </Avatar>
                      <Button 
                        size="icon" 
                        variant="secondary" 
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change avatar</span>
                      </Button>
                    </div>
                    
                    <h2 className="text-xl font-medium text-bloombook-900 mt-2">
                      {profile?.full_name || 'User'}
                    </h2>
                    <p className="text-sm text-bloombook-500 mt-1">
                      {user?.email}
                    </p>
                    
                    {/* Admin status */}
                    {profile?.role === 'admin' && (
                      <div className="mt-2 flex items-center justify-center bg-green-50 text-green-700 rounded-full px-3 py-1 text-xs font-medium">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </div>
                    )}
                    
                    <Separator className="my-4" />
                    
                    <div className="w-full mt-2 space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to="/my-orders">
                          <ShoppingBag className="h-4 w-4 mr-2" />
                          My Orders
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        asChild
                      >
                        <Link to="/account-settings">
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </Link>
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="default"
                          className="w-full justify-start bg-bloombook-600 hover:bg-bloombook-700"
                          onClick={() => navigate('/admin')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Admin Promotion Card - Only show if no admin exists and user is not already an admin */}
              {!adminExists && profile?.role !== 'admin' && (
                <Card className="mt-4 border-dashed border-2 border-gray-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin Access
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Gain admin privileges for your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4">
                    <p className="text-sm mb-4">
                      Promoting yourself to admin will give you access to the admin dashboard to manage products, categories, and users.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          disabled={isPromotingToAdmin}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          {isPromotingToAdmin ? 'Processing...' : 'Become Admin'}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Become an Admin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will grant your account admin privileges. With great power comes great responsibility. Are you sure you want to proceed?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={promoteToAdmin}>
                            Confirm
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Main content */}
            <div className="w-full md:w-2/3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your personal information and contact details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                                    <Input 
                                      placeholder="Your full name" 
                                      className="pl-10" 
                                      {...field} 
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Email field (disabled) */}
                          <div className="space-y-2">
                            <FormLabel>Email</FormLabel>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                              <Input 
                                value={user?.email || ''} 
                                className="pl-10 bg-gray-50 text-bloombook-700" 
                                disabled 
                              />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Email cannot be changed.
                            </p>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                                    <Input 
                                      placeholder="Your phone number" 
                                      className="pl-10" 
                                      {...field} 
                                      value={field.value || ''}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                                    <Input 
                                      placeholder="Your address" 
                                      className="pl-10" 
                                      {...field} 
                                      value={field.value || ''}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <Button 
                            type="submit" 
                            className="bg-bloombook-600 hover:bg-bloombook-700"
                            disabled={isSaving}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                      <CardDescription>
                        View your past orders and check their status.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12 px-4">
                        <ShoppingBag className="mx-auto h-12 w-12 text-bloombook-300" />
                        <h3 className="mt-4 text-lg font-medium text-bloombook-900">No orders yet</h3>
                        <p className="mt-2 text-sm text-bloombook-500">
                          When you place orders, they will appear here.
                        </p>
                        <div className="mt-6 space-x-4">
                          <Button asChild className="bg-bloombook-600 hover:bg-bloombook-700">
                            <Link to="/shop">Start Shopping</Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link to="/my-orders">View All Orders</Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
