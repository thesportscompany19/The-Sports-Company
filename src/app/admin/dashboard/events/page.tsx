"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Search, Edit2, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AdminModal } from "@/components/admin/AdminModal";
import { DataTable, type TableColumn } from "@/components/admin/DataTable";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface AdminEvent {
  id: string;
  image: string;
  tag: string;
  title: string;
  date: string;
  location: string;
  entryFee: string;
  prize: string;
  status: EventStatus;
  createdAt: string;
}

const SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Athletics", "Hockey", "Volleyball"];
const STATUSES: EventStatus[] = ["upcoming", "ongoing", "completed", "cancelled"];

const STATUS_STYLE: Record<EventStatus, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  ongoing: "bg-green-50 text-green-700 border-green-200",
  completed: "bg-gray-100 text-gray-600 border-gray-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

type FormData = Omit<AdminEvent, "id" | "createdAt">;

const EMPTY_FORM: FormData = {
  image: "/images/event-1.png",
  tag: "Cricket",
  title: "",
  date: "",
  location: "",
  entryFee: "",
  prize: "",
  status: "upcoming",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function EventsPage() {
  const { loading } = useAdminAuth();

  const [items, setItems] = useState<AdminEvent[]>([]);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.success) setItems(data.events);
    } catch {
      toast.error("Failed to load events.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const q = search.toLowerCase();
      const matchSearch = !q || item.title.toLowerCase().includes(q) || item.location.toLowerCase().includes(q);
      const matchSport = sportFilter === "all" || item.tag === sportFilter;
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchSport && matchStatus;
    });
  }, [items, search, sportFilter, statusFilter]);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setShowModal(true);
  }

  function openEdit(item: AdminEvent) {
    setEditId(item.id);
    setForm({ image: item.image, tag: item.tag, title: item.title, date: item.date, location: item.location, entryFee: item.entryFee, prize: item.prize, status: item.status });
    setFormErrors({});
    setShowModal(true);
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.date.trim()) errs.date = "Date is required.";
    if (!form.location.trim()) errs.location = "Location is required.";
    if (!form.entryFee.trim()) errs.entryFee = "Entry fee is required.";
    if (!form.prize.trim()) errs.prize = "Prize is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    try {
      const url = editId ? `/api/events/${editId}` : "/api/events";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, createdAt: new Date().toISOString().split("T")[0] }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.errors?.join(", ") || "Failed to save event.");
        return;
      }
      toast.success(editId ? "Event updated!" : "Event created!");
      await fetchEvents();
      setShowModal(false);
    } catch {
      toast.error("Network error. Please try again.");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/events/${deleteId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.errors?.join(", ") || "Failed to delete event.");
        return;
      }
      toast.success("Event deleted!");
      await fetchEvents();
    } catch {
      toast.error("Network error. Please try again.");
    }
    setDeleteId(null);
  }

  function resetFilters() {
    setSearch("");
    setSportFilter("all");
    setStatusFilter("all");
  }

  const columns: TableColumn<AdminEvent>[] = [
    {
      key: "#", label: "#", headerClassName: "text-left w-10",
      render: (_, idx) => <span className="text-gray-400 text-xs">{idx}</span>,
    },
    {
      key: "tag", label: "Sport", sortable: true, getValue: (item) => item.tag,
      render: (item) => <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#0B1C2D]/8 text-[#0B1C2D]">{item.tag}</span>,
    },
    {
      key: "title", label: "Event Title", sortable: true, getValue: (item) => item.title,
      className: "max-w-[200px]",
      render: (item) => <p className="font-medium text-[#0B1C2D] truncate">{item.title}</p>,
    },
    {
      key: "date", label: "Date", sortable: true, getValue: (item) => item.date,
      render: (item) => <span className="text-gray-600 whitespace-nowrap">{item.date}</span>,
    },
    {
      key: "location", label: "Location", className: "max-w-[160px]",
      render: (item) => <p className="text-gray-600 truncate">{item.location}</p>,
    },
    {
      key: "entryFee", label: "Entry Fee",
      render: (item) => <span className="text-gray-600 whitespace-nowrap">{item.entryFee}</span>,
    },
    {
      key: "prize", label: "Prize",
      render: (item) => <span className="text-gray-600 whitespace-nowrap">{item.prize}</span>,
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

 
  if (loading || fetching) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <span className="size-8 border-2 border-[#C62828]/30 border-t-[#C62828] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B1C2D]">Events Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} total events</p>
        </div>
        <Button onClick={openAdd} className="bg-[#C62828] hover:bg-[#a82020] text-white gap-2 shadow-sm">
          <Plus className="size-4" /> Add Event
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
            <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
            </SelectContent>
          </Select>
          {(search || sportFilter !== "all" || statusFilter !== "all") && (
            <Button variant="outline" onClick={resetFilters} className="gap-2 shrink-0">
              <RotateCcw className="size-3.5" /> Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Showing <span className="font-medium text-[#0B1C2D]">{filtered.length}</span> of {items.length} events
        </p>
      </div>

      {/* Table with sorting + pagination */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        emptyMessage="No events found matching your criteria."
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={showModal}
        onOpenChange={setShowModal}
        title={editId ? "Edit Event" : "Add New Event"}
        subtitle={editId ? "Update the event details below." : "Fill in the details to create a new event."}
        size="xl"
        onSave={handleSave}
        saveLabel={editId ? "Save Changes" : "Add Event"}
      >
        <div>
          <Label className="text-xs font-medium text-gray-700">Event Title <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Inter-City Cricket Championship 2026" />
          <FieldError msg={formErrors.title} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Sport <span className="text-red-500">*</span></Label>
            <Select value={form.tag} onValueChange={(v) => setForm({ ...form, tag: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Status <span className="text-red-500">*</span></Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as EventStatus })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Date <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. April 15, 2026" />
            <FieldError msg={formErrors.date} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Location <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Nehru Stadium, Mumbai" />
            <FieldError msg={formErrors.location} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Entry Fee <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.entryFee} onChange={(e) => setForm({ ...form, entryFee: e.target.value })} placeholder="e.g. ₹199 per player" />
            <FieldError msg={formErrors.entryFee} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Prize <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.prize} onChange={(e) => setForm({ ...form, prize: e.target.value })} placeholder="e.g. ₹50,000 Winner Prize" />
            <FieldError msg={formErrors.prize} />
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The event will be permanently removed from the system.</AlertDialogDescription>
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
