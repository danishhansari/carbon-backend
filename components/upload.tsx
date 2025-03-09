"use client";

import React, {
  type ChangeEvent,
  type FormEvent,
  useState,
  useRef,
} from "react";
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
} from "lucide-react";

export function Upload() {
  // File upload state
  const [file, setFile] = useState<File | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | "info" | null
  >(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product information state
  const [productName, setProductName] = useState<string>("");
  const [productDescription, setProductDescription] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string>("");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productQuantity, setProductQuantity] = useState<string>("1");
  const [activeTab, setActiveTab] = useState<string>("details");

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

    // Validate product information
    if (!productName.trim()) {
      setMessage("Please enter a product name");
      setMessageType("error");
      setActiveTab("details");
      return;
    }

    if (!productDescription.trim()) {
      setMessage("Please enter a product description");
      setMessageType("error");
      setActiveTab("details");
      return;
    }

    if (!productPrice.trim() || isNaN(Number(productPrice))) {
      setMessage("Please enter a valid product price");
      setMessageType("error");
      setActiveTab("details");
      return;
    }

    if (!productCategory) {
      setMessage("Please select a product category");
      setMessageType("error");
      setActiveTab("details");
      return;
    }

    // Validate file
    if (!file) {
      setMessage("Please select a product image");
      setMessageType("error");
      setActiveTab("image");
      return;
    }

    setUploading(true);
    setMessage("Uploading your product...");
    setMessageType("info");

    try {
      // Fetch the Pre-Signed URL
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: file.name,
          productName,
          description: productDescription,
          range: Number.parseFloat(productPrice),
          index: Math.floor(Math.random() * 100),
        }),
      });

      if (res.ok) {
        const { url }: { url: string } = await res.json();
        const uploadRes = await fetch(url, {
          method: "PUT",
          body: file,
        });

        if (uploadRes.ok) {
          setMessage("Product uploaded successfully!");
          setMessageType("success");

          // Reset form after successful upload
          setProductName("");
          setProductDescription("");
          setProductPrice("");
          setProductCategory("");
          setProductQuantity("1");
          setFile(undefined);
          setPreview(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          setMessage("Product image upload failed");
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="dark">
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 transition-colors duration-300">
        <div className="w-full max-w-4xl">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 border border-slate-200 dark:border-slate-700">
            <div className="relative">
              <div className="p-8 md:p-10">
                <div className="flex items-center mb-8">
                  <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
                    <Tag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      Product Upload
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Add a new product to your inventory with images and
                      details
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpload} className="space-y-8">
                  {/* Tabs */}
                  <div className="grid grid-cols-2 mb-8">
                    <button
                      type="button"
                      onClick={() => handleTabChange("details")}
                      className={`flex items-center justify-center py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "details"
                          ? "border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      }`}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Product Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTabChange("image")}
                      className={`flex items-center justify-center py-3 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === "image"
                          ? "border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400"
                          : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      }`}
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Product Image
                    </button>
                  </div>

                  {/* Product Details Tab */}
                  <div className={activeTab === "details" ? "block" : "hidden"}>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="product-name"
                          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Product Name
                        </label>
                        <input
                          id="product-name"
                          placeholder="Enter product name"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white text-sm transition-colors"
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="product-price"
                          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Price ($)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                          <input
                            id="product-price"
                            placeholder="0.00"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            className="w-full pl-10 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white text-sm transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <label
                        htmlFor="product-description"
                        className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                      >
                        Product Description
                      </label>
                      <textarea
                        id="product-description"
                        placeholder="Enter product description"
                        rows={4}
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white text-sm transition-colors"
                      />
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 mt-4">
                      <div className="space-y-2">
                        <label
                          htmlFor="product-category"
                          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Category
                        </label>
                        <select
                          id="product-category"
                          value={productCategory}
                          onChange={(e) => setProductCategory(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white text-sm transition-colors"
                        >
                          <option value="">Select category</option>
                          <option value="electronics">Electronics</option>
                          <option value="clothing">Clothing</option>
                          <option value="home">Home & Kitchen</option>
                          <option value="books">Books</option>
                          <option value="toys">Toys & Games</option>
                          <option value="beauty">Beauty & Personal Care</option>
                          <option value="sports">Sports & Outdoors</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="product-quantity"
                          className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                          Initial Stock Quantity
                        </label>
                        <div className="relative">
                          <Layers className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                          <select
                            id="product-quantity"
                            value={productQuantity}
                            onChange={(e) => setProductQuantity(e.target.value)}
                            className="w-full pl-10 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-slate-700 dark:text-white text-sm transition-colors"
                          >
                            {[1, 5, 10, 25, 50, 100, 250, 500].map((qty) => (
                              <option key={qty} value={qty.toString()}>
                                {qty}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Image Tab */}
                  <div className={activeTab === "image" ? "block" : "hidden"}>
                    <div
                      className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out overflow-hidden cursor-pointer
                        ${
                          dragActive
                            ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                            : "border-slate-300 dark:border-slate-600 hover:border-purple-400 dark:hover:border-purple-500"
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
                            src={preview}
                            alt="Product preview"
                            className="w-full h-auto object-contain max-h-96"
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
                          <div className="w-20 h-20 mb-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <UploadCloud className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">
                            Drag and drop your product image
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-xs">
                            Supports JPG, PNG and GIF files. Max file size 5MB.
                          </p>
                          <button
                            type="button"
                            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                          >
                            Browse Files
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                      type="submit"
                      disabled={uploading}
                      className={`w-full flex items-center justify-center px-6 py-3.5 rounded-xl text-white font-medium transition-all duration-300
                        ${
                          uploading
                            ? "bg-purple-600 cursor-wait"
                            : "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 shadow-md hover:shadow-lg"
                        }
                      `}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          Uploading Product...
                        </>
                      ) : (
                        <>
                          <Tag className="w-5 h-5 mr-3" />
                          Add Product to Inventory
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
                    Your product information and images are securely uploaded
                    and processed. All product details will be available in your
                    inventory management system.
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
