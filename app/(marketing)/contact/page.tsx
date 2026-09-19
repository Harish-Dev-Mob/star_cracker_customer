"use client";

import Image from "next/image";
import { Mail, MapPin, Phone, Send, Clock, Sparkles, MessageCircle } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "@/components/ui/Toast";

const SUBJECTS = [
  { value: "order", label: "📦 Order Issues", desc: "Tracking & problems" },
  { value: "product", label: "🎆 Product Inquiry", desc: "Details & availability" },
  { value: "bulk", label: "🏷️ Bulk / Wholesale", desc: "Events & distributors" },
  { value: "other", label: "💬 Other", desc: "General questions" },
];

const INFO_CARDS = [
  {
    icon: <Phone className="w-5 h-5" />,
    label: "Call Us",
    value: "+91 98765 43210",
    sub: "Mon – Sat, 9 AM to 8 PM",
    accent: "bg-orange-500",
    light: "bg-orange-50",
    text: "text-orange-600",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    label: "Email Us",
    value: "hello@firecrackers.com",
    sub: "Reply within 24 hours",
    accent: "bg-fuchsia-500",
    light: "bg-fuchsia-50",
    text: "text-fuchsia-600",
  },
  {
    icon: <MapPin className="w-5 h-5" />,
    label: "Visit Us",
    value: "123 Celebration Ave",
    sub: "Sivakasi, Tamil Nadu 626123",
    accent: "bg-emerald-500",
    light: "bg-emerald-50",
    text: "text-emerald-600",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    label: "Working Hours",
    value: "9:00 AM – 8:00 PM",
    sub: "Monday through Saturday",
    accent: "bg-amber-500",
    light: "bg-amber-50",
    text: "text-amber-600",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Message Sent!", "We'll get back to you as soon as possible.");
      (e.target as HTMLFormElement).reset();
      setSubject("");
    }, 1500);
  };

  const inputCls = (name: string) =>
    `w-full h-12 px-4 rounded-xl text-sm font-medium outline-none transition-all duration-200 bg-white border-2 text-gray-800 placeholder:text-gray-400 ${focusedField === name
      ? "border-orange-400 shadow-[0_0_0_3px_rgba(251,146,60,0.15)]"
      : "border-gray-200 hover:border-gray-300"
    }`;

  return (
    <div
      className="light"
      style={{
        colorScheme: "light",
        /* Reset dark-mode CSS vars for this subtree */
        // @ts-expect-error CSS custom properties
        "--color-bg": "#FFF8F0",
        "--color-bg-card": "#FFFFFF",
        "--color-bg-muted": "#F5EDE4",
        "--color-text": "#1A1A1A",
        "--color-text-muted": "#6B6B6B",
        "--color-border": "#E8D5C4",
      }}
    >
      <main className="min-h-screen !bg-gradient-to-br !from-orange-50 !via-white !to-rose-50 text-gray-900">

        {/* Hero */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/40 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-200/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          {["🎆", "✨", "🎇", "💥", "🌟", "🎉"].map((em, i) => (
            <span
              key={i}
              className="absolute text-2xl opacity-30 animate-bounce select-none pointer-events-none"
              style={{
                left: `${8 + i * 15}%`,
                top: `${20 + (i % 3) * 18}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${2.5 + i * 0.3}s`,
              }}
            >
              {em}
            </span>
          ))}

          <div className="container-site relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-orange-200 bg-orange-100 text-orange-600 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>We&apos;re Here to Help</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-black tracking-tight mb-6 text-gray-900 leading-none">
              Get in{" "}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-fuchsia-500">
                  Touch
                </span>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-fuchsia-500 rounded-full opacity-70" />
              </span>
            </h1>

            <p className="max-w-xl mx-auto text-base text-gray-500 leading-relaxed">
              Have a question about an order, product, or purchase?
              Drop us a message — we&apos;ll light up your inbox with a response.
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <section className="container-site flex flex-col gap-8 pb-24">

          {/* Info Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {INFO_CARDS.map((card) => (
              <div
                key={card.label}
                className="group relative rounded-2xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className={`w-10 h-10 rounded-xl ${card.light} flex items-center justify-center ${card.text} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  {card.icon}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{card.label}</p>
                <p className="text-sm font-bold text-gray-800 leading-snug">{card.value}</p>
                <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Form and Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Sidebar */}
            <div className="lg:col-span-2">

              {/* WhatsApp card */}
              <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md shrink-0 relative">
                    <Image src="/icons/whatsapp.jpg" alt="WhatsApp" fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-800">Chat on WhatsApp</p>
                    <p className="text-xs text-gray-400 mt-0.5">Fastest way to reach us</p>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white text-sm font-bold px-4 py-3.5 rounded-xl hover:bg-green-600 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-green-500/30">
                  <MessageCircle className="w-4 h-4" />
                  Open WhatsApp
                </button>
              </div>

            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="relative rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/60 overflow-hidden">
                <div className="h-1.5 w-full bg-gradient-to-r from-orange-400 via-red-500 to-fuchsia-500" />

                <div className="p-8 md:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-1">Send a Message</h2>
                    <p className="text-sm text-gray-400">Fill out the form and we&apos;ll respond shortly.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "firstName", label: "First Name", placeholder: "Arjun", type: "text", required: true },
                        { name: "lastName", label: "Last Name", placeholder: "Kumar", type: "text", required: false },
                      ].map((f) => (
                        <div key={f.name} className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            {f.label} {f.required && <span className="text-orange-500">*</span>}
                          </label>
                          <input
                            type={f.type}
                            id={f.name}
                            placeholder={f.placeholder}
                            required={f.required}
                            onFocus={() => setFocusedField(f.name)}
                            onBlur={() => setFocusedField(null)}
                            className={inputCls(f.name)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Contact row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { name: "email", label: "Email Address", placeholder: "arjun@example.com", type: "email", required: true },
                        { name: "phone", label: "Phone Number", placeholder: "+91 98765 43210", type: "tel", required: false },
                      ].map((f) => (
                        <div key={f.name} className="flex flex-col gap-1.5">
                          <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                            {f.label} {f.required && <span className="text-orange-500">*</span>}
                          </label>
                          <input
                            type={f.type}
                            id={f.name}
                            placeholder={f.placeholder}
                            required={f.required}
                            onFocus={() => setFocusedField(f.name)}
                            onBlur={() => setFocusedField(null)}
                            className={inputCls(f.name)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Subject chips */}
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Subject <span className="text-orange-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {SUBJECTS.map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => setSubject(s.value)}
                            className={`relative flex flex-col items-start px-4 py-3 rounded-xl border-2 text-left transition-all duration-200 ${subject === s.value
                                ? "border-orange-400 bg-orange-50 shadow-[0_0_0_3px_rgba(251,146,60,0.12)]"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                              }`}
                          >
                            <span className={`text-sm font-bold leading-tight ${subject === s.value ? "text-orange-600" : "text-gray-700"}`}>
                              {s.label}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-0.5">{s.desc}</span>
                            {subject === s.value && (
                              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center text-[8px] text-white font-black">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                      <input type="hidden" name="subject" value={subject} required />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        Message <span className="text-orange-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={5}
                        placeholder="How can we help you today? Share as much detail as you'd like…"
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full p-4 rounded-xl text-sm font-medium outline-none transition-all duration-200 resize-none bg-white border-2 text-gray-800 placeholder:text-gray-400 ${focusedField === "message"
                            ? "border-orange-400 shadow-[0_0_0_3px_rgba(251,146,60,0.15)]"
                            : "border-gray-200 hover:border-gray-300"
                          }`}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      id="btn-contact-submit"
                      disabled={isSubmitting || !subject}
                      className="group relative w-full h-14 rounded-xl text-sm font-black text-white uppercase tracking-wider overflow-hidden transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 bg-[length:200%_100%] animate-[gradient-x_3s_ease_infinite]" />
                      <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="relative z-10 flex items-center justify-center gap-2.5">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            Sending your message…
                          </>
                        ) : (
                          <>
                            Send Message
                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-200" />
                          </>
                        )}
                      </span>
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      By submitting, you agree to our{" "}
                      <span className="text-orange-500 hover:text-orange-600 cursor-pointer transition-colors font-medium">Privacy Policy</span>.
                    </p>

                  </form>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
