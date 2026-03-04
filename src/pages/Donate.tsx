import { useState } from "react";
import { Heart, Shield, ArrowRight, CreditCard, Smartphone, Wallet, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

const suggestedAmounts = [25, 50, 100, 250, 500, 1000];

type PaymentMethod = "credit" | "momo" | "paypal";

const paymentMethods: { id: PaymentMethod; label: string; icon: React.ElementType; desc: string }[] = [
  { id: "credit", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, Amex" },
  { id: "momo", label: "Mobile Money", icon: Smartphone, desc: "MTN, Vodafone, AirtelTigo" },
  { id: "paypal", label: "PayPal", icon: Wallet, desc: "Pay with your PayPal account" },
];

const Donate = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [selectedPreset, setSelectedPreset] = useState<number | null>(100);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit");
  const [isRecurring, setIsRecurring] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handlePreset = (val: number) => {
    setSelectedPreset(val);
    setAmount(val);
  };

  const handleCustom = (val: string) => {
    setSelectedPreset(null);
    setAmount(val === "" ? "" : Number(val));
  };

  const finalAmount = selectedPreset ?? (amount || 0);

  const handleContinue = () => {
    if (!finalAmount || finalAmount <= 0) return;
    setStep(2);
  };

  return (
    <main>
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-24 pb-16 bg-gradient-navy overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-accent blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-accent blur-[100px]" />
        </div>
        <div className="container max-w-3xl relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6 border border-accent/20">
              <Heart className="w-10 h-10 text-accent" fill="currentColor" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight">
              Partner With <span className="text-gradient-gold">This Ministry</span>
            </h1>
            <p className="mt-5 text-primary-foreground/70 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
              Your generous gift fuels the proclamation of the everlasting gospel
              across the globe — through sermons, Bible studies, and outreach.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-background min-h-screen -mt-2">
        <div className="container max-w-4xl py-12 md:py-16">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid lg:grid-cols-5 gap-8"
              >
                {/* Amount Selection - Left */}
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
                      Select Amount
                    </h2>
                    <p className="text-muted-foreground text-sm">Choose a preset or enter a custom amount</p>
                  </div>

                  {/* Recurring toggle */}
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card">
                    <button
                      onClick={() => setIsRecurring(false)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        !isRecurring
                          ? "bg-gradient-gold text-primary shadow-md"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      One-Time Gift
                    </button>
                    <button
                      onClick={() => setIsRecurring(true)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                        isRecurring
                          ? "bg-gradient-gold text-primary shadow-md"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Monthly Partner
                    </button>
                  </div>

                  {/* Amount Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    {suggestedAmounts.map((val) => (
                      <motion.button
                        key={val}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => handlePreset(val)}
                        className={`relative py-5 rounded-xl text-xl font-bold transition-all border-2 ${
                          selectedPreset === val
                            ? "bg-gradient-gold text-primary border-transparent shadow-lg"
                            : "bg-card border-border text-foreground hover:border-accent/50"
                        }`}
                      >
                        ${val.toLocaleString()}
                        {selectedPreset === val && (
                          <motion.div
                            layoutId="check"
                            className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center"
                          >
                            <Check className="w-3 h-3 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  {/* Custom Amount */}
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="Enter custom amount"
                      value={selectedPreset === null ? amount : ""}
                      onChange={(e) => handleCustom(e.target.value)}
                      className="pl-9 text-lg h-14 bg-card border-border focus-visible:ring-accent font-semibold"
                      min="1"
                    />
                  </div>

                  {/* Continue Button */}
                  <Button
                    onClick={handleContinue}
                    disabled={!finalAmount || finalAmount <= 0}
                    className="w-full h-14 text-lg bg-gradient-gold text-primary font-bold gap-2 hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    Continue — ${Number(finalAmount).toLocaleString()}
                    {isRecurring ? "/mo" : ""}
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Sidebar - Right */}
                <div className="lg:col-span-2 space-y-5">
                  <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="font-serif font-bold text-foreground mb-4">
                      Your Impact
                    </h3>
                    <ul className="space-y-4 text-sm">
                      {[
                        { amount: "$25", impact: "Provides sermon recordings for 50 listeners" },
                        { amount: "$100", impact: "Funds a full week of Bible study materials" },
                        { amount: "$500", impact: "Sponsors a community outreach event" },
                        { amount: "$1,000", impact: "Supports a month of global broadcasting" },
                      ].map((item) => (
                        <li key={item.amount} className="flex gap-3">
                          <span className="text-accent font-bold min-w-[52px]">{item.amount}</span>
                          <span className="text-muted-foreground">{item.impact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className="w-5 h-5 text-accent" />
                      <h3 className="font-serif font-bold text-foreground text-sm">
                        Secure & Trusted
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      All transactions are secured with 256-bit SSL encryption.
                      Last Call Messages is a registered nonprofit — all donations
                      are tax-deductible.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="max-w-2xl mx-auto space-y-6"
              >
                {/* Back & Summary */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back
                  </button>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {isRecurring ? "Monthly" : "One-time"} gift
                    </p>
                    <p className="text-3xl font-serif font-bold text-foreground">
                      ${Number(finalAmount).toLocaleString()}
                      {isRecurring && <span className="text-lg text-muted-foreground">/mo</span>}
                    </p>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div>
                  <h2 className="font-serif text-xl font-bold text-foreground mb-4">
                    Payment Method
                  </h2>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      const isActive = paymentMethod === method.id;
                      return (
                        <motion.button
                          key={method.id}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setPaymentMethod(method.id)}
                          className={`w-full flex items-center gap-4 p-5 rounded-xl border-2 transition-all text-left ${
                            isActive
                              ? "border-accent bg-accent/5 shadow-sm"
                              : "border-border bg-card hover:border-accent/30"
                          }`}
                        >
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-gradient-gold text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{method.label}</p>
                            <p className="text-xs text-muted-foreground">{method.desc}</p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isActive ? "border-accent" : "border-border"
                            }`}
                          >
                            {isActive && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-2.5 h-2.5 rounded-full bg-accent"
                              />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Payment Form Fields */}
                <AnimatePresence mode="wait">
                  {paymentMethod === "credit" && (
                    <motion.div
                      key="credit-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Cardholder Name
                          </label>
                          <Input
                            placeholder="John Doe"
                            className="h-12 bg-background border-border focus-visible:ring-accent"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Card Number
                          </label>
                          <Input
                            placeholder="4242 4242 4242 4242"
                            className="h-12 bg-background border-border focus-visible:ring-accent font-mono tracking-wider"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                              Expiry
                            </label>
                            <Input
                              placeholder="MM / YY"
                              className="h-12 bg-background border-border focus-visible:ring-accent"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                              CVC
                            </label>
                            <Input
                              placeholder="123"
                              className="h-12 bg-background border-border focus-visible:ring-accent"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {paymentMethod === "momo" && (
                    <motion.div
                      key="momo-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="p-6 rounded-xl border border-border bg-card space-y-4">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Mobile Money Provider
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {["MTN MoMo", "Vodafone Cash", "AirtelTigo"].map((provider) => (
                              <button
                                key={provider}
                                className="py-3 px-2 rounded-lg border border-border bg-background text-xs font-semibold text-foreground hover:border-accent/50 transition-colors"
                              >
                                {provider}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                            Phone Number
                          </label>
                          <Input
                            placeholder="+233 XX XXX XXXX"
                            className="h-12 bg-background border-border focus-visible:ring-accent"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You will receive a prompt on your phone to authorize the payment.
                        </p>
                      </div>
                    </motion.div>
                  )}
                  {paymentMethod === "paypal" && (
                    <motion.div
                      key="paypal-form"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 rounded-xl border border-border bg-card text-center">
                        <Wallet className="w-12 h-12 text-accent mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">
                          You'll be redirected to PayPal to complete your{" "}
                          {isRecurring ? "monthly" : ""} donation securely.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Donate Button */}
                <Button className="w-full h-14 text-lg bg-gradient-gold text-primary font-bold gap-2 hover:opacity-90 transition-opacity">
                  {paymentMethod === "paypal" ? "Continue to PayPal" : "Donate Now"} — $
                  {Number(finalAmount).toLocaleString()}
                  {isRecurring ? "/mo" : ""}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>256-bit SSL encryption · PCI compliant · Tax-deductible</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Donate;
