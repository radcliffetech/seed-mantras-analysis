import Footer from "./Footer";
import Header from "./Header";
import MainStage from "./MainStage";
import type { NavItem } from "../config/navConfig";
import Navbar from "./Navbar";

export default function Layout({ navItems }: { navItems: NavItem[] }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <aside className="w-64 bg-gray-100 p-4 border-r border-gray-300">
          <Navbar navItems={navItems} />
        </aside>
        <MainStage />
      </div>
      <Footer />
    </div>
  );
}
