"use client";

import Navbar from "@/components/navbar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader, ArrowLeft, ShoppingCart, Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

interface ProductType {
  id: number;
  productName: string;
  description: string;
  range: string;
  index: number;
  imgUrl: string;
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = params.id;
        console.log(productId);
        const data = await fetch(`/api/upload/${productId}`);
        const response = await data.json();
        console.log(response);
        setProduct(response);
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  // Mock features for demonstration
  const features = [
    "High conductivity",
    "Durable material",
    "Long lifespan",
    "Low resistance",
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 mt-16 lg:mt-20 mb-16">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Products
        </motion.button>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin text-red-600" size={30} />
          </div>
        ) : product ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12"
          >
            {/* Product Image with decorative elements */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                {/* Background decorative element */}
                <div className="absolute inset-0 bg-red-600 opacity-10 z-0"></div>

                <motion.div
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10"
                >
                  <img
                    src={product.imgUrl || "/placeholder.svg"}
                    alt={product.productName}
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </motion.div>

                {/* Decorative circles */}
                <div className="absolute -bottom-5 -right-5 w-24 h-24 rounded-full bg-red-100 z-0"></div>
                <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full bg-red-50 z-0"></div>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col"
            >
              <div className="mb-2">
                <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-red-50 text-red-600">
                  Carbon Brush
                </span>
              </div>

              <h1 className="text-3xl font-bold mb-3 text-gray-900">
                {product.productName}
              </h1>

              <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-md mb-4 w-fit">
                {product.description}
              </span>

              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description} Our premium carbon brushes are designed
                for optimal performance and longevity, ensuring consistent power
                transmission and reduced maintenance costs.
              </p>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  KEY FEATURES
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <span className="text-gray-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mt-auto">
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">
                    PRICE RANGE
                  </h3>
                  <span className="text-2xl font-bold text-red-600">
                    {product.range || "Contact for pricing"}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Heart size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    <Share2 size={20} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20 bg-gray-50 rounded-lg"
          >
            <p className="text-gray-600 mb-4">Product not found.</p>
            <button
              onClick={() => router.push("/products")}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Browse Products
            </button>
          </motion.div>
        )}

        {/* Product specifications section */}
        {product && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 border-t border-gray-200 pt-10"
          >
            <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Technical Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Material</span>
                      <span className="font-medium">Carbon Graphite</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Dimensions</span>
                      <span className="font-medium">25mm x 15mm x 10mm</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">Resistance</span>
                      <span className="font-medium">0.05 Ohm</span>
                    </div>
                    <div className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="text-gray-600">
                        Operating Temperature
                      </span>
                      <span className="font-medium">-20°C to 180°C</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Applications</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <span>Industrial DC motors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <span>Power generators</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <span>Electric power tools</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-600"></div>
                      <span>Automotive applications</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <Footer />
    </>
  );
}
