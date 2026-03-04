import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import GlobalSearch from "@/components/GlobalSearch";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Sermons", path: "/sermons" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-primary-foreground/10">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif font-bold text-primary-foreground">
              Last Call <span className="text-gradient-gold">Messages</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-wide transition-colors ${
                  location.pathname === link.path
                    ? "text-gold"
                    : "text-primary-foreground/80 hover:text-gold-light"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-primary-foreground/70 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link to="/donate">
              <Button className="bg-gradient-gold text-primary font-semibold hover:opacity-90 transition-opacity gap-2">
                <Heart className="w-4 h-4" />
                Give
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className="text-primary-foreground p-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-primary-foreground p-2"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-primary border-t border-primary-foreground/10"
            >
              <div className="container py-6 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-medium py-2 ${
                      location.pathname === link.path
                        ? "text-gold"
                        : "text-primary-foreground/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link to="/donate" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full bg-gradient-gold text-primary font-semibold gap-2 mt-2">
                    <Heart className="w-4 h-4" />
                    Give
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AnimatePresence>
        {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
