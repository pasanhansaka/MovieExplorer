import { createBrowserRouter } from 'react-router-dom'
import { Layout } from '../components/layout/Layout.tsx'
import { HomePage } from '../pages/HomePage.tsx'
import { SearchPage } from '../pages/SearchPage.tsx'
import { MovieDetailsPage } from '../pages/MovieDetailsPage.tsx'
import { FavoritesPage } from '../pages/FavoritesPage.tsx'
import { LoginPage } from '../pages/LoginPage.tsx'
import { SignupPage } from '../pages/SignupPage.tsx'
import { NotFoundPage } from '../pages/NotFoundPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'search',
        element: <SearchPage />,
      },
      {
        path: 'movie/:movieId',
        element: <MovieDetailsPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'signup',
        element: <SignupPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
