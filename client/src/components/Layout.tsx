import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  ChartBarIcon, 
  Box, 
  TruckIcon, 
  UsersIcon, 
  ShoppingCartIcon,
  Underline,
  Settings as SettingsIcon
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: ChartBarIcon },
  { name: 'Bricks Inventory', href: '/inventory', icon: Box },
  { name: 'Tractors', href: '/tractors', icon: TruckIcon },
  { name: 'Labor Management', href: '/labor', icon: UsersIcon },
  { name: 'Orders', href: '/orders', icon: ShoppingCartIcon },
  { name: 'Invoices', href: '/invoices', icon: Underline },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brick-muted to-white">
      {/* Top Navigation */}
      <header className="bg-white/90 backdrop-blur-sm shadow-brick-lg border-b border-brick-light">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-brick rounded-xl flex items-center justify-center shadow-brick">
                <Box className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-brick-dark" data-testid="app-title">BrickFlow</h1>
              </div>
            </div>

            {/* Navigation Buttons */}
            <nav className="flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href || 
                  (item.href !== '/' && location.startsWith(item.href));

                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 hover-lift ${
                      isActive 
                        ? 'text-white bg-brick-primary shadow-brick' 
                        : 'text-brick-dark/70 hover:text-brick-primary hover:bg-brick-accent/50'
                    }`}
                    data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Icon className={`h-4 w-4 mr-2 transition-transform duration-300 ${
                      isActive ? 'scale-110' : 'hover:scale-105'
                    }`} />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 animate-fade-in">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}