import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import brandLogo from "./assets/icon/logo_brand.png";
import {
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Award,
  Wind,
  Waves,
  CloudRain,
  Volume2,
  VolumeX,
  Star,
  ArrowRight,
  Check,
  ChevronDown,
  X,
  Menu,
  Smile,
  Plus,
  Minus,
  Trash2,
  Flower2,
  Moon,
  Baby,
  Info,
} from "lucide-react";
import { PRODUCTS, SOUNDS, TESTIMONIALS, FAQS } from "./data";
import { Product, CartItem, SoundOption } from "./types";
import heroImage from "./assets/images/hinh1.png";
import classicRoseStoryImage from "./assets/images/hinh4.png";
import buttercreamStoryImage from "./assets/images/hinh5.png";

export default function App() {
  // Navigation & Responsiveness States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Cart Management
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("bunny_lullaby_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [orderForm, setOrderForm] = useState({
    parentName: "",
    phone: "",
    address: "",
    babyAge: "6",
    giftNote: "",
  });

  // Modal / Detail States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Love Likes Counter
  const [likes, setLikes] = useState(() => {
    try {
      const saved = localStorage.getItem("bunny_likes");
      return saved
        ? JSON.parse(saved)
        : { "bunny-rose": 142, "bunny-buttercream": 95, "bunny-lavender": 118 };
    } catch {
      return {
        "bunny-rose": 142,
        "bunny-buttercream": 95,
        "bunny-lavender": 118,
      };
    }
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = { ...likes, [id]: likes[id as keyof typeof likes] + 1 };
    setLikes(updated);
    localStorage.setItem("bunny_likes", JSON.stringify(updated));
  };

  // Sound Synth States for Lullaby Soundboard
  const [playingSoundId, setPlayingSoundId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const melodyIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Save Cart to local Storage
  useEffect(() => {
    localStorage.setItem("bunny_lullaby_cart", JSON.stringify(cart));
  }, [cart]);

  // Clean up sound context on unmount
  useEffect(() => {
    return () => {
      stopLullaby();
    };
  }, []);

  const stopLullaby = () => {
    if (melodyIntervalRef.current) {
      clearInterval(melodyIntervalRef.current);
      melodyIntervalRef.current = null;
    }
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (e) {
      console.warn("Error cleaning synth nodes:", e);
    }
    setPlayingSoundId(null);
  };

  const handlePlaySound = (sound: SoundOption) => {
    if (playingSoundId === sound.id) {
      stopLullaby();
      return;
    }

    // Try to trigger Web Audio synthetic cute lullaby box
    stopLullaby();
    setPlayingSoundId(sound.id);

    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        alert(
          "Hello parent, this browser doesn't support automatic sleep sound synthesis yet.",
        );
        return;
      }

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Master volume envelope
      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNodeRef.current = masterGain;

      // A beautiful dreamy music scale (Pentatonic/Lydian) for baby relaxation
      let noteStep = 0;
      const multipliers = [1.0, 1.25, 1.5, 1.666, 1.875, 2.0, 2.5, 3.0];

      const triggerSoftNote = () => {
        if (!audioContextRef.current || ctx.state === "closed") return;

        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Calculate a gentle frequency around base
        const mult = multipliers[noteStep % multipliers.length];
        const currentFreq = sound.frequency * mult;

        osc.type = sound.waveType;
        osc.frequency.setValueAtTime(currentFreq, ctx.currentTime);

        // Make it sound like a beautiful xylophone / music box clock
        noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
        // Soft attack to avoid digital clicks
        noteGain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.1);
        // Exponential decay to sound cozy and plush-like
        noteGain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 1.2,
        );

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start();
        osc.stop(ctx.currentTime + 1.4);

        noteStep = (noteStep + 1) % 32;
      };

      // Play first note immediately then schedule
      triggerSoftNote();
      const interval = setInterval(triggerSoftNote, 800);
      melodyIntervalRef.current = interval;
    } catch (err) {
      console.error("Web Audio initialization failure:", err);
      setPlayingSoundId(null);
    }
  };

  // Add to Cart
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { product, quantity }];
    });
    // Visual cue
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderForm.parentName || !orderForm.phone || !orderForm.address) {
      alert(
        "Please fill in all your shipping details so we can deliver your bunny!",
      );
      return;
    }
    // Success flow
    setIsCheckoutSuccess(true);
    setCart([]);
  };

  // Active filter for products
  const filteredProducts =
    activeTab === "all"
      ? PRODUCTS
      : PRODUCTS.filter(
          (p) =>
            p.badge?.toLowerCase() === activeTab.toLowerCase() ||
            p.tags.some((t) =>
              t.toLowerCase().includes(activeTab.toLowerCase()),
            ),
        );

  return (
    <div className="min-h-screen bg-[#FDF9EA] text-[#3D2D31] font-sans relative">
      {/* BACKGROUND FLOATING CLOUDS ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <div className="absolute top-[15%] left-[-5%] w-[320px] h-[180px] bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-[45%] right-[-10%] w-[400px] h-[220px] bg-[#FFE8EC] rounded-full blur-3xl"></div>
        <div className="absolute top-[75%] left-[10%] w-[350px] h-[190px] bg-[#FFFEFA] rounded-full blur-2.5xl"></div>
      </div>

      {/* HEADER SECTION */}
      <header className="sticky top-0 z-40 bg-[#FDF9EA]/90 backdrop-blur-md border-b border-[#FFD5E0]/40 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Brand */}
            <a href="#" className="flex items-center gap-3 group">
              <img 
                src={brandLogo} 
                alt="Bunny Lullaby Logo" 
                className="h-16 sm:h-[72px] w-auto object-contain transform group-hover:scale-105 transition-all" 
              />
            </a>
            
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <a
              href="#story"
              className="text-[#3D2D31]/80 hover:text-[#E84A6E] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#E84A6E] hover:after:w-full after:transition-all"
            >
              Our Story
            </a>
            <a
              href="#showcase"
              className="text-[#3D2D31]/80 hover:text-[#E84A6E] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#E84A6E] hover:after:w-full after:transition-all"
            >
              Collections
            </a>
            <a
              href="#soundboard"
              className="text-[#3D2D31]/80 hover:text-[#E84A6E] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#E84A6E] hover:after:w-full after:transition-all"
            >
              Music Box
            </a>
            <a
              href="#quality"
              className="text-[#3D2D31]/80 hover:text-[#E84A6E] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#E84A6E] hover:after:w-full after:transition-all"
            >
              Safety Standards
            </a>
            <a
              href="#faq"
              className="text-[#3D2D31]/80 hover:text-[#E84A6E] transition-colors relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#E84A6E] hover:after:w-full after:transition-all"
            >
              FAQs
            </a>
          </nav>

          {/* Actions Menu */}
          <div className="flex items-center gap-4">
            {/* Cart Box */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-[#FFE8EC] hover:bg-[#FFD5E0] text-[#E84A6E] px-4 py-2.5 rounded-full font-bold text-sm tracking-wide flex items-center gap-2 relative shadow-xs hover:scale-105 transition-all cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cuddle Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E84A6E] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-display border border-[#FDF9EA]">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              className="md:hidden p-2 text-[#3D2D31] hover:text-[#E84A6E] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAV DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FDF9EA] border-b border-[#FFD5E0] relative z-30"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 font-semibold">
              <a
                href="#story"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-[#FFE8EC] text-[#3D2D31] hover:text-[#E84A6E] transition-colors"
              >
                Our Story
              </a>
              <a
                href="#showcase"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-[#FFE8EC] text-[#3D2D31] hover:text-[#E84A6E] transition-colors"
              >
                Collections
              </a>
              <a
                href="#soundboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-[#FFE8EC] text-[#3D2D31] hover:text-[#E84A6E] transition-colors"
              >
                Music Box
              </a>
              <a
                href="#quality"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-[#FFE8EC] text-[#3D2D31] hover:text-[#E84A6E] transition-colors"
              >
                Safety Standards
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg hover:bg-[#FFE8EC] text-[#3D2D31] hover:text-[#E84A6E] transition-colors"
              >
                FAQs
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-24 lg:py-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text panel */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Tagline premium marker */}
            <div className="inline-flex items-center gap-2 bg-[#FFE8EC] border border-[#FFD5E0] px-4 py-1.5 rounded-full text-xs font-bold text-[#E84A6E] uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#E84A6E]" />
              Natural Organic Sleep Aromatherapy
            </div>

            {/* Title display */}
            <h1 className="font-display font-extrabold text-[#3D2D31] tracking-tight leading-tight text-4xl sm:text-5xl md:text-6xl max-w-2xl mx-auto lg:mx-0">
              A Gentle Embrace for{" "}
              <span className="text-[#E84A6E] relative">
                Your Baby's
                <span className="absolute left-0 bottom-1 w-full h-2 bg-[#FFD5E0]/60 -z-10 rounded-full"></span>
              </span>{" "}
              Sweet Dreams
            </h1>

            {/* Tagline */}
            <p className="font-tagline italic text-lg sm:text-xl text-[#E84A6E] font-medium tracking-wide">
              &ldquo;Soft Hugs &bull; Sweet Dreams&rdquo; — Nurturing Peace
              beside the Bassinet
            </p>

            <p className="text-base sm:text-lg text-[#3D2D31]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Experience premium organic Bunny Lullaby herbal companion
              plushies. Exquisitely handcrafted from antibacterial organic
              fleece and natural calming lavender lavender essence, helping your
              little one drift into deep, restful sleep naturally, free from
              bedtime fuss.
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#showcase"
                className="w-full sm:w-auto bg-[#E84A6E] hover:bg-[#FF8BA4] text-white px-8 py-4 rounded-full font-bold tracking-wide shadow-md hover:shadow-lg hover:scale-105 transition-all text-center"
              >
                Meet Bunny Lullaby
              </a>
              <a
                href="#soundboard"
                className="w-full sm:w-auto bg-white hover:bg-[#FFE8EC] text-[#E84A6E] border-2 border-[#FFD5E0] px-8 py-4 rounded-full font-bold tracking-wide shadow-2xs hover:scale-105 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Moon className="w-4 h-4" /> Play Sleep Chimes
              </a>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 text-center border-t border-[#FFD5E0]/40 max-w-md mx-auto lg:mx-0">
              <div>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#E84A6E]">
                  100%
                </div>
                <div className="text-xs font-semibold text-[#3D2D31]/60">
                  Organic Cotton
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#E84A6E]">
                  0+ Newborn
                </div>
                <div className="text-xs font-semibold text-[#3D2D31]/60">
                  Safety Certified
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-[#E84A6E]">
                  12K+
                </div>
                <div className="text-xs font-semibold text-[#3D2D31]/60 font-sans">
                  Happy Parents
                </div>
              </div>
            </div>
          </div>

          {/* Graphics panel */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-[#FFD5E0]/40 rounded-full filter blur-3xl z-0 transform scale-90 translate-y-4"></div>

            {/* Outer custom frames */}
            <div className="relative z-10 bg-white/40 p-3 sm:p-4 rounded-3xl border border-white/80 shadow-md">
              <img
                src={heroImage}
                alt="Bunny Lullaby Premium Plush Banner"
                className="w-full h-auto rounded-2xl shadow-sm object-cover aspect-[4/3] sm:aspect-video lg:aspect-[4/3]"
                referrerPolicy="no-referrer"
              />

              {/* Cute badge overlay */}
              <div className="absolute -bottom-6 -left-4 sm:-left-6 bg-[#FDF9EA] border-2 border-[#FF8BA4] p-4 rounded-2xl shadow-md flex items-center gap-3 max-w-xs z-20">
                <div className="bg-[#FFE8EC] p-2.5 rounded-full text-[#E84A6E]">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#E84A6E]">
                    Pediatrician Approved
                  </div>
                  <div className="text-[11px] font-medium text-[#3D2D31]/70">
                    Recommended to soothe bedtime restlessness and assist baby
                    rest cycle
                  </div>
                </div>
              </div>
            </div>

            {/* Floral decorations */}
            <div className="absolute top-[-20px] right-[-20px] z-20 text-[#FF8BA4] opacity-80">
              <Flower2 className="w-10 h-10" />
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY SECTION */}
      <section id="story" className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section banner */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#3D2D31]">
              The <span className="text-[#E84A6E]">Bunny Lullaby</span> Story
            </h2>
            <p className="font-tagline italic text-lg text-[#E84A6E]/80">
              &ldquo;Weaving safe, warm, and gentle cuddles into childhood's
              sweetest moments&rdquo;
            </p>
            <div className="w-24 h-1 bg-[#FFD5E0] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Visual illustration of hand-made soft craft */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-[#FFFDF2] p-4 rounded-2xl border border-[#FFD5E0]/40 shadow-xs">
                    <img
                      src={classicRoseStoryImage}
                      alt="Handcrafted Rose Bunny"
                      className="w-full h-40 object-cover rounded-xl shadow-2xs hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-[11px] text-center font-bold text-[#E84A6E] mt-2">
                      Finely Hand-Embroidered
                    </p>
                  </div>
                  <div className="bg-[#FFFDF2] p-4 rounded-3xl border border-[#FFD5E0]/40 shadow-xs bubble-border-1">
                    <div className="h-28 flex flex-col justify-center items-center text-center p-2 bg-[#FFE8EC]/40 rounded-2xl">
                      <Flower2 className="w-8 h-8 text-[#E84A6E] mb-1" />
                      <p className="text-[11px] font-bold text-[#3D2D31]">
                        100% Organic Lavender
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="bg-[#FFFDF2] p-4 rounded-3xl border border-[#FFD5E0]/40 shadow-xs bubble-border-2">
                    <div className="h-28 flex flex-col justify-center items-center text-center p-2 bg-[#FDF9EA] rounded-2xl">
                      <ShieldCheck className="w-8 h-8 text-[#E84A6E] mb-1" />
                      <p className="text-[11px] font-bold text-[#3D2D31]">
                        Dermatologically Tested
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#FFFDF2] p-4 rounded-2xl border border-[#FFD5E0]/40 shadow-xs">
                    <img
                      src={buttercreamStoryImage}
                      alt="Soft Cotton Bunny"
                      className="w-full h-40 object-cover rounded-xl shadow-2xs hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-[11px] text-center font-bold text-[#E84A6E] mt-2">
                      Natural Bamboo Fibers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Narrative text info */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
              <h3 className="font-display font-semibold text-2xl text-[#E84A6E]">
                When a Tender Hug Transforms into Sweet Sleep
              </h3>

              <p className="text-base text-[#3D2D31]/80 leading-relaxed">
                At Bunny Lullaby, we deeply understand the exhausting midnight
                hours parents spend trying to soothe a restless baby. The
                gentle, natural aroma of organic dried lavender combined with
                our premium plush textures establishes a calming{" "}
                <strong>&ldquo;soft ritual&rdquo;</strong> that eases nighttime
                fears and supports a peaceful transition to sleep.
              </p>

              <blockquote className="border-l-4 border-[#FF8BA4] pl-4 italic text-[#3D2D31]/70 bg-[#FFE8EC]/30 py-3 pr-2 rounded-r-lg">
                &ldquo;Your baby isn't just falling asleep; they are wrapped in
                gentle comfort, soothed through organic scent and sound in the
                safest possible way.&rdquo;
              </blockquote>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <span className="bg-[#FFE8EC] p-1.5 rounded-full text-[#E84A6E] shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#3D2D31]">
                      Pure & Organic Materials
                    </h4>
                    <p className="text-xs text-[#3D2D31]/60">
                      Untreated organic botanical fibers entirely free from
                      harsh bleaching or toxic chemicals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="bg-[#FFE8EC] p-1.5 rounded-full text-[#E84A6E] shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-[#3D2D31]">
                      Acoustic Sound Therapy
                    </h4>
                    <p className="text-xs text-[#3D2D31]/60">
                      Gently triggers natural sleep cues with organic scents and
                      alpha-frequency binaural ripples.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-center sm:justify-start">
                <a
                  href="#showcase"
                  className="inline-flex items-center gap-2 bg-[#FFE8EC] hover:bg-[#FFD5E0] text-[#E84A6E] px-6 py-3 rounded-full font-bold text-sm tracking-wide transition-all shadow-xs"
                >
                  Explore Our Bunny Companions{" "}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT GRID SECTION */}
      <section id="showcase" className="py-20 bg-[#FDF9EA] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section banner */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#3D2D31]">
              The <span className="text-[#E84A6E]">Sweet Sleep Ritual</span>
            </h2>
            <p className="text-base text-[#3D2D31]/70">
              Each bunny carries a serene whisper from a peaceful sky. Choose
              the perfect, comforting companion for your little one's sacred
              sleep.
            </p>

            {/* Filter buttons */}
            <div className="flex justify-center gap-2 pt-6 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${activeTab === "all" ? "bg-[#E84A6E] text-white shadow-xs" : "bg-white hover:bg-[#FFE8EC] text-[#3D2D31]/80"}`}
              >
                All Bunny Lullabies
              </button>
              <button
                onClick={() => setActiveTab("bestseller")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${activeTab === "bestseller" ? "bg-[#E84A6E] text-white shadow-xs" : "bg-white hover:bg-[#FFE8EC] text-[#3D2D31]/80"}`}
              >
                Bestsellers 🔥
              </button>
              <button
                onClick={() => setActiveTab("new release")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${activeTab === "new release" ? "bg-[#E84A6E] text-white shadow-xs" : "bg-white hover:bg-[#FFE8EC] text-[#3D2D31]/80"}`}
              >
                Newborn Exclusives 🌱
              </button>
              <button
                onClick={() => setActiveTab("natural herbs")}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${activeTab === "natural herbs" ? "bg-[#E84A6E] text-white shadow-xs" : "bg-white hover:bg-[#FFE8EC] text-[#3D2D31]/80"}`}
              >
                Aroma Companions 🌸
              </button>
            </div>
          </div>

          {/* Product Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((p) => {
              const currentLikes = likes[p.id as keyof typeof likes] || 0;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  key={p.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#FFD5E0]/30 shadow-xs hover:shadow-md transition-all group flex flex-col h-full"
                >
                  {/* Photo area */}
                  <div className="relative overflow-hidden aspect-square bg-[#FFFDF2] p-4 flex items-center justify-center">
                    {/* Badge */}
                    {p.badge && (
                      <span className="absolute top-4 left-4 bg-[#E84A6E] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10 shadow-2xs">
                        {p.badge}
                      </span>
                    )}

                    {/* Cute Like love button */}
                    <button
                      onClick={(e) => handleLike(p.id, e)}
                      className="absolute top-4 right-4 bg-white/70 hover:bg-white text-[#E84A6E] p-2.5 rounded-full z-10 transition-colors shadow-2xs flex items-center gap-1 text-xs font-bold"
                    >
                      <Heart className="w-4 h-4 fill-current text-[#E84A6E]" />
                      <span>{currentLikes}</span>
                    </button>

                    {/* Image with zoom spec */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-11/12 h-11/12 object-contain transform group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                      referrerPolicy="no-referrer"
                    />

                    {/* Background soft overlay on photo */}
                    <div className="absolute inset-0 bg-[#FDF9EA]/10 mix-blend-multiply pointer-events-none"></div>
                  </div>

                  {/* Info details */}
                  <div className="p-6 flex flex-col grow justify-between">
                    <div>
                      {/* Rating star lines */}
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 fill-[#FF8BA4] text-[#FF8BA4]"
                          />
                        ))}
                        <span className="text-[11px] font-bold text-[#E84A6E] ml-1">
                          {p.rating} / 5
                        </span>
                      </div>

                      {/* Title block */}
                      <h3 className="font-display font-bold text-xl text-[#3D2D31] mb-1 group-hover:text-[#E84A6E] transition-colors">
                        {p.name}
                      </h3>
                      <h4 className="font-medium text-xs text-[#E84A6E] tracking-tight uppercase mb-3">
                        {p.subName}
                      </h4>

                      {/* Scent Info bar */}
                      <div className="flex items-center gap-1.5 bg-[#FFFDF2] border border-[#FFD5E0]/40 py-1.5 px-3 rounded-lg text-xs font-semibold mb-4 text-[#3D2D31]/80 text-left">
                        <Flower2 className="w-3.5 h-3.5 text-[#E84A6E] shrink-0" />
                        <span className="truncate">Scent: {p.scent}</span>
                      </div>

                      <p className="text-xs text-[#3D2D31]/75 line-clamp-2 mb-4 leading-relaxed text-left">
                        {p.description}
                      </p>

                      {/* Organic tag chips */}
                      <div className="flex flex-wrap gap-1 mb-6">
                        {p.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-[#FFE8EC] text-[#E84A6E] text-[10px] font-bold px-2 py-0.5 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer product actions */}
                    <div>
                      <div className="flex items-baseline justify-between mb-4 border-t border-[#FFD5E0]/20 pt-4">
                        <span className="text-xs text-[#3D2D31]/50 font-bold">
                          Special Gift Set Price:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#3D2D31]/30 text-xs line-through">
                            ${p.originalPrice}.00
                          </span>
                          <span className="text-lg font-display font-extrabold text-[#E84A6E]">
                            ${p.price}.00
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSelectedProduct(p)}
                          className="bg-[#FFFDF2] hover:bg-[#FFE8EC] text-[#E84A6E] border border-[#FFD5E0] text-xs font-bold py-3 px-2 rounded-xl transition-all hover:scale-102 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Info className="w-3.5 h-3.5" /> View Details
                        </button>
                        <button
                          onClick={() => handleAddToCart(p, 1)}
                          className="bg-[#E84A6E] hover:bg-[#FF8BA4] text-white text-xs font-bold py-3 px-2 rounded-xl transition-all hover:scale-102 shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE SOUNDBOARD / LULLABY RITUAL COMPANION */}
      <section
        id="soundboard"
        className="py-20 bg-white relative z-10 border-t border-[#FFD5E0]/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Companion Intro Texts */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-[#FDF9EA] border border-[#FFD5E0] px-4 py-1 rounded-full text-xs font-semibold text-[#E84A6E]">
                <Moon className="w-3.5 h-3.5 text-[#E84A6E]" />
                Sleep Sound Audio Therapy
              </div>

              <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#3D2D31] leading-tight">
                The Sleep Sound{" "}
                <span className="text-[#E84A6E] block sm:inline">
                  Bedtime Companion
                </span>
              </h2>

              <p className="text-sm sm:text-base text-[#3D2D31]/80 leading-relaxed">
                Do you keep your nursery completely silent? In reality, gentle,
                repetitive natural frequencies—like soft summer rain or rolling
                ocean waves—are incredibly effective at masking sudden household
                noises and gently easing active toddler minds into deep slumber.
              </p>

              <blockquote className="bg-[#FDF9EA] border-l-4 border-[#FF8BA4] p-4 rounded-r-xl text-xs space-y-2">
                <p className="font-bold text-[#E84A6E] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Golden Frequencies for
                  Sleeping Babies:
                </p>
                <p className="text-[#3D2D31]/70 leading-relaxed">
                  Click any sound card on the right to start our soft audio box.
                  Place your device near the Bunny Lullaby plush at a gentle
                  volume 15 minutes before bedtime to feel the difference.
                </p>
              </blockquote>

              {/* Status indicator if playing */}
              {playingSoundId && (
                <div className="bg-[#FFE8EC] border-2 border-[#FFD5E0] p-4 rounded-2xl flex items-center justify-between shadow-2xs antialiased">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#E84A6E] text-white p-2.5 rounded-full animate-bounce">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#E84A6E]">
                        Soothing audio playing live...
                      </div>
                      <div className="text-[11px] text-[#3D2D31]/70 font-bold">
                        {SOUNDS.find((s) => s.id === playingSoundId)?.subName}{" "}
                        (Melody Chime)
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={stopLullaby}
                    className="bg-white hover:bg-[#FFE8EC] text-[#E84A6E] p-2 rounded-xl text-xs font-bold border border-[#FFD5E0] cursor-pointer"
                  >
                    Stop Music
                  </button>
                </div>
              )}
            </div>

            {/* Interactive Grid of Sounds */}
            <div className="lg:col-span-7 bg-[#FDF9EA] p-6 sm:p-8 rounded-3xl border border-[#FFD5E0]/40 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-10">
                <span className="block absolute w-48 h-48 border border-[#FF8BA4] rounded-full animate-star-glow top-0 right-0"></span>
                <span className="block absolute w-[400px] h-[400px] border border-[#FF8BA4] rounded-full animate-star-glow top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
              </div>

              {/* Grid block info */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOUNDS.map((sound) => {
                  const isCurrent = playingSoundId === sound.id;

                  const renderIcon = () => {
                    switch (sound.icon) {
                      case "CloudRain":
                        return <CloudRain className="w-6 h-6" />;
                      case "Waves":
                        return <Waves className="w-6 h-6" />;
                      case "Wind":
                        return <Wind className="w-6 h-6" />;
                      default:
                        return <Volume2 className="w-6 h-6" />;
                    }
                  };

                  return (
                    <button
                      key={sound.id}
                      onClick={() => handlePlaySound(sound)}
                      className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between h-44 cursor-pointer relative ${isCurrent ? "bg-[#FFE8EC] border-[#E84A6E] shadow-sm transform scale-[1.02]" : "bg-white hover:bg-[#FFFDF2] border-[#FFD5E0]/30 hover:border-[#FF8BA4]/60"}`}
                    >
                      <div className="w-full flex justify-between items-start">
                        <div
                          className={`p-3 rounded-xl ${isCurrent ? "bg-[#E84A6E] text-white" : "bg-[#FDF9EA] text-[#E84A6E]"}`}
                        >
                          {renderIcon()}
                        </div>
                        {isCurrent && (
                          <span className="bg-[#E84A6E] text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full animate-pulse">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h3
                          className={`font-bold text-sm ${isCurrent ? "text-[#E84A6E]" : "text-[#3D2D31]"}`}
                        >
                          {sound.name}
                        </h3>
                        <p className="text-[10px] text-[#3D2D31]/40 font-semibold mb-1 uppercase tracking-wide">
                          {sound.subName}
                        </p>
                        <p className="text-[11px] text-[#3D2D31]/60 leading-snug line-clamp-2">
                          {sound.description}
                        </p>
                      </div>

                      {/* Visual pulsing rings for active sound */}
                      {isCurrent && (
                        <span className="absolute inset-0 border-2 border-[#E84A6E]/20 rounded-2xl animate-ping opacity-30 pointer-events-none"></span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 text-center text-xs text-[#3D2D31]/50 italic">
                *Our sound generator utilizes the client-side Web Audio API to
                produce pure mechanical waves safely, with absolutely zero
                electromagnetic radiation or blue light hazard.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HEALTH STANDARDS / SAFETY & QUALITY */}
      <section
        id="quality"
        className="py-20 bg-[#FFE8EC]/45 relative z-10 border-y border-[#FFD5E0]/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#3D2D31]">
              Our Absolute Commitment{" "}
              <span className="text-[#E84A6E]">to Safety & Health</span>
            </h2>
            <p className="text-base text-[#3D2D31]/75 leading-relaxed">
              Your child's health is a boundary Bunny Lullaby will never
              compromise. Every plush character we hand-craft meets and exceeds
              the strictest international safety certifications.
            </p>
            <div className="w-16 h-1 bg-[#FFD5E0] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
            {/* Metric 1 */}
            <div className="bg-white p-6 rounded-2xl border border-[#FFD5E0]/30 shadow-2xs space-y-4">
              <div className="bg-[#FDF9EA] text-[#E84A6E] p-3.5 rounded-2xl inline-block">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#3D2D31]">
                OEKO-TEX 100 Certified
              </h3>
              <p className="text-xs text-[#3D2D31]/70 leading-relaxed">
                All plush fibers and decorative embroideries are certified Class
                I—guaranteed non-toxic and hypoallergenic even for newborns who
                explore with their mouths.
              </p>
            </div>

            {/* Metric 2 */}
            <div className="bg-white p-6 rounded-2xl border border-[#FFD5E0]/30 shadow-2xs space-y-4">
              <div className="bg-[#FDF9EA] text-[#E84A6E] p-3.5 rounded-2xl inline-block">
                <Smile className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#3D2D31]">
                Zero-Plastic Design
              </h3>
              <p className="text-xs text-[#3D2D31]/70 leading-relaxed">
                To eliminate choking hazards entirely, elements like eyes, cute
                snout details, and forehead flowers are 100% flat hand-stitched.
                No tiny plastic beads or buttons are used.
              </p>
            </div>

            {/* Metric 3 */}
            <div className="bg-white p-6 rounded-2xl border border-[#FFD5E0]/30 shadow-2xs space-y-4">
              <div className="bg-[#FDF9EA] text-[#E84A6E] p-3.5 rounded-2xl inline-block">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#3D2D31]">
                Eco Aromatherapy
              </h3>
              <p className="text-xs text-[#3D2D31]/70 leading-relaxed">
                Each internal organic herbal pouch uses dried French Lavender,
                processed with moisture-locking cold-drying technology to ensure
                it stays mold-free under all conditions.
              </p>
            </div>

            {/* Metric 4 */}
            <div className="bg-white p-6 rounded-2xl border border-[#FFD5E0]/30 shadow-2xs space-y-4">
              <div className="bg-[#FDF9EA] text-[#E84A6E] p-3.5 rounded-2xl inline-block">
                <Waves className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#3D2D31]">
                Fully Washable
              </h3>
              <p className="text-xs text-[#3D2D31]/70 leading-relaxed">
                Simply unzip the hidden back pocket, slide out the aromatic
                sachet, and hand-wash or machine-wash the plush gently without
                worrying about shape distortion or shedding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PARENTS TESTIMONIALS */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main header banner */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#3D2D31]">
              Real Experiences from{" "}
              <span className="text-[#E84A6E]">Loving Parents</span>
            </h2>
            <p className="text-sm sm:text-base text-[#3D2D31]/70 leading-relaxed">
              Don't just take our word for it. Explore the heartwarming
              experiences shared by over 12,000 satisfied families who have
              integrated Bunny Lullaby into their sleep routines.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id}
                className="bg-[#FDF9EA]/50 border border-[#FFD5E0]/30 p-6 sm:p-8 rounded-3xl flex flex-col justify-between shadow-2xs relative"
              >
                {/* Visual quote indicator */}
                <span className="absolute -top-[15px] -right-[5px] text-[#FF8BA4]/20 font-display font-extrabold text-7xl select-none">
                  &ldquo;
                </span>

                <div className="space-y-4 relative z-10 text-left">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className="w-4 h-4 fill-[#E84A6E] text-[#E84A6E]"
                      />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#3D2D31]/80 leading-relaxed italic font-medium">
                    &ldquo;{item.content}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-[#FFD5E0]/20 mt-6 md:text-left">
                  <img
                    src={item.avatar}
                    alt={item.author}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF8BA4] shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="text-left">
                    <h4 className="font-display font-bold text-[#E84A6E] text-sm">
                      {item.author}
                    </h4>
                    <p className="text-[10px] uppercase tracking-wide font-semibold text-[#3D2D31]/50">
                      {item.role}
                    </p>
                    <p className="text-[11px] text-[#3D2D31]/40 font-bold">
                      {item.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scent Gift Promotion Box */}
          <div className="bg-[#FFE8EC] rounded-3xl border border-[#FFD5E0] p-6 sm:p-10 text-center max-w-4xl mx-auto mt-16 shadow-2xs">
            <h3 className="font-display font-bold text-2xl text-[#E84A6E] mb-2">
              🎁 Exclusive Bedtime Gift This Month
            </h3>
            <p className="text-xs sm:text-sm text-[#3D2D31]/85 max-w-2xl mx-auto leading-relaxed mb-6">
              Every single Bunny Lullaby order this month includes a{" "}
              <strong>
                free 10ml aromatherapy essential oil blend (French Lavender or
                Sweet Orange)
              </strong>{" "}
              to refresh your sachet indefinitely, delivered with{" "}
              <strong>
                free express courier shipping in a luxury linen ribbon-wrapped
                gift box.
              </strong>
            </p>
            <a
              href="#showcase"
              className="bg-[#E84A6E] hover:bg-[#FF8BA4] text-white px-8 py-3.5 rounded-full font-bold tracking-wide transition-all shadow-xs inline-block"
            >
              Get Your Gift Combo Set Now
            </a>
          </div>
        </div>
      </section>

      {/* SWEEET DREAM FAQ ACCORDION SECTION */}
      <section
        id="faq"
        className="py-20 bg-[#FDF9EA] relative z-10 border-t border-[#FFD5E0]/20"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-display font-bold text-3xl text-[#3D2D31]">
              Answering Parents'{" "}
              <span className="text-[#E84A6E]">Common Questions</span>
            </h2>
            <div className="w-16 h-1 bg-[#FFD5E0] mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4 text-left">
            {FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white p-5 rounded-2xl border border-[#FFD5E0]/30 transition-all shadow-2xs [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                  <h3 className="font-display font-bold text-sm sm:text-base text-[#3D2D31] group-open:text-[#E84A6E] transition-colors pr-4">
                    {faq.q}
                  </h3>
                  <span className="bg-[#FFE8EC] p-1.5 rounded-full text-[#E84A6E] transition-transform group-open:rotate-180 shrink-0">
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-[#FFD5E0]/10 text-xs sm:text-sm text-[#3D2D31]/75 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer className="bg-[#3D2D31] text-[#FFFDF2] py-16 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-[#FFFDF2]/10 pb-12">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <img 
                src={brandLogo} 
                alt="Bunny Lullaby Logo" 
                className="h-16 w-auto object-contain" 
              />
            </div>
            <p className="text-xs text-[#FFFDF2]/70 leading-relaxed max-w-sm mx-auto md:mx-0">
              The leading sleep-therapy organic brand for infants, combining
              aromatherapy and natural sound care. Nurturing safe, sweet dreams
              from our hands to yours.
            </p>
            <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 py-1.5 px-3 rounded-full text-[11px] font-mono tracking-wider font-semibold text-[#FF8BA4]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              100% Hypoallergenic Sterile Facility
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-4 text-center md:text-left">
            <h4 className="font-display font-bold text-sm text-[#FF8BA4] tracking-wide uppercase">
              Our Community
            </h4>
            <div className="flex flex-col space-y-2.5 text-xs text-[#FFFDF2]/80">
              <a
                href="#story"
                className="hover:text-[#FF8BA4] transition-colors"
              >
                Our Story & Mission
              </a>
              <a
                href="#showcase"
                className="hover:text-[#FF8BA4] transition-colors"
              >
                Herbal Plush Collection
              </a>
              <a
                href="#soundboard"
                className="hover:text-[#FF8BA4] transition-colors"
              >
                High-Frequency Sound Helper
              </a>
              <a
                href="#quality"
                className="hover:text-[#FF8BA4] transition-colors"
              >
                OEKO-TEX Quality Test
              </a>
            </div>
          </div>

          {/* Support policies */}
          <div className="md:col-span-2 space-y-4 text-center md:text-left">
            <h4 className="font-display font-bold text-sm text-[#FF8BA4] tracking-wide uppercase">
              Policies
            </h4>
            <div className="flex flex-col space-y-2.5 text-xs text-[#FFFDF2]/80">
              <a href="#" className="hover:text-[#FF8BA4] transition-colors">
                Lifetime 1-to-1 Warranty
              </a>
              <a href="#" className="hover:text-[#FF8BA4] transition-colors">
                2-Hour Instant Shipping
              </a>
              <a href="#" className="hover:text-[#FF8BA4] transition-colors">
                30-Day Bedtime Trial
              </a>
              <a href="#" className="hover:text-[#FF8BA4] transition-colors">
                Plush Reward Points
              </a>
            </div>
          </div>

          {/* Contacts Col */}
          <div className="md:col-span-3 space-y-4 text-center md:text-left">
            <h4 className="font-display font-bold text-sm text-[#FF8BA4] tracking-wide uppercase">
              Contact Bunny Lullaby
            </h4>
            <div className="space-y-2 text-xs text-[#FFFDF2]/80 leading-relaxed">
              <p>
                🏢 <strong>Signature Baby Boutique:</strong> 141 - 145, 145 Dien
                Bien Phu Street, Gia Dinh, Ho Chi Minh City 00700
              </p>
              <p>
                📞 <strong>Parent Support Toll-Free:</strong> 028 2236 2222
              </p>
              <p>
                ✉️ <strong>Email Help:</strong> bunnylullaby@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Copywrite lines */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#FFFDF2]/40 gap-4">
          <p>
            © 2026 Bunny Lullaby. All rights reserved. Intellectual handcraft
            design protection.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-[#FF8BA4] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-[#FF8BA4] transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>

      {/* QUICK VIEW PRODUCT MODAL POPUP */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal backdrop background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#3D2D31]/60 backdrop-blur-xs"
              onClick={() => setSelectedProduct(null)}
            ></motion.div>

            {/* Modal core window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-xl border border-[#FFD5E0]/40 grid grid-cols-1 md:grid-cols-12"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-[#FFE8EC] text-[#E84A6E] hover:bg-[#FFD5E0] p-2 rounded-full z-20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Photo Area */}
              <div className="md:col-span-5 bg-[#FDF9EA] p-6 flex flex-col justify-center items-center relative border-b md:border-b-0 md:border-r border-[#FFD5E0]/20 min-h-[300px]">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-10/12 h-10/12 object-contain"
                  referrerPolicy="no-referrer"
                />

                {/* Organic Certification Stamp */}
                <div className="absolute bottom-4 left-4 bg-white/70 py-1.5 px-3 rounded-lg text-[10px] font-bold text-[#E84A6E] border border-[#FFD5E0] uppercase tracking-wider">
                  🌱 Certified Bio-Fleece
                </div>
              </div>

              {/* Info details Area */}
              <div className="md:col-span-7 p-6 sm:p-8 space-y-6 text-left">
                <div>
                  <span className="bg-[#FFE8EC] text-[#E84A6E] text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">
                    {selectedProduct.badge || "Premium Collection"}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl text-[#3D2D31] mt-3 mb-1">
                    {selectedProduct.name}
                  </h3>
                  <h4 className="font-semibold text-sm text-[#E84A6E] tracking-tight uppercase">
                    {selectedProduct.subName}
                  </h4>
                </div>

                {/* Scent & Specs Box */}
                <div className="bg-[#FDF9EA] p-4 rounded-2xl border border-[#FFD5E0]/30 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#3D2D31]/40">
                      Infused Aromatherapy
                    </span>
                    <span className="text-xs font-bold text-[#E84A6E] flex items-center gap-1.5 mt-1">
                      <Flower2 className="w-3.5 h-3.5 shrink-0" />{" "}
                      {selectedProduct.scent}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#3D2D31]/40">
                      Dimensions & Safety Size
                    </span>
                    <span className="text-xs font-bold text-[#3D2D31] block mt-1">
                      📏 Size: {selectedProduct.size} (
                      {selectedProduct.ageLimit})
                    </span>
                  </div>
                </div>

                {/* Long description text */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-[#3D2D31]/40">
                    About This Companion
                  </h4>
                  <p className="text-xs sm:text-sm text-[#3D2D31]/85 leading-relaxed">
                    {selectedProduct.longDescription}
                  </p>
                </div>

                {/* Bullet parameters of safety */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-bold text-[#3D2D31]/40">
                    Exquisite Handcraft Details
                  </h4>
                  <ul className="space-y-2 text-xs text-[#3D2D31]/80">
                    {selectedProduct.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="bg-[#FFE8EC] p-0.5 rounded-full text-[#E84A6E] shrink-0 mt-0.5">
                          <Check className="w-3 h-3" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price block & buy */}
                <div className="flex flex-col sm:flex-row items-baseline justify-between gap-4 pt-4 border-t border-[#FFD5E0]/20">
                  <div>
                    <span className="block text-[10px] uppercase font-bold text-[#3D2D31]/45">
                      Gift Set Full Price:
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-display font-extrabold text-[#E84A6E]">
                        ${selectedProduct.price}.00
                      </span>
                      <span className="text-[#3D2D31]/30 text-xs line-through">
                        ${selectedProduct.originalPrice}.00
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="w-full sm:w-auto bg-[#E84A6E] hover:bg-[#FF8BA4] text-white px-8 py-3.5 rounded-xl font-bold tracking-wide transition-all shadow-md hover:scale-103 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" /> Order This Bunny Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART DRAWER PANEL */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#3D2D31]/60 backdrop-blur-xs"
              onClick={() => setIsCartOpen(false)}
            ></motion.div>

            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ translateX: "100%" }}
                animate={{ translateX: "0%" }}
                exit={{ translateX: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="w-screen max-w-md bg-white border-l border-[#FFD5E0]/40 flex flex-col shadow-2xl h-full text-left"
              >
                {/* Header cart info */}
                <div className="p-6 border-b border-[#FFD5E0]/20 flex items-center justify-between bg-[#FDF9EA]">
                  <div className="flex items-center gap-2 text-[#E84A6E]">
                    <ShoppingBag className="w-5 h-5" />
                    <h3 className="font-display font-bold text-lg">
                      Your Cuddle Cart
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-full text-[#3D2D31] hover:text-[#E84A6E] bg-[#FFE8EC] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cart Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {isCheckoutSuccess ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="text-5xl">🧸🎉</div>
                      <h4 className="font-display font-bold text-xl text-[#E84A6E]">
                        Order Placed Successfully! 🎉
                      </h4>
                      <p className="text-xs text-[#3D2D31]/80 leading-relaxed max-w-xs mx-auto">
                        Thank you for choosing Bunny Lullaby to guard your
                        child's sweet dreams. A pediatric consultant will call
                        you at your provided phone number in 20 minutes to
                        confirm the customized herbs details and fast tracking
                        shipping!
                      </p>
                      <button
                        onClick={() => {
                          setIsCheckoutSuccess(false);
                          setIsCartOpen(false);
                        }}
                        className="bg-[#E84A6E] hover:bg-[#FF8BA4] text-white text-xs font-bold px-6 py-2.5 rounded-full tracking-wide transition-all cursor-pointer"
                      >
                        Got It, Thanks!
                      </button>
                    </div>
                  ) : cart.length === 0 ? (
                    <div className="text-center py-20 space-y-4 text-[#3D2D31]/50">
                      <div className="text-4xl text-center">💤</div>
                      <h4 className="font-display font-medium text-sm">
                        Your cuddle cart is currently empty.
                      </h4>
                      <p className="text-xs max-w-xs mx-auto">
                        Explore our newborn-tested, organic dream companions and
                        add a bunny to your nursery to activate this month's
                        free premium herbal bundle!
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="bg-[#E84A6E] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer"
                      >
                        Continue Exploring
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex gap-4 p-3 rounded-2xl border border-[#FFD5E0]/20 bg-[#FDF9EA]/40 items-center"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-pink-50"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <h4 className="font-display font-bold text-xs text-[#3D2D31] truncate">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-[#E84A6E] uppercase font-bold truncate">
                              {item.product.subName}
                            </p>
                            <span className="text-xs font-bold text-[#E84A6E] block mt-1">
                              ${item.product.price * item.quantity}.00
                            </span>
                            <span className="text-[9px] text-[#3D2D31]/50 block">
                              Scent: {item.product.scent.split(" - ")[0]}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-2 shrink-0">
                            {/* Quantity buttons */}
                            <div className="flex items-center gap-1.5 bg-white border border-[#FFD5E0]/50 rounded-lg p-1">
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item.product.id, -1)
                                }
                                className="p-0.5 text-[#3D2D31]/60 hover:text-[#E84A6E]"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold w-4 text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleUpdateQuantity(item.product.id, 1)
                                }
                                className="p-0.5 text-[#3D2D31]/60 hover:text-[#E84A6E]"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <button
                              onClick={() =>
                                handleRemoveFromCart(item.product.id)
                              }
                              className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Checkout simulated input form */}
                      <form
                        onSubmit={handleCheckoutSubmit}
                        className="pt-6 border-t border-[#FFD5E0]/30 space-y-4"
                      >
                        <h4 className="font-display font-bold text-sm text-[#E84A6E] text-left">
                          Delivery Information
                        </h4>

                        <div className="space-y-3 text-xs text-left">
                          <div>
                            <label className="block font-bold text-[#3D2D31]/75 mb-1">
                              Parent's Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Maria Rostova"
                              value={orderForm.parentName}
                              onChange={(e) =>
                                setOrderForm({
                                  ...orderForm,
                                  parentName: e.target.value,
                                })
                              }
                              className="w-full bg-[#FDF9EA]/45 border border-[#FFD5E0]/80 rounded-xl p-3 focus:outline-none focus:border-[#E84A6E] focus:ring-1 focus:ring-[#E84A6E]"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#3D2D31]/75 mb-1">
                              Contact Mobile Number *
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="e.g. +1 555 123 4567"
                              value={orderForm.phone}
                              onChange={(e) =>
                                setOrderForm({
                                  ...orderForm,
                                  phone: e.target.value,
                                })
                              }
                              className="w-full bg-[#FDF9EA]/45 border border-[#FFD5E0]/80 rounded-xl p-3 focus:outline-none focus:border-[#E84A6E] focus:ring-1 focus:ring-[#E84A6E]"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-[#3D2D31]/75 mb-1">
                              Shipping Address *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Street, apt, city, state, zip code"
                              value={orderForm.address}
                              onChange={(e) =>
                                setOrderForm({
                                  ...orderForm,
                                  address: e.target.value,
                                })
                              }
                              className="w-full bg-[#FDF9EA]/45 border border-[#FFD5E0]/80 rounded-xl p-3 focus:outline-none focus:border-[#E84A6E] focus:ring-1 focus:ring-[#E84A6E]"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block font-bold text-[#3D2D31]/75 mb-1">
                                Baby's Age
                              </label>
                              <select
                                value={orderForm.babyAge}
                                onChange={(e) =>
                                  setOrderForm({
                                    ...orderForm,
                                    babyAge: e.target.value,
                                  })
                                }
                                className="w-full bg-[#FDF9EA]/45 border border-[#FFD5E0]/80 rounded-xl p-3 focus:outline-none focus:border-[#E84A6E]"
                              >
                                <option value="0">Newborn (0 - 3m)</option>
                                <option value="6">Infant (6 - 12m)</option>
                                <option value="12">Toddler (1+ years)</option>
                                <option value="adult">
                                  Adult Premium Gift
                                </option>
                              </select>
                            </div>
                            <div>
                              <label className="block font-bold text-[#3D2D31]/75 mb-1">
                                Add Personalization
                              </label>
                              <select className="w-full bg-[#FDF9EA]/45 border border-[#FFD5E0]/80 rounded-xl p-3 focus:outline-none focus:border-[#E84A6E]">
                                <option>None (Original)</option>
                                <option>
                                  Yes, Hand-stitch name on ear (+$3.00)
                                </option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block font-bold text-[#3D2D31]/75 mb-1">
                              Handwritten Gift Note (Optional)
                            </label>
                            <textarea
                              placeholder="e.g. Happy sweet dreams, grow strong and happy!"
                              rows={2}
                              value={orderForm.giftNote}
                              onChange={(e) =>
                                setOrderForm({
                                  ...orderForm,
                                  giftNote: e.target.value,
                                })
                              }
                              className="w-full bg-[#FDF9EA]/45 border border-[#FFD5E0]/80 rounded-xl p-3 focus:outline-none focus:border-[#E84A6E] focus:ring-1 focus:ring-[#E84A6E] resize-none"
                            ></textarea>
                          </div>
                        </div>

                        {/* Order calculation block */}
                        <div className="bg-[#FFE8EC]/40 p-4 rounded-2xl space-y-2 border border-[#FFD5E0]/30 text-xs text-left text-[#3D2D31]">
                          <div className="flex justify-between items-center">
                            <span>Subtotal:</span>
                            <span className="font-bold">${cartTotal}.00</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Luxury Gift Box & Ribbon Wrapping:</span>
                            <span className="text-emerald-600 font-bold">
                              Free
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Sterile Express Shipping:</span>
                            <span className="text-emerald-600 font-bold">
                              Free
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm font-bold border-t border-[#FFD5E0]/30 pt-2 text-[#E84A6E]">
                            <span>Total Payment:</span>
                            <span>${cartTotal}.00</span>
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="w-full bg-[#E84A6E] hover:bg-[#FF8BA4] text-white py-3.5 rounded-xl font-bold tracking-wide shadow-md hover:scale-101 transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs text-center"
                        >
                          <Check className="w-4 h-4" /> PLACE ORDER NOW
                        </button>
                        <p className="text-[10px] text-center text-[#3D2D31]/40 leading-relaxed font-semibold">
                          *We support standard 30-day touch-and-sniff bedtime
                          trials. Sleep soundly knowing we guarantee complete
                          happiness, free returns, and safe deliveries.
                        </p>
                      </form>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
