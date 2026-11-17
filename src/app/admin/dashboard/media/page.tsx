"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, RotateCcw, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AdminModal } from "@/components/admin/AdminModal";
import { DataTable, type TableColumn } from "@/components/admin/DataTable";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { mediaStore, type AdminMedia, type MediaType } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const SPORTS = ["Cricket", "Football", "Badminton", "Basketball", "Tennis", "Athletics", "Hockey", "Event", "Chess"];

type FormData = Omit<AdminMedia, "id">;

const EMPTY_FORM: FormData = {
  thumbnail: "/images/event-1.png", title: "", tag: "Cricket",
  videoUrl: "", type: "videos", duration: "", date: "", status: "published",
};

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-red-500 mt-1">{msg}</p>;
}

export default function MediaPage() {
  const { loading } = useAdminAuth();
  const [items, setItems] = useState<AdminMedia[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [imageError, setImageError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadMedia() {
      try {
        const response = await fetch("/api/media?all=true", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data.success || !Array.isArray(data.items)) {
          throw new Error(data.errors?.join(", ") || "Unable to load media.");
        }
        if (mounted) setItems(data.items.length ? data.items : mediaStore.getAll());
      } catch (error) {
        console.error("Fetch admin media error:", error);
        toast.error("Could not load media from the server. Showing locally saved items if available.");
        if (mounted) setItems(mediaStore.getAll());
      }
    }
    void loadMedia();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => items.filter((item) => {
    const q = search.toLowerCase();
    return (
      (!q || item.title.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)) &&
      (typeFilter === "all" || item.type === typeFilter) &&
      (statusFilter === "all" || item.status === statusFilter) &&
      (tagFilter === "all" || item.tag === tagFilter)
    );
  }), [items, search, typeFilter, statusFilter, tagFilter]);

  function openAdd() { setEditId(null); setForm(EMPTY_FORM); setFormErrors({}); setImageError(""); setShowModal(true); }
  function openEdit(item: AdminMedia) {
    setEditId(item.id);
    setForm({ thumbnail: item.thumbnail, videoUrl: item.videoUrl || "", title: item.title, tag: item.tag, type: item.type, duration: item.duration, date: item.date, status: item.status });
    setFormErrors({}); setImageError(""); setShowModal(true);
  }

  async function handleThumbnailChange(file?: File) {
    setImageError("");
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setImageError("Choose a PNG, JPEG, or WebP image.");
      return;
    }
    if (file.size === 0 || file.size > 2 * 1024 * 1024) {
      setImageError("The thumbnail must be 2 MB or smaller.");
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    try {
      const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const preview = new window.Image();
        preview.onload = () => resolve({ width: preview.naturalWidth, height: preview.naturalHeight });
        preview.onerror = () => reject(new Error("The selected image could not be read."));
        preview.src = previewUrl;
      });
      if (dimensions.width !== 1200 || dimensions.height !== 600) {
        setImageError("Use an image that is exactly 1200 × 600 pixels.");
        return;
      }
      const imageData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(new Error("The image could not be read."));
        reader.onerror = () => reject(new Error("The image could not be read."));
        reader.readAsDataURL(file);
      });
      setForm((current) => ({ ...current, thumbnail: imageData }));
    } catch (error) {
      setImageError(error instanceof Error ? error.message : "The selected image could not be read.");
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (imageError) errs.thumbnail = imageError;
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.date.trim()) errs.date = "Date is required.";
    if (form.videoUrl && !/^https?:\/\/\S+$/i.test(form.videoUrl.trim())) errs.videoUrl = "Enter a valid HTTP or HTTPS video URL.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    const isRemoteRecord = Boolean(editId && /^[a-f\d]{24}$/i.test(editId));
    try {
      const response = await fetch(isRemoteRecord ? `/api/media/${editId}` : "/api/media", {
        method: isRemoteRecord ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.errors?.join(", ") || "Unable to save media.");
        return;
      }
      setItems((current) => {
        const next = current.filter((item) => item.id !== editId);
        return [data.item, ...next];
      });
      toast.success(editId ? "Media updated." : "Media added.");
      setShowModal(false);
    } catch {
      toast.error("Unable to save media. Please check your connection and try again.");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      if (/^[a-f\d]{24}$/i.test(deleteId)) {
        const response = await fetch(`/api/media/${deleteId}`, { method: "DELETE" });
        const data = await response.json();
        if (!response.ok || !data.success) {
          toast.error(data.errors?.join(", ") || "Unable to delete media.");
          return;
        }
      } else {
        mediaStore.remove(deleteId);
      }
      setItems((current) => current.filter((item) => item.id !== deleteId));
      setDeleteId(null);
      toast.success("Media deleted.");
    } catch {
      toast.error("Unable to delete media. Please try again.");
    }
  }

  const columns: TableColumn<AdminMedia>[] = [
    {
      key: "#", label: "#", headerClassName: "text-left w-10",
      render: (_, idx) => <span className="text-gray-400 text-xs">{idx}</span>,
    },
    {
      key: "thumbnail", label: "Thumbnail",
      render: (item) => (
        <div className="relative size-14 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
          <Image src={item.thumbnail} alt="" fill sizes="56px" className="object-cover" />
        </div>
      ),
    },
    {
      key: "type", label: "Type", sortable: true, getValue: (item) => item.type,
      render: (item) => (
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border capitalize", item.type === "videos" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200")}>
          {item.type === "videos" ? "Video" : "Photo"}
        </span>
      ),
    },
    {
      key: "title", label: "Title", sortable: true, getValue: (item) => item.title,
      className: "max-w-[220px]",
      render: (item) => <p className="font-medium text-[#0B1C2D] truncate">{item.title}</p>,
    },
    {
      key: "tag", label: "Tag", sortable: true, getValue: (item) => item.tag,
      render: (item) => <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[#0B1C2D]/8 text-[#0B1C2D]">{item.tag}</span>,
    },
    {
      key: "duration", label: "Duration",
      render: (item) => item.duration
        ? <span className="text-gray-500 font-mono text-xs">{item.duration}</span>
        : <span className="text-gray-300">—</span>,
    },
    {
      key: "date", label: "Date", sortable: true, getValue: (item) => item.date,
      render: (item) => <span className="text-gray-500 whitespace-nowrap">{item.date}</span>,
    },
    {
      key: "status", label: "Status", sortable: true, getValue: (item) => item.status,
      render: (item) => (
        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium border capitalize", item.status === "published" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200")}>
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

  const hasFilters = search || typeFilter !== "all" || statusFilter !== "all" || tagFilter !== "all";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#0B1C2D]">Media Gallery</h2>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} media items</p>
        </div>
        <PrimaryButton onClick={openAdd} className="gap-2 shadow-sm">
          <Plus className="size-4" /> Add Media
        </PrimaryButton>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {([{ label: "Total", value: items.length, color: "text-[#0B1C2D]" }, { label: "Videos", value: items.filter(i => i.type === "videos").length, color: "text-blue-600" }, { label: "Photos", value: items.filter(i => i.type === "photos").length, color: "text-purple-600" }, { label: "Published", value: items.filter(i => i.status === "published").length, color: "text-green-600" }]).map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
            <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-50">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input className="pl-9" placeholder="Search by title or tag…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
              <SelectItem value="photos">Photos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={tagFilter} onValueChange={setTagFilter}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="All Tags" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tags</SelectItem>
              {SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="outline" onClick={() => { setSearch(""); setTypeFilter("all"); setStatusFilter("all"); setTagFilter("all"); }} className="gap-2 shrink-0">
              <RotateCcw className="size-3.5" /> Reset
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Showing <span className="font-medium text-[#0B1C2D]">{filtered.length}</span> of {items.length} items
        </p>
      </div>

      {/* Table with sorting + pagination */}
      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(item) => item.id}
        emptyMessage="No media items found."
      />

      {/* Add / Edit Modal */}
      <AdminModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) setImageError("");
        }}
        title={editId ? "Edit Media" : "Add Media Item"}
        subtitle={editId ? "Update the media details." : "Fill in the details to add a new media item."}
        size="lg"
        onSave={handleSave}
        saveLabel={editId ? "Save Changes" : "Add Media"}
      >
        <div>
          <Label className="text-xs font-medium text-gray-700">Title <span className="text-red-500">*</span></Label>
          <Input className="mt-1.5" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Cricket Championship — Match Highlights" />
          <FieldError msg={formErrors.title} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-medium text-gray-700">Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as MediaType, videoUrl: v === "photos" ? "" : form.videoUrl })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="videos">Video</SelectItem>
                <SelectItem value="photos">Photo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Sport Tag</Label>
            <Select value={form.tag} onValueChange={(v) => setForm({ ...form, tag: v })}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="media-thumbnail" className="text-xs font-medium text-gray-700">Media Thumbnail</Label>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">Required dimensions: 1200 × 600 px. PNG, JPEG, or WebP; maximum 2 MB.</p>
          <label htmlFor="media-thumbnail" className="mt-2 flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-600 transition-colors hover:border-[#C62828] hover:text-[#C62828]">
            <ImagePlus className="size-4 shrink-0" />
            {editId ? "Change thumbnail" : "Choose thumbnail"}
          </label>
          <input
            id="media-thumbnail"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              void handleThumbnailChange(file);
            }}
          />
          {form.thumbnail && (
            <div className="relative mt-3 aspect-[2/1] overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
              <Image src={form.thumbnail} alt={`${form.title || "Media"} thumbnail preview`} fill unoptimized className="object-cover" />
            </div>
          )}
          <FieldError msg={imageError} />
        </div>
        {form.type === "videos" && (
          <div>
            <Label htmlFor="media-video-url" className="text-xs font-medium text-gray-700">Video URL</Label>
            <Input id="media-video-url" className="mt-1.5" type="url" value={form.videoUrl || ""} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} placeholder="YouTube, Vimeo, or direct video URL" />
            <p className="mt-1 text-xs text-gray-400">Add a public video link so users can play the video from its card.</p>
            <FieldError msg={formErrors.videoUrl} />
          </div>
        )}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-xs font-medium text-gray-700">Date <span className="text-red-500">*</span></Label>
            <Input className="mt-1.5" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Mar 20, 2026" />
            <FieldError msg={formErrors.date} />
          </div>
          <div>
            <Label className="text-xs font-medium text-gray-700">Duration <span className="text-gray-400 font-normal">(video only)</span></Label>
            <Input className="mt-1.5" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 4:32" />
          </div>
        </div>
        <div>
          <Label className="text-xs font-medium text-gray-700">Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as "published" | "draft" })}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </AdminModal>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this media item?</AlertDialogTitle>
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
