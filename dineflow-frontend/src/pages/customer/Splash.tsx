import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Utensils, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function Splash() {
  const navigate = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => navigate("/customer/qr-scan"), 2200)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.4, 0],
              y: [`${Math.random() * 100}%`, `${Math.random() * 40 - 10}%`],
            }}
            transition={{
              duration: 2 + Math.random() * 1.5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
            }}
          />
        ))}
      </div>

      <motion.div
        className="relative z-10 flex flex-col items-center text-white"
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div
          className="relative"
          animate={{
            rotate: [0, -3, 3, -2, 2, 0],
            y: [0, -6, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-28 w-28 rounded-3xl bg-white/15 backdrop-blur-xl flex items-center justify-center shadow-2xl border border-white/20">
            <Utensils className="h-14 w-14 text-white" strokeWidth={2} />
          </div>
          <motion.div
            className="absolute -top-2 -right-2 h-10 w-10 rounded-2xl bg-yellow-400 flex items-center justify-center shadow-lg"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 15, -10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles className="h-5 w-5 text-white" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="mt-8 text-5xl font-black tracking-tight drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          DineFlow
        </motion.h1>

        <motion.p
          className="mt-3 text-lg font-medium text-white/85"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.6 }}
        >
          Smart Restaurant Table Ordering
        </motion.p>

        <motion.div
          className="mt-10 flex gap-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-white/90"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </motion.div>
      </motion.div>

      <motion.p
        className="absolute bottom-8 text-white/70 text-sm font-medium z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Powered by DineFlow • v2.0
      </motion.p>
    </div>
  )
}
