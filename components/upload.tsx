"use client";

import React, { type FormEvent, useState, useRef, useCallback } from "react";
import {
  UploadCloud,
  ImageIcon,
  Loader2,
  X,
  CheckCircle,
  AlertCircle,
  Tag,
  FileText,
  DollarSign,
  Layers,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";

export function Upload() {
  const [file, setFile] = useState<File | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | null
  >(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    quantity: "1",
    tags: [] as string[],
  });
  const [activeTab, setActiveTab] = useState<string>("details");
  const [tagInput, setTagInput] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    handleFileChange(acceptedFiles[0]);
  }, []);

  const { getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxSize: 5 * 1024 * 1024,
    multiple: false,
    noClick: true, // Prevent dropzone from intercepting clicks on the button
  });

  const handleFileChange = (uploadedFile: File) => {
    if (!uploadedFile?.type.startsWith("image/")) {
      setMessage("Please select an image file");
      setMessageType("error");
      return;
    }
    if (uploadedFile.size > 5 * 1024 * 1024) {
      setMessage("File size exceeds 5MB limit");
      setMessageType("error");
      return;
    }

    setFile(uploadedFile);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(uploadedFile);
    setMessage("");
    setMessageType(null);
  };

  const handleInputChange = (
    field: keyof typeof productData,
    value: string
  ) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleUpload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { name, description, price, category } = productData;

    if (
      !name.trim() ||
      !description.trim() ||
      !price.trim() ||
      !category ||
      !file
    ) {
      setMessage("Please complete all required fields and upload an image");
      setMessageType("error");
      setActiveTab(!file ? "image" : "details");
      return;
    }

    if (isNaN(Number(price))) {
      setMessage("Please enter a valid price");
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("Uploading your product...");
    setMessageType("info");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          productName: name,
          description,
          price: Number.parseFloat(price),
          category,
          quantity: Number(productData.quantity),
          tags: productData.tags,
          index: Math.floor(Math.random() * 100),
        }),
      });

      if (res.ok) {
        const { url } = await res.json();
        const uploadRes = await fetch(url, {
          method: "PUT",
          body: file,
        });

        if (uploadRes.ok) {
          setMessage("Product uploaded successfully!");
          setMessageType("success");
          resetForm();
        } else {
          throw new Error("Image upload failed");
        }
      } else {
        throw new Error("Failed to get upload URL");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed");
      setMessageType("error");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      price: "",
      category: "",
      quantity: "1",
      tags: [],
    });
    setFile(undefined);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="dark">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/10 to-slate-900 p-4"
      >
        <div className="w-full max-w-4xl">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-purple-500/20">
            <div className="p-8 md:p-10 relative">
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="flex items-center mb-8"
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg">
                  <Tag className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
                    Product Upload
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Add premium products with style and precision
                  </p>
                </div>
              </motion.div>

              <form onSubmit={handleUpload} className="space-y-8">
                <div className="grid grid-cols-2 gap-2 mb-8 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                  {["details", "image"].map((tab) => (
                    <motion.button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center py-3 text-sm font-medium rounded-lg transition-all ${
                        activeTab === tab
                          ? "bg-white dark:bg-slate-800 shadow-md text-purple-600 dark:text-purple-400"
                          : "text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                      }`}
                    >
                      {tab === "details" ? (
                        <FileText className="w-4 h-4 mr-2" />
                      ) : (
                        <ImageIcon className="w-4 h-4 mr-2" />
                      )}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {activeTab === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300 flex items-center">
                            Product Name
                            <span className="ml-1 text-red-400">*</span>
                          </label>
                          <input
                            placeholder="e.g., Premium Wireless Headphones"
                            value={productData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300 flex items-center">
                            Price ($)
                            <span className="ml-1 text-red-400">*</span>
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                            <input
                              placeholder="49.99"
                              value={productData.price}
                              onChange={(e) =>
                                handleInputChange("price", e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300 flex items-center">
                          Description
                          <span className="ml-1 text-red-400">*</span>
                        </label>
                        <textarea
                          placeholder="Describe your product's features..."
                          rows={4}
                          value={productData.description}
                          onChange={(e) =>
                            handleInputChange("description", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all resize-none"
                        />
                      </div>

                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300 flex items-center">
                            Category
                            <span className="ml-1 text-red-400">*</span>
                          </label>
                          <select
                            value={productData.category}
                            onChange={(e) =>
                              handleInputChange("category", e.target.value)
                            }
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all appearance-none"
                          >
                            <option value="" className="bg-slate-800">
                              Select category
                            </option>
                            {[
                              "electronics",
                              "clothing",
                              "home",
                              "books",
                              "toys",
                              "beauty",
                              "sports",
                              "other",
                            ].map((cat) => (
                              <option
                                key={cat}
                                value={cat}
                                className="bg-slate-800"
                              >
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-slate-300">
                            Stock Quantity
                          </label>
                          <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-400" />
                            <select
                              value={productData.quantity}
                              onChange={(e) =>
                                handleInputChange("quantity", e.target.value)
                              }
                              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white transition-all appearance-none"
                            >
                              {[1, 5, 10, 25, 50, 100, 250, 500].map((qty) => (
                                <option
                                  key={qty}
                                  value={qty}
                                  className="bg-slate-800"
                                >
                                  {qty}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-300">
                          Tags (Press Enter to add)
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <AnimatePresence>
                            {productData.tags.map((tag) => (
                              <motion.span
                                key={tag}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="inline-flex items-center px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => handleTagRemove(tag)}
                                  className="ml-2 focus:outline-none"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </motion.span>
                            ))}
                          </AnimatePresence>
                        </div>
                        <input
                          placeholder="Add tags (e.g., wireless, premium)"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagAdd}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Product Image Tab with Explicit File Input */}
                  {activeTab === "image" && (
                    <motion.div
                      key="image"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div
                        {...getRootProps()}
                        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all duration-300 ${
                          isDragActive
                            ? "border-purple-500 bg-purple-500/10"
                            : "border-purple-500/30 hover:border-purple-500"
                        }`}
                      >
                        {preview ? (
                          <div className="relative group">
                            <motion.img
                              src={preview}
                              alt="Product preview"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: showPreview ? 1 : 0.3 }}
                              className="w-full h-auto object-contain max-h-96 rounded-lg"
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex gap-4">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPreview(!showPreview);
                                  }}
                                  className="p-2 bg-purple-600/80 text-white rounded-full"
                                >
                                  {showPreview ? (
                                    <EyeOff className="h-5 w-5" />
                                  ) : (
                                    <Eye className="h-5 w-5" />
                                  )}
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFile(undefined);
                                    setPreview(null);
                                  }}
                                  className="p-2 bg-red-600/80 text-white rounded-full"
                                >
                                  <X className="h-5 w-5" />
                                </motion.button>
                              </div>
                            </div>
                            {file && (
                              <div className="absolute bottom-3 left-3 bg-purple-900/80 text-white text-xs px-3 py-1 rounded-full">
                                {file.name.length > 25
                                  ? file.name.substring(0, 22) + "..."
                                  : file.name}{" "}
                                • {(file.size / (1024 * 1024)).toFixed(2)}MB
                              </div>
                            )}
                          </div>
                        ) : (
                          <motion.div
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            className="text-center py-12"
                          >
                            <UploadCloud className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">
                              Drop your product image here
                            </h3>
                            <p className="text-sm text-slate-400 mb-4">
                              or use the button below (JPG, PNG, GIF • Max 5MB)
                            </p>
                            <div className="flex justify-center gap-4">
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    handleFileChange(e.target.files[0]);
                                  }
                                }}
                                className="hidden"
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerFileInput();
                                }}
                                className="px-5 py-2 bg-purple-600 text-white rounded-xl font-medium flex items-center gap-2"
                              >
                                <ImageIcon className="h-5 w-5" />
                                Select Image
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={uploading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center justify-center px-6 py-4 rounded-xl text-white font-medium bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg transition-all duration-300 ${
                    uploading
                      ? "opacity-75 cursor-not-allowed"
                      : "hover:shadow-xl"
                  }`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Tag className="w-5 h-5 mr-3" />
                      Add to Inventory
                    </>
                  )}
                </motion.button>

                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mt-6 p-4 rounded-xl text-sm flex items-start ${
                        messageType === "success"
                          ? "bg-green-500/20 text-green-200 border border-green-500/30"
                          : messageType === "error"
                          ? "bg-red-500/20 text-red-200 border border-red-500/30"
                          : "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                      }`}
                    >
                      {messageType === "success" ? (
                        <CheckCircle className="h-5 w-5 mr-3 mt-0.5" />
                      ) : messageType === "error" ? (
                        <AlertCircle className="h-5 w-5 mr-3 mt-0.5" />
                      ) : (
                        <Loader2 className="h-5 w-5 mr-3 animate-spin mt-0.5" />
                      )}
                      <span>{message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
