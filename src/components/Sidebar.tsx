import React from "react";
import { Users, FileText, Bookmark, Menu, X } from "lucide-react";
import KemenagLogo from "./KemenagLogo";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  const menuItems = [
    { id: "pegawai", label: "Data Pegawai", icon: Users },
    { id: "sppd", label: "Buat & Cetak SPPD", icon: FileText },
    { id: "referensi", label: "Referensi Pejabat", icon: Bookmark },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="flex items-center justify-between bg-[#1B3022] px-4 py-3 text-white md:hidden shadow-md">
        <div className="flex items-center gap-3">
          <KemenagLogo size={36} className="shrink-0" />
          <div>
            <h1 className="text-xs font-bold tracking-tight text-[#E0E7E1]">KEMENTERIAN AGAMA</h1>
            <p className="text-[10px] text-[#BFA07A] font-semibold">KOTA PALOPO</p>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-1.5 hover:bg-[#2A4533] transition"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-[#1B3022] text-[#E0E7E1] transition-transform duration-300 ease-in-out md:static md:translate-x-0 flex flex-col justify-between border-r border-[#2A4533] shadow-xl ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col flex-1 py-6">
          {/* Sidebar Header Brand with Logo */}
          <div className="p-8 flex items-center gap-3 border-b border-[#2A4533]">
            <KemenagLogo size={40} className="shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] tracking-widest uppercase opacity-70">Kementerian Agama</span>
              <span className="font-bold text-sm tracking-tight text-white">KOTA PALOPO</span>
            </div>
          </div>

          <div className="px-6 py-4.5 mt-4">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#BFA07A]">Sistem SPPD Digital</div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 px-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`group flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-[#BFA07A] text-white font-medium shadow-md"
                      : "text-[#E0E7E1] hover:bg-[#2A4533] hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-white" : "text-[#E0E7E1] opacity-70 group-hover:opacity-100"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-6 bg-[#15261B] text-[10px] uppercase tracking-widest text-[#E0E7E1]/40 text-center border-t border-[#2A4533]">
          Versi 2.4.0 &copy; 2026
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-xs md:hidden"
        />
      )}
    </>
  );
}
