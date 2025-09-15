import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Clock, Star, Settings, LogOut, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { loadOrders, StoredOrder } from '@/lib/orders';

interface Order {
  id: string;
  token: string;
  date: string;
  time: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'completed' | 'cancelled' | 'in-progress';
  canteen: string;
}

// Mock user data
const userData = {
  name: 'John Doe',
  email: 'john.doe@university.edu',
  phone: '+91 9876543210',
  totalOrders: 24,
  favoriteCanteen: 'Main Campus Cafeteria'
};

// Mock order history
const orderHistory: Order[] = [
  {
    id: '1',
    token: 'CE-20250912-4821',
    date: '2025-09-12',
    time: '2:30 PM',
    items: [
      { name: 'Chicken Biryani', quantity: 1, price: 120 },
      { name: 'Raita', quantity: 1, price: 30 }
    ],
    total: 170,
    status: 'completed',
    canteen: 'Main Campus Cafeteria'
  },
  {
    id: '2',
    token: 'CE-20250911-3547',
    date: '2025-09-11',
    time: '1:15 PM',
    items: [
      { name: 'Veg Thali', quantity: 1, price: 80 },
      { name: 'Lassi', quantity: 1, price: 25 }
    ],
    total: 125,
    status: 'completed',
    canteen: 'Main Campus Cafeteria'
  },
  {
    id: '3',
    token: 'CE-20250910-2193',
    date: '2025-09-10',
    time: '7:45 PM',
    items: [
      { name: 'Pav Bhaji', quantity: 2, price: 45 },
      { name: 'Vada Pav', quantity: 1, price: 25 }
    ],
    total: 115,
    status: 'completed',
    canteen: 'North Block Food Court'
  }
];

export default function Account() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [storedOrders, setStoredOrders] = useState<StoredOrder[]>([]);

  useEffect(() => {
    setStoredOrders(loadOrders());
  }, []);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      case 'in-progress':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      case 'in-progress':
        return 'In Progress';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-avatar.png" />
                <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-1">{userData.name}</h1>
                <p className="text-muted-foreground mb-3">{userData.email}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{userData.totalOrders}</div>
                    <div className="text-sm text-muted-foreground">Total Orders</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">₹2,450</div>
                    <div className="text-sm text-muted-foreground">Total Spent</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted/50 rounded-lg col-span-2 md:col-span-1">
                    <div className="text-sm font-medium text-primary truncate">
                      {userData.favoriteCanteen}
                    </div>
                    <div className="text-sm text-muted-foreground">Favorite Canteen</div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="default" size="sm" onClick={() => navigate('/')}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Place New Order
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4" />
              <span>Order History</span>
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center space-x-2">
              <Star className="h-4 w-4" />
              <span>Favorites</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Order History Tab */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Recent Orders</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stored Orders */}
                {storedOrders.map((order) => (
                  <div 
                    key={`stored-${order.id}`} 
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/order-tracking/${order.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="font-mono">
                            {order.id}
                          </Badge>
                          <Badge className="bg-success text-success-foreground">
                            Completed
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.canteen} • {order.date} at {order.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.total}</p>
                        <ArrowRight className="h-4 w-4 ml-auto mt-1 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-muted-foreground">
                          <span>{item.quantity}x {item.name}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {orderHistory.map((order) => (
                  <div 
                    key={order.id} 
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/order-tracking/${order.token}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline" className="font-mono">
                            {order.token}
                          </Badge>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.canteen} • {order.date} at {order.time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.total}</p>
                        <ArrowRight className="h-4 w-4 ml-auto mt-1 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-muted-foreground">
                          <span>{item.quantity}x {item.name}</span>
                          <span>₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {orderHistory.length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-semibold mb-2">No Orders Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start ordering delicious food from campus canteens!
                    </p>
                    <Button onClick={() => navigate('/')}>
                      Browse Canteens
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Favorite Items</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Star className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">No Favorites Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Mark your favorite dishes to quickly reorder them!
                  </p>
                  <Button onClick={() => navigate('/')}>
                    Discover Food
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <User className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="font-semibold mb-2">Profile Settings</h3>
                  <p className="text-muted-foreground mb-4">
                    Update your personal information and preferences
                  </p>
                  <Button variant="outline">
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}