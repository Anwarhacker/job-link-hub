import React, { useState, useEffect } from "react";
import { LinkDTO } from "@/models/Link";
import { AVAILABLE_ICONS, DynamicIcon } from "./DynamicIcon";
import { Plus, Check, X, AlertCircle, Layers, PlusCircle, Trash2 } from "lucide-react";

interface AdminLinkFormProps {
  editingLink: LinkDTO | null;
  onSubmit: (linkData: Partial<LinkDTO> | Partial<LinkDTO>[]) => Promise<void>;
  onCancelEdit?: () => void;
  isSubmitting?: boolean;
}

interface BulkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  order: number;
}

export const AdminLinkForm: React.FC<AdminLinkFormProps> = ({
  editingLink,
  onSubmit,
  onCancelEdit,
  isSubmitting = false,
}) => {
  const [mode, setMode] = useState<"single" | "bulk">("single");

  // Single Link state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("link");
  const [order, setOrder] = useState<number>(1);
  const [active, setActive] = useState(true);

  // Bulk Links state
  const [bulkItems, setBulkItems] = useState<BulkItem[]>([
    { id: "1", title: "", description: "", url: "", icon: "linkedin", order: 1 },
    { id: "2", title: "", description: "", url: "", icon: "naukri", order: 2 },
  ]);

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (editingLink) {
      setMode("single");
      setTitle(editingLink.title || "");
      setDescription(editingLink.description || "");
      setUrl(editingLink.url || "");
      setIcon(editingLink.icon || "link");
      setOrder(editingLink.order ?? 1);
      setActive(editingLink.active ?? true);
      setFormError(null);
    } else {
      resetSingleForm();
    }
  }, [editingLink]);

  const resetSingleForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setIcon("link");
    setOrder(1);
    setActive(true);
    setFormError(null);
  };

  const handleAddBulkRow = () => {
    setBulkItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: "",
        description: "",
        url: "",
        icon: "link",
        order: prev.length + 1,
      },
    ]);
  };

  const handleRemoveBulkRow = (id: string) => {
    if (bulkItems.length === 1) return;
    setBulkItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBulkChange = (id: string, field: keyof BulkItem, value: string | number) => {
    setBulkItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!title.trim()) return setFormError("Title is required");
    if (!description.trim()) return setFormError("Description is required");
    if (!url.trim()) return setFormError("URL is required");

    try {
      new URL(url.trim());
    } catch {
      return setFormError("Please enter a valid URL (e.g. https://github.com/username)");
    }

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        url: url.trim(),
        icon,
        order: Number(order) || 0,
        active,
      });

      if (!editingLink) {
        resetSingleForm();
      }
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save link");
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const validItems: Partial<LinkDTO>[] = [];
    for (let i = 0; i < bulkItems.length; i++) {
      const item = bulkItems[i];
      if (!item.title.trim() && !item.url.trim()) continue; // skip completely empty rows

      if (!item.title.trim()) {
        return setFormError(`Row #${i + 1}: Title is required`);
      }
      if (!item.description.trim()) {
        return setFormError(`Row #${i + 1}: Description is required`);
      }
      if (!item.url.trim()) {
        return setFormError(`Row #${i + 1}: URL is required`);
      }

      try {
        new URL(item.url.trim());
      } catch {
        return setFormError(`Row #${i + 1}: Invalid URL "${item.url}"`);
      }

      validItems.push({
        title: item.title.trim(),
        description: item.description.trim(),
        url: item.url.trim(),
        icon: item.icon,
        order: Number(item.order) || i + 1,
        active: true,
      });
    }

    if (validItems.length === 0) {
      return setFormError("Please fill out at least one link row.");
    }

    try {
      await onSubmit(validItems);
      setBulkItems([
        { id: "1", title: "", description: "", url: "", icon: "linkedin", order: 1 },
        { id: "2", title: "", description: "", url: "", icon: "naukri", order: 2 },
      ]);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to add bulk links");
    }
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl backdrop-blur-md">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          {editingLink ? "Edit Link" : mode === "single" ? "Add Single Link" : "Add Multiple Links"}
        </h3>

        {!editingLink && (
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMode("single")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                mode === "single"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Single URL
            </button>
            <button
              type="button"
              onClick={() => setMode("bulk")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1 ${
                mode === "bulk"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Multiple URLs
            </button>
          </div>
        )}

        {editingLink && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg transition-colors"
          >
            <X className="w-3.5 h-3.5" /> Cancel Edit
          </button>
        )}
      </div>

      {formError && (
        <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* SINGLE LINK FORM */}
      {mode === "single" ? (
        <form onSubmit={handleSingleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Junior Developer Hiring Post"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Icon
              </label>
              <div className="relative">
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 capitalize appearance-none"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic} value={ic} className="bg-slate-900 text-slate-100">
                      {ic}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <DynamicIcon name={icon} className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Description *
            </label>
            <input
              type="text"
              placeholder="e.g. View Junior Developer role on LinkedIn / Naukri"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Destination URL *
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/jobs/view/123456"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="pt-5">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900"
                />
                <span className="text-sm font-medium text-slate-200">
                  Active (Visible on bio)
                </span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all duration-200 disabled:opacity-50"
            >
              {editingLink ? (
                <>
                  <Check className="w-4 h-4" /> Update Link
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Add Link
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* BULK MULTI-LINK FORM */
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">
            Add multiple job links, Naukri posts, or URLs at once:
          </p>

          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            {bulkItems.map((item, index) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3 relative group"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>URL Card #{index + 1}</span>
                  {bulkItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBulkRow(item.id)}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/50 transition-colors"
                      title="Remove row"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Title (e.g. Junior Developer Post)"
                    value={item.title}
                    onChange={(e) => handleBulkChange(item.id, "title", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                  />

                  <select
                    value={item.icon}
                    onChange={(e) => handleBulkChange(item.id, "icon", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 capitalize"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Short Description (e.g. View role on LinkedIn / Naukri)"
                  value={item.description}
                  onChange={(e) => handleBulkChange(item.id, "description", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />

                <input
                  type="url"
                  placeholder="URL (https://linkedin.com/jobs/... or https://naukri.com/...)"
                  value={item.url}
                  onChange={(e) => handleBulkChange(item.id, "url", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleAddBulkRow}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-indigo-400" /> Add Another URL Row
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg shadow-indigo-600/20 transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Save All {bulkItems.length} Links
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
