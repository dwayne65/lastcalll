import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Sermons from "./pages/Sermons";
import SermonDetail from "./pages/SermonDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import SeriesDetail from "./pages/SeriesDetail";
import Resources from "./pages/Resources";
import Donate from "./pages/Donate";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import ContentManager from "./pages/admin/ContentManager";
import ContentEditor from "./pages/admin/ContentEditor";
import DonationLedger from "./pages/admin/DonationLedger";
import UserRoles from "./pages/admin/UserRoles";
import Settings from "./pages/admin/Settings";
import MediaLibrary from "./pages/admin/MediaLibrary";
import Subscribers from "./pages/admin/Subscribers";
import Inquiries from "./pages/admin/Inquiries";
import SeriesManager from "./pages/admin/SeriesManager";
import CategoriesManager from "./pages/admin/CategoriesManager";
import TagsManager from "./pages/admin/TagsManager";
import NotFound from "./pages/NotFound";
import Profile from "./pages/admin/Profile";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const CONTENT_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR", "CONTRIBUTOR"] as const;
const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"] as const;
const FINANCE_ROLES = ["SUPER_ADMIN", "ADMIN", "FINANCE"] as const;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/sermons/:slug" element={<SermonDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/series/:slug" element={<SeriesDetail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<Login />} />

            {/* Protected admin routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin/content" element={<ProtectedRoute requiredRoles={[...CONTENT_ROLES]}><ContentManager /></ProtectedRoute>} />
            <Route path="/admin/content/new" element={<ProtectedRoute requiredRoles={[...CONTENT_ROLES]}><ContentEditor /></ProtectedRoute>} />
            <Route path="/admin/content/:id" element={<ProtectedRoute requiredRoles={[...CONTENT_ROLES]}><ContentEditor /></ProtectedRoute>} />
            <Route path="/admin/media" element={<ProtectedRoute requiredRoles={[...CONTENT_ROLES]}><MediaLibrary /></ProtectedRoute>} />
            <Route path="/admin/series" element={<ProtectedRoute requiredRoles={[...CONTENT_ROLES]}><SeriesManager /></ProtectedRoute>} />
            <Route path="/admin/categories" element={<ProtectedRoute requiredRoles={[...CONTENT_ROLES]}><CategoriesManager /></ProtectedRoute>} />
            <Route path="/admin/tags" element={<ProtectedRoute requiredRoles={[...CONTENT_ROLES]}><TagsManager /></ProtectedRoute>} />
            <Route path="/admin/donations" element={<ProtectedRoute requiredRoles={[...FINANCE_ROLES]}><DonationLedger /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute requiredRoles={[...ADMIN_ROLES]}><UserRoles /></ProtectedRoute>} />
            <Route path="/admin/subscribers" element={<ProtectedRoute requiredRoles={[...ADMIN_ROLES]}><Subscribers /></ProtectedRoute>} />
            <Route path="/admin/inquiries" element={<ProtectedRoute requiredRoles={[...ADMIN_ROLES]}><Inquiries /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute requiredRoles={[...ADMIN_ROLES]}><Settings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
