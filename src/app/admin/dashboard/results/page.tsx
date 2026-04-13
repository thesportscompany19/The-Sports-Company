"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminModal } from "@/components/admin/AdminModal";
import { DataTable, type TableColumn } from "@/components/admin/DataTable";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { resultsStore, type AdminResult } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Athletics", "Hockey", "Volleyball"];

type FormData = Omit<AdminResult, "id">;

const EMPTY_FORM: FormData = {
  sport: "Cricket", event: "", winner: "", runner: "", date: "", score: "", venue: "",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function ResultsPage() {
  const { loading } = useAdminAuth();
  const [items, setItems] = useState<AdminResult[]>([]);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { setItems(resultsStore.getAll()); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (!q || item.event.toLowerCase().includes(q) || item.winner.toLowerCase().includes(q) || item.runner.toLowerCase().includes(q)) &&
      (sportFilter === "all" || item.sport === sportFilter)
    );
  }), [items, search, sportFilter]);

  function reload() { setItems(resultsStore.getAll()); }

  function openAdd() { setEditId(null); setForm(EMPTY_FORM); setFormErrors({}); setShowModal(true); }
  function openEdit(item: AdminResult) {
    setEditId(item.id);
    setForm({ sport: item.sport, event: item.event, winner: item.winner, runner: item.runner, date: item.date, score: item.score, venue: item.venue });
    setFormErrors({}); setShowModal(true);
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.event.trim()) errs.event = "Event name is required.";
    if (!form.winner.trim()) errs.winner = "Winner is required.";
    if (!form.runner.trim()) errs.runner = "Runner-up is required.";
    if (!form.date.trim()) errs.date = "Date is required.";
    if (!form.score.trim()) errs.score = "Score is required.";
    if (!form.venue.trim()) errs.venue = "Venue is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    if (editId) { resultsStore.update(editId, form); } else { resultsStore.add(form); }
    reload(); setShowModal(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    resultsStore.remove(deleteId); reload(); setDeleteId(null);
  }

  const columns: TableColumn<AdminResult>[] = [
    {
      key: "#", label: "#", headerClassName: "text-left w-10",
      render: (_, idx) => <span className="text-gray-400 text-xs">{idx}</span>,
    },
    {
      key: "sport", label: "Sport", sortable: true, getValue: (item) => item.sport,
      render: (item) => <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#0B1C2D]/8 text-[#0B1C2D]">{item.sport}</span>,
    },
    {
      key: "event", label: "Event", sortable: true, getValue: (item) => item.event,
      className: "max-w-[180px]",
      render: (item) => <p className="font-medium text-[#0B1C2D] truncate">{item.event}</p>,
    },
    {
      key: "winner", label: "Winner",
      render: (item) => (
        <div className="flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
          <span className="text-gray-700 font-medium whitespace-nowrap">{item.winner}</span>
        </div>
      ),
    },
    {
      key: "runner", label: "Runner-up",
      render: (item) => <span className="text-gray-500 whitespace-nowrap">{item.runner}</span>,
    },
    {
      key: "score", label: "Score",
      render: (item) => <span className="text-gray-600 font-mono text-xs whitespace-nowrap">{item.score}</span>,
    },
    {
      key: "date", label: "Date", sortable: true, getValue: (item) => item.date,
      render: (item) => <span className="text-gray-500 whitespace-nowrap">{item.date}</span>,
    },
    {
      key: "venue", label: "Venue",
      className: "max-w-[150px]",
      render: (item) => <p className="text-gray-500 truncate">{item.venue}</p>,
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
          <h2 className="text-xl font-bold text-[#0B1C2D]">Recent Results</h2>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} recorded results</p>
        </div>
        <PrimaryButton onClick={openAdd} className="gap-2 shadow-sm">
          <Plus className="size-4" /> Add Result
        </PrimaryButton>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search by event or player…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={sportFilter} onValueChange={setSportFilter}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Sports" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {(search || sportFilter !== "all") && (
            <Button variant="outline" onClick={() => { setSearch(""); setSportFilter("all"); }} className="gap-2 shrink-0">
              <RotateCcw className="size-3.5" /> Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Showing <span className="font-medium text-[#0B1C2D]">{filtered.length}</span> of {items.length} results
        </p>
      </div>

      {/* Table with sorting + pagination */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        emptyMessage="No results found."
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={showModal}
        onOpenChange={setShowModal}
        title={editId ? "Edit Result" : "Add New Result"}
        subtitle={editId ? "Update the result details." : "Enter the details for the new result."}
        size="xl"
        onSave={handleSave}
        saveLabel={editId ? "Save Changes" : "Add Result"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Sport</Label>
            <Select value={form.sport} onValueChange={(v) => setForm({ ...form, sport: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Date <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Mar 12, 2026" />
            <FieldError msg={formErrors.date} />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700">Event Name <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.event} onChange={(e) => setForm({ ...form, event: e.target.value })} placeholder="e.g. Summer Tennis Open 2026" />
          <FieldError msg={formErrors.event} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Winner <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.winner} onChange={(e) => setForm({ ...form, winner: e.target.value })} placeholder="e.g. Rajesh Kumar" />
            <FieldError msg={formErrors.winner} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Runner-up <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.runner} onChange={(e) => setForm({ ...form, runner: e.target.value })} placeholder="e.g. Arjun Mehta" />
            <FieldError msg={formErrors.runner} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Score / Result <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} placeholder="e.g. 6-4, 7-5" />
            <FieldError msg={formErrors.score} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Venue <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. DLTA Complex, Delhi" />
            <FieldError msg={formErrors.venue} />
          </div>
        </div>
      </AdminModal>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this result?</AlertDialogTitle>
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
