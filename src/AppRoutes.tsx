import { createBrowserRouter, RouterProvider } from 'react-router';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ServiceDetails from './pages/ServiceDetails';


const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // Header as layout
    children: [
      {
        index: true,
        element: <Home />,
        handle: { name: 'home' },
      },
      {
        path: 'service/:slug',
        element: <ServiceDetails />,
        handle: { name: 'service-details' },
      },
    ],
  },
]);

function AppRoutes() {
  return <RouterProvider router={router} />;
}

export default AppRoutes;
