"use client";

import React, { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Eye,
  Filter,
  KeyRound,
  LayoutGrid,
  ListFilter,
  Lock,
  LockKeyhole,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  TableProperties,
  Trash2,
  Unlock,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
  X,
  Zap,
} from "lucide-react";
import {
  ALL_ROLES,
  PERMISSION_GROUPS,
  DEFAULT_ROLE_PERMISSIONS,
  useAuditLogStore,
  useRolePermissionsStore,
  useUsersStore,
  type AuditActionType,
  type PermissionKey,
  type SystemRoleId,
  type UserAccount,
  type UserStatus,
} from "@/components/oect/rbacDomain";

const PROVINCES_LIST = [
  "ส่วนกลาง",
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "ขอนแก่น",
  "นครราชสีมา",
  "สงขลา",
  "สุราษฎร์ธานี",
  "อุบลราชธานี",
  "ชลบุรี",
  "นนทบุรี",
  "ปทุมธานี",
  "สมุทรปราการ",
];

interface AdminUserManagementViewProps {
  onNotify?: (text: string) => void;
}

export default function AdminUserManagementView({ onNotify }: AdminUserManagementViewProps) {
  const [users, setUsers, isLoaded] = useUsersStore();
  const [rolePermissions, togglePermission, resetPermissions] = useRolePermissionsStore();
  const [, appendAuditLog] = useAuditLogStore();

  const [activeTab, setActiveTab] = useState<"users" | "matrix">("matrix");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [provinceFilter, setProvinceFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Matrix UI View Modes
  const [matrixViewMode, setMatrixViewMode] = useState<"role_focused" | "table_matrix">("role_focused");
  const [selectedMatrixRoleId, setSelectedMatrixRoleId] = useState<SystemRoleId>("intake");
  const [matrixSearch, setMatrixSearch] = useState("");
  const [copySourceRole, setCopySourceRole] = useState<SystemRoleId>("intake");
  const [copyTargetRole, setCopyTargetRole] = useState<SystemRoleId>("review-1");

  // Modal States
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserAccount | null>(null);
  const [newTempPassword, setNewTempPassword] = useState<string>("");

  // User-Specific Custom Permissions Modal State
  const [managingPermsUser, setManagingPermsUser] = useState<UserAccount | null>(null);
  const [userPermsMode, setUserPermsMode] = useState<"role" | "custom">("role");
  const [userSelectedPerms, setUserSelectedPerms] = useState<PermissionKey[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<UserAccount>>({
    name: "",
    username: "",
    roleId: "intake",
    province: "เชียงใหม่",
    section: "สนง.กกต.จว. เชียงใหม่",
    email: "",
    phone: "",
    status: "ACTIVE",
    twoFactorEnabled: true,
  });

  const notify = (msg: string) => {
    if (onNotify) onNotify(msg);
  };

  const logAdminAction = (action: AuditActionType, actionLabel: string, details: string) => {
    appendAuditLog({
      userId: "usr-admin",
      userName: "ผู้ดูแลระบบกลาง",
      userRole: "admin",
      userRoleLabel: "ADMIN",
      ipAddress: "192.168.1.10",
      action,
      actionLabel,
      status: "SUCCESS",
      details,
    });
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchQuery =
        !searchQuery ||
        `${u.name} ${u.username} ${u.email} ${u.section} ${u.province}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === "ALL" || u.roleId === roleFilter;
      const matchProvince = provinceFilter === "ALL" || u.province === provinceFilter;
      const matchStatus = statusFilter === "ALL" || u.status === statusFilter;
      return matchQuery && matchRole && matchProvince && matchStatus;
    });
  }, [users, searchQuery, roleFilter, provinceFilter, statusFilter]);

  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const lockedCount = users.filter((u) => u.status === "LOCKED").length;
  const suspendedCount = users.filter((u) => u.status === "SUSPENDED").length;

  const rolesForMatrix = useMemo(() => {
    return ALL_ROLES.filter((r) => r.id !== "citizen");
  }, []);

  const currentRoleMeta = useMemo(() => {
    return ALL_ROLES.find((r) => r.id === selectedMatrixRoleId) || ALL_ROLES[0];
  }, [selectedMatrixRoleId]);

  const selectedRolePerms = useMemo(() => {
    return rolePermissions[selectedMatrixRoleId] || [];
  }, [rolePermissions, selectedMatrixRoleId]);

  const filteredPermissionGroups = useMemo(() => {
    if (!matrixSearch.trim()) return PERMISSION_GROUPS;
    const query = matrixSearch.toLowerCase();
    return PERMISSION_GROUPS.map((g) => {
      const matchedPerms = g.permissions.filter(
        (p) => p.label.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.key.toLowerCase().includes(query)
      );
      return {
        ...g,
        permissions: matchedPerms,
      };
    }).filter((g) => g.permissions.length > 0);
  }, [matrixSearch]);

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      username: "",
      roleId: "intake",
      province: "เชียงใหม่",
      section: "สนง.กกต.จว. เชียงใหม่",
      email: "",
      phone: "",
      status: "ACTIVE",
      twoFactorEnabled: true,
    });
    setIsAddUserOpen(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    setEditingUser(user);
    setFormData({ ...user });
  };

  const handleOpenUserPermissions = (user: UserAccount) => {
    setManagingPermsUser(user);
    if (user.customPermissions && user.customPermissions.length > 0) {
      setUserPermsMode("custom");
      setUserSelectedPerms([...user.customPermissions]);
    } else {
      setUserPermsMode("role");
      setUserSelectedPerms([...(rolePermissions[user.roleId] || [])]);
    }
  };

  const handleSaveUserPermissions = () => {
    if (!managingPermsUser) return;
    const updatedCustomPerms = userPermsMode === "custom" ? userSelectedPerms : undefined;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === managingPermsUser.id ? { ...u, customPermissions: updatedCustomPerms } : u
      )
    );

    logAdminAction(
      "USER_UPDATE_ROLE",
      `แก้ไขสิทธิ์รายบุคคลสำหรับ ${managingPermsUser.name}`,
      userPermsMode === "custom"
        ? `กำหนดสิทธิ์เฉพาะบุคคลจำนวน ${userSelectedPerms.length} สิทธิ์`
        : `รีเซ็ตกลับไปใช้สิทธิ์มาตรฐานตามบทบาท (${managingPermsUser.roleId})`
    );

    notify(`บันทึกสิทธิ์รายบุคคลสำหรับ ${managingPermsUser.name} สำเร็จ`);
    setManagingPermsUser(null);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.username) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editingUser.id ? ({ ...u, ...formData } as UserAccount) : u))
      );
      logAdminAction(
        "USER_UPDATE",
        `แก้ไขข้อมูลบัญชีผู้ใช้ ${formData.name}`,
        `บทบาท: ${formData.roleId}, สังกัด: ${formData.province}`
      );
      notify(`อัปเดตข้อมูลบัญชี ${formData.name} สำเร็จ`);
      setEditingUser(null);
    } else {
      const initials = formData.name ? formData.name.slice(0, 2) : "จน";
      const newUser: UserAccount = {
        id: `usr-${Date.now().toString().slice(-4)}`,
        username: formData.username || `user_${Date.now()}`,
        name: formData.name || "",
        roleId: (formData.roleId as SystemRoleId) || "intake",
        province: formData.province || "เชียงใหม่",
        section: formData.section || "สนง.กกต.จว. เชียงใหม่",
        email: formData.email || `${formData.username}@ect.go.th`,
        phone: formData.phone || "053-***-***",
        status: (formData.status as UserStatus) || "ACTIVE",
        lastLogin: "ยังไม่เคยเข้าใช้งาน",
        twoFactorEnabled: formData.twoFactorEnabled ?? true,
        loginAttempts: 0,
        avatarInitials: initials,
      };
      setUsers((prev) => [newUser, ...prev]);
      logAdminAction(
        "USER_CREATE",
        `สร้างบัญชีผู้ใช้งานใหม่ ${newUser.name}`,
        `ชื่อบัญชี: ${newUser.username}, บทบาท: ${newUser.roleId}, สังกัด: ${newUser.province}`
      );
      notify(`สร้างบัญชีผู้ใช้ ${newUser.name} สำเร็จ`);
      setIsAddUserOpen(false);
    }
  };

  const handleToggleStatus = (user: UserAccount) => {
    const newStatus: UserStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus, loginAttempts: 0 } : u))
    );
    logAdminAction(
      newStatus === "ACTIVE" ? "USER_UNLOCK" : "USER_SUSPEND",
      `${newStatus === "ACTIVE" ? "เปิดใช้งาน" : "ระงับการใช้งาน"} บัญชี ${user.name}`,
      `สถานะใหม่: ${newStatus}`
    );
    notify(`${newStatus === "ACTIVE" ? "เปิดใช้งาน" : "ระงับการใช้งาน"} บัญชี ${user.name} แล้ว`);
  };

  const handleUnlock = (user: UserAccount) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: "ACTIVE", loginAttempts: 0 } : u))
    );
    logAdminAction("USER_UNLOCK", `ปลดล็อคบัญชี ${user.name}`, "รีเซ็ต login attempts เป็น 0");
    notify(`ปลดล็อคบัญชี ${user.name} เรียบร้อยแล้ว`);
  };

  const handleResetPasswordClick = (user: UserAccount) => {
    const tempPass = `ECT@${Math.floor(100000 + Math.random() * 900000)}`;
    setResetPasswordUser(user);
    setNewTempPassword(tempPass);
  };

  const handleConfirmResetPassword = () => {
    if (!resetPasswordUser) return;
    logAdminAction(
      "USER_RESET_PASSWORD",
      `รีเซ็ตรหัสผ่านชั่วคราวสำหรับ ${resetPasswordUser.name}`,
      "สร้างรหัสผ่านชั่วคราวและบังคับเปลี่ยนรหัสผ่านเมื่อเข้าสู่ระบบครั้งแรก"
    );
    notify(`รีเซ็ตรหัสผ่านของ ${resetPasswordUser.name} เรียบร้อยแล้ว`);
    setResetPasswordUser(null);
  };

  const handleDeleteUser = (user: UserAccount) => {
    if (confirm(`ยืนยันการลบบัญชีผู้ใช้ "${user.name}" ออกจากระบบ?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      logAdminAction("USER_DELETE", `ลบบัญชีผู้ใช้ ${user.name}`, `ลบบัญชี ${user.username} (${user.id})`);
      notify(`ลบบัญชี ${user.name} ออกจากระบบแล้ว`);
    }
  };

  // Role Permissions Batch Handlers
  const handleGrantAllForRole = (roleId: SystemRoleId) => {
    const allKeys = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key));
    allKeys.forEach((key) => {
      if (!rolePermissions[roleId]?.includes(key)) {
        togglePermission(roleId, key);
      }
    });
    logAdminAction("USER_UPDATE_ROLE", `มอบสิทธิ์ทั้งหมดให้บทบาท ${roleId}`, `จำนวน ${allKeys.length} สิทธิ์`);
    notify(`มอบสิทธิ์ทั้งหมดให้บทบาท ${roleId} สำเร็จ`);
  };

  const handleRevokeAllForRole = (roleId: SystemRoleId) => {
    const current = rolePermissions[roleId] || [];
    current.forEach((key) => {
      togglePermission(roleId, key);
    });
    logAdminAction("USER_UPDATE_ROLE", `ล้างสิทธิ์ทั้งหมดของบทบาท ${roleId}`, "ถอดสิทธิ์ทั้งหมด");
    notify(`ล้างสิทธิ์ทั้งหมดของบทบาท ${roleId} สำเร็จ`);
  };

  const handleResetRoleToDefault = (roleId: SystemRoleId) => {
    const defaults = DEFAULT_ROLE_PERMISSIONS[roleId] || [];
    const current = rolePermissions[roleId] || [];
    // remove non-defaults
    current.forEach((k) => {
      if (!defaults.includes(k)) togglePermission(roleId, k);
    });
    // add missing defaults
    defaults.forEach((k) => {
      if (!current.includes(k)) togglePermission(roleId, k);
    });
    logAdminAction("USER_UPDATE_ROLE", `คืนค่าสิทธิ์มาตรฐานของบทบาท ${roleId}`, `จำนวน ${defaults.length} สิทธิ์ตามระเบียบ`);
    notify(`คืนค่าสิทธิ์เริ่มต้นของบทบาท ${roleId} เรียบร้อยแล้ว`);
  };

  const handleToggleGroupForRole = (roleId: SystemRoleId, groupKey: string, grant: boolean) => {
    const group = PERMISSION_GROUPS.find((g) => g.id === groupKey);
    if (!group) return;
    group.permissions.forEach((p) => {
      const isCurrentlyGranted = rolePermissions[roleId]?.includes(p.key);
      if (grant && !isCurrentlyGranted) {
        togglePermission(roleId, p.key);
      } else if (!grant && isCurrentlyGranted) {
        togglePermission(roleId, p.key);
      }
    });
    notify(`${grant ? "เปิด" : "ปิด"}สิทธิ์หมวด "${group.name}" สำหรับบทบาทนี้`);
  };

  const handleCopyRolePermissions = () => {
    if (copySourceRole === copyTargetRole) return;
    const sourcePerms = rolePermissions[copySourceRole] || [];
    sourcePerms.forEach((permKey) => {
      if (!rolePermissions[copyTargetRole]?.includes(permKey)) {
        togglePermission(copyTargetRole, permKey);
      }
    });
    (rolePermissions[copyTargetRole] || []).forEach((permKey) => {
      if (!sourcePerms.includes(permKey)) {
        togglePermission(copyTargetRole, permKey);
      }
    });

    logAdminAction(
      "USER_UPDATE_ROLE",
      `คัดลอกสิทธิ์จากบทบาท ${copySourceRole} ไปยัง ${copyTargetRole}`,
      `คัดลอก ${sourcePerms.length} สิทธิ์`
    );

    notify(`คัดลอกสิทธิ์จาก ${copySourceRole} ไปยัง ${copyTargetRole} สำเร็จ`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#1B3F8B]">
                <UserCog className="h-4 w-4" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                User & Role-Based Access Control
              </span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              จัดการผู้ใช้งานและกำหนดสิทธิ์การเข้าถึง (RBAC)
            </h1>
            <p className="text-xs text-slate-500">
              ควบคุมบัญชีเจ้าหน้าที่ กำหนดขอบเขตข้อมูลรายจังหวัด (Data Scope) และสิทธิ์การสั่งการตาม 9 บทบาทงาน
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1B3F8B] px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-blue-900"
            >
              <UserPlus className="h-4 w-4 text-[#FFD600]" />
              <span>เพิ่มผู้ใช้งานใหม่</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
            <div className="text-[10px] font-bold uppercase text-slate-400">ผู้ใช้งานทั้งหมด</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{users.length}</span>
              <span className="text-[10px] text-slate-500">บัญชี</span>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="text-[10px] font-bold uppercase text-emerald-600">พร้อมใช้งาน (Active)</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-800">{activeCount}</span>
              <span className="text-[10px] text-emerald-600">บัญชี</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="text-[10px] font-bold uppercase text-amber-700">ถูกระงับ (Suspended)</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-800">{suspendedCount}</span>
              <span className="text-[10px] text-amber-600">บัญชี</span>
            </div>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
            <div className="text-[10px] font-bold uppercase text-rose-600">ถูกล็อค (Locked 2FA)</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-800">{lockedCount}</span>
              <span className="text-[10px] text-rose-600">บัญชี</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabs Navigation */}
      <section className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50/70 px-6 gap-2">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("matrix")}
              className={`flex items-center gap-2 border-b-2 py-4 px-4 text-xs font-bold transition ${
                activeTab === "matrix"
                  ? "border-[#1B3F8B] text-[#1B3F8B]"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>กำหนดและแก้ไขสิทธิ์ (Role Permissions)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("users")}
              className={`flex items-center gap-2 border-b-2 py-4 px-4 text-xs font-bold transition ${
                activeTab === "users"
                  ? "border-[#1B3F8B] text-[#1B3F8B]"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>ทะเบียนผู้ใช้งาน ({filteredUsers.length})</span>
            </button>
          </div>

          {activeTab === "matrix" && (
            <div className="flex items-center gap-1.5 py-2">
              <div className="inline-flex rounded-xl bg-slate-200/80 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setMatrixViewMode("role_focused")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                    matrixViewMode === "role_focused"
                      ? "bg-white text-[#1B3F8B] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>จัดการรายบทบาท (แนะนำ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMatrixViewMode("table_matrix")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-bold transition ${
                    matrixViewMode === "table_matrix"
                      ? "bg-white text-[#1B3F8B] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <TableProperties className="h-3.5 w-3.5" />
                  <span>ตารางภาพรวม (Matrix)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: PERMISSIONS MANAGEMENT (NEW INTUITIVE DUAL VIEW) */}
        {activeTab === "matrix" && (
          <div className="p-5 sm:p-6 space-y-6">
            {/* VIEW MODE 1: ROLE FOCUSED (EASY & INTUITIVE) */}
            {matrixViewMode === "role_focused" && (
              <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                {/* Left Role Selection Sidebar */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">เลือกลำดับบทบาทที่ต้องการตั้งค่า</span>
                    <span className="text-[10px] text-slate-400 font-medium">{rolesForMatrix.length} บทบาท</span>
                  </div>

                  <div className="space-y-3">
                    {/* Provincial Roles */}
                    <div className="space-y-1.5">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        <span>ส่วนภูมิภาค (สนง.กกต.จว.)</span>
                      </div>
                      {rolesForMatrix
                        .filter((r) => r.category === "provincial")
                        .map((role) => {
                          const isSelected = selectedMatrixRoleId === role.id;
                          const permsCount = (rolePermissions[role.id] || []).length;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setSelectedMatrixRoleId(role.id)}
                              className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between group ${
                                isSelected
                                  ? "bg-blue-50/80 border-[#1B3F8B] shadow-xs ring-1 ring-[#1B3F8B]/20"
                                  : "bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className={`text-xs font-bold truncate ${isSelected ? "text-[#1B3F8B]" : "text-slate-800"}`}>
                                  {role.label}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate mt-0.5">{role.stage}</div>
                              </div>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  isSelected
                                    ? "bg-[#1B3F8B] text-white"
                                    : "bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-800"
                                }`}
                              >
                                {permsCount} สิทธิ์
                              </span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Central Roles */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                        <span>ส่วนกลาง (สนง.กกต.)</span>
                      </div>
                      {rolesForMatrix
                        .filter((r) => r.category === "central")
                        .map((role) => {
                          const isSelected = selectedMatrixRoleId === role.id;
                          const permsCount = (rolePermissions[role.id] || []).length;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setSelectedMatrixRoleId(role.id)}
                              className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between group ${
                                isSelected
                                  ? "bg-emerald-50/80 border-emerald-700 shadow-xs ring-1 ring-emerald-700/20"
                                  : "bg-white border-slate-200 hover:border-emerald-300 hover:bg-slate-50/60"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className={`text-xs font-bold truncate ${isSelected ? "text-emerald-900" : "text-slate-800"}`}>
                                  {role.label}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate mt-0.5">{role.stage}</div>
                              </div>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  isSelected
                                    ? "bg-emerald-800 text-white"
                                    : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-800"
                                }`}
                              >
                                {permsCount} สิทธิ์
                              </span>
                            </button>
                          );
                        })}
                    </div>

                    {/* Admin Roles */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-purple-800 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                        <span>ผู้ดูแลระบบ (Admin)</span>
                      </div>
                      {rolesForMatrix
                        .filter((r) => r.category === "admin")
                        .map((role) => {
                          const isSelected = selectedMatrixRoleId === role.id;
                          const permsCount = (rolePermissions[role.id] || []).length;
                          return (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => setSelectedMatrixRoleId(role.id)}
                              className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between group ${
                                isSelected
                                  ? "bg-purple-50/80 border-purple-700 shadow-xs ring-1 ring-purple-700/20"
                                  : "bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50/60"
                              }`}
                            >
                              <div className="min-w-0 pr-2">
                                <div className={`text-xs font-bold truncate ${isSelected ? "text-purple-900" : "text-slate-800"}`}>
                                  {role.label}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate mt-0.5">{role.stage}</div>
                              </div>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  isSelected
                                    ? "bg-purple-800 text-white"
                                    : "bg-slate-100 text-slate-600 group-hover:bg-purple-100 group-hover:text-purple-800"
                                }`}
                              >
                                {permsCount} สิทธิ์
                              </span>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Copy Permissions Quick Box */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                      <Copy className="h-3.5 w-3.5 text-blue-700" />
                      <span>คัดลอกสิทธิ์ระหว่างบทบาท</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500">ต้นทาง:</span>
                        <select
                          value={copySourceRole}
                          onChange={(e) => setCopySourceRole(e.target.value as SystemRoleId)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 outline-none"
                        >
                          {rolesForMatrix.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500">ปลายทาง:</span>
                        <select
                          value={copyTargetRole}
                          onChange={(e) => setCopyTargetRole(e.target.value as SystemRoleId)}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-medium text-slate-800 outline-none"
                        >
                          {rolesForMatrix.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyRolePermissions}
                        className="w-full mt-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#1B3F8B] py-2 text-xs font-bold text-white hover:bg-blue-900 transition"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>คัดลอกชุดสิทธิ์</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Permission Configuration Panel */}
                <div className="space-y-5">
                  {/* Selected Role Hero Header */}
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              currentRoleMeta.category === "provincial"
                                ? "bg-blue-100 text-blue-800"
                                : currentRoleMeta.category === "central"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {currentRoleMeta.categoryLabel}
                          </span>
                          <span className="text-xs text-slate-400 font-mono font-medium">
                            Role ID: {currentRoleMeta.id}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 mt-1.5 flex items-center gap-2">
                          <span>{currentRoleMeta.label}</span>
                          <span className="text-xs font-semibold text-slate-500">({selectedRolePerms.length} จาก 16 สิทธิ์)</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">{currentRoleMeta.description}</p>
                        <div className="mt-2 text-[11px] text-blue-900 bg-blue-50/90 rounded-xl px-3 py-1.5 inline-block border border-blue-100">
                          <strong>ขอบเขตอำนาจ:</strong> {currentRoleMeta.scope}
                        </div>
                      </div>

                      {/* Quick Role Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleResetRoleToDefault(currentRoleMeta.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                          title="คืนค่าสิทธิ์ตั้งต้นตามระเบียบ กกต."
                        >
                          <RefreshCw className="h-3.5 w-3.5 text-blue-700" />
                          <span>คืนค่าเริ่มต้นบทบาทนี้</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleGrantAllForRole(currentRoleMeta.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition"
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>ให้สิทธิ์ทั้งหมด</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRevokeAllForRole(currentRoleMeta.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-800 hover:bg-rose-100 transition"
                        >
                          <X className="h-3.5 w-3.5" />
                          <span>ล้างสิทธิ์</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Filter / Search Permission */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={matrixSearch}
                      onChange={(e) => setMatrixSearch(e.target.value)}
                      placeholder="ค้นหาชื่อสิทธิ์การใช้งาน หรือคีย์เวิร์ด..."
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  {/* Permission Groups List with Modern Toggle Switches */}
                  <div className="space-y-4">
                    {filteredPermissionGroups.map((group) => {
                      const totalInGroup = group.permissions.length;
                      const activeInGroup = group.permissions.filter((p) =>
                        selectedRolePerms.includes(p.key)
                      ).length;
                      const isAllActive = activeInGroup === totalInGroup;

                      return (
                        <div key={group.id} className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
                          {/* Group Header */}
                          <div className="bg-slate-50/90 px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-[#1B3F8B] flex items-center gap-2">
                                <span>{group.name}</span>
                                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-700">
                                  {activeInGroup} / {totalInGroup} เปิดใช้
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{group.description}</div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleGroupForRole(currentRoleMeta.id, group.id, !isAllActive)}
                                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 transition"
                              >
                                {isAllActive ? "ปิดทั้งหมดในหมวดนี้" : "เปิดทั้งหมดในหมวดนี้"}
                              </button>
                            </div>
                          </div>

                          {/* Group Items */}
                          <div className="divide-y divide-slate-100">
                            {group.permissions.map((perm) => {
                              const isGranted = selectedRolePerms.includes(perm.key);
                              return (
                                <div
                                  key={perm.key}
                                  onClick={() => {
                                    togglePermission(currentRoleMeta.id, perm.key);
                                    logAdminAction(
                                      "USER_UPDATE_ROLE",
                                      `${!isGranted ? "เพิ่มสิทธิ์" : "ถอดสิทธิ์"} ${perm.label} ให้บทบาท ${currentRoleMeta.label}`,
                                      `PermissionKey: ${perm.key}`
                                    );
                                    notify(`ปรับสิทธิ์ ${perm.label} เป็น ${!isGranted ? "อนุญาต" : "ไม่อนุญาต"}`);
                                  }}
                                  className={`p-4 flex items-center justify-between gap-4 cursor-pointer transition hover:bg-slate-50/80 ${
                                    isGranted ? "bg-emerald-50/20" : ""
                                  }`}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-slate-900">{perm.label}</span>
                                      <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                        {perm.key}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500">{perm.desc}</p>
                                  </div>

                                  {/* Modern iOS Style Toggle Switch */}
                                  <div className="flex items-center gap-3 shrink-0">
                                    <span
                                      className={`text-xs font-bold transition ${
                                        isGranted ? "text-emerald-700" : "text-slate-400"
                                      }`}
                                    >
                                      {isGranted ? "อนุญาต" : "ไม่อนุญาต"}
                                    </span>
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={isGranted}
                                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        isGranted ? "bg-emerald-600" : "bg-slate-200"
                                      }`}
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                          isGranted ? "translate-x-5" : "translate-x-0"
                                        }`}
                                      />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE 2: FULL 9-ROLE MATRIX TABLE (CLEAN & SPREADSHEET STYLE) */}
            {matrixViewMode === "table_matrix" && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 rounded-2xl bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between border border-blue-200">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-blue-950">
                      <ShieldCheck className="h-4 w-4 text-blue-700" />
                      ตารางเมทริกซ์สิทธิ์ตามบทบาท (Role-Based Access Control - 9 บทบาท)
                    </h3>
                    <p className="mt-1 text-[11px] text-blue-800/80">
                      คลิกที่ปุ่มสิทธิ์ในแต่ละช่องเพื่อสลับสถานะเปิด/ปิดสิทธิ์ของบทบาทที่ต้องการ
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      resetPermissions();
                      logAdminAction(
                        "SECURITY_POLICY_UPDATE",
                        "คืนค่าสิทธิ์มาตรฐานตามระเบียบ กกต.",
                        "Reset 9-role matrix to default"
                      );
                      notify("คืนค่าสิทธิ์มาตรฐานตามระเบียบ กกต. เรียบร้อยแล้ว");
                    }}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-semibold text-blue-800 shadow-xs hover:bg-blue-100 transition"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    คืนค่าสิทธิ์มาตรฐานทุกบทบาท
                  </button>
                </div>

                {/* Matrix Table */}
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100 text-[10px] font-bold text-slate-700">
                        <th className="p-3.5 w-72 sticky left-0 bg-slate-100 z-10 shadow-xs">
                          หมวดหมู่และสิทธิ์การใช้งาน (Permission Keys)
                        </th>
                        {rolesForMatrix.map((role) => {
                          const permsCount = (rolePermissions[role.id] || []).length;
                          return (
                            <th key={role.id} className="p-3 text-center min-w-[100px] border-l border-slate-200 bg-slate-100">
                              <div className="font-bold text-slate-900">{role.shortLabel}</div>
                              <div className="text-[9px] font-medium text-blue-700 mt-0.5">
                                {permsCount} สิทธิ์
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {PERMISSION_GROUPS.map((group) => (
                        <React.Fragment key={group.id}>
                          <tr className="bg-slate-100/80 font-bold text-slate-900 border-t border-slate-200">
                            <td colSpan={rolesForMatrix.length + 1} className="px-4 py-2.5 text-[11px] text-[#1B3F8B] bg-slate-100/90">
                              <div className="flex items-center justify-between">
                                <span>{group.name}</span>
                                <span className="text-[10px] font-normal text-slate-500">{group.description}</span>
                              </div>
                            </td>
                          </tr>
                          {group.permissions.map((perm) => (
                            <tr key={perm.key} className="hover:bg-slate-50/70 transition">
                              <td className="p-3 pl-6 sticky left-0 bg-white z-10 border-r border-slate-100">
                                <div className="font-semibold text-slate-800">{perm.label}</div>
                                <div className="text-[10px] text-slate-400">{perm.desc}</div>
                              </td>
                              {rolesForMatrix.map((role) => {
                                const isAllowed = rolePermissions[role.id]?.includes(perm.key);
                                return (
                                  <td key={role.id} className="p-2 text-center border-l border-slate-100">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        togglePermission(role.id, perm.key);
                                        logAdminAction(
                                          "USER_UPDATE_ROLE",
                                          `${isAllowed ? "ถอดสิทธิ์" : "เพิ่มสิทธิ์"} ${perm.label} ให้บทบาท ${role.label}`,
                                          `PermissionKey: ${perm.key}`
                                        );
                                        notify(`ปรับสิทธิ์ ${perm.label} สำหรับ ${role.label} เป็น ${!isAllowed ? "อนุญาต" : "ไม่อนุญาต"}`);
                                      }}
                                      className={`h-7 w-7 rounded-xl inline-flex items-center justify-center transition cursor-pointer ${
                                        isAllowed
                                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 ring-1 ring-emerald-300"
                                          : "bg-slate-100 text-slate-300 hover:bg-slate-200 hover:text-slate-500"
                                      }`}
                                      title={`คลิกเพื่อ${isAllowed ? "ปิด" : "เปิด"}สิทธิ์ (${role.label})`}
                                    >
                                      {isAllowed ? <Check className="h-4 w-4 stroke-[3]" /> : <X className="h-3.5 w-3.5" />}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: USERS LIST */}
        {activeTab === "users" && (
          <div className="p-5 sm:p-6 space-y-4">
            {/* Filter Toolbar */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อผู้ใช้, บัญชี, อีเมล, จังหวัด หรือหน่วยงาน..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="ALL">ทุกลำดับบทบาท ({ALL_ROLES.length})</option>
                  {ALL_ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>

                <select
                  value={provinceFilter}
                  onChange={(e) => setProvinceFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="ALL">ทุกพื้นที่สังกัด</option>
                  {PROVINCES_LIST.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 outline-none"
                >
                  <option value="ALL">ทุกสถานะบัญชี</option>
                  <option value="ACTIVE">พร้อมใช้งาน (Active)</option>
                  <option value="SUSPENDED">ระงับชั่วคราว (Suspended)</option>
                  <option value="LOCKED">ถูกล็อค (Locked)</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full min-w-[950px] text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-5 py-3.5">ผู้ใช้งาน / Username</th>
                    <th className="px-4 py-3.5">บทบาทและสิทธิ์</th>
                    <th className="px-4 py-3.5">พื้นที่สังกัด / Scope</th>
                    <th className="px-4 py-3.5 text-center">สถานะ</th>
                    <th className="px-4 py-3.5">เข้าใช้งานล่าสุด</th>
                    <th className="px-4 py-3.5 text-center">2FA</th>
                    <th className="px-5 py-3.5 text-right">การจัดการสิทธิ์และบัญชี</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        ไม่พบบัญชีผู้ใช้งานตามเงื่อนไขการค้นหา
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const roleMeta = ALL_ROLES.find((r) => r.id === user.roleId) ?? ALL_ROLES[0];
                      const hasCustomPerms = user.customPermissions && user.customPermissions.length > 0;
                      const activePermsCount = hasCustomPerms
                        ? user.customPermissions!.length
                        : (rolePermissions[user.roleId] || []).length;

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/60 transition">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1B3F8B] text-xs font-bold text-white">
                                {user.avatarInitials}
                              </span>
                              <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {hasCustomPerms && (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-purple-100 px-1.5 py-0.5 text-[9px] font-bold text-purple-800" title="มีสิทธิ์พิเศษเฉพาะบุคคล">
                                      <Zap className="h-2.5 w-2.5 text-purple-600" /> Custom
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400">@{user.username}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                                roleMeta.category === "provincial"
                                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                                  : roleMeta.category === "central"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-purple-50 text-purple-800 border border-purple-200"
                              }`}
                            >
                              <Shield className="h-3 w-3" />
                              {roleMeta.label}
                            </span>
                            <div className="mt-0.5 text-[10px] text-slate-500 font-medium">
                              {activePermsCount} สิทธิ์ที่ได้รับ
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-slate-800">
                              {user.province === "ส่วนกลาง" ? "สนง.กกต. ส่วนกลาง" : `จ.${user.province}`}
                            </div>
                            <div className="text-[10px] text-slate-400">{user.section}</div>
                          </td>

                          <td className="px-4 py-3.5 text-center">
                            {user.status === "ACTIVE" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                <Check className="h-3 w-3" />
                                ใช้งานปกติ
                              </span>
                            ) : user.status === "LOCKED" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold text-rose-800">
                                <Lock className="h-3 w-3" />
                                ล็อค 2FA
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-800">
                                <UserX className="h-3 w-3" />
                                ระงับ
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 text-[11px] text-slate-500">
                            {user.lastLogin}
                            <div className="text-[9px] text-slate-400">{user.email}</div>
                          </td>

                          <td className="px-4 py-3.5 text-center">
                            {user.twoFactorEnabled ? (
                              <span className="inline-flex items-center rounded-md bg-emerald-50 p-1 text-emerald-600" title="เปิดใช้ 2FA">
                                <ShieldCheck className="h-4 w-4" />
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-md bg-slate-100 p-1 text-slate-400" title="ปิด 2FA">
                                <ShieldAlert className="h-4 w-4" />
                              </span>
                            )}
                          </td>

                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Manage Custom Permissions Button */}
                              <button
                                type="button"
                                onClick={() => handleOpenUserPermissions(user)}
                                title="แก้ไขสิทธิ์รายบุคคล (Permission Override)"
                                className="inline-flex items-center gap-1 rounded-xl border border-purple-200 bg-purple-50 px-2.5 py-1.5 text-xs font-bold text-purple-900 hover:bg-purple-100 transition shadow-2xs"
                              >
                                <Sliders className="h-3.5 w-3.5 text-purple-700" />
                                <span>แก้สิทธิ์</span>
                              </button>

                              {user.status === "LOCKED" && (
                                <button
                                  type="button"
                                  onClick={() => handleUnlock(user)}
                                  title="ปลดล็อคบัญชี"
                                  className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50"
                                >
                                  <Unlock className="h-4 w-4" />
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => handleResetPasswordClick(user)}
                                title="รีเซ็ตรหัสผ่าน"
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-700"
                              >
                                <KeyRound className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEdit(user)}
                                title="แก้ไขข้อมูล"
                                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-[#1B3F8B]"
                              >
                                <UserCog className="h-4 w-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(user)}
                                title={user.status === "ACTIVE" ? "ระงับการใช้งาน" : "เปิดใช้งาน"}
                                className={`rounded-lg p-1.5 ${
                                  user.status === "ACTIVE"
                                    ? "text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                                    : "text-emerald-600 hover:bg-emerald-50"
                                }`}
                              >
                                {user.status === "ACTIVE" ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteUser(user)}
                                title="ลบบัญชี"
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-3 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <LockKeyhole className="h-3.5 w-3.5 text-emerald-600" />
                <span>บัญชีผู้ใช้งานถูกจัดเก็บและเข้ารหัสตามมาตรฐานความปลอดภัยภาครัฐ (Least Privilege Principle)</span>
              </div>
              <div>แสดง {filteredUsers.length} จากทั้งหมด {users.length} บัญชี</div>
            </div>
          </div>
        )}
      </section>

      {/* MODAL: USER SPECIFIC CUSTOM PERMISSIONS */}
      {managingPermsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-purple-50/50">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100 text-purple-800">
                  <Sliders className="h-5 w-5" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      กำหนดและแก้ไขสิทธิ์เฉพาะรายบุคคล (Custom Permissions)
                    </h3>
                    <span className="rounded-full bg-[#1B3F8B] px-2 py-0.5 text-[9px] font-bold text-white">
                      {managingPermsUser.roleId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    สำหรับ: <strong>{managingPermsUser.name}</strong> (@{managingPermsUser.username}) · {managingPermsUser.section}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManagingPermsUser(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Mode Switcher */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-800">โหมดการกำหนดสิทธิ์ผู้ใช้</label>
                <div className="grid gap-3 sm:grid-cols-2 text-xs">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      userPermsMode === "role"
                        ? "bg-white border-blue-500 shadow-xs ring-1 ring-blue-500"
                        : "bg-slate-100 border-slate-200 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="user_perm_mode"
                      checked={userPermsMode === "role"}
                      onChange={() => {
                        setUserPermsMode("role");
                        setUserSelectedPerms([...(rolePermissions[managingPermsUser.roleId] || [])]);
                      }}
                      className="mt-0.5 text-[#1B3F8B]"
                    />
                    <div>
                      <strong className="block text-slate-900 font-bold">ใช้สิทธิ์มาตรฐานตามบทบาท (Inherit from Role)</strong>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        สิทธิ์จะเปลี่ยนแปลงอัตโนมัติตามเมทริกซ์ของบทบาท {managingPermsUser.roleId}
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                      userPermsMode === "custom"
                        ? "bg-white border-purple-500 shadow-xs ring-1 ring-purple-500"
                        : "bg-slate-100 border-slate-200 hover:bg-white"
                    }`}
                  >
                    <input
                      type="radio"
                      name="user_perm_mode"
                      checked={userPermsMode === "custom"}
                      onChange={() => setUserPermsMode("custom")}
                      className="mt-0.5 text-purple-600"
                    />
                    <div>
                      <strong className="block text-purple-950 font-bold">กำหนดสิทธิ์เฉพาะบุคคล (Custom Override)</strong>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        เพิ่มหรือลดสิทธิ์อิสระรายบุคคลนอกเหนือจากบทบาทปกติ
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quick Actions if custom */}
              {userPermsMode === "custom" && (
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    เลือกสิทธิ์ที่ต้องการมอบหมาย ({userSelectedPerms.length} สิทธิ์ที่เลือก)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const allKeys = PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.key));
                        setUserSelectedPerms(allKeys);
                      }}
                      className="text-[10px] font-bold text-blue-700 hover:underline"
                    >
                      เลือกทั้งหมด
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        setUserSelectedPerms([...(rolePermissions[managingPermsUser.roleId] || [])]);
                      }}
                      className="text-[10px] font-bold text-purple-700 hover:underline"
                    >
                      รีเซ็ตเป็นค่าตามบทบาท
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      type="button"
                      onClick={() => setUserSelectedPerms([])}
                      className="text-[10px] font-bold text-slate-500 hover:underline"
                    >
                      ล้างทั้งหมด
                    </button>
                  </div>
                </div>
              )}

              {/* Permissions Checklist */}
              <div className="space-y-4">
                {PERMISSION_GROUPS.map((group) => (
                  <div key={group.id} className="rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 border-b border-slate-200 flex items-center justify-between">
                      <span>{group.name}</span>
                      <span className="text-[10px] font-normal text-slate-500">{group.description}</span>
                    </div>
                    <div className="p-3 grid gap-2.5 sm:grid-cols-2">
                      {group.permissions.map((perm) => {
                        const isChecked = userPermsMode === "role"
                          ? (rolePermissions[managingPermsUser.roleId] || []).includes(perm.key)
                          : userSelectedPerms.includes(perm.key);

                        return (
                          <label
                            key={perm.key}
                            className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs transition ${
                              userPermsMode === "role"
                                ? "opacity-75 cursor-not-allowed border-slate-100 bg-slate-50/50"
                                : isChecked
                                ? "border-purple-200 bg-purple-50/70 text-purple-950 cursor-pointer"
                                : "border-slate-200 bg-white hover:bg-slate-50 cursor-pointer"
                            }`}
                          >
                            <input
                              type="checkbox"
                              disabled={userPermsMode === "role"}
                              checked={isChecked}
                              onChange={() => {
                                if (userPermsMode === "role") return;
                                if (isChecked) {
                                  setUserSelectedPerms((prev) => prev.filter((k) => k !== perm.key));
                                } else {
                                  setUserSelectedPerms((prev) => [...prev, perm.key]);
                                }
                              }}
                              className="mt-0.5 rounded text-purple-600"
                            />
                            <div>
                              <div className="font-bold text-[11px] text-slate-900">{perm.label}</div>
                              <div className="text-[10px] text-slate-500">{perm.desc}</div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-4">
              <span className="text-[10px] text-slate-500">
                การแก้ไขสิทธิ์จะบันทึกใน Audit Trail และมีผลในการเข้าสู่ระบบครั้งถัดไป
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setManagingPermsUser(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleSaveUserPermissions}
                  className="rounded-xl bg-[#1B3F8B] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900"
                >
                  บันทึกการเปลี่ยนแปลงสิทธิ์
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT USER */}
      {(isAddUserOpen || editingUser) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#1B3F8B]">
                  <UserPlus className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingUser ? "แก้ไขข้อมูลผู้ใช้งาน" : "เพิ่มผู้ใช้งานใหม่ในระบบ"}
                  </h3>
                  <p className="text-[10px] text-slate-400">กำหนดบทบาท หน่วยงาน และสิทธิ์เข้าถึงตามระเบียบ กกต.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddUserOpen(false);
                  setEditingUser(null);
                }}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">ชื่อ-นามสกุล *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น วรากร กรณีศึกษา"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">ชื่อบัญชีผู้ใช้ (Username) *</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingUser}
                    value={formData.username || ""}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="เช่น varakorn_cmi"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">บทบาทปฏิบัติงาน (Role) *</label>
                  <select
                    value={formData.roleId || "intake"}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value as SystemRoleId })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {ALL_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} ({r.categoryLabel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">จังหวัด / สังกัด *</label>
                  <select
                    value={formData.province || "เชียงใหม่"}
                    onChange={(e) => {
                      const prov = e.target.value;
                      setFormData({
                        ...formData,
                        province: prov,
                        section: prov === "ส่วนกลาง" ? "สำนักงาน กกต. ส่วนกลาง" : `สนง.กกต.จว. ${prov}`,
                      });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  >
                    {PROVINCES_LIST.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-slate-700">หน่วยงาน / กลุ่มงาน</label>
                <input
                  type="text"
                  value={formData.section || ""}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="เช่น กลุ่มงานสืบสวนและไต่สวน สนง.กกต.จว.เชียงใหม่"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">อีเมลราชการ</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@ect.go.th"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-slate-700">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="text"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="053-112-184"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">การยืนยันตัวตนสองขั้นตอน (2FA)</div>
                    <div className="text-[10px] text-slate-500">บังคับใช้ OTP หรือ Hardware Token เมื่อเข้าสู่ระบบ</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnabled ?? true}
                    onChange={(e) => setFormData({ ...formData, twoFactorEnabled: e.target.checked })}
                    className="h-4 w-4 rounded text-[#1B3F8B]"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                  <div>
                    <div className="text-xs font-bold text-slate-800">สถานะบัญชี (Account Status)</div>
                    <div className="text-[10px] text-slate-500">เปิดหรือปิดการเข้าถึงระบบชั่วคราว</div>
                  </div>
                  <select
                    value={formData.status || "ACTIVE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                    className="rounded-xl border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="ACTIVE">พร้อมใช้งาน (Active)</option>
                    <option value="SUSPENDED">ระงับชั่วคราว (Suspended)</option>
                    <option value="LOCKED">ล็อค (Locked)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddUserOpen(false);
                    setEditingUser(null);
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1B3F8B] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900"
                >
                  {editingUser ? "บันทึกการแก้ไข" : "สร้างบัญชีผู้ใช้"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">รีเซ็ตรหัสผ่านชั่วคราว</h3>
              </div>
              <button
                type="button"
                onClick={() => setResetPasswordUser(null)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                ระบบได้สุ่มรหัสผ่านชั่วคราวสำหรับ <strong>{resetPasswordUser.name}</strong> (@{resetPasswordUser.username}) กรุณาคัดลอกและแจ้งผู้ใช้งาน:
              </p>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-center">
                <div className="text-[10px] font-bold text-amber-700 uppercase">รหัสผ่านชั่วคราว (Temporary Password)</div>
                <div className="mt-1 font-mono text-xl font-bold tracking-wider text-amber-950">
                  {newTempPassword}
                </div>
                <div className="mt-1 text-[10px] text-amber-600">
                  ผู้ใช้จะต้องเปลี่ยนรหัสผ่านทันทีที่เข้าสู่ระบบครั้งแรก
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmResetPassword}
                  className="rounded-xl bg-[#1B3F8B] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-900"
                >
                  ยืนยันการตั้งค่ารหัสผ่านใหม่
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
