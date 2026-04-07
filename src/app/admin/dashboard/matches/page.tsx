"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AdminModal } from "@/components/admin/AdminModal";
import { DataTable, type TableColumn } from "@/components/admin/DataTable";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { matchesStore, type AdminMatch, type MatchStatus } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Athletics", "Hockey", "Volleyball"];
const ROUNDS = ["Group Stage", "Round of 16", "Quarter Final", "Semi Final", "Final", "Finals"];
const STATUS_STYLE: Record<MatchStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
};

type FormData = Omit<AdminMatch, "id">;

const EMPTY_FORM: FormData = {
  sport: "Cricket", round: "Group Stage", title: "",
  date: "", time: "", location: "", status: "upcoming", score: "",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function MatchesPage() {
  const { loading } = useAdminAuth();
  const [items, setItems] = useState<AdminMatch[]>([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { setItems(matchesStore.getAll()); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (!q || item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q)) &&
      (sportFilter === "all" || item.sport === sportFilter) &&
      (statusFilter === "all" || item.status === statusFilter)
    );
  }), [items, search, sportFilter, statusFilter]);

  function reload() { setItems(matchesStore.getAll()); }

  function openAdd() { setEditId(null); setForm(EMPTY_FORM); setFormErrors({}); setShowModal(true); }
  function openEdit(item: AdminMatch) {
    setEditId(item.id);
    setForm({ sport: item.sport, round: item.round, title: item.title, date: item.date, time: item.time, location: item.location, status: item.status, score: item.score });
    setFormErrors({}); setShowModal(true);
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.date.trim()) errs.date = "Date is required.";
    if (!form.time.trim()) errs.time = "Time is required.";
    if (!form.location.trim()) errs.location = "Location is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    if (editId) { matchesStore.update(editId, form); } else { matchesStore.add(form); }
    reload(); setShowModal(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    matchesStore.remove(deleteId); reload(); setDeleteId(null);
  }

  const columns: TableColumn<AdminMatch>[] = [
    {
      key: "#", label: "#", headerClassName: "text-left w-10",
      render: (_, idx) => <span className="text-gray-400 text-xs">{idx}</span>,
    },
    {
      key: "sport", label: "Sport", sortable: true, getValue: (item) => item.sport,
      render: (item) => <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#0B1C2D]/8 text-[#0B1C2D]">{item.sport}</span>,
    },
    {
      key: "round", label: "Round", sortable: true, getValue: (item) => item.round,
      render: (item) => <span className="text-gray-500 text-xs whitespace-nowrap">{item.round}</span>,
    },
    {
      key: "title", label: "Match", sortable: true, getValue: (item) => item.title,
      className: "max-w-[200px]",
      render: (item) => <p className="font-medium text-[#0B1C2D] truncate">{item.title}</p>,
    },
    {
      key: "date", label: "Date & Time", sortable: true, getValue: (item) => item.date,
      render: (item) => (
        <div>
          <p className="text-gray-600 whitespace-nowrap text-xs">{item.date}</p>
          <p className="text-gray-400 text-xs">{item.time}</p>
        </div>
      ),
    },
    {
      key: "location", label: "Location", className: "max-w-[150px]",
      render: (item) => <p className="text-gray-600 truncate">{item.location}</p>,
    },
    {
      key: "score", label: "Score",
      render: (item) => item.score
        ? <span className="text-gray-600 whitespace-nowrap">{item.score}</span>
        : <span className="text-gray-300">—</span>,
    },
    {
      key: "status", label: "Status", sortable: true, getValue: (item) => item.status,
      render: (item) => (
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border capitalize", STATUS_STYLE[item.status])}>{item.status}</span>
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
          <h2 className="text-xl font-bold text-[#0B1C2D]">Match Schedule</h2>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} total matches</p>
        </div>
        <Button onClick={openAdd} className="bg-[#C62828] hover:bg-[#a82020] text-white gap-2 shadow-sm">
          <Plus className="size-4" /> Add Match
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search by title or location…" value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {(search || sportFilter !== "all" || statusFilter !== "all") && (
            <Button variant="outline" onClick={() => { setSearch(""); setSportFilter("all"); setStatusFilter("all"); }} className="gap-2 shrink-0">
              <RotateCcw className="size-3.5" /> Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Showing <span className="font-medium text-[#0B1C2D]">{filtered.length}</span> of {items.length} matches
        </p>
      </div>

      {/* Table with sorting + pagination */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        emptyMessage="No matches found."
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={showModal}
        onOpenChange={setShowModal}
        title={editId ? "Edit Match" : "Add New Match"}
        subtitle={editId ? "Update match details below." : "Fill in the details to schedule a new match."}
        size="xl"
        onSave={handleSave}
        saveLabel={editId ? "Save Changes" : "Add Match"}
      >
        <div>
          <Label className="text-xs font-medium text-gray-700">Match Title <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Mumbai Warriors vs Delhi Thunders" />
          <FieldError msg={formErrors.title} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Sport</Label>
            <Select value={form.sport} onValueChange={(v) => setForm({ ...form, sport: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Round</Label>
            <Select value={form.round} onValueChange={(v) => setForm({ ...form, round: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{ROUNDS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Date <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Apr 15, 2026" />
            <FieldError msg={formErrors.date} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Time <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="e.g. 10:00 AM" />
            <FieldError msg={formErrors.time} />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700">Location <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Wankhede Stadium, Mumbai" />
          <FieldError msg={formErrors.location} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as MatchStatus })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Score <span className="text-gray-400 font-normal">(optional)</span></Label>
            <Input className="mt-1.5" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} placeholder="e.g. 6-4, 7-5" />
          </div>
        </div>
      </AdminModal>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this match?</AlertDialogTitle>
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
