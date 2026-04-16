import { motion } from "framer-motion";

const StatCard = ({ label, value, accent, helper }) => (
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-lg border border-white/10 bg-slate-950/35 p-5 shadow-panel backdrop-blur"
  >
    <div className="text-sm text-slate-300">{label}</div>
    <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
    <div className={`mt-2 text-sm ${accent}`}>{helper}</div>
  </motion.div>
);

export default StatCard;
