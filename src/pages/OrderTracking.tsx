import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface OrderStatus {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
  timestamp?: string;
}

export default function OrderTracking() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [estimatedTime, setEstimatedTime] = useState(18);

  // Simulate order progress
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < 4) {
          return prev + 1;
        }
        return prev;
      });
      
      setEstimatedTime(prev => Math.max(0, prev - 1));
    }, 5000); // Update every 5 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const orderStatuses: OrderStatus[] = [
    {
      id: '1',
      label: 'Order Placed',
      description: 'Your order has been received and confirmed',
      icon: <CheckCircle className="h-5 w-5" />,
      completed: currentStep >= 1,
      active: currentStep === 1,
      timestamp: '2:30 PM'
    },
    {
      id: '2',
      label: 'Order Accepted',
      description: 'Restaurant is preparing your delicious meal',
      icon: <Package className="h-5 w-5" />,
      completed: currentStep >= 2,
      active: currentStep === 2,
      timestamp: currentStep >= 2 ? '2:32 PM' : undefined
    },
    {
      id: '3',
      label: 'Preparing',
      description: 'Your food is being freshly prepared',
      icon: <Clock className="h-5 w-5" />,
      completed: currentStep >= 3,
      active: currentStep === 3,
      timestamp: currentStep >= 3 ? '2:38 PM' : undefined
    },
    {
      id: '4',
      label: 'Ready',
      description: 'Your order is ready!',
      icon: <CheckCircle className="h-5 w-5" />,
      completed: currentStep >= 4,
      active: currentStep === 4,
      timestamp: currentStep >= 4 ? '2:48 PM' : undefined
    }
  ];

  const progressPercentage = (currentStep / orderStatuses.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-muted-foreground">Order Token:</span>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {orderId}
            </Badge>
          </div>
          
          {estimatedTime > 0 && (
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Estimated time: {estimatedTime} minutes</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium">Order Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}% Complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardContent>
        </Card>

        {/* Order Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Order Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {orderStatuses.map((status, index) => (
                <div key={status.id} className="flex items-start space-x-4">
                  <div className={`
                    flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 
                    ${status.completed 
                      ? 'bg-primary border-primary text-white' 
                      : status.active
                        ? 'bg-primary/10 border-primary text-primary animate-pulse'
                        : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                    }
                  `}>
                    {status.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-medium ${status.active ? 'text-primary' : ''}`}>
                        {status.label}
                      </h3>
                      {status.timestamp && (
                        <span className="text-sm text-muted-foreground">
                          {status.timestamp}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {status.description}
                    </p>
                    
                    {status.active && (
                      <div className="mt-2">
                        <Badge variant="secondary" className="animate-pulse">
                          In Progress
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  {index < orderStatuses.length - 1 && (
                    <div className={`
                      absolute left-5 mt-10 w-0.5 h-6 
                      ${status.completed ? 'bg-primary' : 'bg-muted'}
                    `} />
                  )}
                </div>
              ))}
            </div>

            {currentStep >= 4 && (
              <div className="mt-8 p-4 bg-success/10 rounded-lg border border-success/20">
                <div className="flex items-center space-x-2 text-success font-medium mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Order Ready!</span>
                </div>
                <p className="text-sm text-muted-foreground">Your order is ready.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/profile')}
          >
            View Order History
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            className="btn-hero"
          >
            Order More Food
          </Button>
        </div>
      </div>
    </div>
  );
}