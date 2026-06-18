import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ImageUpload({
  bucket,
  value,
  onChange,
  label = "Image",
}: {
  bucket: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) {
      toast.error(error.message);
      setBusy(false);
      return;
    }
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    onChange(data.publicUrl);
    setBusy(false);
    toast.success("Uploaded");
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="" className="h-16 w-16 rounded-lg object-cover" />}
        <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-dashed border-border bg-input px-3 py-2 text-xs hover:border-primary">
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {value ? "Replace" : "Upload"}
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
          />
        </label>
        {value && (
          <button type="button" onClick={() => onChange(null)} className="text-xs text-muted-foreground hover:text-destructive">
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
