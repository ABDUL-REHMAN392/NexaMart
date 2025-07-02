import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white pt-12 pb-6 px-6 md:px-24 rounded-t-3xl shadow-inner mt-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12 text-center md:text-left">
        {/* Brand Info */}
        <div>
          <h3 className="text-2xl font-bold mb-3">NexaMart</h3>
          <p className="text-sm text-indigo-100">
            Your one-stop destination for quality and convenience. Experience better shopping.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Support</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="#" className="hover:underline">Help Center</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
          <div className="flex justify-center md:justify-start gap-4 text-indigo-100 text-xl">
            <a href="#" className="hover:text-white"><FaFacebookF /></a>
            <a href="#" className="hover:text-white"><FaTwitter /></a>
            <a href="#" className="hover:text-white"><FaInstagram /></a>
            <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-indigo-700 mt-10 pt-6 text-center text-sm text-indigo-300">
        © {new Date().getFullYear()} NexaMart. All rights reserved.
      </div>
    </footer>
  );
}
