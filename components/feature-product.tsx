"use client"

import { useRef, useEffect } from "react"
import { motion, useInView, useAnimation } from "framer-motion"

const products = [
  {
    id: 1,
    name: "Industrial Drill Press",
    category: "Machinery",
    image: "/placeholder.svg?height=600&width=800",
    description: "High-precision drill press for industrial applications with variable speed control.",
    price: "$2,499",
  },
  {
    id: 2,
    name: "Automated Conveyor System",
    category: "Automation",
    image: "/placeholder.svg?height=600&width=800",
    description: "Modular conveyor system with smart controls for efficient material handling.",
    price: "$5,999",
  },
  {
    id: 3,
    name: "CNC Milling Machine",
    category: "Machinery",
    image: "/placeholder.svg?height=600&width=800",
    description: "Computer numerical control milling machine for precision manufacturing.",
    price: "$12,499",
  },
  {
    id: 4,
    name: "Robotic Arm Assembly",
    category: "Automation",
    image: "/placeholder.svg?height=600&width=800",
    description: "6-axis robotic arm for assembly line automation with advanced programming capabilities.",
    price: "$8,750",
  },
]

export default function FeaturedProducts() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const controls = useAnimation()

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our premium manufacturing equipment designed for precision, efficiency, and durability.
          </p>
        </motion.div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-md">{product.category}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-bold">{product.price}</span>
                  <button className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-red-600 hover:text-white transition-colors duration-300">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mt-12"
        >
          <button className="px-6 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors duration-300">
            View All Products
          </button>
        </motion.div>
      </div>
    </section>
  )
}

