import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-indigo-50 py-20 px-6 md:px-24 text-gray-900 font-sans">
      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center bg-white shadow-2xl rounded-3xl p-8 md:p-16">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 leading-tight">
            Let's Talk!
          </h1>
          <p className="text-gray-600 text-lg">
            We're here to help and answer any question you might have. Fill out the form and our team will get back to you shortly.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-gray-700">
              <MdEmail className="text-2xl text-indigo-600" />
              <span>support@nexamart.com</span>
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <MdPhone className="text-2xl text-indigo-600" />
              <span>+92-123-4567890</span>
            </div>
            <div className="flex items-center gap-4 text-gray-700">
              <MdLocationOn className="text-2xl text-indigo-600" />
              <span>Plot #12, Tech Street, Islamabad, Pakistan</span>
            </div>
          </div>
        </motion.div>

        {!submitted ? (
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-50 p-6 rounded-2xl shadow-md"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none p-3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="5"
                required
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none p-3"
              ></textarea>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full shadow-md transition duration-300"
              >
                Send Message
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            className="md:col-span-1 text-center md:text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-green-600 mb-4">Thank you!</h2>
            <p className="text-lg text-gray-700">
              Your message has been received. We'll get back to you soon.
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
