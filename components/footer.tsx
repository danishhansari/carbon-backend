"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import svg from "@/app/logo.svg";

export default function Footer() {
  const [emailValue, setEmailValue] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.2 });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailValue.trim() !== "") {
      // Here you would typically send this to your API
      console.log("Subscribing email:", emailValue);
      setSubscribed(true);
      setEmailValue("");

      // Reset the subscribed state after 3 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 3000);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const linkGroups = [
    {
      title: "Products",
      links: [
        { name: "Industrial Machinery", href: "#" },
        { name: "Manufacturing Tools", href: "#" },
        { name: "Automation Systems", href: "#" },
        { name: "Spare Parts", href: "#" },
        { name: "Custom Solutions", href: "#" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#" },
        { name: "Our Team", href: "#" },
        { name: "Careers", href: "#" },
        { name: "News & Media", href: "#" },
        { name: "Sustainability", href: "#" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "#" },
        { name: "Case Studies", href: "#" },
        { name: "Product Catalogs", href: "#" },
        { name: "Technical Support", href: "#" },
        { name: "FAQ", href: "#" },
      ],
    },
  ];

  const contactInfo = [
    {
      icon: <Phone size={18} />,
      text: "+1 (555) 123-4567",
      href: "tel:+15551234567",
    },
    {
      icon: <Mail size={18} />,
      text: "info@royalcarbonbrush.com",
      href: "mailto:info@royalcarbonbrush.com",
    },
    {
      icon: <MapPin size={18} />,
      text: "123 Industrial Way, Manufacturing District, NY 10001",
      href: "https://maps.google.com",
    },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
    { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer ref={footerRef} className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12"
        >
          {/* Company Info */}
          <motion.div variants={itemVariants} className="lg:col-span-4">
            <div className="mb-6">
              <Link href={"/"}>
                <Image src={svg} alt="Logo" className="w-56" />
              </Link>
              <p className="text-gray-400 text-sm">
                Leading manufacturer of industrial equipment and automation
                solutions since 1985.
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {contactInfo.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-200 group"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                >
                  <div className="text-red-500 group-hover:text-red-400 transition-colors duration-200">
                    {item.icon}
                  </div>
                  <span className="text-sm">{item.text}</span>
                  {item.href.startsWith("http") && (
                    <ExternalLink
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    />
                  )}
                </a>
              ))}
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-gray-800 hover:bg-red-600 p-2.5 rounded-full transition-colors duration-300 text-gray-300 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          {linkGroups.map((group, groupIndex) => (
            <motion.div
              key={groupIndex}
              variants={itemVariants}
              className="lg:col-span-2"
            >
              <h3 className="text-lg font-semibold mb-4 text-white">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-red-500 transition-colors duration-200 text-sm flex items-center gap-1 group"
                    >
                      <span>{link.name}</span>
                      <ArrowRight
                        size={14}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-x-0 group-hover:translate-x-1"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Newsletter */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Newsletter
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest product updates and
              industry news.
            </p>

            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="Your email address"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-white"
                required
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md transition-colors duration-200"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>

            {subscribed && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-green-400 text-xs mt-2"
              >
                Thank you for subscribing!
              </motion.p>
            )}
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="pt-8 mt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center"
        >
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Royal Carbon Brush. All rights
            reserved.
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Cookie Policy
            </a>
            <a
              href="#"
              className="hover:text-white transition-colors duration-200"
            >
              Sitemap
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
