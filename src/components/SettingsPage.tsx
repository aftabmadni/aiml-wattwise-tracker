import Magic3DInterface from "./Magic3DInterface";
// import React, { useState } from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
// import { Button } from './ui/button';
// import { Input } from './ui/input';
// import { Label } from './ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
// import { Switch } from './ui/switch';
// import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
// import { User, Bell, CreditCard, Shield, Globe } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import { userApi } from '../lib/mockApi';
// import { toast } from 'sonner';

// export const SettingsPage: React.FC = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);

//   // Profile state
//   const [name, setName] = useState(user?.name || '');
//   const [email, setEmail] = useState(user?.email || '');

//   // Preferences state
//   const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR'>(user?.preferences.currency || 'INR');
//   const [units, setUnits] = useState<'kWh' | 'MWh'>(user?.preferences.units || 'kWh');
//   const [monthlyBudget, setMonthlyBudget] = useState(user?.preferences.monthlyBudget || 2000);
//   const [language, setLanguage] = useState<'en' | 'hi'>(user?.preferences.language || 'en');

//   // Notification preferences
//   const [emailNotifications, setEmailNotifications] = useState(user?.preferences.notifications.email || true);
//   const [pushNotifications, setPushNotifications] = useState(user?.preferences.notifications.push || true);
//   const [aiInsights, setAiInsights] = useState(user?.preferences.notifications.aiInsights || true);

//   const handleSaveProfile = async () => {
//     setLoading(true);
//     try {
//       await userApi.updateProfile({ name, email });
//       toast.success('Profile updated successfully');
//     } catch (error) {
//       toast.error('Failed to update profile');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSavePreferences = async () => {
//     setLoading(true);
//     try {
//       await userApi.updatePreferences({
//         currency,
//         units,
//         monthlyBudget,
//         language,
//         notifications: {
//           email: emailNotifications,
//           push: pushNotifications,
//           aiInsights
//         }
//       });
//       toast.success('Preferences updated successfully');
//     } catch (error) {
//       toast.error('Failed to update preferences');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-semibold mb-2">Settings</h1>
//         <p className="text-gray-600">
//           Manage your account settings and preferences
//         </p>
//       </div>

//       <Tabs defaultValue="profile" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-5 max-w-2xl">
//           <TabsTrigger value="profile" className="gap-2">
//             <User size={16} />
//             <span className="hidden sm:inline">Profile</span>
//           </TabsTrigger>
//           <TabsTrigger value="notifications" className="gap-2">
//             <Bell size={16} />
//             <span className="hidden sm:inline">Notifications</span>
//           </TabsTrigger>
//           <TabsTrigger value="payments" className="gap-2">
//             <CreditCard size={16} />
//             <span className="hidden sm:inline">Payments</span>
//           </TabsTrigger>
//           <TabsTrigger value="preferences" className="gap-2">
//             <Globe size={16} />
//             <span className="hidden sm:inline">Preferences</span>
//           </TabsTrigger>
//           <TabsTrigger value="security" className="gap-2">
//             <Shield size={16} />
//             <span className="hidden sm:inline">Security</span>
//           </TabsTrigger>
//         </TabsList>

//         {/* Profile Tab */}
//         <TabsContent value="profile" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Profile Information</CardTitle>
//               <CardDescription>
//                 Update your personal information and profile picture
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center gap-6">
//                 <Avatar className="h-24 w-24">
//                   <AvatarImage src={user?.avatar} alt={user?.name} />
//                   <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
//                 </Avatar>
//                 <div className="space-y-2">
//                   <Button variant="outline" size="sm">
//                     Change Photo
//                   </Button>
//                   <p className="text-xs text-gray-500">
//                     JPG, GIF or PNG. Max size of 2MB.
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="name">Full Name</Label>
//                   <Input
//                     id="name"
//                     value={name}
//                     onChange={(e) => setName(e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <Button onClick={handleSaveProfile} disabled={loading}>
//                 {loading ? 'Saving...' : 'Save Changes'}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Notifications Tab */}
//         <TabsContent value="notifications" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Notification Preferences</CardTitle>
//               <CardDescription>
//                 Choose how you want to receive notifications
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <p className="font-medium">Email Notifications</p>
//                   <p className="text-sm text-gray-500">
//                     Receive email updates about your usage and bills
//                   </p>
//                 </div>
//                 <Switch
//                   checked={emailNotifications}
//                   onCheckedChange={setEmailNotifications}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <p className="font-medium">Push Notifications</p>
//                   <p className="text-sm text-gray-500">
//                     Get instant alerts on your device
//                   </p>
//                 </div>
//                 <Switch
//                   checked={pushNotifications}
//                   onCheckedChange={setPushNotifications}
//                 />
//               </div>

