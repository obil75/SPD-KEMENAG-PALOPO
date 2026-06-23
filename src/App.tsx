import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Sidebar from "./components/Sidebar";
import PegawaiManager from "./components/PegawaiManager";
import ReferensiManager from "./components/ReferensiManager";
import SppdForm from "./components/SppdForm";
import SppdList from "./components/SppdList";
import SppdPrintReceipt from "./components/SppdPrintReceipt";

import { Pegawai, Referensi, Sppd } from "./types";
import { INITIAL_PEGAWAI, INITIAL_REFERENSI, INITIAL_SPPD } from "./data";
import { RefreshCw, Database } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("sppd");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Core database states
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
  const [referensi, setReferensi] = useState<Referensi>({
    kepalaKantor: { nama: "", nip: "", unitKerja: "" },
    ppkList: [],
  });
  const [sppdS, setSppdS] = useState<Sppd[]>([]);

  // Workflow states
  const [currentEditSppd, setCurrentEditSppd] = useState<Sppd | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [activePrintSppd, setActivePrintSppd] = useState<Sppd | null>(null);

  // 1. Initial Load of Database from LocalStorage
  useEffect(() => {
    const storedPegawai = localStorage.getItem("kemenag_pegawai");
    const storedReferensi = localStorage.getItem("kemenag_referensi");
    const storedSppd = localStorage.getItem("kemenag_sppd");

    if (storedPegawai) {
      let parsed = JSON.parse(storedPegawai);
      let migrated = false;
      parsed = parsed.map((p: any) => {
        if (p.nama === "HARDIANTI RAHIM SAKTI, S.E.") { p.nama = "Hardianti Rahim Sakti, S.E."; migrated = true; }
        if (p.nama === "SUDIRMAN, S.Ag.") { p.nama = "Sudirman, S.Ag."; migrated = true; }
        if (p.nama === "NURHIDAYAH, S.Pd.I.") { p.nama = "Nurhidayah, S.Pd.I."; migrated = true; }
        if (p.nama === "HASANUDDIN, S.Th.I.") { p.nama = "Hasanuddin, S.Th.I."; migrated = true; }
        return p;
      });
      setPegawai(parsed);
      if (migrated) {
        localStorage.setItem("kemenag_pegawai", JSON.stringify(parsed));
      }
    } else {
      setPegawai(INITIAL_PEGAWAI);
      localStorage.setItem("kemenag_pegawai", JSON.stringify(INITIAL_PEGAWAI));
    }

    if (storedReferensi) {
      let parsed = JSON.parse(storedReferensi);
      let migrated = false;
      if (parsed.kepalaKantor && parsed.kepalaKantor.nama === "Dr. H. M. RUSYDI HASYIM, M.Ag") {
        parsed.kepalaKantor.nama = "Dr. H. M. Rusydi Hasyim, M.Ag";
        migrated = true;
      }
      setReferensi(parsed);
      if (migrated) {
        localStorage.setItem("kemenag_referensi", JSON.stringify(parsed));
      }
    } else {
      setReferensi(INITIAL_REFERENSI);
      localStorage.setItem("kemenag_referensi", JSON.stringify(INITIAL_REFERENSI));
    }

    if (storedSppd) {
      let parsed = JSON.parse(storedSppd);
      let migrated = false;
      parsed = parsed.map((s: any) => {
        if (s.namaPegawai === "HARDIANTI RAHIM SAKTI, S.E.") { s.namaPegawai = "Hardianti Rahim Sakti, S.E."; migrated = true; }
        if (s.kepalaKantorNama === "Dr. H. M. RUSYDI HASYIM, M.Ag") { s.kepalaKantorNama = "Dr. H. M. Rusydi Hasyim, M.Ag"; migrated = true; }
        if (s.ppkNama === "Drs. H. AHMAD PATTOLA, M.Pd") { s.ppkNama = "Drs. H. Ahmad Pattola, M.Pd"; migrated = true; }
        if (s.lembarKe === "I") { s.lembarKe = "I / II / III / IV"; migrated = true; }
        return s;
      });
      setSppdS(parsed);
      if (migrated) {
        localStorage.setItem("kemenag_sppd", JSON.stringify(parsed));
      }
    } else {
      setSppdS(INITIAL_SPPD);
      localStorage.setItem("kemenag_sppd", JSON.stringify(INITIAL_SPPD));
    }
  }, []);

  // 2. Autosave Updates to LocalStorage When States Change
  useEffect(() => {
    if (pegawai.length > 0) {
      localStorage.setItem("kemenag_pegawai", JSON.stringify(pegawai));
    }
  }, [pegawai]);

  useEffect(() => {
    if (referensi.ppkList.length > 0) {
      localStorage.setItem("kemenag_referensi", JSON.stringify(referensi));
    }
  }, [referensi]);

  useEffect(() => {
    if (sppdS.length > 0) {
      localStorage.setItem("kemenag_sppd", JSON.stringify(sppdS));
    }
  }, [sppdS]);

  // SPPD CRUD triggers
  const handleSaveSppd = (savedSppd: Sppd) => {
    const exists = sppdS.some((item) => item.id === savedSppd.id);
    if (exists) {
      setSppdS((prev) => prev.map((item) => (item.id === savedSppd.id ? savedSppd : item)));
    } else {
      setSppdS((prev) => [savedSppd, ...prev]);
    }
    setIsFormOpen(false);
    setCurrentEditSppd(null);
    setActiveTab("sppd");
  };

  const handleDeleteSppd = (id: string, nomor: string) => {
    setSppdS((prev) => {
      const afterDelete = prev.filter((item) => item.id !== id);
      // Ensure the localStorage is synced even if the list becomes empty
      localStorage.setItem("kemenag_sppd", JSON.stringify(afterDelete));
      return afterDelete;
    });
  };

  const handleEditSppdTrigger = (sppd: Sppd) => {
    setCurrentEditSppd(sppd);
    setIsFormOpen(true);
  };

  const handleAddNewSppdTrigger = () => {
    setCurrentEditSppd(null);
    setIsFormOpen(true);
  };

  // Reset database to initial defaults
  const handleResetDatabase = () => {
    if (
      confirm(
        "Apakah Anda yakin ingin menyetel ulang seluruh database (Pegawai, SPPD, Referensi) kembali ke data contoh bawaan?"
      )
    ) {
      localStorage.clear();
      setPegawai(INITIAL_PEGAWAI);
      setReferensi(INITIAL_REFERENSI);
      setSppdS(INITIAL_SPPD);
      
      localStorage.setItem("kemenag_pegawai", JSON.stringify(INITIAL_PEGAWAI));
      localStorage.setItem("kemenag_referensi", JSON.stringify(INITIAL_REFERENSI));
      localStorage.setItem("kemenag_sppd", JSON.stringify(INITIAL_SPPD));
      
      alert("Database Kemenag Kota Palopo berhasil disetel ulang!");
      setActiveTab("sppd");
    }
  };

  // Special Print Mode Isolation
  if (activePrintSppd) {
    return (
      <SppdPrintReceipt
        sppd={activePrintSppd}
        onBack={() => setActivePrintSppd(null)}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7F5F2] select-text overflow-hidden font-sans text-[#2D2A26]">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={isFormOpen ? "sppd" : activeTab}
        setActiveTab={(tab) => {
          setIsFormOpen(false);
          setActiveTab(tab);
        }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Panel */}
        <header className="hidden md:flex h-16 bg-white border-b border-[#E5E2DD] items-center justify-between px-8 shrink-0 shadow-xs">
          <div className="flex items-center gap-4">
            <motion.h2 
              animate={{ opacity: [1, 0.25, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-lg font-serif italic text-[#1B3022] font-semibold"
            >
              Surat Perintah Perjalanan Dinas
            </motion.h2>
          </div>
        </header>

        {/* Dynamic Navigational Stage wrapper */}
        <main className="flex-1 pt-2 md:pt-4 pb-4 md:pb-8 px-4 md:px-8 max-w-7xl w-full mx-auto">
          {isFormOpen ? (
            <SppdForm
              sppdToEdit={currentEditSppd}
              sppdS={sppdS}
              pegawaiList={pegawai}
              referensi={referensi}
              onSave={handleSaveSppd}
              onCancel={() => {
                setIsFormOpen(false);
                setCurrentEditSppd(null);
              }}
            />
          ) : (
            <>
              {activeTab === "pegawai" && (
                <PegawaiManager pegawai={pegawai} setPegawai={setPegawai} />
              )}

              {activeTab === "sppd" && (
                <SppdList
                  sppdS={sppdS}
                  onAddNew={handleAddNewSppdTrigger}
                  onEdit={handleEditSppdTrigger}
                  onDelete={handleDeleteSppd}
                  onPrint={(sppd) => setActivePrintSppd(sppd)}
                />
              )}

              {activeTab === "referensi" && (
                <ReferensiManager referensi={referensi} setReferensi={setReferensi} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
