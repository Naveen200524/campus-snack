import { ArrowRight, Clock, Star, Users } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CanteenCardProps {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  preparationTime: string;
  isOpen: boolean;
  totalOrders: number;
  onClick: () => void;
}

export default function CanteenCard({
  name,
  description,
  image,
  rating,
  preparationTime,
  isOpen,
  totalOrders,
  onClick
}: CanteenCardProps) {
  return (
    <Card className="card-hover cursor-pointer group" onClick={onClick}>
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={isOpen ? "default" : "secondary"} className="shadow-sm">
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-white/90 text-foreground">
            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
            {rating}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{preparationTime}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{totalOrders}+ orders</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full group-hover:shadow-primary transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          View Menu
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
}