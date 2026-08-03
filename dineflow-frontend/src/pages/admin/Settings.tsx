import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Tabs, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import {
  Settings2, Store, CreditCard, Receipt, Bell, UtensilsCrossed,
  Plug, Save, Upload, Image as ImageIcon, MapPin, Phone, Mail,
  Globe, Clock, ToggleLeft, ToggleRight, ShieldCheck, RefreshCw,
  CheckCircle2, AlertTriangle, Plus, Trash2, Key, Smartphone,
  FileText, Zap, Link, Download
} from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/toast"
import { cn, formatCurrency } from "@/lib/utils"

type SectionId = "general" | "payments" | "taxes" | "notifications" | "tables" | "integrations"

const sections: { id: SectionId; label: string; Icon: any; desc: string }[] = [
  { id: "general", label: "General", Icon: Store, desc: "Restaurant info & branding" },
  { id: "payments", label: "Payments", Icon: CreditCard, desc: "Gateways & methods" },
  { id: "taxes", label: "Taxes", Icon: Receipt, desc: "Tax rates & rules" },
  { id: "notifications", label: "Notifications", Icon: Bell, desc: "Email & SMS alerts" },
  { id: "tables", label: "Tables", Icon: UtensilsCrossed, desc: "Layout & QR codes" },
  { id: "integrations", label: "Integrations", Icon: Plug, desc: "Third-party services" },
]

