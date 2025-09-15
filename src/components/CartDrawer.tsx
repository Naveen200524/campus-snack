import { X, Plus, Minus, ShoppingBag, CreditCard, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { addOrder, StoredOrder } from '@/lib/orders';

export default function CartDrawer() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [placing, setPlacing] = useState(false);

  const handleCheckout = () => {
    dispatch({ type: 'CLOSE_CART' });
    navigate('/checkout');
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  };

  const handlePlaceOrder = async () => {
    if (state.items.length === 0 || placing) return;
    try {
      setPlacing(true);
      // Create a local order immediately and show it in the dashboard
      const now = new Date();
      const yyyymmdd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
      const rand = Math.floor(1000 + Math.random() * 9000);
      const orderId = `CE-${yyyymmdd}-${rand}`;

      const items = state.items.map(i => ({
        id: i.id,
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        image: i.image,
        canteenName: i.canteenName,
      }));

      const total = state.total ?? items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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

      toast({ title: 'Order placed successfully', description: `Order ${orderId} added to your dashboard.` });

      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'CLOSE_CART' });

      // Navigate directly to dashboard (profile) so user sees the order immediately
      navigate('/profile');
    } catch (e) {
      toast({ title: 'Order failed', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setPlacing(false);
    }
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={() => dispatch({ type: 'CLOSE_CART' })}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <Badge variant="secondary">
              {state.items.reduce((total, item) => total + item.quantity, 0)} items
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {state.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground text-sm">
                Add some delicious items from our canteens!
              </p>
            </div>
          ) : (
            <>
              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {state.items.map((item) => (
                  <Card key={item.id} className="shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            from {item.canteenName}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </span>
                            <div className="flex items-center space-x-2 bg-muted rounded-full p-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 rounded-full p-0"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium px-2">
                                {item.quantity}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 rounded-full p-0"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₹{state.total.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{state.total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button 
                    variant="outline"
                    onClick={handleCheckout}
                    disabled={state.items.length === 0}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Checkout
                  </Button>
                  <Button 
                    className="btn-hero"
                    onClick={handlePlaceOrder}
                    disabled={state.items.length === 0 || placing}
                  >
                    {placing ? (
                      <span className="inline-flex items-center">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Placing...
                      </span>
                    ) : (
                      <><Check className="h-4 w-4 mr-2" />Order</>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}