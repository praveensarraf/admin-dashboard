import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { uploadTasksFile, fetchTasks } from "../redux/slices/taskSlice";
import { Loader2 } from "lucide-react";

export default function UploadTasks() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const { uploadLoading, error } = useSelector((state) => state.tasks);

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a file!");
    }

    try {
      const res = await dispatch(uploadTasksFile(file)).unwrap();
      if (res.success) {
        toast.success(res.message || "Uploaded successfully!");
        setFile(null);
        dispatch(fetchTasks());
      } else {
        toast.error(res.message || "Upload failed.");
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Upload failed!";
      toast.error(errorMessage);
    }
  };



  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="p-6 space-y-4 max-w-md mx-auto bg-zinc-800 rounded-lg shadow-md text-white">
      <h2 className="text-2xl font-bold">Upload Tasks File</h2>
      <p className="text-[0.8rem] text-muted-foreground md:text-nowrap">
        Upload a <code>.csv</code>, <code>.xlsx</code>, or <code>.xls</code> file to distribute tasks among agents.
      </p>

      <Input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={(e) => { setFile(e.target.files[0]); e.target.value = null; }}
        className="bg-zinc-700 border border-zinc-600 text-white"
      />
      {file && (
        <p className="text-sm text-green-400">
          Selected file: <span className="font-medium">{file.name}</span>
        </p>
      )}

      <Button
        onClick={handleUpload}
        disabled={!file || uploadLoading}
        className="w-full bg-white text-black hover:bg-gray-200"
      >
        {uploadLoading ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </div>
        ) : (
          "Upload & Distribute"
        )}
      </Button>
    </div>
  );
}
