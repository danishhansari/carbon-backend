"use client";

import type React from "react";

import {
  type ChangeEvent,
  type FormEvent,
  useState,
  useRef,
  useEffect,
} from "react";
import {
  UploadCloud,
  Image,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export function Upload() {
  const [file, setFile] = useState<File | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | null
  >(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check for dark mode preference
  useEffect(() => {
    const isDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];

      // Validate file type
      if (!uploadedFile.type.startsWith("image/")) {
        setMessage("Please select an image file");
        setMessageType("error");
        return;
      }

      // Validate file size (max 5MB)
      if (uploadedFile.size > 5 * 1024 * 1024) {
        setMessage("File size exceeds 5MB limit");
        setMessageType("error");
        return;
      }

      setFile(uploadedFile);
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
      setMessage("");
      setMessageType(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const uploadedFile = e.dataTransfer.files[0];

      // Validate file type
      if (!uploadedFile.type.startsWith("image/")) {
        setMessage("Please select an image file");
        setMessageType("error");
        return;
      }

      // Validate file size (max 5MB)
      if (uploadedFile.size > 5 * 1024 * 1024) {
        setMessage("File size exceeds 5MB limit");
        setMessageType("error");
        return;
      }

      setFile(uploadedFile);
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(uploadedFile);
      setMessage("");
      setMessageType(null);
    }
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setMessage("Please select a file");
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("Uploading your image...");
    setMessageType("info");

    try {
      // Fetch the Pre-Signed URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename: file.name }),
      });

      if (res.ok) {
        const { url }: { url: string } = await res.json();
        const uploadRes = await fetch(url, {
          method: "PUT",
          body: file,
        });

        if (uploadRes.ok) {
          setMessage("Image uploaded successfully!");
          setMessageType("success");
        } else {
          setMessage("Image upload failed");
          setMessageType("error");
        }
      } else {
        setMessage("Failed to get upload URL");
        setMessageType("error");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during upload");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(undefined);
    setPreview(null);
    setMessage("");
    setMessageType(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
        <div className="w-full max-w-3xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <div className="relative">
              <div className="p-8 md:p-10">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-4">
                    <Image className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      Image Uploader
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Upload your images securely with pre-signed URLs
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpload} className="space-y-8">
                  <div
                    className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out overflow-hidden
                      ${
                        dragActive
                          ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500"
                      }
                      ${preview ? "h-auto" : "h-72"}
                    `}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                  >
                    <input
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      type="file"
                      onChange={handleFileChange}
                    />

                    {preview ? (
                      <div className="relative group">
                        <img
                          src={preview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full h-auto object-contain max-h-[400px]"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300 rounded-lg">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center">
                            <button
                              type="button"
                              onClick={removeImage}
                              className="p-2 bg-red-500 text-white rounded-full mb-2 hover:bg-red-600 transition-colors"
                              aria-label="Remove image"
                            >
                              <X className="h-5 w-5" />
                            </button>
                            <p className="text-white text-sm font-medium px-4 py-2 bg-black bg-opacity-50 rounded-lg">
                              Click to change image
                            </p>
                          </div>
                        </div>

                        {file && (
                          <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white text-xs px-3 py-1 rounded-full">
                            {file.name.length > 25
                              ? file.name.substring(0, 22) + "..."
                              : file.name}{" "}
                            • {(file.size / (1024 * 1024)).toFixed(2)}MB
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-20 h-20 mb-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          <UploadCloud className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                          Drag and drop your image
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                          Supports JPG, PNG and GIF files. Max file size 5MB.
                        </p>
                        <button
                          type="button"
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Browse Files
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                      <span className="px-4 text-sm text-slate-500 dark:text-slate-400">
                        Upload Options
                      </span>
                      <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                    </div>

                    <button
                      type="submit"
                      disabled={uploading || !file}
                      className={`w-full flex items-center justify-center px-6 py-3.5 rounded-xl text-white font-medium transition-all duration-300
                        ${
                          !file
                            ? "bg-slate-400 cursor-not-allowed opacity-70"
                            : uploading
                            ? "bg-indigo-600 cursor-wait"
                            : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-md hover:shadow-lg"
                        }
                      `}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-5 h-5 mr-3" />
                          Upload with Pre-signed URL
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {message && (
                  <div
                    className={`mt-6 p-4 rounded-xl text-sm flex items-start transition-all duration-300 ${
                      messageType === "success"
                        ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200 border border-green-200 dark:border-green-800"
                        : messageType === "error"
                        ? "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200 border border-red-200 dark:border-red-800"
                        : "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 border border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    {messageType === "success" ? (
                      <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                    ) : messageType === "error" ? (
                      <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Loader2 className="h-5 w-5 mr-3 animate-spin flex-shrink-0 mt-0.5" />
                    )}
                    <span>{message}</span>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                    Your files are securely uploaded and processed. We support
                    various image formats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
