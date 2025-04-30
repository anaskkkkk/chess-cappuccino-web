
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-chess-dark border-b border-[rgba(255,255,255,0.12)] py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="font-bold text-2xl text-chess-text-light">Smart<span className="text-chess-accent">Chess</span></div>
        </Link>
        
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-chess-text-light hover:text-chess-accent">Store</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/store"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-chess-accent p-6 no-underline outline-none focus:shadow-md"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium text-chess-text-light">
                            SmartChess Store
                          </div>
                          <p className="text-sm leading-tight text-chess-text-light/90">
                            Explore our innovative chess products and accessories
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem to="/smart-board" title="Smart Board">
                      Our flagship electronic chess board with online connectivity
                    </ListItem>
                    <ListItem to="/accessories" title="Accessories">
                      Enhance your chess experience with premium accessories
                    </ListItem>
                    <ListItem to="/gift-cards" title="Gift Cards">
                      The perfect gift for chess enthusiasts
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-chess-text-light hover:text-chess-accent">Learn</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    <ListItem to="/learn" title="Learning Center">
                      Everything you need to improve your chess skills
                    </ListItem>
                    <ListItem to="/courses" title="Courses">
                      Structured lessons from beginner to master
                    </ListItem>
                    <ListItem to="/puzzles" title="Puzzles">
                      Sharpen your tactical skills with thousands of puzzles
                    </ListItem>
                    <ListItem to="/faq" title="FAQ">
                      Find answers to common questions about our products and services
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/play" className="text-chess-text-light hover:text-chess-accent transition-colors inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium">
                  Play
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/community" className="text-chess-text-light hover:text-chess-accent transition-colors inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium">
                  Community
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:text-chess-text-light">
            Log In
          </Button>
          <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90">
            Sign Up
          </Button>
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu className="h-6 w-6 text-chess-text-light" />
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-chess-dark border-t border-[rgba(255,255,255,0.12)] mt-4">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-4">
              <div>
                <div className="text-chess-accent font-medium mb-2">Store</div>
                <ul className="space-y-2 pl-4">
                  <li><Link to="/store" className="text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>All Products</Link></li>
                  <li><Link to="/smart-board" className="text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Smart Board</Link></li>
                  <li><Link to="/accessories" className="text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Accessories</Link></li>
                  <li><Link to="/gift-cards" className="text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Gift Cards</Link></li>
                </ul>
              </div>
              
              <div>
                <div className="text-chess-accent font-medium mb-2">Learn</div>
                <ul className="space-y-2 pl-4">
                  <li><Link to="/learn" className="text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Learning Center</Link></li>
                  <li><Link to="/courses" className="text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Courses</Link></li>
                  <li><Link to="/puzzles" className="text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Puzzles</Link></li>
                  <li><Link to="/faq" className="text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>FAQ</Link></li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <Link to="/play" className="block text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Play</Link>
                <Link to="/community" className="block text-chess-text-light hover:text-chess-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Community</Link>
              </div>
              
              <div className="pt-4 flex flex-col space-y-3">
                <Button variant="outline" className="border-chess-accent text-chess-accent hover:bg-chess-accent hover:text-chess-text-light w-full">
                  Log In
                </Button>
                <Button className="bg-chess-accent text-chess-text-light hover:bg-opacity-90 w-full">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { to: string, title: string }
>(({ className, title, children, to, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-chess-text-dark">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-gray-700">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Navbar;
