import { Product, SoundOption, Testimonial } from "./types";
import classicRoseImage from "./assets/images/hinh2.png";
import buttercreamImage from "./assets/images/hinh3.png";
import lavenderImage from "./assets/images/hinh6.png";

export const PRODUCTS: Product[] = [
  {
    id: "bunny-rose",
    name: "Classic Rose Lullaby",
    subName: "Classic Pink Blossom Plush",
    description: "An exquisite blend of ultra-soft organic fleece and natural calming lavender essence woven gently inside.",
    longDescription: "Our signature and beloved Bunny Lullaby companion. Lovingly hand-crafted using 100% certified organic anti-allergetics and premium recycled materials. Tucked deep within is a removable sachet of dried organic French lavender that releases a soothing sleep aroma whenever baby cuddles their bunny, helping establish a natural and calm deep sleep ritual.",
    price: 29,
    originalPrice: 36,
    image: classicRoseImage,
    rating: 5,
    badge: "Bestseller",
    tags: ["Natural Herbs", "Anti-Allergenic", "Hand-Embroidered"],
    size: "14 inches (Convenient Hug Size)",
    ageLimit: "From 6 months onwards",
    colorHex: "#FF8BA4",
    bgColor: "bg-pink-50",
    scent: "Organic Lavender - deep relaxation",
    features: [
      "Ultra-lightweight micro-breathe cloud fleece fabric",
      "Removable lavender sachet for simple cleaning and washing",
      "100% hand-stitched flat eyes & nose, certifying zero choking hazards"
    ]
  },
  {
    id: "bunny-buttercream",
    name: "Buttercream Cotton Cloud",
    subName: "Infant Companion Scented Plush",
    description: "Woven from supreme organic hand-picked cotton with a soothing vanilla-milk scent to ease infant tension.",
    longDescription: "Specially designed for the most delicate and sensitive skin of newborns. The Buttercream bunny is dressed in raw, unbleached organic plant fibers. Gently infused with a warm, comforting vanilla cream aroma, it rebuilds the secure comforting feelings of a mother's warm embrace.",
    price: 32,
    originalPrice: 40,
    image: buttercreamImage,
    rating: 4.9,
    badge: "New Release",
    tags: ["100% Organic Cotton", "Sensory-Safe", "Sweet Buttercream Scent"],
    size: "12.5 inches (Perfect Bassinet Fit)",
    ageLimit: "All ages (0+ Newborn Safe)",
    colorHex: "#F2DFB8",
    bgColor: "bg-amber-50/60",
    scent: "Sweet Vanilla Cream - stress relief & comforting reassurance",
    features: [
      "Eco-friendly bamboo extract weave with premium OEKO-TEX 100 Class I license",
      "No plastic micro-pellets, utilizing lightweight pure botanical fiber fill",
      "Elongated floppy ears designed for newborns to grasp and develop tactile coordination"
    ]
  },
  {
    id: "bunny-lavender",
    name: "Midnight Lavender Bliss",
    subName: "Peaceful Glow-in-the-Dark Guardian",
    description: "A soft pastel lilac fleece paired with custom bio-luminescent embroidery and sweet chamomile notes.",
    longDescription: "The ultimate nighttime guardian designed for toddlers experiencing fear of the dark or night terrors. In addition to a sweet aromatherapy heart with calming lavender & sweet chamomile, it features subtle glow-in-the-dark stars that radiate a soft, reassuring celestial glow to soothe infants.",
    price: 35,
    originalPrice: 44,
    image: lavenderImage,
    rating: 5,
    badge: "Limited Edition",
    tags: ["Luminescent Starlight", "Sweet Chamomile & Orange", "Night Terror Relief"],
    size: "15 inches (Full Body Snuggle Size)",
    ageLimit: "From 12 months onwards",
    colorHex: "#C1AEFC",
    bgColor: "bg-purple-50",
    scent: "Chamomile & Sweet Orange (Calming & Relaxing)",
    features: [
      "Glow-in-the-dark embroidered star motifs that guide children back to sleep",
      "Knitted linen foot structures to prevent sweat build-up and maximize breathability",
      "Helps stimulate relaxation endorphins to calm toddlers natural hyperactivity"
    ]
  }
];

