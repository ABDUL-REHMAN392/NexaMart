import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";


const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Founder & CEO",
    img: "https://randomuser.me/api/portraits/women/68.jpg",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: 2,
    name: "Michael Lee",
    role: "CTO",
    img: "https://randomuser.me/api/portraits/men/65.jpg",
    social: { twitter: "#", linkedin: "#" },
  },
  {
    id: 3,
    name: "Jessica Wong",
    role: "Head of Marketing",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    social: { twitter: "#", linkedin: "#" },
  },
];

const faqs = [
  {
    question: "What is NexaMart?",
    answer:
      "NexaMart is a leading e-commerce platform offering a wide range of quality products with fast delivery and excellent customer service.",
  },
  {
    question: "How can I contact support?",
    answer:
      "You can reach out to our support team via the Contact page or email us at support@nexamart.com.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Yes, we ship to many countries worldwide. Shipping charges and delivery times may vary.",
  },
];

function StatCounter({ number, label }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = number;
    const duration = 2000;
    const incrementTime = 50;
    const steps = duration / incrementTime;
    const increment = end / steps;

    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, [number]);

  return (
    <div className="text-center p-6 w-full max-w-xs">
      <h3 className="text-3xl font-extrabold text-indigo-600">{count.toLocaleString()}+</h3>
      <p className="text-gray-500 mt-1 text-sm tracking-wide uppercase font-semibold">{label}</p>
    </div>
  );
}

function TeamFlipCard({ member }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full max-w-xs h-80 perspective cursor-pointer"
      onClick={() => setFlipped(!flipped)}
      aria-label={`Toggle info about ${member.name}`}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl shadow-xl overflow-hidden bg-white"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute backface-hidden w-full h-full rounded-2xl overflow-hidden select-none">
          <img
            src={member.img}
            alt={member.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent text-white p-4 text-center font-semibold text-lg">
            {member.name}
          </div>
        </div>

        <div className="absolute backface-hidden w-full h-full rotateY-180 bg-white p-6 flex flex-col items-center justify-center rounded-2xl text-center">
          <h3 className="font-bold text-xl mb-2 text-indigo-700">{member.role}</h3>
          <p className="text-gray-600 mb-6 font-medium">
            Dedicated to providing top-tier services and products.
          </p>
          <div className="flex gap-6 text-indigo-600 text-2xl">
            <a href={member.social.twitter} target="_blank" rel="noreferrer">🐦</a>
            <a href={member.social.linkedin} target="_blank" rel="noreferrer">🔗</a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Testimonial({ testimonial }) {
  return (
    <motion.div
      className="bg-white shadow-xl rounded-2xl p-8 max-w-sm w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="italic text-gray-700 mb-6 leading-relaxed">"{testimonial.feedback}"</p>
      <h4 className="font-semibold text-indigo-700">{testimonial.name}</h4>
      <p className="text-sm text-gray-400">{testimonial.position}</p>
    </motion.div>
  );
}

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b border-gray-300 py-4 cursor-pointer select-none"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? setOpen(!open) : null)}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-lg text-indigo-700">{faq.question}</h4>
        <span className="text-indigo-700 font-bold text-2xl select-none">{open ? "−" : "+"}</span>
      </div>
      {open && <p className="mt-3 text-gray-600 text-base">{faq.answer}</p>}
    </div>
  );
}

export default function AboutPage() {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      position: "Verified Buyer",
      feedback: "NexaMart transformed the way I shop online! Fast, reliable, and great products.",
    },
    {
      id: 2,
      name: "Emma Watson",
      position: "Happy Customer",
      feedback: "Amazing customer support and a huge variety of products. Highly recommend!",
    },
    {
      id: 3,
      name: "Liam Smith",
      position: "Frequent Shopper",
      feedback: "Quality products and timely delivery every time. I’m a loyal customer now.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-indigo-50 py-14 px-6 md:px-24 text-gray-900 font-sans">
      <section className="max-w-6xl mx-auto text-center mb-20">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold tracking-wide mb-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          About <span className="pacifico text-indigo-600">NexaMart</span>
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl max-w-4xl mx-auto text-gray-700 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          NexaMart is your trusted online shopping destination delivering quality,
          variety, and excellent service to customers worldwide.
        </motion.p>
      </section>

      <section className="max-w-6xl mx-auto flex flex-wrap justify-center gap-6 mb-24 px-6 md:px-0">
        <StatCounter number={10000} label="Happy Customers" />
        <StatCounter number={500} label="Products Available" />
        <StatCounter number={24} label="7/24 Customer Support" />
      </section>

      <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 mb-24 px-6 md:px-0">
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-10"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-3">🎯 Mission</h2>
          <p className="text-gray-700 text-lg leading-relaxed font-medium">
            To provide the best online shopping experience through innovation,
            quality products, and exceptional customer service.
          </p>
        </motion.div>
        <motion.div
          className="bg-white rounded-3xl shadow-xl p-10"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-indigo-700 flex items-center gap-3">👁️ Vision</h2>
          <p className="text-gray-700 text-lg leading-relaxed font-medium">
            To be the world’s most customer-centric marketplace, where people find
            anything they want online.
          </p>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto mb-24 px-6 md:px-0">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-600">
          Meet Our <span className="pacifico">Team</span>
        </h2>
        <div className="flex justify-center gap-8 flex-wrap">
          {teamMembers.map((member) => (
            <TeamFlipCard key={member.id} member={member} />
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto mb-24 px-6 md:px-0">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-600">
          What Our Customers Say
        </h2>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          {testimonials.map((t) => (
            <Testimonial key={t.id} testimonial={t} />
          ))}
        </div>
      </section>

      <section className="max-w-3xl w-full mx-auto mb-24 px-6 md:px-0">
        <h2 className="text-4xl font-bold mb-12 text-center text-indigo-600">
          Frequently Asked Questions
        </h2>
        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>
      </section>

      <motion.section
        className="bg-indigo-900 text-white py-16 rounded-3xl max-w-6xl mx-auto px-10 text-center shadow-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-4xl font-extrabold mb-8">
          Ready to experience <span className="pacifico">NexaMart</span>?
        </h3>
        <p className="mb-10 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          Join thousands of satisfied customers shopping smarter and faster with NexaMart today.
        </p>
        <button
          onClick={() => (window.location.href = "/contact")}
          className="bg-white cursor-pointer text-indigo-600 font-bold px-8 sm:px-12 py-3 sm:py-4 w-full sm:w-auto rounded-full shadow-lg hover:bg-indigo-50 transition"
          aria-label="Contact NexaMart"
        >
          Contact Us Now
        </button>
      </motion.section>
    </main>
  );
}
