import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { addOrder, StoredOrder } from '@/lib/orders';
import { useCart } from '@/context/CartContext';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { state } = useCart();

  const estimatedTime = '20-25 minutes';

  const handleConfirm = () => {
    if (!orderId) return;
    // Build a StoredOrder from the current cart snapshot we had when navigating here.
    // If cart was cleared earlier, this will store an empty item list, which is acceptable as a demo.
    const items = state.items.map(i => ({
      id: i.id,
      name: i.name,
      quantity: i.quantity,
      price: i.price,
      image: i.image,
      canteenName: i.canteenName,
    }));
    const total = state.total;
    const now = new Date();
    const stored: StoredOrder = {
      id: orderId,
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString(),
      items,
      total,
      status: 'completed',
      canteen: items[0]?.canteenName || 'Campus Canteen',
    };
    addOrder(stored);
    navigate('/profile');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-success animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground text-lg">
            Your delicious meal is being prepared
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="shadow-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <span>Order Token</span>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {orderId}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Estimated Time</p>
                  <p className="text-sm text-muted-foreground">{estimatedTime}</p>
                </div>
              </div>
              
            </div>

            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Keep this token handy for order verification
              </p>
              <p className="font-mono text-2xl font-bold text-primary">
                {orderId}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="btn-hero"
            onClick={() => navigate(`/order-tracking/${orderId}`)}
          >
            Track Your Order
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button 
            variant="default" 
            size="lg"
            onClick={handleConfirm}
          >
            Confirm & View in Account
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/')}
          >
            Order More Food
          </Button>
        </div>

        {/* Thank You Message */}
        <div className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg">
          <h3 className="font-semibold mb-2">Thank you for choosing Campus Eats!</h3>
          <p className="text-sm text-muted-foreground">
            We'll notify you as your order progresses. You can track your order status anytime.
          </p>
        </div>
      </div>
    </div>
  );
}