export const SOUNDS: SoundOption[] = [
  {
    id: "hum-rain",
    name: "Warm Summer Rain",
    subName: "Gentle Warm Raindrops",
    icon: "CloudRain",
    frequency: 180,
    waveType: "sine",
    description: "Steady rhythmic rain simulation mirroring the warm and secure biosounds of a mother's womb."
  },
  {
    id: "hum-ocean",
    name: "Gentle Ocean Waves",
    subName: "Rhythmic Seaside Surf",
    icon: "Waves",
    frequency: 140,
    waveType: "triangle",
    description: "Low-frequency repetitive rolling waves designed to naturally align baby's heart rate into deep rest."
  },
  {
    id: "hum-lullaby",
    name: "Lullaby Sleep Chimes",
    subName: "Alpha-frequency Music Box",
    icon: "MusicalNote",
    frequency: 320,
    waveType: "sine",
    description: "A 432Hz Alpha wave chime designed to slow restless over-excited brainwaves before bedtime."
  },
  {
    id: "hum-wind",
    name: "Forest Pine Whispers",
    subName: "Soothing Woods White Noise",
    icon: "Wind",
    frequency: 120,
    waveType: "sawtooth",
    description: "Even rustling leaf frequencies that naturally mask sudden, disruptive ambient sounds."
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "review-1",
    author: "Elena Rostova",
    role: "Mother of 2 toddlers",
    content: "My daughter used to take up to an hour to fall asleep, crying restlessly. Ever since we brought the Classic Rose bunny home, she cuddles it, sniffs the lovely lavender scent, and drifts off peacefully within 5 minutes. This has been a total game-changer for our family bedtime routine!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120",
    location: "San Francisco, CA"
  },
  {
    id: "review-2",
    author: "Michael Chen",
    role: "Software Engineer & Dad of a 9-month-old",
    content: "I highly appreciate that this plush doesn't shed fibers at all, especially since my baby loves teething on the long ears. It's incredibly soft and has a subtle, calming scent. A fantastic investment for both baby's sleep and our own peace of mind.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120",
    location: "Seattle, WA"
  },
  {
    id: "review-3",
    author: "Sophia Lin",
    role: "Music Therapist & Teacher",
    content: "Midnight Lavender is gorgeous in person! The craftsmanship is immaculate, and the organic textures feel so comforting. Combining the built-in sound helper with the soothing chamomile lavender scent makes bedtime a delightful, scientific routine.",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120",
    location: "Boston, MA"
  }
];

export const FAQS = [
  {
    q: "Is the Bunny Lullaby plush toy machine washable?",
    a: "Yes! Simply open the hidden zipper on the bunny's back to remove the aromatherapy sachet. Place the bunny in a delicate mesh bag, wash on a gentle/wool cycle with cold water, and air dry. Once dried, re-insert the sachet, and your baby's bunny is fresh as new!"
  },
  {
    q: "Does the plush fabric shed or pose a choking/ingestion risk?",
    a: "Not at all. Our bunnies are crafted from premium tightly-woven organic cotton and bamboo fibres. They are certified safe for newborns (0+), with zero loose shedding, and feature 100% flat embroidery instead of unsafe plastic buttons to eliminate any choking hazards."
  },
  {
    q: "How long does the aromatherapy scent last, and is it refillable?",
    a: "The natural organic sachet scent is designed to last between 6 and 9 months. Each Bunny Lullaby set comes with a complimentary vial of pure essential oil so you can easily refresh the aromatherapy pad inside the sachet over and over again!"
  },
  {
    q: "What is your return and satisfaction policy?",
    a: "We are committed to bringing sleep and happiness to your home. We offer a 100% money-back guarantee with hassle-free returns within 30 days if your little one does not connect with their new cuddle buddy or if you are unsatisfied for any reason."
  }
];
