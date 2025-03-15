"use client";

import Navbar from "@/components/navbar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader, ArrowLeft } from "lucide-react";

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

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 mt-16 lg:mt-20">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-red-600 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Products
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="animate-spin" />
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden">
              <img
                src={product.imgUrl || "/placeholder.svg"}
                alt={product.productName}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
              <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-md mb-4 w-fit">
                {product.description}
              </span>
              <p className="text-gray-700 mb-6">{product.description}</p>
              <div className="mt-auto">
                <div className="mb-6">
                  <span className="text-2xl font-bold text-red-600">
                    {product.range}
                  </span>
                </div>
                <button className="w-full py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p>Product not found.</p>
          </div>
        )}
      </div>
    </>
  );
}