//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <p className="font-medium">AI Insights</p>
//                   <p className="text-sm text-gray-500">
//                     Receive personalized AI-generated recommendations
//                   </p>
//                 </div>
//                 <Switch
//                   checked={aiInsights}
//                   onCheckedChange={setAiInsights}
//                 />
//               </div>

//               <Button onClick={handleSavePreferences} disabled={loading}>
//                 {loading ? 'Saving...' : 'Save Preferences'}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Payments Tab */}
//         <TabsContent value="payments" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Payment Methods</CardTitle>
//               <CardDescription>
//                 Manage your saved payment methods
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="p-4 border border-gray-200 rounded-lg">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs">
//                       VISA
//                     </div>
//                     <div>
//                       <p className="font-medium text-sm">•••• •••• •••• 4242</p>
//                       <p className="text-xs text-gray-500">Expires 12/25</p>
//                     </div>
//                   </div>
//                   <Button variant="ghost" size="sm">Remove</Button>
//                 </div>
//               </div>

//               <Button variant="outline" className="w-full">
//                 Add Payment Method
//               </Button>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>UPI ID</CardTitle>
//               <CardDescription>
//                 Save your UPI ID for quick payments
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <Input placeholder="yourname@upi" />
//               <Button>Save UPI ID</Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Preferences Tab */}
//         <TabsContent value="preferences" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Display Preferences</CardTitle>
//               <CardDescription>
//                 Customize how you view your data
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label htmlFor="currency">Currency</Label>
//                   <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
//                     <SelectTrigger id="currency">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
//                       <SelectItem value="USD">US Dollar ($)</SelectItem>
//                       <SelectItem value="EUR">Euro (€)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="units">Energy Units</Label>
//                   <Select value={units} onValueChange={(v) => setUnits(v as any)}>
//                     <SelectTrigger id="units">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="kWh">Kilowatt-hour (kWh)</SelectItem>
//                       <SelectItem value="MWh">Megawatt-hour (MWh)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="language">Language</Label>
//                   <Select value={language} onValueChange={(v) => setLanguage(v as any)}>
//                     <SelectTrigger id="language">
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="en">English</SelectItem>
//                       <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="budget">Monthly Budget ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€'})</Label>
//                   <Input
//                     id="budget"
//                     type="number"
//                     value={monthlyBudget}
//                     onChange={(e) => setMonthlyBudget(Number(e.target.value))}
//                   />
//                 </div>
//               </div>

//               <Button onClick={handleSavePreferences} disabled={loading}>
//                 {loading ? 'Saving...' : 'Save Preferences'}
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Security Tab */}
//         <TabsContent value="security" className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Change Password</CardTitle>
//               <CardDescription>
//                 Update your password regularly to keep your account secure
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="current-password">Current Password</Label>
//                 <Input id="current-password" type="password" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="new-password">New Password</Label>
//                 <Input id="new-password" type="password" />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="confirm-password">Confirm New Password</Label>
//                 <Input id="confirm-password" type="password" />
//               </div>
//               <Button>Update Password</Button>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Two-Factor Authentication</CardTitle>
//               <CardDescription>
//                 Add an extra layer of security to your account
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <div className="space-y-0.5">
//                   <p className="font-medium">Enable 2FA</p>
//                   <p className="text-sm text-gray-500">
//                     Require authentication code in addition to password
//                   </p>
//                 </div>
//                 <Switch />
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-red-200">
//             <CardHeader>
//               <CardTitle className="text-red-600">Danger Zone</CardTitle>
//               <CardDescription>
//                 Irreversible actions that affect your account
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
//                   Delete All Data
//                 </Button>
//                 <Button variant="destructive" className="w-full">
//                   Delete Account
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

