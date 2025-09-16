import { useState, useEffect } from 'react';
import { Search, Utensils, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CanteenCard from '@/components/CanteenCard';
import { useNavigate } from 'react-router-dom';

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

// Fetch from backend API

export default function Home() {
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCanteens, setFilteredCanteens] = useState<Canteen[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load canteens from simple backend API
    (async () => {
      try {
        const res = await fetch('http://localhost:3000/api/canteens');
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        // Ensure data is an array
        const canteensData = Array.isArray(data) ? data : [];
        setCanteens(canteensData);
        setFilteredCanteens(canteensData);
      } catch (e) {
        console.error('Failed to load canteens:', e);
        // Set empty arrays as fallback
        setCanteens([]);
        setFilteredCanteens([]);
      }
    })();
  }, []);

  useEffect(() => {
    // Ensure canteens is an array before filtering
    if (!Array.isArray(canteens)) {
      setFilteredCanteens([]);
      return;
    }

    const filtered = canteens.filter(canteen =>
      canteen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      canteen.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCanteens(filtered);
  }, [searchTerm, canteens]);

  const handleCanteenClick = (slug: string) => {
    navigate(`/canteen/${slug}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              Delicious Campus Food,
              <span className="text-primary"> Ready Quickly</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 text-balance">
              Order from your favorite campus canteens and get fresh, hot meals prepared fast.
            </p>
            
            {/* Hero Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input 
                  placeholder="Search canteens, food items..." 
                  className="pl-12 py-3 text-lg shadow-card"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="btn-hero px-8">
                <Utensils className="h-5 w-5 mr-2" />
                Browse Canteens
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Canteens Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Campus Canteens</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from our diverse range of dining options across campus
            </p>
          </div>

          {!Array.isArray(filteredCanteens) || filteredCanteens.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No canteens found matching "{searchTerm}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCanteens.map((canteen) => (
                <CanteenCard
                  key={canteen.id}
                  {...canteen}
                  onClick={() => handleCanteenClick(canteen.slug)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Campus Eats?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Utensils className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fresh & Quality</h3>
              <p className="text-muted-foreground">
                All meals prepared fresh daily with high-quality ingredients from trusted suppliers.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Ready on Time</h3>
              <p className="text-muted-foreground">
                Quick preparation across campus locations. Most orders ready in 15-20 minutes.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Ordering</h3>
              <p className="text-muted-foreground">
                Simple, intuitive interface. Browse menus, customize orders, and track your order.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}