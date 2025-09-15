import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Clock, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { MenuItem } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface Canteen {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  preparationTime: string;
  isOpen: boolean;
  totalOrders: number;
  slug: string;
}

// Data is fetched from backend API by slug

export default function CanteenPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [canteenData, setCanteenData] = useState<{ canteen: Canteen; menu: MenuItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (!slug) return;
        
        // Fetch canteen data from API
        const response = await fetch(`/api/canteens/${slug}`);

        if (!response.ok) {
          throw new Error('Failed to load canteen data');
        }

        const data = await response.json();
        setCanteenData(data);
      } catch (e) {
        console.error('Failed to load canteen', e);
        setCanteenData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const addToCart = (item: MenuItem) => {
    const cartItem = {
      ...item,
      canteenId: canteen.id,
      canteenName: canteen.name,
    };
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!canteenData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Canteen Not Found</h1>
        <p className="text-muted-foreground mb-4">The canteen you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  const { canteen, menu } = canteenData;

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Canteens
        </Button>
      </div>

      {/* Canteen Header */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={canteen.image} 
          alt={canteen.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">{canteen.name}</h1>
            <p className="text-lg mb-4 opacity-90">{canteen.description}</p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{canteen.rating}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{canteen.preparationTime}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{canteen.totalOrders}+ orders</span>
              </div>
              <Badge variant={canteen.isOpen ? "default" : "secondary"}>
                {canteen.isOpen ? "Open" : "Closed"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        
        {menu.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No menu items available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menu.map((item) => (
              <Card key={item.id} className="card-hover group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">
                      ₹{item.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="btn-hero"
                      onClick={() => addToCart(item)}
                      disabled={!canteen.isOpen}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}