import { motion } from "framer-motion";

const StatCard = ({ label, value, accent, helper }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    whileHover={{ y: -4, scale: 1.02 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/35 p-6 shadow-panel backdrop-blur transition-all hover:bg-slate-900/40 hover:shadow-2xl"
  >
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-slate-400">{label}</div>
        <div className="mt-2 text-3xl font-bold text-white">{value}</div>
      </div>
      <div className={`h-2 w-2 rounded-full bg-current ${accent.replace("text-", "bg-")}`} />
    </div>
    <div className={`mt-4 text-sm font-medium ${accent}`}>{helper}</div>
    
    {/* Subtle gradient overlay for premium feel */}
    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-3xl" />
  </motion.div>
);

export default StatCard;
