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
  { code: '+93', name: 'Afghanistan', flag: '🇦🇫' },
  { code: '+355', name: 'Albania', flag: '🇦🇱' },
  { code: '+213', name: 'Algeria', flag: '🇩🇿' },
  { code: '+376', name: 'Andorra', flag: '🇦🇩' },
  { code: '+244', name: 'Angola', flag: '🇦🇴' },
  { code: '+1', name: 'Antigua and Barbuda', flag: '🇦🇬' },
  { code: '+54', name: 'Argentina', flag: '🇦🇷' },
  { code: '+374', name: 'Armenia', flag: '🇦🇲' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: '+43', name: 'Austria', flag: '🇦🇹' },
  { code: '+994', name: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+1', name: 'Bahamas', flag: '🇧🇸' },
  { code: '+973', name: 'Bahrain', flag: '🇧🇭' },
  { code: '+880', name: 'Bangladesh', flag: '🇧🇩' },
  { code: '+1', name: 'Barbados', flag: '🇧🇧' },
  { code: '+375', name: 'Belarus', flag: '🇧🇾' },
  { code: '+32', name: 'Belgium', flag: '🇧🇪' },
  { code: '+501', name: 'Belize', flag: '🇧🇿' },
  { code: '+229', name: 'Benin', flag: '🇧🇯' },
  { code: '+975', name: 'Bhutan', flag: '🇧🇹' },
  { code: '+591', name: 'Bolivia', flag: '🇧🇴' },
  { code: '+387', name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
  { code: '+267', name: 'Botswana', flag: '🇧🇼' },
  { code: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: '+673', name: 'Brunei', flag: '🇧🇳' },
  { code: '+359', name: 'Bulgaria', flag: '🇧🇬' },
  { code: '+226', name: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+257', name: 'Burundi', flag: '🇧🇮' },
  { code: '+855', name: 'Cambodia', flag: '🇰🇭' },
  { code: '+237', name: 'Cameroon', flag: '🇨🇲' },
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+238', name: 'Cape Verde', flag: '🇨🇻' },
  { code: '+236', name: 'Central African Republic', flag: '🇨🇫' },
  { code: '+235', name: 'Chad', flag: '🇹🇩' },
  { code: '+56', name: 'Chile', flag: '🇨🇱' },
  { code: '+86', name: 'China', flag: '🇨🇳' },
  { code: '+57', name: 'Colombia', flag: '🇨🇴' },
  { code: '+269', name: 'Comoros', flag: '🇰🇲' },
  { code: '+242', name: 'Congo', flag: '🇨🇬' },
  { code: '+243', name: 'Congo, Democratic Republic of the', flag: '🇨🇩' },
  { code: '+506', name: 'Costa Rica', flag: '🇨🇷' },
  { code: '+225', name: 'Cote d\'Ivoire', flag: '🇨🇮' },
  { code: '+385', name: 'Croatia', flag: '🇭🇷' },
  { code: '+53', name: 'Cuba', flag: '🇨🇺' },
  { code: '+357', name: 'Cyprus', flag: '🇨🇾' },
  { code: '+420', name: 'Czech Republic', flag: '🇨🇿' },
  { code: '+45', name: 'Denmark', flag: '🇩🇰' },
  { code: '+253', name: 'Djibouti', flag: '🇩🇯' },
  { code: '+1', name: 'Dominica', flag: '🇩🇲' },
  { code: '+1', name: 'Dominican Republic', flag: '🇩🇴' },
  { code: '+670', name: 'East Timor', flag: '🇹🇱' },
  { code: '+593', name: 'Ecuador', flag: '🇪🇨' },
  { code: '+20', name: 'Egypt', flag: '🇪🇬' },
  { code: '+503', name: 'El Salvador', flag: '🇸🇻' },
  { code: '+240', name: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: '+291', name: 'Eritrea', flag: '🇪🇷' },
  { code: '+372', name: 'Estonia', flag: '🇪🇪' },
  { code: '+251', name: 'Ethiopia', flag: '🇪🇹' },
  { code: '+679', name: 'Fiji', flag: '🇫🇯' },
  { code: '+358', name: 'Finland', flag: '🇫🇮' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+241', name: 'Gabon', flag: '🇬🇦' },
  { code: '+220', name: 'Gambia', flag: '🇬🇲' },
  { code: '+995', name: 'Georgia', flag: '🇬🇪' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+233', name: 'Ghana', flag: '🇬🇭' },
  { code: '+30', name: 'Greece', flag: '🇬🇷' },
  { code: '+1', name: 'Grenada', flag: '🇬🇩' },
  { code: '+502', name: 'Guatemala', flag: '🇬🇹' },
  { code: '+224', name: 'Guinea', flag: '🇬🇳' },
  { code: '+245', name: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: '+592', name: 'Guyana', flag: '🇬🇾' },
  { code: '+509', name: 'Haiti', flag: '🇭🇹' },
  { code: '+504', name: 'Honduras', flag: '🇭🇳' },
  { code: '+36', name: 'Hungary', flag: '🇭🇺' },
  { code: '+354', name: 'Iceland', flag: '🇮🇸' },
  { code: '+91', name: 'India', flag: '🇮🇳' },
  { code: '+62', name: 'Indonesia', flag: '🇮🇩' },
  { code: '+98', name: 'Iran', flag: '🇮🇷' },
  { code: '+964', name: 'Iraq', flag: '🇮🇶' },
  { code: '+353', name: 'Ireland', flag: '🇮🇪' },
  { code: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+1', name: 'Jamaica', flag: '🇯🇲' },
  { code: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: '+962', name: 'Jordan', flag: '🇯🇴' },
  { code: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: '+254', name: 'Kenya', flag: '🇰🇪' },
  { code: '+686', name: 'Kiribati', flag: '🇰🇮' },
  { code: '+850', name: 'North Korea', flag: '🇰🇵' },
  { code: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: '+965', name: 'Kuwait', flag: '🇰🇼' },
  { code: '+996', name: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '+856', name: 'Laos', flag: '🇱🇦' },
  { code: '+371', name: 'Latvia', flag: '🇱🇻' },
  { code: '+961', name: 'Lebanon', flag: '🇱🇧' },
  { code: '+266', name: 'Lesotho', flag: '🇱🇸' },
  { code: '+231', name: 'Liberia', flag: '🇱🇷' },
  { code: '+218', name: 'Libya', flag: '🇱🇾' },
  { code: '+423', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: '+370', name: 'Lithuania', flag: '🇱🇹' },
  { code: '+352', name: 'Luxembourg', flag: '🇱🇺' },
  { code: '+389', name: 'North Macedonia', flag: '🇲🇰' },
  { code: '+261', name: 'Madagascar', flag: '🇲🇬' },
  { code: '+265', name: 'Malawi', flag: '🇲🇼' },
  { code: '+60', name: 'Malaysia', flag: '🇲🇾' },
  { code: '+960', name: 'Maldives', flag: '🇲🇻' },
  { code: '+223', name: 'Mali', flag: '🇲🇱' },
  { code: '+356', name: 'Malta', flag: '🇲🇹' },
  { code: '+692', name: 'Marshall Islands', flag: '🇲🇭' },
  { code: '+222', name: 'Mauritania', flag: '🇲🇷' },
  { code: '+230', name: 'Mauritius', flag: '🇲🇺' },
  { code: '+52', name: 'Mexico', flag: '🇲🇽' },
  { code: '+691', name: 'Micronesia', flag: '🇫🇲' },
  { code: '+373', name: 'Moldova', flag: '🇲🇩' },
  { code: '+377', name: 'Monaco', flag: '🇲🇨' },
  { code: '+976', name: 'Mongolia', flag: '🇲🇳' },
  { code: '+382', name: 'Montenegro', flag: '🇲🇪' },
  { code: '+212', name: 'Morocco', flag: '🇲🇦' },
  { code: '+258', name: 'Mozambique', flag: '🇲🇿' },
  { code: '+95', name: 'Myanmar', flag: '🇲🇲' },
  { code: '+264', name: 'Namibia', flag: '🇳🇦' },
  { code: '+674', name: 'Nauru', flag: '🇳🇷' },
  { code: '+977', name: 'Nepal', flag: '🇳🇵' },
  { code: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: '+64', name: 'New Zealand', flag: '🇳🇿' },
  { code: '+505', name: 'Nicaragua', flag: '🇳🇮' },
  { code: '+227', name: 'Niger', flag: '🇳🇪' },
  { code: '+234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '+47', name: 'Norway', flag: '🇳🇴' },
  { code: '+968', name: 'Oman', flag: '🇴🇲' },
  { code: '+92', name: 'Pakistan', flag: '🇵🇰' },
  { code: '+680', name: 'Palau', flag: '🇵🇼' },
  { code: '+970', name: 'Palestine', flag: '🇵🇸' },
  { code: '+507', name: 'Panama', flag: '🇵🇦' },
  { code: '+675', name: 'Papua New Guinea', flag: '🇵🇬' },
  { code: '+595', name: 'Paraguay', flag: '🇵🇾' },
  { code: '+51', name: 'Peru', flag: '🇵🇪' },
  { code: '+63', name: 'Philippines', flag: '🇵🇭' },
  { code: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: '+351', name: 'Portugal', flag: '🇵🇹' },
  { code: '+974', name: 'Qatar', flag: '🇶🇦' },
  { code: '+40', name: 'Romania', flag: '🇷🇴' },
  { code: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: '+250', name: 'Rwanda', flag: '🇷🇼' },
  { code: '+1', name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
  { code: '+1', name: 'Saint Lucia', flag: '🇱🇨' },
  { code: '+1', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨' },
  { code: '+685', name: 'Samoa', flag: '🇼🇸' },
  { code: '+378', name: 'San Marino', flag: '🇸🇲' },
  { code: '+239', name: 'Sao Tome and Principe', flag: '🇸🇹' },
  { code: '+966', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+221', name: 'Senegal', flag: '🇸🇳' },
  { code: '+381', name: 'Serbia', flag: '🇷🇸' },
  { code: '+248', name: 'Seychelles', flag: '🇸🇨' },
  { code: '+232', name: 'Sierra Leone', flag: '🇸🇱' },
  { code: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: '+421', name: 'Slovakia', flag: '🇸🇰' },
  { code: '+386', name: 'Slovenia', flag: '🇸🇮' },
  { code: '+677', name: 'Solomon Islands', flag: '🇸🇧' },
  { code: '+252', name: 'Somalia', flag: '🇸🇴' },
  { code: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: '+211', name: 'South Sudan', flag: '🇸🇸' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+94', name: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+249', name: 'Sudan', flag: '🇸🇩' },
  { code: '+597', name: 'Suriname', flag: '🇸🇷' },
  { code: '+268', name: 'Eswatini', flag: '🇸🇿' },
  { code: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: '+963', name: 'Syria', flag: '🇸🇾' },
  { code: '+886', name: 'Taiwan', flag: '🇹🇼' },
  { code: '+992', name: 'Tajikistan', flag: '🇹🇯' },
  { code: '+255', name: 'Tanzania', flag: '🇹🇿' },
  { code: '+66', name: 'Thailand', flag: '🇹🇭' },
  { code: '+228', name: 'Togo', flag: '🇹🇬' },
  { code: '+676', name: 'Tonga', flag: '🇹🇴' },
  { code: '+1', name: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
  { code: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: '+993', name: 'Turkmenistan', flag: '🇹🇲' },
  { code: '+688', name: 'Tuvalu', flag: '🇹🇻' },
  { code: '+256', name: 'Uganda', flag: '🇺🇬' },
  { code: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+598', name: 'Uruguay', flag: '🇺🇾' },
  { code: '+998', name: 'Uzbekistan', flag: '🇺🇿' },
  { code: '+678', name: 'Vanuatu', flag: '🇻🇺' },
  { code: '+379', name: 'Vatican City', flag: '🇻🇦' },
  { code: '+58', name: 'Venezuela', flag: '🇻🇪' },
  { code: '+84', name: 'Vietnam', flag: '🇻🇳' },
  { code: '+967', name: 'Yemen', flag: '🇾🇪' },
  { code: '+260', name: 'Zambia', flag: '🇿🇲' },
  { code: '+263', name: 'Zimbabwe', flag: '🇿🇼' },
];

const countries = [
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 
  'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 
  'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria',
  'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czech Republic',
  'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'Egypt', 'El Salvador', 
  'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 
  'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana',
  'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
  'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 
  'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
  'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
  'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia',
  'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia',
  'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines',
  'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 
  'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal',
  'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland',
  'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia',
  'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 
  'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 
  'Zambia', 'Zimbabwe'
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
          postalCode: '',
          city: '',
          apartmentNumber: '',
        };

        if (profileData.address && typeof profileData.address === 'object') {
          addressObj = {
            ...addressObj,
            ...(profileData.address as unknown as StructuredAddress)
          };
        } else if (profileData.address && typeof profileData.address === 'string') {
          try {
            const parsedAddress = JSON.parse(profileData.address as string);
            addressObj = {
              ...addressObj,
              ...parsedAddress
            };
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
