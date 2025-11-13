// import React, { useState } from "react";
// import {
//   Home,
//   BarChart3,
//   CreditCard,
//   Settings,
//   Menu,
//   X,
//   Bell,
//   LogOut,
//   User,
//   Zap,
// } from "lucide-react";

// import {
//   SidebarProvider,
//   Sidebar,
//   SidebarContent,
//   SidebarHeader,
//   SidebarTrigger,
// } from "./ui/sidebar";
// import { UsageSummarySidebar } from "./UsageSummarySidebar";
// import { useAuth } from "../contexts/AuthContext";
// import { Button } from "./ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { Badge } from "./ui/badge";

// interface AppLayoutProps {
//   children: React.ReactNode;
//   currentPage: "dashboard" | "reports" | "payments" | "settings";
//   onNavigate: (page: "dashboard" | "reports" | "payments" | "settings") => void;
//   notificationCount?: number;
//   onNotificationClick?: () => void;
// }

// export const AppLayout: React.FC<AppLayoutProps> = ({
//   children,
//   currentPage,
//   onNavigate,
//   notificationCount = 0,
//   onNotificationClick,
// }) => {
//   const { user, logout } = useAuth();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const navigation = [
//     { id: "dashboard" as const, name: "Dashboard", icon: Home },
//     { id: "reports" as const, name: "Reports", icon: BarChart3 },
//     { id: "payments" as const, name: "Payments", icon: CreditCard },
//     { id: "settings" as const, name: "Settings", icon: Settings },
//   ];

//   const handleLogout = async () => {
//     await logout();
//   };

//   return (
//     <SidebarProvider defaultOpen={true}>
//       <div className="flex min-h-screen w-full bg-gray-50">
//         {/* Sidebar */}
//         <Sidebar variant="inset">
//           <SidebarHeader className="flex items-center gap-2">
//             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <Zap className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//               WattWise
//             </span>
//             <SidebarTrigger className="ml-auto" />
//           </SidebarHeader>
//           <SidebarContent>
//             <UsageSummarySidebar />
//           </SidebarContent>
//         </Sidebar>

//         <div className="flex flex-1 flex-col min-w-0">
//           {/* Header */}
//           <header className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full">
//             <div className="flex items-center justify-between px-4 py-3 md:px-6 w-full">
//               {/* Navigation */}
//               <nav className="flex items-center gap-1">
//                 {navigation.map((item) => {
//                   const Icon = item.icon;
//                   const isActive = currentPage === item.id;
//                   return (
//                     <button
//                       key={item.id}
//                       onClick={() => onNavigate(item.id)}
//                       className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//                         isActive
//                           ? "bg-blue-50 text-blue-600"
//                           : "text-gray-600 hover:bg-gray-100"
//                       }`}
//                     >
//                       <Icon size={20} />
//                       <span>{item.name}</span>
//                     </button>
//                   );
//                 })}
//               </nav>

//               {/* User Menu */}
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   className="relative"
//                   onClick={onNotificationClick}
//                   aria-label="Notifications"
//                 >
//                   <Bell size={20} />
//                   {notificationCount > 0 && (
//                     <Badge
//                       variant="destructive"
//                       className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
//                     >
//                       {notificationCount}
//                     </Badge>
//                   )}
//                 </Button>

//                 <DropdownMenu>
//                   <DropdownMenuTrigger asChild>
//                     <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
//                       <Avatar className="h-8 w-8">
//                         <AvatarImage src={user?.avatar} alt={user?.name} />
//                         <AvatarFallback>
//                           {user?.name?.charAt(0) || "U"}
//                         </AvatarFallback>
//                       </Avatar>
//                       <span className="text-sm">{user?.name}</span>
//                     </button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-56">
//                     <DropdownMenuLabel>
//                       <div className="flex flex-col">
//                         <span>{user?.name}</span>
//                         <span className="text-xs text-gray-500">
//                           {user?.email}
//                         </span>
//                       </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={() => onNavigate("settings")}>
//                       <User className="mr-2 h-4 w-4" />
//                       Profile
//                     </DropdownMenuItem>
//                     <DropdownMenuItem onClick={() => onNavigate("settings")}>
//                       <Settings className="mr-2 h-4 w-4" />
//                       Settings
//                     </DropdownMenuItem>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem
//                       onClick={handleLogout}
//                       className="text-red-600"
//                     >
//                       <LogOut className="mr-2 h-4 w-4" />
//                       Logout
//                     </DropdownMenuItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>
//               </div>
//             </div>
//           </header>

