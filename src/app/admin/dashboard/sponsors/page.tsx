"use client";

import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, RotateCcw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminModal } from "@/components/admin/AdminModal";
import { DataTable, type TableColumn } from "@/components/admin/DataTable";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { sponsorsStore, type AdminSponsor, type SponsorTier } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const TIERS: SponsorTier[] = ["title", "gold", "silver", "bronze"];

const TIER_STYLE: Record<SponsorTier, string> = {
  title: "bg-[#0B1C2D] text-white border-[#0B1C2D]",
  gold: "bg-amber-50 text-amber-700 border-amber-300",
  silver: "bg-gray-100 text-gray-600 border-gray-300",
  bronze: "bg-orange-50 text-orange-700 border-orange-200",
};

type FormData = Omit<AdminSponsor, "id">;

const EMPTY_FORM: FormData = {
  name: "", tier: "gold", website: "", logo: "/images/event-1.png", status: "active",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function SponsorsPage() {
  const { loading } = useAdminAuth();
  const [items, setItems] = useState<AdminSponsor[]>([]);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { setItems(sponsorsStore.getAll()); }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (!q || item.name.toLowerCase().includes(q)) &&
      (tierFilter === "all" || item.tier === tierFilter) &&
      (statusFilter === "all" || item.status === statusFilter)
    );
  }), [items, search, tierFilter, statusFilter]);

  function reload() { setItems(sponsorsStore.getAll()); }

  function openAdd() { setEditId(null); setForm(EMPTY_FORM); setFormErrors({}); setShowModal(true); }
  function openEdit(item: AdminSponsor) {
    setEditId(item.id);
    setForm({ name: item.name, tier: item.tier, website: item.website, logo: item.logo, status: item.status });
    setFormErrors({}); setShowModal(true);
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = "Sponsor name is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    if (editId) { sponsorsStore.update(editId, form); } else { sponsorsStore.add(form); }
    reload(); setShowModal(false);
  }

  function handleDelete() {
    if (!deleteId) return;
    sponsorsStore.remove(deleteId); reload(); setDeleteId(null);
  }

  const columns: TableColumn<AdminSponsor>[] = [
    {
      key: "#", label: "#", headerClassName: "text-left w-10",
      render: (_, idx) => <span className="text-gray-400 text-xs">{idx}</span>,
    },
    {
      key: "name", label: "Sponsor Name", sortable: true, getValue: (item) => item.name,
      render: (item) => <span className="font-medium text-[#0B1C2D]">{item.name}</span>,
    },
    {
      key: "tier", label: "Tier", sortable: true, getValue: (item) => item.tier,
      render: (item) => (
        <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", TIER_STYLE[item.tier])}>{item.tier}</span>
      ),
    },
    {
      key: "website", label: "Website",
      render: (item) => item.website ? (
        <a href={item.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline text-xs">
          {item.website.replace("https://", "")} <ExternalLink className="size-3" />
        </a>
      ) : <span className="text-gray-300">—</span>,
    },
    {
      key: "status", label: "Status", sortable: true, getValue: (item) => item.status,
      render: (item) => (
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border capitalize", item.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-500 border-gray-200")}>{item.status}</span>
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
          <h2 className="text-xl font-bold text-[#0B1C2D]">Sponsors</h2>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} sponsors listed</p>
        </div>
        <Button onClick={openAdd} className="bg-[#C62828] hover:bg-[#a82020] text-white gap-2 shadow-sm">
          <Plus className="size-4" /> Add Sponsor
        </Button>
      </div>

      {/* Tier summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TIERS.map((tier) => {
          const count = items.filter((s) => s.tier === tier).length;
          return (
            <div key={tier} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
              <p className="text-2xl font-bold text-[#0B1C2D]">{count}</p>
              <span className={cn("mt-1 px-2 py-0.5 rounded-full text-xs font-medium border capitalize inline-block", TIER_STYLE[tier])}>{tier}</span>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search by sponsor name…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Tiers" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              {TIERS.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          {(search || tierFilter !== "all" || statusFilter !== "all") && (
            <Button variant="outline" onClick={() => { setSearch(""); setTierFilter("all"); setStatusFilter("all"); }} className="gap-2 shrink-0">
              <RotateCcw className="size-3.5" /> Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Showing <span className="font-medium text-[#0B1C2D]">{filtered.length}</span> of {items.length} sponsors
        </p>
      </div>

      {/* Table with sorting + pagination */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        emptyMessage="No sponsors found."
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={showModal}
        onOpenChange={setShowModal}
        title={editId ? "Edit Sponsor" : "Add New Sponsor"}
        subtitle={editId ? "Update the sponsor details." : "Fill in the details to add a new sponsor."}
        size="md"
        onSave={handleSave}
        saveLabel={editId ? "Save Changes" : "Add Sponsor"}
      >
        <div>
          <Label className="text-xs font-medium text-gray-700">Sponsor Name <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. SportZone India" />
          <FieldError msg={formErrors.name} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs font-medium text-gray-700">Partnership Tier</Label>
            <Select value={form.tier} onValueChange={(v) => setForm({ ...form, tier: v as SponsorTier })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{TIERS.map((t) => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
            </Select>
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
        <div>
          <Label className="text-xs font-medium text-gray-700">Website URL</Label>
          <Input className="mt-1.5" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="e.g. https://sportzone.in" />
        </div>
      </AdminModal>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this sponsor?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently remove the sponsor from the system.</AlertDialogDescription>
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
