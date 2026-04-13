"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AdminModal } from "@/components/admin/AdminModal";
import { DataTable, type TableColumn } from "@/components/admin/DataTable";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { coachesStore, type AdminCoach } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Athletics", "Hockey", "Volleyball"];

type FormData = Omit<AdminCoach, "id">;

const EMPTY_FORM: FormData = {
  image: "/images/event-1.png", name: "", sport: "Cricket",
  academy: "", location: "", specialization: "", experience: "", fee: "", status: "active",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function CoachesPage() {
  const { loading } = useAdminAuth();
  const [items, setItems] = useState<AdminCoach[]>([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { setItems(coachesStore.getAll()); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (!q || item.name.toLowerCase().includes(q) || item.academy.toLowerCase().includes(q) || item.location.toLowerCase().includes(q)) &&
      (sportFilter === "all" || item.sport === sportFilter) &&
      (statusFilter === "all" || item.status === statusFilter)
    );
  }), [items, search, sportFilter, statusFilter]);

  function reload() { setItems(coachesStore.getAll()); }

  function openAdd() { setEditId(null); setForm(EMPTY_FORM); setFormErrors({}); setShowModal(true); }
  function openEdit(item: AdminCoach) {
    setEditId(item.id);
    setForm({ image: item.image, name: item.name, sport: item.sport, academy: item.academy, location: item.location, specialization: item.specialization, experience: item.experience, fee: item.fee, status: item.status });
    setFormErrors({}); setShowModal(true);
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.academy.trim()) errs.academy = "Academy is required.";
    if (!form.location.trim()) errs.location = "Location is required.";
    if (!form.specialization.trim()) errs.specialization = "Specialization is required.";
    if (!form.experience.trim()) errs.experience = "Experience is required.";
    if (!form.fee.trim()) errs.fee = "Fee is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    if (editId) { coachesStore.update(editId, form); } else { coachesStore.add(form); }
    reload(); setShowModal(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    coachesStore.remove(deleteId); reload(); setDeleteId(null);
  }

  const columns: TableColumn<AdminCoach>[] = [
    {
      key: "#", label: "#", headerClassName: "text-left w-10",
      render: (_, idx) => <span className="text-gray-400 text-xs">{idx}</span>,
    },
    {
      key: "name", label: "Name", sortable: true, getValue: (item) => item.name,
      render: (item) => (
        <div>
          <p className="font-medium text-[#0B1C2D]">{item.name}</p>
          <p className="text-xs text-gray-400 truncate max-w-[140px]">{item.location}</p>
        </div>
      ),
    },
    {
      key: "sport", label: "Sport", sortable: true, getValue: (item) => item.sport,
      render: (item) => <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#0B1C2D]/8 text-[#0B1C2D]">{item.sport}</span>,
    },
    {
      key: "academy", label: "Academy", sortable: true, getValue: (item) => item.academy,
      className: "max-w-[160px]",
      render: (item) => <p className="text-gray-600 truncate">{item.academy}</p>,
    },
    {
      key: "specialization", label: "Specialization",
      render: (item) => <span className="text-gray-600">{item.specialization}</span>,
    },
    {
      key: "experience", label: "Experience",
      render: (item) => <span className="text-gray-600 whitespace-nowrap">{item.experience}</span>,
    },
    {
      key: "fee", label: "Fee",
      render: (item) => <span className="text-gray-600 whitespace-nowrap">{item.fee}</span>,
    },
    {
      key: "status", label: "Status", sortable: true, getValue: (item) => item.status,
      render: (item) => (
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border capitalize", item.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200")}>
          {item.status}
        </span>
      ),
    },
    {
      key: "actions", label: "Actions", headerClassName: "text-right", className: "text-right",
      render: (item) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => openEdit(item)} className="p-1.5 rounded-md hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Edit"><Edit2 className="size-3.5" /></button>
          <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" title="Delete"><Trash2 className="size-3.5" /></button>
        </div>
      ),
    },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="size-8 border-2 border-[#C62828]/30 border-t-[#C62828] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B1C2D]">Coaches Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} total coaches</p>
        </div>
        <PrimaryButton onClick={openAdd} className="gap-2 shadow-sm">
          <Plus className="size-4" /> Add Coach
        </PrimaryButton>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search by name, academy or location…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Sports" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {(search || sportFilter !== "all" || statusFilter !== "all") && (
            <Button variant="outline" onClick={() => { setSearch(""); setSportFilter("all"); setStatusFilter("all"); }} className="gap-2 shrink-0">
              <RotateCcw className="size-3.5" /> Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Showing <span className="font-medium text-[#0B1C2D]">{filtered.length}</span> of {items.length} coaches
        </p>
      </div>

      {/* Table with sorting + pagination */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        emptyMessage="No coaches found."
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={showModal}
        onOpenChange={setShowModal}
        title={editId ? "Edit Coach" : "Add New Coach"}
        subtitle={editId ? "Update coach details below." : "Fill in the details to add a new coach."}
        size="xl"
        onSave={handleSave}
        saveLabel={editId ? "Save Changes" : "Add Coach"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Full Name <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ravi Shastri" />
            <FieldError msg={formErrors.name} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Sport</Label>
            <Select value={form.sport} onValueChange={(v) => setForm({ ...form, sport: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700">Academy <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.academy} onChange={(e) => setForm({ ...form, academy: e.target.value })} placeholder="e.g. National Cricket Academy" />
          <FieldError msg={formErrors.academy} />
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700">Location <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Mumbai, Maharashtra" />
          <FieldError msg={formErrors.location} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Specialization <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. Batting" />
            <FieldError msg={formErrors.specialization} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Experience <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} placeholder="e.g. 15 Years" />
            <FieldError msg={formErrors.experience} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Session Fee <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} placeholder="e.g. ₹2,500 / Session" />
            <FieldError msg={formErrors.fee} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "active" | "inactive" })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </AdminModal>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this coach?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-[#C62828] hover:bg-[#a82020]" onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
