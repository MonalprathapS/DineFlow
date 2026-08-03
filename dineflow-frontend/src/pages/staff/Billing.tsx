import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Receipt,
  DollarSign,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  FileText,
  ChevronRight,
  Table2,
  User,
  Clock,
  Search,
  Calculator,
  Download,
  Printer,
  ArrowUpRight,
  TrendingUp,
  Wallet,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/toast"
import { staffApi } from "@/api/orders"
import { cn, formatCurrency, formatTime } from "@/lib/utils"
import type { Order } from "@/types"

const mockPendingBills: Order[] = [
  {
    id: 101, orderNumber: "DF-0803-001", customerName: "John Smith", tableNumber: "T-12",
    status: "SERVED", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 68.50, taxAmount: 5.48, totalAmount: 73.98, restaurantId: 1,
    discountAmount: 0,
    assignedWaiterName: "Alex Johnson",
    items: [
      { id: 1, menuItemName: "Grilled Atlantic Salmon", quantity: 1, unitPrice: 28.00, subtotal: 28.00, status: "SERVED" },
      { id: 2, menuItemName: "Classic Caesar Salad", quantity: 1, unitPrice: 12.50, subtotal: 12.50, status: "SERVED" },
      { id: 3, menuItemName: "Sparkling Water 500ml", quantity: 2, unitPrice: 4.00, subtotal: 8.00, status: "SERVED" },
      { id: 4, menuItemName: "Chocolate Lava Cake", quantity: 1, unitPrice: 9.00, subtotal: 9.00, status: "SERVED" },
      { id: 5, menuItemName: "Espresso Double", quantity: 2, unitPrice: 3.00, subtotal: 6.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 85 * 60000).toISOString(),
    servedAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: 102, orderNumber: "DF-0803-002", customerName: "Emily Davis & Family", tableNumber: "T-05",
    status: "SERVED", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 124.00, taxAmount: 9.92, totalAmount: 133.92, restaurantId: 1,
    discountAmount: 10,
    assignedWaiterName: "Alex Johnson",
    items: [
      { id: 1, menuItemName: "Margherita Pizza (Large)", quantity: 2, unitPrice: 22.00, subtotal: 44.00, status: "SERVED" },
      { id: 2, menuItemName: "Spaghetti Bolognese", quantity: 1, unitPrice: 18.00, subtotal: 18.00, status: "SERVED" },
      { id: 3, menuItemName: "Kid's Chicken Nuggets", quantity: 2, unitPrice: 9.00, subtotal: 18.00, status: "SERVED" },
      { id: 4, menuItemName: "Tiramisu", quantity: 3, unitPrice: 9.00, subtotal: 27.00, status: "SERVED" },
      { id: 5, menuItemName: "Fresh Orange Juice", quantity: 2, unitPrice: 5.00, subtotal: 10.00, status: "SERVED" },
      { id: 6, menuItemName: "Sparkling Water", quantity: 3, unitPrice: 4.00, subtotal: 12.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 110 * 60000).toISOString(),
    servedAt: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: 104, orderNumber: "DF-0803-004", customerName: "Sarah Wilson", tableNumber: "T-03",
    status: "SERVED", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 32.50, taxAmount: 2.60, totalAmount: 35.10, restaurantId: 1,
    discountAmount: 0,
    assignedWaiterName: "Alex Johnson",
    items: [
      { id: 1, menuItemName: "Grilled Chicken Pasta", quantity: 1, unitPrice: 16.50, subtotal: 16.50, status: "SERVED" },
      { id: 2, menuItemName: "Iced Lemon Tea", quantity: 2, unitPrice: 3.50, subtotal: 7.00, status: "SERVED" },
      { id: 3, menuItemName: "Garlic Bread", quantity: 2, unitPrice: 4.50, subtotal: 9.00, status: "SERVED" },
    ],
    createdAt: new Date(Date.now() - 95 * 60000).toISOString(),
    servedAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 106, orderNumber: "DF-0803-006", customerName: "Amanda Foster", tableNumber: "T-02",
    status: "READY", orderType: "DINE_IN", paymentStatus: "PENDING",
    subtotal: 24.00, taxAmount: 1.92, totalAmount: 25.92, restaurantId: 1,
    discountAmount: 0,
    assignedWaiterName: "Alex Johnson",
    items: [
      { id: 1, menuItemName: "Club Sandwich", quantity: 1, unitPrice: 14.00, subtotal: 14.00, status: "READY" },
      { id: 2, menuItemName: "French Fries (Large)", quantity: 1, unitPrice: 5.00, subtotal: 5.00, status: "READY" },
      { id: 3, menuItemName: "Iced Coffee", quantity: 1, unitPrice: 5.00, subtotal: 5.00, status: "READY" },
    ],
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
]

type PaymentMethod = "CASH" | "CREDIT_CARD" | "MOBILE_PAY"

export default function Billing() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [bills, setBills] = useState<Order[]>(mockPendingBills)
  const [selectedBillId, setSelectedBillId] = useState<number | null>(mockPendingBills[0]?.id ?? null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CREDIT_CARD")
  const [cashReceived, setCashReceived] = useState("")
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBills = bills.filter(b =>
    b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.tableNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedBill = bills.find(b => b.id === selectedBillId) || null

  const change = paymentMethod === "CASH" && cashReceived && selectedBill
    ? parseFloat(cashReceived) - selectedBill.totalAmount
    : 0

  const pendingTotal = bills.reduce((sum, b) => sum + b.totalAmount, 0)
  const pendingCount = bills.length

  const handleMarkPaid = async (billId: number) => {
    setProcessingId(billId)
    await new Promise(r => setTimeout(r, 600))
    const bill = bills.find(b => b.id === billId)
    setBills(prev => prev.filter(b => b.id !== billId))
    if (selectedBillId === billId) setSelectedBillId(filteredBills.find(b => b.id !== billId)?.id ?? null)
    setProcessingId(null)
    setCashReceived("")
    toast({
      title: "Payment Received",
      description: `Bill ${bill?.orderNumber} marked as PAID via ${paymentMethod.replace("_", " ")}`,
      variant: "success",
    })
  }

  const handleGenerateInvoice = () => {
    toast({ title: "Invoice Generated", description: "PDF invoice is being prepared for download", variant: "info" })
  }

  const paymentOptions: { id: PaymentMethod; label: string; icon: any; color: string }[] = [
    { id: "CREDIT_CARD", label: "Credit/Debit Card", icon: CreditCard, color: "from-blue-500 to-indigo-600" },
    { id: "CASH", label: "Cash", icon: Banknote, color: "from-emerald-500 to-green-600" },
    { id: "MOBILE_PAY", label: "Mobile Pay", icon: Smartphone, color: "from-purple-500 to-violet-600" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <Receipt className="h-7 w-7 text-blue-500" />
          Billing & Payments
        </h1>
        <p className="text-muted-foreground mt-1">Process pending payments and generate invoices.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Pending Balance</p>
                  <p className="text-2xl font-black tracking-tight">{formatCurrency(pendingTotal)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Bills to Collect</p>
                  <p className="text-2xl font-black tracking-tight">{pendingCount} <span className="text-sm font-medium text-muted-foreground">orders</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Avg. Order Value</p>
                  <p className="text-2xl font-black tracking-tight">{formatCurrency(pendingCount > 0 ? pendingTotal / pendingCount : 0)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-blue-500" />
                  Pending Bills
                </CardTitle>
                <Badge variant="warning">{pendingCount}</Badge>
              </div>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search table, name..."
                  className="pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-2.5 overflow-y-auto max-h-[560px] pr-1">
              <AnimatePresence mode="popLayout">
                {filteredBills.map((bill) => {
                  const isSelected = selectedBillId === bill.id
                  return (
                    <motion.button
                      key={bill.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      onClick={() => setSelectedBillId(bill.id)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all group",
                        isSelected
                          ? "border-blue-500 bg-blue-50/60 shadow-lg shadow-blue-500/10"
                          : "border-border/50 hover:border-blue-200 hover:bg-blue-50/30"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold">{bill.customerName}</span>
                            <Badge variant="muted" className="text-[10px] h-4 px-1.5">{bill.tableNumber}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                            <span className="font-mono">{bill.orderNumber.split("-").slice(-2).join("-")}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(bill.createdAt!)}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2 text-xs">
                            <span className="text-muted-foreground">{bill.items.length} items</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-black tracking-tight text-blue-600">{formatCurrency(bill.totalAmount)}</p>
                          <ChevronRight className={cn("h-4 w-4 ml-auto mt-1 transition-transform", isSelected && "text-blue-500 translate-x-0.5")} />
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </AnimatePresence>
              {filteredBills.length === 0 && (
                <div className="text-center py-10">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
                  <p className="text-muted-foreground font-semibold">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No pending bills</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedBill ? (
              <motion.div
                key={selectedBill.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-5"
              >
                <Card className="overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
                  <CardHeader className="pb-3 flex flex-row items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-lg">{selectedBill.customerName}</CardTitle>
                        <Badge variant={selectedBill.paymentStatus === "PAID" ? "success" : "warning"}>
                          {selectedBill.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1"><Table2 className="h-3.5 w-3.5" /> Table {selectedBill.tableNumber}</span>
                        <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" /> {selectedBill.assignedWaiterName}</span>
                        <span className="font-mono text-xs">{selectedBill.orderNumber}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleGenerateInvoice}>
                        <Download className="h-3.5 w-3.5 mr-1.5" /> Invoice
                      </Button>
                      <Button variant="outline" size="sm">
                        <Printer className="h-3.5 w-3.5 mr-1.5" /> Print
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-xl border border-border/50 overflow-hidden">
                      <div className="max-h-52 overflow-y-auto divide-y divide-border/40">
                        {selectedBill.items.map(item => (
                          <div key={item.id} className="flex items-center justify-between px-4 py-2.5">
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <span className="h-7 w-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-xs font-bold text-orange-600 shrink-0">
                                {item.quantity}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm truncate">{item.menuItemName}</p>
                                <p className="text-[11px] text-muted-foreground">{formatCurrency(item.unitPrice)} each</p>
                              </div>
                            </div>
                            <span className="font-bold text-sm whitespace-nowrap">{formatCurrency(item.subtotal)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="bg-slate-50/80 p-4 space-y-2 border-t border-border/50">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">{formatCurrency(selectedBill.subtotal)}</span>
                        </div>
                        {selectedBill.discountAmount ? (
                          <div className="flex justify-between text-sm">
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                              <ArrowUpRight className="h-3.5 w-3.5" /> Discount
                            </span>
                            <span className="font-medium text-emerald-600">-{formatCurrency(selectedBill.discountAmount)}</span>
                          </div>
                        ) : null}
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Tax (8%)</span>
                          <span className="font-medium">{formatCurrency(selectedBill.taxAmount)}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-border/50 flex justify-between items-baseline">
                          <span className="font-bold">Total Due</span>
                          <span className="text-2xl font-black tracking-tight text-blue-600">
                            {formatCurrency(selectedBill.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                      Process Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <Label className="text-sm font-semibold mb-2 block">Payment Method</Label>
                      <div className="grid grid-cols-3 gap-2.5">
                        {paymentOptions.map(opt => {
                          const Icon = opt.icon
                          const active = paymentMethod === opt.id
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setPaymentMethod(opt.id)}
                              className={cn(
                                "relative p-3.5 rounded-xl border-2 transition-all text-center",
                                active
                                  ? "border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/10"
                                  : "border-border/60 hover:border-blue-200 hover:bg-slate-50"
                              )}
                            >
                              <div className={cn(
                                "h-10 w-10 mx-auto rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                                active ? opt.color : "bg-slate-100 to-slate-200 from-slate-100"
                              )}>
                                <Icon className={cn("h-5 w-5", active ? "text-white" : "text-slate-500")} />
                              </div>
                              <p className={cn("text-xs font-semibold mt-2", active ? "text-blue-700" : "text-muted-foreground")}>
                                {opt.label}
                              </p>
                              {active && (
                                <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {paymentMethod === "CASH" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3 overflow-hidden"
                      >
                        <div className="space-y-1.5">
                          <Label className="text-sm font-semibold">Cash Received</Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="pl-10 h-11 text-lg font-bold"
                              value={cashReceived}
                              onChange={(e) => setCashReceived(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {[50, 100, 150, 200].map(v => (
                            <Button
                              key={v}
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setCashReceived(String(Math.max(v, selectedBill.totalAmount).toFixed(2)))}
                            >
                              ${v}
                            </Button>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCashReceived(String(selectedBill.totalAmount.toFixed(2)))}
                          >
                            Exact
                          </Button>
                        </div>
                        {cashReceived && (
                          <div className={cn(
                            "p-3.5 rounded-xl border-2",
                            change >= 0 ? "bg-emerald-50/60 border-emerald-200" : "bg-red-50/60 border-red-200"
                          )}>
                            <div className="flex justify-between items-center">
                              <span className={cn("text-sm font-semibold", change >= 0 ? "text-emerald-700" : "text-red-700")}>
                                {change >= 0 ? "Change Due" : "Insufficient"}
                              </span>
                              <span className={cn("text-xl font-black", change >= 0 ? "text-emerald-700" : "text-red-700")}>
                                {formatCurrency(Math.abs(change))}
                              </span>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    <Button
                      size="lg"
                      variant="success"
                      className="w-full gap-2 h-12 text-base"
                      onClick={() => handleMarkPaid(selectedBill.id)}
                      disabled={processingId === selectedBill.id || (paymentMethod === "CASH" && (change < 0 || !cashReceived))}
                    >
                      {processingId === selectedBill.id ? (
                        <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" />
                      )}
                      Mark as Paid — {formatCurrency(selectedBill.totalAmount)}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-full">
                <CardContent className="py-20 text-center">
                  <Receipt className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-lg font-bold text-muted-foreground">Select a bill to view</p>
                  <p className="text-sm text-muted-foreground mt-1">Choose a pending bill from the list</p>
                </CardContent>
              </Card>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
