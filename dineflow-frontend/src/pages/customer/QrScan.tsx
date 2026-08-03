import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { QrCode, Camera, ArrowRight, User, UserCog, ChefHat, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

const portalOptions = [
  { label: "Staff", icon: UserCog, path: "/staff/login", color: "from-blue-500 to-indigo-600", sub: "Table Service" },
  { label: "Kitchen", icon: ChefHat, path: "/kitchen/login", color: "from-green-500 to-emerald-600", sub: "Order Display" },
  { label: "Admin", icon: Building2, path: "/admin/login", color: "from-purple-500 to-violet-600", sub: "Management" },
]

export default function QrScan() {
  const navigate = useNavigate()
  const [qrCode, setQrCode] = useState("")
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    if (!scanning) return
    const t = setTimeout(() => {
      setScanning(false)
      setQrCode("TABLE-A7-2024")
    }, 2500)
    return () => clearTimeout(t)
  }, [scanning])

  const handleProceed = () => {
    const code = qrCode || "TABLE-A1-DEFAULT"
    navigate(`/customer/welcome/${code}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 via-white to-white">
      <div className="mx-auto max-w-md px-6 pt-10 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-xl shadow-brand-500/25 mb-4">
            <QrCode className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Scan & Dine</h1>
          <p className="mt-2 text-muted-foreground">Scan the QR code on your table to begin ordering</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden shadow-elevated border-0">
            <div
              className={`relative aspect-square bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center overflow-hidden ${scanning ? "cursor-wait" : "cursor-pointer"}`}
              onClick={() => setScanning(!scanning)}
            >
              <div className="absolute inset-8 rounded-3xl border border-white/10" />
              <div className="absolute inset-12 rounded-2xl border border-white/5" />
              <div className="absolute inset-16 rounded-xl border-2 border-dashed border-white/20" />

              {scanning && (
                <motion.div
                  className="absolute left-16 right-16 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_20px_4px_rgba(249,115,22,0.6)] rounded-full"
                  animate={{ top: ["16%", "84%", "16%"] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                {qrCode && !scanning ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <div className="h-20 w-20 rounded-2xl bg-success-500/20 border-2 border-success-400 flex items-center justify-center mb-4">
                      <svg className="h-10 w-10 text-success-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-white font-bold text-lg">QR Code Detected</p>
                    <p className="text-white/60 text-sm mt-1 font-mono">{qrCode}</p>
                  </motion.div>
                ) : (
                  <motion.div animate={scanning ? { opacity: [1, 0.6, 1] } : {}} transition={{ duration: 1.2, repeat: Infinity }}>
                    <Camera className="h-14 w-14 text-white/80" />
                  </motion.div>
                )}
                <p className="text-white/70 text-sm mt-6 font-medium">
                  {scanning ? "Scanning..." : qrCode ? "Tap to rescan" : "Tap to scan QR code"}
                </p>
              </div>

              {[...Array(4)].map((_, i) => {
                const corners = [
                  "top-6 left-6 border-l-2 border-t-2",
                  "top-6 right-6 border-r-2 border-t-2",
                  "bottom-6 left-6 border-l-2 border-b-2",
                  "bottom-6 right-6 border-r-2 border-b-2",
                ]
                return (
                  <div
                    key={i}
                    className={`absolute ${corners[i]} h-8 w-8 border-brand-400 rounded-md`}
                    style={{ opacity: 0.8 }}
                  />
                )
              })}
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block">Or enter table code manually</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., TABLE-A7"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value.toUpperCase())}
                    className="uppercase tracking-widest font-mono"
                  />
                </div>
              </div>

              <Button
                size="xl"
                className="w-full gap-2"
                onClick={handleProceed}
              >
                Continue to Menu
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mt-10"
        >
          <div className="text-center mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Staff Portals
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {portalOptions.map((opt, i) => {
              const Icon = opt.icon
              return (
                <motion.button
                  key={opt.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  onClick={() => navigate(opt.path)}
                  className="group"
                >
                  <Card className="p-4 text-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg border-border/50">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-bold text-sm">{opt.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{opt.sub}</p>
                  </Card>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