export default function Settings() {
  const { toast } = useToast()
  const [section, setSection] = useState<SectionId>("general")

  const [general, setGeneral] = useState({
    name: "Azure Sky Restaurant",
    description: "Modern fine dining with breathtaking ocean views and seasonal menus",
    address: "1200 Harbor Drive, Suite 200",
    city: "San Diego",
    state: "California",
    zipCode: "92101",
    phone: "+1 (619) 555-0199",
    email: "hello@azuresky.com",
    website: "https://azuresky.com",
    cuisine: "Contemporary American",
    minOrderAmount: 15,
    deliveryFee: 4.99,
    deliveryRadius: 5,
    openTime: "11:00",
    closeTime: "22:00",
    onlineOrdering: true,
    reservationsEnabled: true,
    allowGuestCheckout: true,
    waitlistEnabled: false,
  })

  const [payments, setPayments] = useState({
    acceptCash: true,
    acceptCards: true,
    acceptApplePay: true,
    acceptGooglePay: true,
    stripeEnabled: true,
    testMode: true,
    autoCapture: false,
    tipOptions: [15, 20, 25],
    customTip: true,
    convenienceFee: 0,
    serviceCharge: 0,
  })

  const [taxes, setTaxes] = useState({
    taxRate: "8.25",
    taxOnDelivery: true,
    taxOnTips: false,
    inclusivePricing: false,
    roundTax: true,
    displayTaxBreakdown: true,
  })

  const [notifications, setNotifications] = useState({
    emailNewOrder: true,
    smsNewOrder: false,
    pushNewOrder: true,
    emailReservation: true,
    smsReservation: true,
    emailLowStock: true,
    dailyReport: true,
    weeklyReport: true,
    marketingEmails: false,
    customerReviewAlert: true,
  })

  const [tables, setTables] = useState({
    totalTables: 20,
    autoAssignWaiter: true,
    generateQrCodes: true,
    tableNaming: "numeric",
    mergeEnabled: true,
    splitCheckEnabled: true,
  })

  const [integrations, setIntegrations] = useState({
    googleAnalytics: true,
    facebookPixel: false,
    mailchimp: true,
    slack: false,
    quickbooks: true,
    zapier: false,
  })

  const notifySaved = () =>
    toast({ title: "Settings saved", description: "Your changes have been applied", variant: "success" })

  const ActiveIcon = sections.find((s) => s.id === section)?.Icon || Settings2

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Restaurant Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your restaurant operations, branding, and integrations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Changes reverted" })}>
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          <Button className="gap-2" onClick={notifySaved}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="sticky top-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-orange-500" />
                Settings Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-1">
              {sections.map((s) => {
                const Icon = s.Icon
                const active = section === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => setSection(s.id)}
                    className={cn(
                      "w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all group",
                      active
                        ? "bg-gradient-to-r from-orange-500/10 to-rose-500/10 ring-1 ring-orange-500/20"
                        : "hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                      active
                        ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                    )}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={cn("text-sm font-semibold", active ? "text-slate-900" : "text-slate-700")}>{s.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                    </div>
                  </button>
                )
              })}
            </CardContent>
          </Card>
        </motion.aside>

        <motion.div
          key={section}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {section === "general" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 text-white flex items-center justify-center">
                        <Store className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle>Restaurant Profile</CardTitle>
                        <CardDescription>Branding and contact information</CardDescription>
                      </div>
                    </div>
                    <Badge variant="success" className="gap-1.5">
                      <CheckCircle2 className="h-3 w-3" />
                      Published
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-1">
                      <Label>Logo</Label>
                      <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-300 transition-colors bg-gradient-to-br from-slate-50 to-white p-6 text-center cursor-pointer group">
                        <div className="h-24 w-24 mx-auto rounded-2xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-lg ring-4 ring-white mb-4">
                          <Store className="h-10 w-10" />
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-lg bg-orange-500 text-white px-3 py-1.5 text-xs font-semibold group-hover:bg-orange-600 transition-colors">
                          <Upload className="h-3.5 w-3.5" />
                          Upload Logo
                        </div>
                        <p className="text-[11px] text-slate-500 mt-2">PNG or SVG, max 2MB</p>
                      </div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                      <div className="space-y-2">
                        <Label>Restaurant Name *</Label>
                        <Input
                          value={general.name}
                          onChange={(e) => setGeneral({ ...general, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          rows={3}
                          value={general.description}
                          onChange={(e) => setGeneral({ ...general, description: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Cuisine Type</Label>
                        <Select
                          value={general.cuisine}
                          onValueChange={(v) => setGeneral({ ...general, cuisine: v })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Contemporary American">Contemporary American</SelectItem>
                            <SelectItem value="Italian">Italian</SelectItem>
                            <SelectItem value="Japanese">Japanese</SelectItem>
                            <SelectItem value="Mexican">Mexican</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-violet-500" />
                      Location & Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Street Address</Label>
                        <Input
                          value={general.address}
                          onChange={(e) => setGeneral({ ...general, address: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input
                          value={general.city}
                          onChange={(e) => setGeneral({ ...general, city: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>State</Label>
                          <Input
                            value={general.state}
                            onChange={(e) => setGeneral({ ...general, state: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>ZIP</Label>
                          <Input
                            value={general.zipCode}
                            onChange={(e) => setGeneral({ ...general, zipCode: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> Phone</Label>
                        <Input
                          value={general.phone}
                          onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-400" /> Email</Label>
                        <Input
                          type="email"
                          value={general.email}
                          onChange={(e) => setGeneral({ ...general, email: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1"><Globe className="h-3.5 w-3.5 text-slate-400" /> Website</Label>
                        <Input
                          value={general.website}
                          onChange={(e) => setGeneral({ ...general, website: e.target.value })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> Opens</Label>
                          <Input
                            type="time"
                            value={general.openTime}
                            onChange={(e) => setGeneral({ ...general, openTime: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-slate-400" /> Closes</Label>
                          <Input
                            type="time"
                            value={general.closeTime}
                            onChange={(e) => setGeneral({ ...general, closeTime: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-emerald-500" />
                      Ordering Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                      <div className="space-y-2">
                        <Label>Minimum Order</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={general.minOrderAmount}
                          onChange={(e) => setGeneral({ ...general, minOrderAmount: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Delivery Fee</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={general.deliveryFee}
                          onChange={(e) => setGeneral({ ...general, deliveryFee: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Delivery Radius (mi)</Label>
                        <Input
                          type="number"
                          min={0}
                          value={general.deliveryRadius}
                          onChange={(e) => setGeneral({ ...general, deliveryRadius: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { key: "onlineOrdering" as const, label: "Enable Online Ordering", desc: "Allow customers to place orders via web/app" },
                        { key: "reservationsEnabled" as const, label: "Accept Reservations", desc: "Let customers book tables in advance" },
                        { key: "allowGuestCheckout" as const, label: "Guest Checkout", desc: "Allow orders without creating an account" },
                        { key: "waitlistEnabled" as const, label: "Waitlist Mode", desc: "Enable queue for peak hour seating" },
                      ].map((opt) => (
                        <div
                          key={opt.key}
                          className="flex items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer"
                          onClick={() => setGeneral({ ...general, [opt.key]: !general[opt.key] })}
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{opt.label}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                          </div>
                          {general[opt.key] ? (
                            <ToggleRight className="h-6 w-6 text-orange-600 shrink-0" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-slate-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {section === "payments" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Payment Methods</CardTitle>
                      <CardDescription>Accepted payment types and processing</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { k: "acceptCash", label: "Cash", desc: "Accept physical cash payments" },
                      { k: "acceptCards", label: "Credit/Debit Cards", desc: "Visa, Mastercard, Amex" },
                      { k: "acceptApplePay", label: "Apple Pay", desc: "Apple device payments" },
                      { k: "acceptGooglePay", label: "Google Pay", desc: "Android device payments" },
                    ].map((m) => (
                      <div
                        key={m.k}
                        className="flex items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/40 hover:bg-slate-50 cursor-pointer"
                        onClick={() => setPayments({ ...payments, [m.k]: !payments[m.k as keyof typeof payments] as boolean })}
                      >
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{m.label}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                        </div>
                        {payments[m.k as keyof typeof payments] ? (
                          <ToggleRight className="h-6 w-6 text-orange-600 shrink-0" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-slate-400 shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Processor Configuration</h3>
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 mb-5">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-bold text-emerald-900">Stripe Connect</p>
                              <p className="text-[11px] text-emerald-700 mt-0.5">Securely linked and accepting payments</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn(
                                "border-0 font-semibold gap-1",
                                payments.testMode ? "bg-amber-500/10 text-amber-700" : "bg-emerald-500/10 text-emerald-700"
                              )}>
                                {payments.testMode ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                                {payments.testMode ? "Test Mode" : "Live Mode"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { k: "stripeEnabled", label: "Enable Stripe" },
                        { k: "testMode", label: "Test / Sandbox Mode" },
                        { k: "autoCapture", label: "Auto Capture on Delivery" },
                        { k: "customTip", label: "Allow Custom Tip" },
                      ].map((m) => (
                        <div
                          key={m.k}
                          className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 cursor-pointer hover:bg-slate-50"
                          onClick={() => setPayments({ ...payments, [m.k]: !payments[m.k as keyof typeof payments] as boolean })}
                        >
                          <p className="text-sm font-semibold text-slate-700">{m.label}</p>
                          {payments[m.k as keyof typeof payments] ? (
                            <ToggleRight className="h-6 w-6 text-orange-600" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-slate-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Fees & Gratuity</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label>Convenience Fee (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          value={payments.convenienceFee}
                          onChange={(e) => setPayments({ ...payments, convenienceFee: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Service Charge (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          step={0.01}
                          value={payments.serviceCharge}
                          onChange={(e) => setPayments({ ...payments, serviceCharge: parseFloat(e.target.value) || 0 })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Suggested Tip Amounts</Label>
                      <div className="flex flex-wrap gap-2">
                        {payments.tipOptions.map((t, i) => (
                          <div key={i} className="flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2">
                            <span className="text-sm font-bold text-slate-700">{t}%</span>
                            <button
                              onClick={() => {
                                const newTips = payments.tipOptions.filter((_, idx) => idx !== i)
                                setPayments({ ...payments, tipOptions: newTips })
                              }}
                              className="text-slate-400 hover:text-red-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => {
                            const v = prompt("Tip percentage?", "18")
                            const n = parseInt(v || "")
                            if (n > 0 && n <= 100) setPayments({ ...payments, tipOptions: [...payments.tipOptions, n].sort() })
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Tip
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {section === "taxes" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Tax Settings</CardTitle>
                      <CardDescription>Tax rates, rules, and display options</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label>Default Sales Tax Rate (%)</Label>
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={taxes.taxRate}
                        onChange={(e) => setTaxes({ ...taxes, taxRate: e.target.value })}
                      />
                      <p className="text-[11px] text-slate-500">Applied to all taxable items unless overridden</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Sample Calculation</Label>
                      <div className="h-11 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center px-4 text-sm font-semibold text-slate-700">
                        {formatCurrency(100)} × {taxes.taxRate}% = {formatCurrency(100 * parseFloat(taxes.taxRate) / 100)}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Tax Rules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { k: "taxOnDelivery" as const, label: "Tax Delivery Fees", desc: "Apply sales tax to delivery charges" },
                        { k: "taxOnTips" as const, label: "Tax Gratuity/Tips", desc: "Include tips in taxable subtotal" },
                        { k: "inclusivePricing" as const, label: "Tax Inclusive Pricing", desc: "Display prices with tax included" },
                        { k: "roundTax" as const, label: "Round Tax Calculation", desc: "Round to nearest cent" },
                        { k: "displayTaxBreakdown" as const, label: "Show Tax Breakdown", desc: "Display itemized taxes on receipts" },
                      ].map((r) => (
                        <div
                          key={r.k}
                          className="flex items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/40 hover:bg-slate-50 cursor-pointer"
                          onClick={() => setTaxes({ ...taxes, [r.k]: !taxes[r.k] })}
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{r.label}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{r.desc}</p>
                          </div>
                          {taxes[r.k] ? (
                            <ToggleRight className="h-6 w-6 text-orange-600 shrink-0" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-slate-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {section === "notifications" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Choose alerts for staff and customers</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  {[
                    {
                      group: "New Orders",
                      items: [
                        { k: "emailNewOrder" as const, label: "Email alerts", desc: "Send to management inbox" },
                        { k: "smsNewOrder" as const, label: "SMS alerts", desc: "Text primary manager" },
                        { k: "pushNewOrder" as const, label: "Push notifications", desc: "In-app + browser push" },
                      ],
                    },
                    {
                      group: "Reservations",
                      items: [
                        { k: "emailReservation" as const, label: "Email confirmation", desc: "Customer & staff copies" },
                        { k: "smsReservation" as const, label: "SMS reminders", desc: "Text 2-hour reminders" },
                      ],
                    },
                    {
                      group: "Operations",
                      items: [
                        { k: "emailLowStock" as const, label: "Low stock alerts", desc: "When inventory threshold hit" },
                        { k: "dailyReport" as const, label: "Daily summary email", desc: "End-of-day report" },
                        { k: "weeklyReport" as const, label: "Weekly digest", desc: "Every Monday 9 AM" },
                      ],
                    },
                    {
                      group: "Customer Engagement",
                      items: [
                        { k: "marketingEmails" as const, label: "Marketing emails", desc: "Promos, newsletters" },
                        { k: "customerReviewAlert" as const, label: "Review alerts", desc: "Notify on new reviews" },
                      ],
                    },
                  ].map((section) => (
                    <div key={section.group}>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 px-1">{section.group}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {section.items.map((n) => (
                          <div
                            key={n.k}
                            className="flex items-center justify-between rounded-xl border border-slate-100 p-3.5 hover:bg-slate-50 cursor-pointer"
                            onClick={() => setNotifications({ ...notifications, [n.k]: !notifications[n.k] })}
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-900">{n.label}</p>
                              <p className="text-[11px] text-slate-500">{n.desc}</p>
                            </div>
                            {notifications[n.k] ? (
                              <ToggleRight className="h-6 w-6 text-orange-600 shrink-0" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-slate-400 shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}

          {section === "tables" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center">
                      <UtensilsCrossed className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Table Management</CardTitle>
                      <CardDescription>Seating, floor plan, and QR codes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Total Tables</Label>
                      <Input
                        type="number"
                        min={0}
                        value={tables.totalTables}
                        onChange={(e) => setTables({ ...tables, totalTables: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Naming Style</Label>
                      <Select
                        value={tables.tableNaming}
                        onValueChange={(v) => setTables({ ...tables, tableNaming: v })}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="numeric">Numeric (T-01, T-02...)</SelectItem>
                          <SelectItem value="alpha">Alphabetic (A1, B2...)</SelectItem>
                          <SelectItem value="custom">Custom labels</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <h3 className="text-sm font-bold text-slate-900 mb-4">Table Options</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { k: "autoAssignWaiter" as const, label: "Auto-Assign Waiter", desc: "Match to section's staff" },
                        { k: "generateQrCodes" as const, label: "Generate QR Codes", desc: "Scan-to-order per table" },
                        { k: "mergeEnabled" as const, label: "Allow Table Merge", desc: "Combine tables for large parties" },
                        { k: "splitCheckEnabled" as const, label: "Allow Split Check", desc: "Per-guest itemized billing" },
                      ].map((t) => (
                        <div
                          key={t.k}
                          className="flex items-center justify-between rounded-xl border border-slate-100 p-4 bg-slate-50/40 hover:bg-slate-50 cursor-pointer"
                          onClick={() => setTables({ ...tables, [t.k]: !tables[t.k] })}
                        >
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{t.label}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">{t.desc}</p>
                          </div>
                          {tables[t.k] ? (
                            <ToggleRight className="h-6 w-6 text-orange-600 shrink-0" />
                          ) : (
                            <ToggleLeft className="h-6 w-6 text-slate-400 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" className="gap-2"><Download className="h-4 w-4" /> Download All QR Codes</Button>
                      <Button variant="outline" className="gap-2"><RefreshCw className="h-4 w-4" /> Regenerate Codes</Button>
                      <Button variant="outline" className="gap-2"><FileText className="h-4 w-4" /> Print Table Sheets</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {section === "integrations" && (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white flex items-center justify-center">
                      <Plug className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Integrations</CardTitle>
                      <CardDescription>Connect analytics, marketing, and accounting tools</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { k: "googleAnalytics", label: "Google Analytics 4", desc: "Website and conversion tracking", color: "from-sky-500 to-blue-600", Icon: Globe },
                    { k: "facebookPixel", label: "Meta Pixel", desc: "Ad optimization and retargeting", color: "from-blue-600 to-indigo-700", Icon: Smartphone },
                    { k: "mailchimp", label: "Mailchimp", desc: "Email marketing and automations", color: "from-yellow-500 to-amber-600", Icon: Mail },
                    { k: "slack", label: "Slack", desc: "Order and event alerts to channels", color: "from-purple-500 to-pink-600", Icon: Key },
                    { k: "quickbooks", label: "QuickBooks", desc: "Auto-sync sales and expenses", color: "from-emerald-500 to-green-700", Icon: FileText },
                    { k: "zapier", label: "Zapier", desc: "5,000+ app workflows (IFTTT)", color: "from-orange-500 to-red-600", Icon: Zap },
                  ].map((i) => {
                    const on = integrations[i.k as keyof typeof integrations]
                    const Icon = i.Icon
                    return (
                      <div
                        key={i.k}
                        className="flex items-center justify-between rounded-2xl border border-slate-100 p-4 hover:border-slate-200 hover:bg-slate-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={cn("h-11 w-11 rounded-xl bg-gradient-to-br text-white flex items-center justify-center", i.color)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">{i.label}</p>
                              <Badge variant={on ? "success" : "muted"} className="text-[10px] gap-1">
                                {on ? <CheckCircle2 className="h-2.5 w-2.5" /> : <AlertTriangle className="h-2.5 w-2.5" />}
                                {on ? "Connected" : "Not linked"}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{i.desc}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {on && (
                            <Button variant="ghost" size="sm" className="gap-1 text-xs">
                              <Link className="h-3.5 w-3.5" /> Configure
                            </Button>
                          )}
                          <div
                            onClick={() => setIntegrations({ ...integrations, [i.k]: !integrations[i.k as keyof typeof integrations] })}
                            className="cursor-pointer"
                          >
                            {on ? (
                              <ToggleRight className="h-6 w-6 text-orange-600 shrink-0" />
                            ) : (
                              <ToggleLeft className="h-6 w-6 text-slate-400 shrink-0" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
