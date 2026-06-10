"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, RotateCcw, User, Mail, Phone, Calendar, Trophy, Users, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AdminModal } from "@/components/admin/AdminModal";
import { DataTable, type TableColumn } from "@/components/admin/DataTable";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { playersStore, type AdminPlayer, type PlayerStatus } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Athletics", "Hockey", "Volleyball", "Chess"];
const STATUSES: PlayerStatus[] = ["active", "pending", "inactive"];

const STATUS_STYLE: Record<PlayerStatus, string> = {
  active: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

type FormData = Omit<AdminPlayer, "id" | "registeredAt">;

const EMPTY_FORM: FormData = {
  name: "", email: "", phone: "", sport: "Cricket", gender: "Male", age: "", status: "active",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function PlayersPage() {
  const { loading } = useAdminAuth();
  const [items, setItems] = useState<AdminPlayer[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    setItems(playersStore.getAll());
  }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (!q || item.name.toLowerCase().includes(q) || item.email.toLowerCase().includes(q) || item.phone.includes(q)) &&
      (sportFilter === "all" || item.sport === sportFilter) &&
      (statusFilter === "all" || item.status === statusFilter) &&
      (genderFilter === "all" || item.gender === genderFilter)
    );
  }), [items, search, sportFilter, statusFilter, genderFilter]);

  function reload() { setItems(playersStore.getAll()); }

  function openAdd() { setEditId(null); setForm(EMPTY_FORM); setFormErrors({}); setShowModal(true); }
  function openEdit(item: AdminPlayer) {
    setEditId(item.id);
    setForm({ name: item.name, email: item.email, phone: item.phone, sport: item.sport, gender: item.gender, age: item.age, status: item.status });
    setFormErrors({}); setShowModal(true);
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) { errs.email = "Email is required."; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { errs.email = "Enter a valid email."; }
    if (!form.phone.trim()) errs.phone = "Phone is required.";
    if (!form.age.trim()) errs.age = "Age is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    if (editId) {
      playersStore.update(editId, form);
    } else {
      playersStore.add({ ...form, registeredAt: new Date().toISOString().split("T")[0] });
    }
    reload(); setShowModal(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    playersStore.remove(deleteId); reload(); setDeleteId(null);
  }

  const hasFilters = search || sportFilter !== "all" || statusFilter !== "all" || genderFilter !== "all";

  const columns: TableColumn<AdminPlayer>[] = [
    {
      key: "index", label: "#", headerClassName: "text-left w-12",
      render: (_, idx) => <span className="font-medium text-gray-500 text-xs">{String(idx + 1).padStart(2, "0")}</span>,
    },
    {
      key: "id", label: "Player ID", sortable: true, getValue: (item) => item.id,
      render: (item) => (
        <span className="font-mono text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border">
          {item.id}
        </span>
      ),
    },
    {
      key: "name", label: "Player Name", sortable: true, getValue: (item) => item.name,
      render: (item) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#C62828]/15 border border-[#C62828]/20 flex items-center justify-center">
            <User className="size-4 text-[#C62828]" />
          </div>
          <span className="font-semibold text-[#0B1C2D]">{item.name}</span>
        </div>
      ),
    },
    {
      key: "email", label: "Email Address", sortable: true, getValue: (item) => item.email,
      render: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <Mail className="size-3.5 text-gray-400" />
          <span className="text-gray-600">{item.email}</span>
        </div>
      ),
    },
    {
      key: "phone", label: "Contact Number", sortable: false,
      render: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <Phone className="size-3.5 text-gray-400" />
          <span className="text-gray-600 font-mono">{item.phone}</span>
        </div>
      ),
    },
    {
      key: "gender", label: "Gender", sortable: true, getValue: (item) => item.gender,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Users className="size-3.5 text-gray-400" />
          <span className="text-sm text-gray-600">{item.gender}</span>
        </div>
      ),
    },
    {
      key: "age", label: "Age", sortable: true, getValue: (item) => Number(item.age) || 0,
      render: (item) => (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          {item.age}
        </span>
      ),
    },
    {
      key: "sport", label: "Sport", sortable: true, getValue: (item) => item.sport,
      render: (item) => (
        <div className="flex items-center gap-2">
          <Trophy className="size-3.5 text-amber-500" />
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            {item.sport}
          </span>
        </div>
      ),
    },
    {
      key: "registeredAt", label: "Registration Date", sortable: true, getValue: (item) => item.registeredAt,
      render: (item) => (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="size-3.5 text-gray-400" />
          <span className="text-gray-600">{new Date(item.registeredAt).toLocaleDateString("en-IN")}</span>
        </div>
      ),
    },
    {
      key: "status", label: "Status", sortable: true, getValue: (item) => item.status,
      render: (item) => {
        const icons = {
          active: <CheckCircle2 className="size-3.5" />,
          pending: <Clock className="size-3.5" />,
          inactive: <XCircle className="size-3.5" />,
        };
        return (
          <div className="flex items-center gap-1.5">
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize", STATUS_STYLE[item.status])}>
              {icons[item.status]}
              {item.status}
            </span>
          </div>
        );
      },
    },
    {
      key: "actions", label: "Actions", headerClassName: "text-center", className: "text-center",
      render: (item) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => openEdit(item)}
            className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-all hover:shadow-sm"
            title="Edit Player"
          >
            <Edit2 className="size-4" />
          </button>
          <button
            onClick={() => setDeleteId(item.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all hover:shadow-sm"
            title="Delete Player"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ),
    },
  ];

  if (loading || !isHydrated) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="size-8 border-2 border-[#C62828]/30 border-t-[#C62828] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B1C2D]">Player Registrations</h2>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} registered players</p>
        </div>
        <PrimaryButton onClick={openAdd} className="gap-2 shadow-sm">
          <Plus className="size-4" /> Add Player
        </PrimaryButton>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STATUSES.map((s) => {
          const count = items.filter((p) => p.status === s).length;
          return (
            <div key={s} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-2xl font-bold text-[#0B1C2D]">{count}</p>
              <p className={cn("text-xs font-medium mt-0.5 capitalize", s === "active" ? "text-green-600" : s === "pending" ? "text-amber-600" : "text-gray-400")}>{s}</p>
            </div>
          );
        })}
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <p className="text-2xl font-bold text-[#0B1C2D]">{items.length}</p>
          <p className="text-xs font-medium text-gray-400 mt-0.5">Total Players</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search by name, email or phone…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Sports" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gender</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="outline" onClick={() => { setSearch(""); setSportFilter("all"); setStatusFilter("all"); setGenderFilter("all"); }} className="gap-2 shrink-0">
              <RotateCcw className="size-3.5" /> Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Showing <span className="font-medium text-[#0B1C2D]">{filtered.length}</span> of {items.length} players
        </p>
      </div>

      {/* Table with sorting + pagination */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        emptyMessage="No players found."
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={showModal}
        onOpenChange={setShowModal}
        title={editId ? "Edit Player" : "Register New Player"}
        subtitle={editId ? "Update the player's registration details." : "Fill in the details to register a new player."}
        size="lg"
        onSave={handleSave}
        saveLabel={editId ? "Save Changes" : "Register Player"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Full Name <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Arjun Kapoor" />
            <FieldError msg={formErrors.name} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Age <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="e.g. 22" />
            <FieldError msg={formErrors.age} />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700">Email Address <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="e.g. player@example.com" />
          <FieldError msg={formErrors.email} />
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="e.g. +91 98765 00000" />
          <FieldError msg={formErrors.phone} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Sport</Label>
            <Select value={form.sport} onValueChange={(v) => setForm({ ...form, sport: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Gender</Label>
            <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as PlayerStatus })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this player?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the player registration.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-[#C62828] hover:bg-[#a82020]" onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
