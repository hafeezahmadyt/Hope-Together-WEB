import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Share2,
  CheckCircle2,
  Send,
  HeartHandshake,
  Users,
  Compass,
  AlertCircle,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  message?: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please provide your full name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please provide your message.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Mock/Frontend submission handler (simulated processing)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleSelectPathway = (subjectTitle: string) => {
    setFormData((prev) => ({
      ...prev,
      subject: subjectTitle,
    }));
    // Scroll smoothly to contact form
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <SEO
        title="Contact | Hope Together Organization"
        description="Connect with Hope Together Organization in Khyber Pakhtunkhwa, Pakistan. Inquire about partnerships, volunteering, and community programs."
      />

      {/* Page Hero */}
      <PageHero
        badge="Direct Outreach"
        title="Let's"
        highlightedWord="Connect"
        description="Have a question, want to collaborate, or looking to work together? We'd love to hear from you."
        accentColor="blue"
      />

      {/* Main Contact Section: Left Info & Right Form */}
      <section className="py-20 sm:py-28 bg-[#FAF9F6]">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* LEFT: Contact Information Placeholders */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-10">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#1D70B8] font-semibold block mb-3">
                  Reach Out
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-slate-900 tracking-tight mb-4">
                  Official Communication
                </h2>
                <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed mb-8">
                  For institutional correspondence, community partnerships, or verification
                  inquiries, please use our regional contacts below.
                </p>

                <div className="space-y-6">
                  {/* Location Placeholder */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D70B8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide block">
                        Regional Office
                      </span>
                      <p className="text-sm text-slate-600 font-light mt-0.5">
                        Khyber Pakhtunkhwa, Pakistan
                      </p>
                      <span className="text-xs text-slate-400 font-mono block mt-1">
                        [Official postal address to be added]
                      </span>
                    </div>
                  </div>

                  {/* Email Placeholder */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide block">
                        Official Inquiries
                      </span>
                      <a
                        href="mailto:info@hopetogether.org.pk"
                        className="text-sm text-[#1D70B8] hover:underline block mt-0.5 font-medium"
                      >
                        info@hopetogether.org.pk
                      </a>
                      <span className="text-xs text-slate-400 font-mono block mt-1">
                        [Additional department emails pending]
                      </span>
                    </div>
                  </div>

                  {/* Phone Placeholder */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D70B8] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide block">
                        Telephone
                      </span>
                      <span className="text-sm text-slate-500 font-mono block mt-0.5">
                        [Official contact number placeholder]
                      </span>
                    </div>
                  </div>

                  {/* Office Hours Placeholder */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide block">
                        Working Hours
                      </span>
                      <span className="text-sm text-slate-500 font-mono block mt-0.5">
                        [Operational hours placeholder]
                      </span>
                    </div>
                  </div>

                  {/* Social Media Placeholder */}
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-slate-200/60 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide block">
                        Social Channels
                      </span>
                      <span className="text-xs text-slate-400 font-mono block mt-0.5">
                        [Verified social links to be connected]
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200/60 text-xs text-slate-500 font-light">
                Registered non-governmental organization under the laws of Khyber Pakhtunkhwa, Pakistan.
              </div>
            </div>

            {/* RIGHT: Functional Contact Form */}
            <div id="contact-form" className="lg:col-span-7 scroll-mt-36">
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                <div className="mb-8">
                  <h3 className="text-2xl font-light text-slate-900 tracking-tight mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-slate-500 text-sm font-light">
                    Complete the form below and our team will get in touch with you.
                  </p>
                </div>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-8 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-xl font-medium text-slate-900">
                      Message Received
                    </h4>
                    <p className="text-slate-600 text-sm font-light max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Hope Together Organization.
                    </p>
                    <div className="p-4 rounded-xl bg-white/80 border border-emerald-200/60 text-xs font-mono text-slate-500 max-w-sm mx-auto">
                      [Frontend Validation State: Form submitted successfully. Backend dispatch integration ready for live deployment.]
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          fullName: '',
                          email: '',
                          phone: '',
                          subject: '',
                          message: '',
                        });
                      }}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Your full name"
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D70B8] ${
                          errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.fullName}</span>
                        </p>
                      )}
                    </div>

                    {/* Email & Phone Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="name@domain.com"
                          className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D70B8] ${
                            errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{errors.email}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                          Phone Number <span className="text-slate-400 font-normal lowercase">(optional)</span>
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+92 300 0000000"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Subject / Topic
                      </label>
                      <input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Partnership inquiry, volunteer request, question"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D70B8]"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Please write your inquiry or proposal here..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#1D70B8] resize-none ${
                          errors.message ? 'border-red-400 bg-red-50/20' : 'border-slate-200 bg-slate-50/50 hover:bg-white'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>{errors.message}</span>
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-70 cursor-pointer"
                    >
                      <span>{isSubmitting ? 'Validating...' : 'Send Message'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEDICATED SECTION: GET INVOLVED */}
      <section id="get-involved" className="py-20 sm:py-28 bg-white border-t border-slate-200/60 scroll-mt-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs uppercase tracking-[0.25em] text-[#16A34A] font-semibold block mb-3">
              Action &amp; Engagement
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-slate-900 tracking-tight mb-3">
              Get Involved
            </h2>
            <p className="text-slate-600 text-sm sm:text-base font-light leading-relaxed">
              Discover active pathways to collaborate, volunteer, or establish formal organizational alliances.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pathway 1: Volunteer */}
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-slate-200/70 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center mb-6">
                  <HeartHandshake className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">
                  Volunteer
                </h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed mb-6">
                  Contribute your skills, time, and empathy directly to youth empowerment, child protection,
                  and climate resilience programs across KP.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPathway('Volunteer Application')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#16A34A] hover:text-[#15803D] transition-colors self-start"
              >
                <span>Register to Volunteer</span>
                <span>→</span>
              </button>
            </div>

            {/* Pathway 2: Partner With Us */}
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-slate-200/70 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#1D70B8] flex items-center justify-center mb-6">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">
                  Partner With Us
                </h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed mb-6">
                  We welcome institutional, non-governmental, and educational partnerships to co-design
                  impactful and transparent community programs.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPathway('Organizational Partnership Inquiry')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1D70B8] hover:text-blue-800 transition-colors self-start"
              >
                <span>Initiate Partnership</span>
                <span>→</span>
              </button>
            </div>

            {/* Pathway 3: Collaborate */}
            <div className="p-8 rounded-3xl bg-[#FAF9F6] border border-slate-200/70 hover:border-slate-300 transition-all duration-300 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3 tracking-tight">
                  Collaborate
                </h3>
                <p className="text-slate-600 text-sm font-light leading-relaxed mb-6">
                  Researchers, technical advisors, and advocates seeking shared data, knowledge exchange,
                  or grassroots consultation are welcome.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectPathway('Collaboration Proposal')}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-800 hover:text-slate-950 transition-colors self-start"
              >
                <span>Submit Collaboration</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
