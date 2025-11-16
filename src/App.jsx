import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";

import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import Account from "./pages/Account";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";
import AnimeDetail from "./pages/AnimeDetail";

function AnimeDetailPage(){
  const { useParams } = require("react-router-dom");
  const { id } = useParams();
  return <AnimeDetail id={id} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">

        <nav className="px-4 py-3 flex items-center justify-between bg-gray-800">
          <Link to="/home" className="font-bold text-xl">BLINIME</Link>

          <div className="flex items-center gap-4">
            <Link to="/home">Home</Link>
            <Link to="/account">Account</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/favorites">Favorites</Link>

            <SignedOut>
              <Link to="/login">
                <button className="bg-purple-600 px-3 py-1 rounded">Sign In</button>
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<SignIn routing="path" path="/login" />} />
          <Route path="/signup" element={<SignUp routing="path" path="/signup" />} />

          <Route path="/account" element={<Account />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Home from "./pages/Home";

import { SignIn, SignUp, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import Account from "./pages/Account";
import Watchlist from "./pages/Watchlist";
import Favorites from "./pages/Favorites";
import AnimeDetail from "./pages/AnimeDetail";

function AnimeDetailPage(){
  const { useParams } = require("react-router-dom");
  const { id } = useParams();
  return <AnimeDetail id={id} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">

        <nav className="px-4 py-3 flex items-center justify-between bg-gray-800">
          <Link to="/home" className="font-bold text-xl">BLINIME</Link>

          <div className="flex items-center gap-4">
            <Link to="/home">Home</Link>
            <Link to="/account">Account</Link>
            <Link to="/watchlist">Watchlist</Link>
            <Link to="/favorites">Favorites</Link>

            <SignedOut>
              <Link to="/login">
                <button className="bg-purple-600 px-3 py-1 rounded">Sign In</button>
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<SignIn routing="path" path="/login" />} />
          <Route path="/signup" element={<SignUp routing="path" path="/signup" />} />

          <Route path="/account" element={<Account />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/anime/:id" element={<AnimeDetailPage />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
      }
