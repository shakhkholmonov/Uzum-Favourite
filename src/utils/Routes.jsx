import { Route, Routes } from "react-router-dom";
import Home from "../App";
import Favorites from "../pages/Favorites.Page/Favorites";

function RoutesPage() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/favorites" element={<Favorites />} />
    </Routes>
  );
}

export default RoutesPage;
