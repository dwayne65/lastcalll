import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Sermons from "./pages/Sermons";
import SermonDetail from "./pages/SermonDetail";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManager from "./pages/admin/ContentManager";
import ContentEditor from "./pages/admin/ContentEditor";
import DonationLedger from "./pages/admin/DonationLedger";
import UserRoles from "./pages/admin/UserRoles";
import Settings from "./pages/admin/Settings";
import MediaLibrary from "./pages/admin/MediaLibrary";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/sermons/:slug" element={<SermonDetail />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/content" element={<ContentManager />} />
          <Route path="/admin/content/new" element={<ContentEditor />} />
          <Route path="/admin/content/:id" element={<ContentEditor />} />
          <Route path="/admin/media" element={<MediaLibrary />} />
          <Route path="/admin/donations" element={<DonationLedger />} />
          <Route path="/admin/users" element={<UserRoles />} />
          <Route path="/admin/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
