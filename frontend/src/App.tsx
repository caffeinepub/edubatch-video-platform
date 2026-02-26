import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from '@/components/ui/sonner';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import CategoryPage from './pages/CategoryPage';
import VideoPlayerPage from './pages/VideoPlayerPage';
import AdminDashboard from './pages/AdminDashboard';

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <NavigationBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Home,
});

const categoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/category/$category',
  component: CategoryPage,
});

const videoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/video/$id',
  component: VideoPlayerPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const routeTree = rootRoute.addChildren([homeRoute, categoryRoute, videoRoute, adminRoute]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
