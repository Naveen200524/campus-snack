import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const estimatedTime = Math.floor(Math.random() * (25 - 10 + 1)) + 10;

  return (
    <div className="container mx-auto py-8 text-center">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle className="flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
            <span className="text-2xl">Order Placed Successfully!</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-2">Thank you for your order.</p>
          <p className="text-muted-foreground mb-4">
            Your order is being prepared and will be ready in approximately{" "}
            <span className="font-bold">{estimatedTime} minutes</span>.
          </p>
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Your order token number is:</p>
            <p className="text-2xl font-bold tracking-wider">{orderId}</p>
          </div>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link to="/profile">View My Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