//           {/* Main Content */}
//           <main className="flex-1 px-4 py-6 md:px-6 md:py-8 w-full max-w-[1800px] mx-auto">
//             {children}
//           </main>

//           {/* Footer */}
//           <footer className="border-t border-gray-200 bg-white py-6">
//             <div className="px-4 md:px-6">
//               <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//                 <div className="flex items-center gap-2 text-sm text-gray-600">
//                   <Zap className="w-4 h-4 text-blue-600" />
//                   <span>© 2024 Electricity Usage Tracker. All rights reserved.</span>
//                 </div>
//                 <div className="flex items-center gap-4 text-sm text-gray-600">
//                   <button className="hover:text-blue-600 transition-colors">
//                     Privacy Policy
//                   </button>
//                   <button className="hover:text-blue-600 transition-colors">
//                     Terms of Service
//                   </button>
//                   <button className="hover:text-blue-600 transition-colors">
//                     Contact
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </footer>
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// };

import React, { useState } from "react";
import {
  Home,
  BarChart3,
  CreditCard,
  Settings,
  Bell,
  LogOut,
  User,
  Zap,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "./ui/sidebar";
import { UsageSummarySidebar } from "./UsageSummarySidebar";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: "dashboard" | "reports" | "payments" | "settings";
  onNavigate: (page: "dashboard" | "reports" | "payments" | "settings") => void;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentPage,
  onNavigate,
  notificationCount = 0,
  onNotificationClick,
}) => {
  const { user, logout } = useAuth();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const navigation = [
    { id: "dashboard" as const, name: "Dashboard", icon: Home },
    { id: "reports" as const, name: "Reports", icon: BarChart3 },
    { id: "payments" as const, name: "Payments", icon: CreditCard },
    { id: "settings" as const, name: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-gray-50">
        {/* Sidebar */}
        <Sidebar variant="inset">
          <SidebarHeader className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              WattWise
            </span>
            <SidebarTrigger className="ml-auto" />
          </SidebarHeader>
          <SidebarContent>
            <UsageSummarySidebar />
          </SidebarContent>
        </Sidebar>

        <div className="flex flex-1 flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-white border-b border-gray-200 w-full">
            <div className="flex items-center justify-between px-4 py-3 md:px-6 w-full">
              {/* Navigation */}
              <nav className="flex items-center gap-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>

              {/* User Menu */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={onNotificationClick}
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {notificationCount}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback>
                          {user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user?.name}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span>{user?.name}</span>
                        <span className="text-xs text-gray-500">
                          {user?.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onNavigate("settings")}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onNavigate("settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 px-4 py-6 md:px-6 md:py-8 w-full max-w-[1800px] mx-auto">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-gray-200 bg-white py-6">
            <div className="px-4 md:px-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span>
                    © 2025 Electricity Usage Tracker. All rights reserved.
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button
                    className="hover:text-blue-600 transition-colors"
                    onClick={() => setShowPrivacy(true)}
                  >
                    Privacy Policy
                  </button>
                  <button
                    className="hover:text-blue-600 transition-colors"
                    onClick={() => setShowTerms(true)}
                  >
                    Terms of Service
                  </button>
                  <button
                    className="hover:text-blue-600 transition-colors"
                    onClick={() => setShowContact(true)}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>
              We respect your privacy. Your usage data is stored securely and is
              never shared with third parties without your consent. We collect
              only the information required to enhance your experience with the
              app.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Terms of Service Modal */}
      <Dialog open={showTerms} onOpenChange={setShowTerms}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogDescription>
              By using this application, you agree to follow our community
              guidelines. The app is provided "as is" without any warranties.
              Misuse or unauthorized distribution of the content is strictly
              prohibited.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription>
              For support or feedback, please contact us at:
              <br />
              <strong>Email:</strong> support@wattwise.com
              <br />
              <strong>Phone:</strong> +91 98765 43210
              <br />
              <strong>Address:</strong> 123 Energy Lane, Bengaluru, India
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};
