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
  AlertTriangle,
  Home,
  Building,
  MapPinned,
  Globe
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
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import type { Profile, ProfileUpdate, StructuredAddress, CountryCode } from '@/types/profile';

const countryCodes: CountryCode[] = [
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
];

const countries = [
  'United States', 'United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 
  'Japan', 'China', 'India', 'Australia', 'Brazil', 'Russia', 'South Korea', 
  'Canada', 'Mexico'
];

const profileSchema = z.object({
  full_name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  country_code: z.string().min(1, { message: 'Country code is required' }),
  phone_number: z.string().optional(),
  address: z.object({
    country: z.string().min(1, { message: 'Country is required' }),
    street: z.string().min(1, { message: 'Street is required' }),
    houseNumber: z.string().min(1, { message: 'House number is required' }),
    apartmentNumber: z.string().optional(),
    postalCode: z.string().min(1, { message: 'Postal code is required' }),
    city: z.string().min(1, { message: 'City is required' }),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  console.log("Profile page rendering");
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading, isAdmin, refreshAdminStatus } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPromotingToAdmin, setIsPromotingToAdmin] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const [selectedCountryCode, setSelectedCountryCode] = useState<CountryCode>(countryCodes[0]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      country_code: '+1',
      phone_number: '',
      address: {
        country: '',
        street: '',
        houseNumber: '',
        apartmentNumber: '',
        postalCode: '',
        city: '',
      }
    },
  });

  useEffect(() => {
    console.log("Auth state in profile:", { isAuthenticated, authLoading });
    if (!authLoading && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate('/login', { state: { from: { pathname: '/profile' } } });
    }
  }, [isAuthenticated, authLoading, navigate]);

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
      setAdminExists(true);
    }
  };

  const fetchProfile = async () => {
    try {
      console.log("Starting profile fetch");
      setProfileLoading(true);
      setProfileError(null);
      
      const profileData = await profileService.getCurrentProfile();
      
      if (profileData) {
        console.log("Profile data retrieved:", profileData);
        setProfile(profileData);

        let addressObj: StructuredAddress = {
          country: '',
          street: '',
          houseNumber: '',
          apartmentNumber: '',
          postalCode: '',
          city: '',
        };

        if (profileData.address && typeof profileData.address === 'object') {
          addressObj = profileData.address as unknown as StructuredAddress;
        } else if (profileData.address && typeof profileData.address === 'string') {
          try {
            addressObj = JSON.parse(profileData.address as string);
          } catch (e) {
            // Keep default
          }
        }

        let countryCode = '+1';
        if (profileData.country_code) {
          countryCode = profileData.country_code;
        }
        
        const foundCode = countryCodes.find(c => c.code === countryCode);
        if (foundCode) {
          setSelectedCountryCode(foundCode);
        }

        let phoneNumber = '';
        if (profileData.phone) {
          const phone = profileData.phone;
          if (countryCode && phone.startsWith(countryCode)) {
            phoneNumber = phone.substring(countryCode.length).trim();
          } else {
            phoneNumber = phone;
          }
        }

        form.reset({
          full_name: profileData.full_name || '',
          country_code: countryCode,
          phone_number: phoneNumber,
          address: addressObj
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
      
      const fullPhone = data.phone_number 
        ? `${data.country_code}${data.phone_number}`
        : null;
      
      const updateData: ProfileUpdate = {
        id: user.id,
        full_name: data.full_name,
        phone: fullPhone,
        address: data.address,
        country_code: data.country_code
      };

      const updatedProfile = await profileService.updateProfile(updateData);
      
      if (updatedProfile) {
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
        setProfile({
          ...profile!,
          role: 'admin',
        });
        
        setAdminExists(true);
        
        await refreshAdminStatus();
        
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
                          
                          <div className="space-y-2">
                            <FormLabel>Phone Number</FormLabel>
                            <div className="flex space-x-2">
                              <FormField
                                control={form.control}
                                name="country_code"
                                render={({ field }) => (
                                  <FormItem className="w-28">
                                    <Select
                                      value={field.value}
                                      onValueChange={(value) => {
                                        field.onChange(value);
                                        const code = countryCodes.find(c => c.code === value);
                                        if (code) setSelectedCountryCode(code);
                                      }}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Code">
                                            <span>{selectedCountryCode.flag} {selectedCountryCode.code}</span>
                                          </SelectValue>
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent className="max-h-[300px]">
                                        {countryCodes.map((country) => (
                                          <SelectItem key={country.code + country.name} value={country.code}>
                                            <span className="flex items-center">
                                              <span className="mr-2">{country.flag}</span>
                                              <span>{country.code}</span>
                                              <span className="ml-2 text-xs text-gray-500">{country.name}</span>
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name="phone_number"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                                        <Input 
                                          placeholder="Phone number" 
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
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <FormLabel>Address</FormLabel>
                            
                            <FormField
                              control={form.control}
                              name="address.country"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Country</FormLabel>
                                  <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <Globe className="mr-2 h-4 w-4 text-bloombook-400" />
                                        <SelectValue placeholder="Select a country" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {countries.map((country) => (
                                        <SelectItem key={country} value={country}>
                                          {country}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="address.street"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Street</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                                      <Input 
                                        placeholder="Street name" 
                                        className="pl-10" 
                                        {...field} 
                                      />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex space-x-4">
                              <FormField
                                control={form.control}
                                name="address.houseNumber"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>House Number</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                                        <Input 
                                          placeholder="House number" 
                                          className="pl-10" 
                                          {...field} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="address.apartmentNumber"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>
                                      Apartment Number
                                      <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                                        <Input 
                                          placeholder="Apt., suite, etc." 
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
                            </div>
                            
                            <div className="flex space-x-4">
                              <FormField
                                control={form.control}
                                name="address.postalCode"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>Postal Code</FormLabel>
                                    <FormControl>
                                      <Input 
                                        placeholder="Postal/ZIP code" 
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="address.city"
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <div className="relative">
                                        <MapPinned className="absolute left-3 top-1/2 transform -translate-y-1/2 text-bloombook-400 h-4 w-4" />
                                        <Input 
                                          placeholder="City/Town" 
                                          className="pl-10" 
                                          {...field} 
                                        />
                                      </div>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                          
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
