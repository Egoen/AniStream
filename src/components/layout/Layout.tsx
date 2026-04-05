import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#0b0e11] text-[#f8f9fe]">
      <Navbar />
      <main className="pb-16 md:pb-0 min-h-screen">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
