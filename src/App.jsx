// Version 0.0.2 - Latest deployment
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./assets/pages/Home";
import About from "./assets/pages/About";
import SignIn from "./assets/pages/SignIn";
import SignUp from "./assets/pages/SignUp";
import Profile from "./assets/pages/Profile";
import Header from "./assets/components/Header";
import PrivateRoute from "./assets/components/PrivateRoute";
import CreateListing from "./assets/pages/CreateListing";
import UpdateListing from "./assets/pages/UpdateListing";
import Listing from "./assets/pages/Listing";
import Search from "./assets/pages/Search";
import Blog from "./assets/pages/Blog";
import BlogPost from "./assets/pages/BlogPost";
import Services from "./assets/pages/Services";
import WordPressPage from "./assets/pages/WordPressPage";
import PropertyDetail from "./assets/pages/PropertyDetail";
import Properties from "./assets/pages/Properties";
import IslandProperties from "./assets/pages/IslandProperties"; // Added import statement
import Footer from "./assets/components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {/* Static Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/services" element={<Services />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/:islandSlug" element={<IslandProperties />} />
        <Route path="/property/:propertyId" element={<PropertyDetail />} />
        <Route path="/properties" element={<Properties />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>

        {/* WordPress Content Routes */}
        <Route path="/page/:slug" element={<WordPressPage />} /> {/* WordPress Pages */}
        <Route path="/:slug" element={<BlogPost />} /> {/* WordPress Posts */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
