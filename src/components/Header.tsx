import { ShoppingCart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Header() {
  const { state, dispatch } = useCart();
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const { user, signInWithEmail, signOut } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">CE</span>
          </div>
          <span className="text-xl font-bold text-foreground">Campus Eats</span>
        </div>

        {/* Search removed as requested */}

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Auth / Account */}
          {user ? (
            <div className="hidden sm:flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                <Avatar className="h-5 w-5 mr-2">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>{user.name?.[0] ?? 'U'}</AvatarFallback>
                </Avatar>
                {user.name}
              </Button>
              <Button variant="outline" size="sm" onClick={signOut}>Logout</Button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              {showLogin ? (
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  const success = await signInWithEmail(email, password);
                  if (success) {
                    setShowLogin(false);
                    setEmail('');
                    setPassword('');
                    setLoginError('');
                  } else {
                    setLoginError('Invalid email or password');
                  }
                }} className="flex items-center space-x-2">
                  <div>
                    <Label htmlFor="email" className="sr-only">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="sr-only">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-32"
                    />
                  </div>
                  <Button type="submit" size="sm">Login</Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowLogin(false)}>Cancel</Button>
                  {loginError && <span className="text-red-500 text-sm">{loginError}</span>}
                </form>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setShowLogin(true)}>
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              )}
            </div>
          )}

          {/* Cart Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
          >
            <ShoppingCart className="h-4 w-4" />
            {itemCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}