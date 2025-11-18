// ===========================
// App.js - Routing principal
// ===========================


import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';


// 📄 Pages publiques
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Menu from './pages/Menu';
import Testimonials from './pages/Testimonials';
import Login from './pages/Login1.jsx';
import Reservation from './pages/Reservation1.jsx';
import Chefs from './pages/Chefs';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite.jsx';
import MentionsLegales from './pages/MentionsLegales.jsx';
import CGUCGV from './pages/CGUCGV';
import RegistreRGPD from './pages/RegistreRGPD.jsx';


// 🔐 Dashboards (admin + employés)
import DashboardAdmin from './pages/DashboardAdmin.jsx';
import GestionEmployes from './pages/GestionEmployes.jsx';
import GestionPlats from './pages/GestionPlats.jsx';
import DashboardEmploye from './pages/DashboardEmploye.jsx';
import GestionAvis from './pages/GestionAvis';
import GestionReservations from './pages/GestionReservations';
import GestionMessages from './pages/GestionMessages';
import ModifierContenuSite from './pages/ModifierContenuSite';
import StatistiquesChefs from './pages/StatistiquesChefs.jsx';
import StatistiquesParChef from './pages/StatistiquesParChef.jsx';
import StatistiquesReservations from './pages/StatistiquesReservations';


// 📦 Composants globaux
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BoutonRetour from './components/BoutonRetour.jsx';
import CookieBanner from './components/CookieBanner.jsx';


// 🔐 Auth context & route protégée
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


// ❗ Page 404
const NotFound = () => (
  <div role="alert" style={{ padding: '2rem' }}>
    <h1>404 - Page non trouvée</h1>
  </div>
);


function App() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();


  // ✅ Redirection unique après login
  useEffect(() => {
    if (!token || !user?.role) return;


    // Si on est déjà sur la bonne page, on ne redirige pas
    if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/employe')) {
      return;
    }


    switch (user.role) {
      case 'admin':
        navigate('/admin/dashboard', { replace: true });
        break;
      case 'maitre_hotel':
      case 'chef_cuisine':
      case 'gestionnaire_contenu':
      case 'responsable_salle':
        navigate('/employe/dashboard', { replace: true });
        break;
      default:
        navigate('/', { replace: true });
    }
  }, [token, user, navigate, location.pathname]);


  return (
    <>
      <Header />
      <ScrollToTop />


      <main style={{ minHeight: '80vh' }} role="main">
        {!(location.pathname === '/' || location.pathname === '/Home') && (
          <BoutonRetour />
        )}


        <Routes>
          {/* 🌐 Pages publiques */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/chefs" element={<Chefs />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/avis" element={<Testimonials />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgu-cgv" element={<CGUCGV />} />
          <Route path="/registre-rgpd" element={<RegistreRGPD />} />


          {/* 🔐 Employés */}
          <Route path="/employe/dashboard" element={
            <ProtectedRoute><DashboardEmploye /></ProtectedRoute>
          } />


          {/* 🔐 Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><DashboardAdmin /></ProtectedRoute>
          } />
          <Route path="/admin/employes" element={
            <ProtectedRoute><GestionEmployes /></ProtectedRoute>
          } />
          <Route path="/admin/plats" element={
            <ProtectedRoute><GestionPlats /></ProtectedRoute>
          } />
          <Route path="/admin/avis" element={
            <ProtectedRoute><GestionAvis /></ProtectedRoute>
          } />
          <Route path="/admin/reservations" element={
            <ProtectedRoute><GestionReservations /></ProtectedRoute>
          } />
          <Route path="/admin/messages" element={
            <ProtectedRoute><GestionMessages /></ProtectedRoute>
          } />
          <Route path="/admin/contenu-site" element={
            <ProtectedRoute><ModifierContenuSite /></ProtectedRoute>
          } />
          <Route path="/admin/statistiques" element={
            <ProtectedRoute><StatistiquesChefs /></ProtectedRoute>
          } />
          <Route path="/admin/statistiques-par-chef" element={
            <ProtectedRoute><StatistiquesParChef /></ProtectedRoute>
          } />
          <Route path="/admin/statistiques-reservations" element={
            <ProtectedRoute><StatistiquesReservations /></ProtectedRoute>
          } />


          {/* 🧯 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>


      <CookieBanner />
      <Footer />
    </>
  );
}


export default App;

