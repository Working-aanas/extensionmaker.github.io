import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { toast } from "sonner";
import { Toaster } from "sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(156, 146, 172, 0.3) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <Header />
      <Hero />
      <Projects />
      <Contact />
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

function Header() {
  return (
    <header className="relative z-10 px-6 py-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          ExtensionMaker
        </div>
        <div className="hidden md:flex space-x-8">
          <a href="#projects" className="text-gray-300 hover:text-cyan-400 transition-colors">Projects</a>
          <a href="#contact" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact</a>
        </div>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative z-10 px-6 py-20 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Browser Extensions & Automated Bots
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          Transforming digital workflows with cutting-edge automation solutions
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#projects" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg">
            View Projects
          </a>
          <a href="#contact" className="px-8 py-4 border border-cyan-400 rounded-lg font-semibold text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 transition-all">
            Get Started
          </a>
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      title: "Adobe Stock Automation",
      description: "Automated stock photo downloading and organization system with advanced filtering and batch processing capabilities.",
      tech: ["Browser Extension", "API Integration", "File Management"],
      gradient: "from-red-500 to-orange-500"
    },
    {
      title: "LinkedIn Job Finder",
      description: "Intelligent job search automation that filters opportunities based on custom criteria and applies automatically.",
      tech: ["Web Scraping", "AI Filtering", "Auto-Apply"],
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Instagram Unsend",
      description: "Advanced message management tool for Instagram with bulk operations and smart filtering options.",
      tech: ["Social Media", "Bulk Operations", "Smart Filters"],
      gradient: "from-pink-500 to-purple-500"
    }
  ];

  return (
    <section id="projects" className="relative z-10 px-6 py-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Featured Projects
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl -z-10" 
                   style={{background: `linear-gradient(to right, var(--tw-gradient-stops))`}}></div>
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300 transform group-hover:scale-105">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.gradient} mb-4 flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="px-3 py-1 bg-slate-700 text-cyan-400 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectType: "",
    description: "",
    budget: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const submitForm = useMutation(api.messages.submitContactForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.projectType || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitForm({
        name: formData.name,
        email: formData.email,
        projectType: formData.projectType,
        description: formData.description,
        budget: formData.budget || undefined,
      });
      
      toast.success("Message sent successfully! I'll get back to you soon.");
      setFormData({
        name: "",
        email: "",
        projectType: "",
        description: "",
        budget: ""
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Start Your Project
        </h2>
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Project Type *</label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors"
                required
              >
                <option value="">Select project type</option>
                <option value="browser-extension">Browser Extension</option>
                <option value="automated-bot">Automated Bot</option>
                <option value="both">Both Extension & Bot</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Project Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                placeholder="Describe what you want your extension/bot to do. Be as detailed as possible..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Budget Range</label>
              <select
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors"
              >
                <option value="">Select budget range</option>
                <option value="$100-$500">$100 - $500</option>
                <option value="$500-$1000">$500 - $1,000</option>
                <option value="$1000-$2500">$1,000 - $2,500</option>
                <option value="$2500+">$2,500+</option>
                <option value="discuss">Let's discuss</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold text-white hover:from-cyan-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 px-6 py-8 border-t border-slate-700">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-400">
          © 2024 ExtensionMaker. Crafting the future of browser automation.
        </p>
      </div>
    </footer>
  );
}
