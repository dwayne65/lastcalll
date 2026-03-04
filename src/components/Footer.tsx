import { Link } from "react-router-dom";
import { Youtube, Instagram, Facebook } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h3 className="text-2xl font-serif font-bold mb-3">
            Last Call <span className="text-gradient-gold">Messages</span>
          </h3>
          <p className="text-primary-foreground/70 max-w-sm leading-relaxed">
            A Seventh-day Adventist ministry dedicated to sharing the everlasting gospel
            and the three angels' messages with the world.
          </p>
        </div>
        <div>
          <h4 className="font-semibold font-sans text-sm uppercase tracking-widest text-gold mb-4">
            Explore
          </h4>
          <ul className="space-y-2">
            {["Sermons", "About", "Donate", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item.toLowerCase()}`}
                  className="text-primary-foreground/60 hover:text-gold-light transition-colors text-sm"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold font-sans text-sm uppercase tracking-widest text-gold mb-4">
            Connect
          </h4>
          <div className="flex gap-4">
            {[
              { icon: Youtube, label: "YouTube" },
              { icon: Instagram, label: "Instagram" },
              { icon: Facebook, label: "Facebook" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-gold/20 hover:text-gold transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
        <p className="text-primary-foreground/40 text-sm">
          © {new Date().getFullYear()} Last Call Messages. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