import React, { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { User, Bell, CreditCard, Shield, Globe, Upload, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { userApi } from "../lib/mockApi";
import { toast } from "sonner";

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");

  // Preferences state
  const [currency, setCurrency] = useState<"INR" | "USD" | "EUR">(
    user?.preferences.currency || "INR"
  );
  const [units, setUnits] = useState<"kWh" | "MWh">(
    user?.preferences.units || "kWh"
  );
  const [monthlyBudget, setMonthlyBudget] = useState(
    user?.preferences.monthlyBudget || 2000
  );
  const [language, setLanguage] = useState<"en" | "hi">(
    user?.preferences.language || "en"
  );

  // Notification preferences
  const [emailNotifications, setEmailNotifications] = useState(
    user?.preferences.notifications.email || true
  );
  const [pushNotifications, setPushNotifications] = useState(
    user?.preferences.notifications.push || true
  );
  const [aiInsights, setAiInsights] = useState(
    user?.preferences.notifications.aiInsights || true
  );

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPG, PNG, GIF)");
      return;
      // ...existing code...
      return (
        <div>
          <Magic3DInterface />
          {/* ...existing settings content... */}
        </div>
      );
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setAvatarLoading(true);

    // Create a preview URL for the selected image
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setAvatar(imageUrl);
      setAvatarLoading(false);
      toast.success("Photo updated successfully!");

      // Save to localStorage for persistence (fallback if updateUser is not available)
      try {
        const currentUserData = localStorage.getItem("user");
        if (currentUserData) {
          const userData = JSON.parse(currentUserData);
          userData.avatar = imageUrl;
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.log("Could not save avatar to localStorage");
      }
    };
    reader.onerror = () => {
      toast.error("Failed to load image");
      setAvatarLoading(false);
    };
    reader.readAsDataURL(file);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove avatar
  const handleRemoveAvatar = () => {
    setAvatar("");
    toast.success("Photo removed successfully");

    // Remove from localStorage
    try {
      const currentUserData = localStorage.getItem("user");
      if (currentUserData) {
        const userData = JSON.parse(currentUserData);
        userData.avatar = "";
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.log("Could not remove avatar from localStorage");
    }
  };

  // Trigger file input click
  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await userApi.updateProfile({
        name,
        email,
        avatar,
      });

      // Update localStorage for persistence
      try {
        const currentUserData = localStorage.getItem("user");
        if (currentUserData) {
          const userData = JSON.parse(currentUserData);
          userData.name = name;
          userData.email = email;
          userData.avatar = avatar;
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.log("Could not save profile to localStorage");
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      await userApi.updatePreferences({
        currency,
        units,
        monthlyBudget,
        language,
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
          aiInsights,
        },
      });

      // Update localStorage for preferences
      try {
        const currentUserData = localStorage.getItem("user");
        if (currentUserData) {
          const userData = JSON.parse(currentUserData);
          userData.preferences = {
            currency,
            units,
            monthlyBudget,
            language,
            notifications: {
              email: emailNotifications,
              push: pushNotifications,
              aiInsights,
            },
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }
      } catch (error) {
        console.log("Could not save preferences to localStorage");
      }

      toast.success("Preferences updated successfully");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setLoading(false);
    }
  };

  // Generate avatar fallback
  const getAvatarFallback = () => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="profile" className="gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard size={16} />
            <span className="hidden sm:inline">Payments</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Globe size={16} />
            <span className="hidden sm:inline">Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                    <AvatarImage
                      src={avatar}
                      alt={name || user?.name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {getAvatarFallback()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Loading overlay */}
                  {avatarLoading && (
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/90 hover:bg-white"
                      onClick={handleChangePhotoClick}
                    >
                      <Upload className="h-4 w-4 text-gray-700" />
                    </Button>
                    {avatar && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                        onClick={handleRemoveAvatar}
                      >
                        <X className="h-4 w-4 text-gray-700" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleChangePhotoClick}
                      disabled={avatarLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {avatar ? "Change Photo" : "Upload Photo"}
                    </Button>

                    {avatar && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        disabled={avatarLoading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove Photo
                      </Button>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 max-w-xs">
                    JPG, GIF or PNG. Max size of 2MB.
                  </p>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setName(user?.name || "");
                    setEmail(user?.email || "");
                    setAvatar(user?.avatar || "");
                  }}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
              <CardDescription>
                This is how your profile appears to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {name ? name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">
                    {name || "Your Name"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {email || "your.email@example.com"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rest of your tabs remain the same */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive email updates about your usage and bills
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-gray-500">
                    Get instant alerts on your device
                  </p>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">AI Insights</p>
                  <p className="text-sm text-gray-500">
                    Receive personalized AI-generated recommendations
                  </p>
                </div>
                <Switch checked={aiInsights} onCheckedChange={setAiInsights} />
              </div>

              <Button onClick={handleSavePreferences} disabled={loading}>
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center text-white text-xs">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-sm">•••• •••• •••• 4242</p>
                      <p className="text-xs text-gray-500">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Remove
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>UPI ID</CardTitle>
              <CardDescription>
                Save your UPI ID for quick payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="yourname@upi" />
              <Button>Save UPI ID</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize how you view your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={currency}
                    onValueChange={(v) => setCurrency(v as any)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="units">Energy Units</Label>
                  <Select
                    value={units}
                    onValueChange={(v) => setUnits(v as any)}
                  >
                    <SelectTrigger id="units">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kWh">Kilowatt-hour (kWh)</SelectItem>
                      <SelectItem value="MWh">Megawatt-hour (MWh)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={language}
                    onValueChange={(v) => setLanguage(v as any)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">
                    Monthly Budget (
                    {currency === "INR" ? "₹" : currency === "USD" ? "$" : "€"})
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    value={monthlyBudget}
                    onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                  />
                </div>
              </div>

              <Button onClick={handleSavePreferences} disabled={loading}>
                {loading ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password regularly to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium">Enable 2FA</p>
                  <p className="text-sm text-gray-500">
                    Require authentication code in addition to password
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete All Data
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
