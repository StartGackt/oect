"use client";

import { useState } from "react";
import Header, { USER_ROLES, UserRole } from "@/components/oect/Header";
import SmartHubView from "@/components/oect/SmartHubView";
import DashboardView from "@/components/oect/DashboardView";
import CaseListView from "@/components/oect/CaseListView";
import WorkflowVisualizer from "@/components/oect/WorkflowVisualizer";
import CitizenTrackingView from "@/components/oect/CitizenTrackingView";
import AdminSettingsView from "@/components/oect/AdminSettingsView";
import CaseDetailModal from "@/components/oect/CaseDetailModal";
import NewComplaintForm from "@/components/oect/NewComplaintForm";

// 300 Real Simulated Cases from ข้อมูล POC
import initialCasesData from "@/data/complaintsData.json";

export default function Home() {
  const [cases, setCases] = useState(initialCasesData);
  const [activeTab, setActiveTab] = useState<string>("hub"); // Default to clean SmartHub view
  const [currentRole, setCurrentRole] = useState<UserRole>(USER_ROLES[0]);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  const handleAddCase = (newCase: any) => {
    setCases([newCase, ...cases]);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-[#1A202C] flex flex-col font-prompt selection:bg-[#173B6B] selection:text-white">
      
      {/* 1. Clean Minimalist Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        openNewModal={() => setIsNewModalOpen(true)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto">
        
        {/* VIEW 1: Clean Conversational Smart Hub (Default Style) */}
        {activeTab === "hub" && (
          <SmartHubView
            cases={cases}
            currentRole={currentRole}
            onSelectCase={(c) => setSelectedCase(c)}
            openNewModal={() => setIsNewModalOpen(true)}
            onOpenWorkflow={() => setActiveTab("workflow")}
          />
        )}

        {/* VIEW 2: Executive Dashboard & Analytics */}
        {activeTab === "dashboard" && (
          <div className="px-4 sm:px-6 pt-6">
            <DashboardView
              cases={cases}
              onSelectCase={(c) => setSelectedCase(c)}
              onViewAllCases={() => setActiveTab("hub")}
            />
          </div>
        )}

        {/* VIEW 3: Workflow & Legal SLA Engine */}
        {activeTab === "workflow" && (
          <div className="px-4 sm:px-6 pt-6">
            <WorkflowVisualizer />
          </div>
        )}

        {/* VIEW 4: Admin & Security Governance */}
        {activeTab === "admin_settings" && (
          <div className="px-4 sm:px-6 pt-6">
            <AdminSettingsView />
          </div>
        )}

      </div>

      {/* 3. Electronic Case File Modal (e-Dossier) */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}

      {/* 4. New Complaint Form Modal */}
      {isNewModalOpen && (
        <NewComplaintForm
          onClose={() => setIsNewModalOpen(false)}
          onAddCase={handleAddCase}
        />
      )}

      {/* 5. Clean Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 text-center text-xs text-[#94A3B8]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 สำนักงานคณะกรรมการการเลือกตั้ง (สนง.กกต.) · ระบบบริหารจัดการเรื่องร้องเรียนและการดำเนินการตามกระบวนการยุติธรรม
          </span>
          <div className="flex items-center gap-3 text-[11px]">
            <span>มาตรฐาน OWASP Top 10</span>
            <span>·</span>
            <span>พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)</span>
          </div>
        </div>
      </footer>

    </main>
  );
}