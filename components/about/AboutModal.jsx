"use client";

import { Modal } from "@/components/ui";
import { motion } from "framer-motion";
import {
  Code2,
  Cpu,
  Database,
  Globe,
  Layout,
  Mail,
  Server,
  ShieldCheck,
} from "lucide-react";

const AboutModal = ({ isOpen, onClose }) => {
  const techStack = [
    {
      name: "Next.js 14",
      desc: "App Router",
      icon: Globe,
      color: "text-white",
    },
    { name: "Electron", desc: "Desktop", icon: Layout, color: "text-cyan-400" },
    { name: "Node.js", desc: "Backend", icon: Server, color: "text-green-500" },
    { name: "Zustand", desc: "State", icon: Database, color: "text-amber-400" },
    { name: "Tailwind", desc: "Styling", icon: Code2, color: "text-blue-400" },
    {
      name: "PowerShell",
      desc: "Automation",
      icon: Cpu,
      color: "text-blue-600",
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About"
      size="md"
      className="bg-[#0f172a] border-slate-700 overflow-hidden max-h-[500px]"
    >
      <div className="flex flex-col items-center pt-4 pb-2 px-5 relative h-full justify-between">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

        {/* Header Section */}
        <div className="flex flex-col items-center gap-2 z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 rotate-3"
          >
            <ShieldCheck className="w-7 h-7 text-white" />
          </motion.div>
          <div className="text-center">
            <h2 className="text-lg font-bold text-white tracking-tight">
              Hyper Family ICT Manager
            </h2>
            <p className="text-slate-400 text-[10px] font-mono mt-0.5">
              v1.2.0 (Enterprise)
            </p>
          </div>
        </div>

        {/* Tech Stack Grid (Compact) */}
        <div className="grid grid-cols-2 gap-2 w-full mt-4">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 p-2 bg-slate-800/30 border border-slate-700/50 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <div
                className={`p-1.5 rounded-md bg-slate-900 ${tech.color} bg-opacity-10`}
              >
                <tech.icon className={`w-3.5 h-3.5 ${tech.color}`} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">
                  {tech.name}
                </h4>
                <p className="text-[9px] text-slate-500">{tech.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Developer & Footer */}
        <div className="w-full mt-4 space-y-3">
          <div className="bg-gradient-to-r from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-lg p-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs border border-slate-600">
                AA
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Ali Ajeli Lahiji
                </h4>
                <p className="text-[9px] text-slate-400">Lead Developer</p>
              </div>
            </div>
            <a
              href="mailto:lahiji.ali@hyperfamili.com"
              className="p-1.5 bg-blue-600/10 text-blue-400 rounded hover:bg-blue-600 hover:text-white transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="text-center text-[9px] text-slate-600 border-t border-slate-800/50 pt-2">
            © 2024 Hyper Family Chain Stores. All rights reserved.
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AboutModal;
