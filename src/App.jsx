import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './layout/Layout/Layout'
import { HomePage } from './pages/HomePage/HomePage'
import { CatalogPage } from './pages/CatalogPage/CatalogPage'
import { CamperDetailsPage } from './pages/CamperDetailsPage/CamperDetailsPage'
import { FavouritesPage } from './pages/FavouritesPage/FavouritesPage'
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:id" element={<CamperDetailsPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}
