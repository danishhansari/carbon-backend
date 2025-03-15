"use client";

import Navbar from "@/components/navbar";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProductType {
  id: number;
  productName: string;
  description: string;
  range: string;
  index: number;
  imgUrl: string;
}

const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await fetch("/api/upload");
        const response = await data.json();
        console.log(response);
        setProducts(response);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`);
  };

  return (
    <>
      <Navbar />
      <div className="mt-16 lg:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="col-span-full text-center py-10 mx-auto">
            <Loader className="animate-spin" />
          </div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => handleProductClick(product.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.imgUrl || "/placeholder.svg"}
                  alt={product.productName}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">
                    {product.description}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {product.productName}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-bold">
                    {product.range}
                  </span>
                  <button
                    className="p-2 lg:px-4 lg:py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-300"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent the parent div's onClick from firing
                      handleProductClick(product.id);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
