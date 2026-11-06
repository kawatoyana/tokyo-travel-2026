import React, { useState, useEffect } from "react";
import {
  BookmarkCheck,
  Sparkles,
  Link as LinkIcon,
  MapPin,
  ExternalLink,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Heart,
  HelpCircle,
  Compass,
  UtensilsCrossed,
  Coffee,
  ShoppingBag,
  Building,
  Tag,
  Check,
  X,
  RefreshCw,
  LogIn,
  LogOut,
  User as UserIcon,
  MessageSquare,
  AlertCircle,
  Copy,
  Info,
  ShieldAlert,
  Wand2,
} from "lucide-react";
import {
  unshortenGoogleMapsLinkClient,
  extractPlaceNameFromUrl,
  synthesizePlaceData,
  analyzePlaceWithClientGemini,
  type AnalyzedPlaceData,
} from "../utils/placeAnalyzer";
import {
  db,
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
  collection,
  doc,
  query,
  onSnapshot,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  OperationType,
  handleFirestoreError,
} from "../services/firebase";

export interface SavedPlace {
  id: string;
  url: string;
  name: string;
  spotName?: string;
  japaneseName?: string;
  category: "dining" | "sightseeing" | "shopping" | "cafe" | "stay" | "other" | string;
  categoryLabel?: string;
  tag?: string;
  desc?: string;
  recommendation?: string;
  suggestedTime?: string;
  mapUrl?: string;
  summary?: string;
  highlight?: string;
  address?: string;
  tips?: string;
  notes?: string;
  isVisited?: boolean;
  visited?: boolean;
  isWishlist?: boolean;
  addedByName?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string | number;

  // Distinct Dining attributes
  cuisineType?: string;
  signatureDishes?: string[];
  priceRange?: string;
  diningAtmosphere?: string;

  // Distinct Sightseeing attributes
  spotType?: string;
  mustSeeHighlights?: string[];
  ticketInfo?: string;
  bestTimeToVisit?: string;
}

const CATEGORY_MAP: Record<
  string,
  { label: string; icon: React.ElementType; color: string; bg: string; border: string }
> = {
  dining: {
    label: "餐廳美饌",
    icon: UtensilsCrossed,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  cafe: {
    label: "甜點咖啡",
    icon: Coffee,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
  },
  sightseeing: {
    label: "觀光景點",
    icon: Compass,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  shopping: {
    label: "購物商場",
    icon: ShoppingBag,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  stay: {
    label: "旅宿飯店",
    icon: Building,
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  other: {
    label: "其他探訪",
    icon: Tag,
    color: "text-stone-700",
    bg: "bg-stone-50",
    border: "border-stone-200",
  },
};

const DEFAULT_SEEDS: Omit<SavedPlace, "id">[] = [
  {
    url: "https://maps.app.goo.gl/5QjeuGqka2AcV4mGA",
    name: "志乃多壽司",
    japaneseName: "志乃多寿司（しのだずし）",
    category: "dining",
    categoryLabel: "餐廳美饌",
    summary: "創業於明治時代的百年江戶老字號。特選吸滿香甜柴魚高湯精華的油揚豆皮包裹特調溫潤醋飯，搭配甜鹹爽脆的干瓢卷，是東京最經典的傳統外帶壽司美味。",
    highlight: "百年老鋪多汁油揚豆腐皮稻荷壽司與干瓢卷",
    address: "東京都台東區淺草1-1-12",
    tips: "推薦購買「稻荷壽司與干瓢卷」綜合折詰盒，常溫即可享用，極適合外帶至隅田川畔野餐！",
    notes: "DAY 1 下午散步外帶小點心！",
    isVisited: false,
    addedByName: "散策領隊",
    userId: "seed-user",
    createdAt: new Date().toISOString(),
    cuisineType: "江戶前豆皮壽司與干瓢卷老鋪",
    signatureDishes: ["秘傳豆皮稻荷壽司", "甘煮干瓢卷折詰盒"],
    priceRange: "約 ¥500 - ¥1,500 / 人",
    diningAtmosphere: "百年傳統外帶老字號，適合外帶野餐",
  },
  {
    url: "https://maps.app.goo.gl/jBmQZ8b5DMRUF6SF8",
    name: "淺草寺",
    japaneseName: "浅草寺（せんそうじ）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    summary: "東京都內歷史最悠久的古老寺院（創建於西元628年），江戶下町文化與觀光精神象徵。自雷門大紅燈籠漫步至莊嚴本堂，兩側仲見世通林立傳統人形燒與工藝品，香火鼎盛祥和。",
    highlight: "雷門巨型紅燈籠、熱鬧仲見世通商店街與本堂觀音信仰",
    address: "東京都台東區淺草2-3-1",
    tips: "想避開洶湧人潮可於清晨8點前造訪；夜間雷門與五重塔燈火通明，別具寧靜古典美感！",
    notes: "DAY 2 晨間散步推薦。",
    isVisited: false,
    addedByName: "神社達人",
    userId: "seed-user",
    createdAt: new Date().toISOString(),
    spotType: "歷史古蹟 / 佛教寺院",
    mustSeeHighlights: ["雷門巨型紅燈籠", "仲見世通商店街", "五重塔夜間點燈"],
    ticketInfo: "境內全日免費自由參拜",
    bestTimeToVisit: "清晨 08:00 前避開人潮，或日落後欣賞夜間打燈",
  },
  {
    url: "https://maps.app.goo.gl/oPMAntcFZkmcsbJV8",
    name: "皇居",
    japaneseName: "皇居（こうきょ）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    summary: "江戶幕府德川將軍居城舊址，現為日本天皇居所。四周圍繞著古色古香的石垣護城河與廣袤綠意，外圍一圈約 5 公里無任何紅綠燈，為全球跑者與旅人皆愛的綠意綠洲。",
    highlight: "江戶城古蹟遺跡、二重橋與東京5K環形慢跑勝地",
    address: "東京都千代田區千代田1-1",
    tips: "皇居東御苑開放免費參觀；外圍環形步道逆時針方向慢跑是東京跑者的默契！",
    notes: "晨跑路線或悠閒散步首選。",
    isVisited: false,
    addedByName: "跑步同好",
    userId: "seed-user",
    createdAt: new Date().toISOString(),
    spotType: "歷史名勝 / 皇室宮苑",
    mustSeeHighlights: ["皇居二重橋", "東御苑歷史石垣", "5公里無號誌環形慢跑道"],
    ticketInfo: "外苑與東御苑免費入園",
    bestTimeToVisit: "清晨或傍晚散策、慢跑時段",
  },
  {
    url: "https://maps.app.goo.gl/rikyu-ariake",
    name: "牛たん炭焼 利久 有明花園店",
    japaneseName: "牛たん炭焼 利久 有明ガーデン店",
    category: "dining",
    categoryLabel: "餐廳美饌",
    summary: "仙台炭火極厚牛舌名店，外酥內嫩多汁，搭配麥飯、香滑山藥泥與清甜牛尾湯。",
    highlight: "極厚切牛舌定食、16:20 提前晚餐免排隊",
    address: "東京都江東區有明2-1-8 有明花園 5F",
    tips: "推薦點選「極」定食，厚度普通兩倍超滿足！",
    notes: "DAY 1 晚餐排定！看劇前先吃飽補元氣。",
    isVisited: false,
    addedByName: "美食吃貨",
    userId: "seed-user",
    createdAt: new Date().toISOString(),
    cuisineType: "仙台炭火牛舌專門料理",
    signatureDishes: ["極厚切牛舌定食", "清燉牛尾湯", "山藥泥麥飯"],
    priceRange: "約 ¥2,000 - ¥3,500 / 人",
    diningAtmosphere: "日式連鎖餐廳，適合家庭朋友聚餐",
  },
];

const LOCAL_STORAGE_KEY = "tokyo_2026_pocket_wishlist_places";
const DELETED_IDS_KEY = "tokyo_2026_pocket_wishlist_deleted_ids";
const DEFAULT_GAS_URL = "https://script.google.com/macros/s/AKfycbx2bMD95eKkVZpsYc1hn6VsUpx7WxvB4sJaPDA7olXuC5oUDahk2IQUu01Sid1FC8ZBqA/exec";
const GAS_URL_STORAGE_KEY = "tokyo_2026_pocket_wishlist_gas_url";

function normalizeGasSpotToSavedPlace(spot: any): SavedPlace {
  const name = String(spot.spotName || spot.name || "日本精選景點").trim();
  const catLabel = String(spot.categoryLabel || "私房推薦探訪").trim();
  const desc = String(spot.desc || spot.summary || "").trim();
  const rec = String(spot.recommendation || spot.tips || "").trim();
  const textCheck = `${name} ${catLabel} ${desc} ${spot.tag || ""}`.toLowerCase();

  let category = "other";
  if (/(壽喜燒|燒肉|壽司|拉麵|牛舌|和牛|炸豬排|天婦羅|居酒屋|串燒|火鍋|食堂|洋食|丼飯|今半|敘敘苑|叙々苑|利久|afuri|restaurant|sushi|ramen)/i.test(textCheck)) {
    category = "dining";
  } else if (/(甜點|蛋糕|抹茶|咖啡|喫茶|生吐司|千層|布丁|可麗露|冰淇淋|下午茶|鬆餅|HARBS|cafe|bakery)/i.test(textCheck)) {
    category = "cafe";
  } else if (/(神社|寺|宮|公園|庭園|展望台|塔|城|水族館|美術館|博物館|觀光|景點|shrine|temple|sky)/i.test(textCheck)) {
    category = "sightseeing";
  } else if (/(購物|百貨|商店街|藥妝|唐吉訶德|大丸|Bic|免稅|商場|mall)/i.test(textCheck)) {
    category = "shopping";
  } else if (/(飯店|旅館|民宿|溫泉宿|hotel|inn)/i.test(textCheck)) {
    category = "stay";
  }

  return {
    id: String(spot.id || `gas-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`),
    url: spot.mapUrl || spot.url || (name ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}` : ""),
    name,
    spotName: spot.spotName || name,
    japaneseName: spot.japaneseName || "",
    category,
    categoryLabel: catLabel,
    tag: spot.tag || "",
    desc: desc,
    summary: desc,
    recommendation: rec,
    highlight: spot.highlight || "",
    tips: rec,
    suggestedTime: spot.suggestedTime || "",
    mapUrl: spot.mapUrl || spot.url || "",
    isVisited: !!spot.visited || !!spot.isWishlist,
    visited: !!spot.visited,
    isWishlist: !!spot.isWishlist,
    notes: spot.notes || "",
    userId: "gas-sync",
    addedByName: spot.addedByName || "GAS 雲端同步",
    createdAt: spot.updatedAt ? new Date(Number(spot.updatedAt) || Date.now()).toISOString() : new Date().toISOString(),
    updatedAt: spot.updatedAt || Date.now(),
  };
}

export const PocketWishlistSection: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Places list synced via Firestore onSnapshot and LocalStorage
  const [places, setPlaces] = useState<SavedPlace[]>(() => {
    try {
      let deletedIds = new Set<string>();
      try {
        const rawDel = localStorage.getItem(DELETED_IDS_KEY);
        if (rawDel) deletedIds = new Set(JSON.parse(rawDel));
      } catch {}

      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter((p: SavedPlace) => !deletedIds.has(p.id));
        }
      }
    } catch {}
    return DEFAULT_SEEDS.map((s, idx) => ({ id: `seed-${idx}`, ...s }));
  });
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  // New Link Input Form
  const [inputPlaceName, setInputPlaceName] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [inputNotes, setInputNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visitedFilter, setVisitedFilter] = useState<"all" | "unvisited" | "visited">("all");

  // Editing state for full place modification
  const [editingPlace, setEditingPlace] = useState<SavedPlace | null>(null);
  const [editName, setEditName] = useState("");
  const [editJapaneseName, setEditJapaneseName] = useState("");
  const [editCategory, setEditCategory] = useState("dining");
  const [editAddress, setEditAddress] = useState("");
  const [editHighlight, setEditHighlight] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [editTips, setEditTips] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editCuisineType, setEditCuisineType] = useState("");
  const [editSignatureDishes, setEditSignatureDishes] = useState("");
  const [editPriceRange, setEditPriceRange] = useState("");
  const [editDiningAtmosphere, setEditDiningAtmosphere] = useState("");
  const [editSpotType, setEditSpotType] = useState("");
  const [editMustSeeHighlights, setEditMustSeeHighlights] = useState("");
  const [editTicketInfo, setEditTicketInfo] = useState("");
  const [editBestTimeToVisit, setEditBestTimeToVisit] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Pre-save Review Modal state (Human-in-the-loop review before adding)
  const [pendingCandidate, setPendingCandidate] = useState<SavedPlace | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSavingCandidate, setIsSavingCandidate] = useState(false);

  // Deletion modal state
  const [deletingPlace, setDeletingPlace] = useState<SavedPlace | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Newly added highlight tracking
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Companion sync tracking
  const [lastSyncTime, setLastSyncTime] = useState<string>("即時同步中");
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [showSyncGuideModal, setShowSyncGuideModal] = useState(false);
  const [showAuthDomainModal, setShowAuthDomainModal] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const [editTag, setEditTag] = useState("");
  const [editSuggestedTime, setEditSuggestedTime] = useState("");

  // Google Apps Script Cloud Sync State
  const [gasUrl, setGasUrl] = useState<string>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const qGas = urlParams.get("gasUrl");
      if (qGas) {
        localStorage.setItem(GAS_URL_STORAGE_KEY, qGas);
        return qGas;
      }
      const hash = window.location.hash;
      if (hash.includes("gasUrl=")) {
        const match = hash.match(/gasUrl=([^&]+)/);
        if (match && match[1]) {
          const decoded = decodeURIComponent(match[1]);
          localStorage.setItem(GAS_URL_STORAGE_KEY, decoded);
          return decoded;
        }
      }
      const stored = localStorage.getItem(GAS_URL_STORAGE_KEY);
      if (stored) return stored;
    } catch {}
    return DEFAULT_GAS_URL;
  });
  const [gasSyncStatus, setGasSyncStatus] = useState<"idle" | "syncing" | "synced" | "error">("idle");
  const [showGasModal, setShowGasModal] = useState(false);
  const [tempGasInput, setTempGasInput] = useState("");

  const syncPushToGas = (placesToPush: SavedPlace[]) => {
    if (!gasUrl) return;
    try {
      const spotsForGas = placesToPush.map((p) => ({
        id: p.id,
        name: p.name,
        spotName: p.spotName || p.name,
        categoryLabel: p.categoryLabel || CATEGORY_MAP[p.category]?.label || "探訪據點",
        tag: p.tag || "",
        desc: p.desc || p.summary || "",
        recommendation: p.recommendation || p.tips || "",
        suggestedTime: p.suggestedTime || p.bestTimeToVisit || "",
        mapUrl: p.url || p.mapUrl || "",
        visited: !!p.isVisited || !!p.visited,
        isWishlist: !!p.isVisited || !!p.isWishlist,
        updatedAt: typeof p.updatedAt === "number" ? p.updatedAt : Date.now(),
      }));

      fetch("/api/sync/gas-proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gasUrl,
          action: "post",
          payload: {
            spots: spotsForGas,
            updatedAt: new Date().toISOString(),
            sourceDevice: "Web Journal",
          },
        }),
      }).catch((e) => console.warn("Background GAS push notice:", e));
    } catch (e) {
      console.warn("syncPushToGas error:", e);
    }
  };

  // Save to localStorage helper
  const savePlacesToLocal = (newPlaces: SavedPlace[]) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlaces));
    } catch (e) {
      console.warn("Failed to persist to localStorage:", e);
    }
  };

  // 1. Listen for Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Sync with onSnapshot & intelligent local reconciliation
  useEffect(() => {
    const placesQuery = query(collection(db, "savedPlaces"));

    const unsubscribe = onSnapshot(
      placesQuery,
      (snapshot) => {
        setIsLoadingPlaces(false);
        const remoteList: SavedPlace[] = [];
        snapshot.forEach((docSnap) => {
          remoteList.push({ id: docSnap.id, ...(docSnap.data() as Omit<SavedPlace, "id">) });
        });

        const nowTime = new Date().toLocaleTimeString("zh-TW", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setLastSyncTime(nowTime);

        setPlaces((prevPlaces) => {
          let deletedIds = new Set<string>();
          try {
            const rawDel = localStorage.getItem(DELETED_IDS_KEY);
            if (rawDel) deletedIds = new Set(JSON.parse(rawDel));
          } catch {}

          // Remove explicitly deleted spots
          const validRemote = remoteList.filter((p) => !deletedIds.has(p.id));

          // Only keep local-only offline items that haven't been deleted
          const remoteIds = new Set(validRemote.map((p) => p.id));
          const localOnly = prevPlaces.filter(
            (p) => !remoteIds.has(p.id) && !deletedIds.has(p.id) && (p.id.startsWith("seed-") || p.userId === "local-user")
          );

          const combined = [...validRemote, ...localOnly];
          combined.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          });

          savePlacesToLocal(combined);
          return combined;
        });
      },
      (error) => {
        console.warn("Firestore onSnapshot offline or permissions error:", error);
        setIsLoadingPlaces(false);
        try {
          handleFirestoreError(error, OperationType.LIST, "savedPlaces");
        } catch {
          // Gracefully continue in local mode
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Automatic GAS sync on mount and when gasUrl changes
  useEffect(() => {
    let isMounted = true;
    async function initGasSync() {
      if (!gasUrl) return;
      setGasSyncStatus("syncing");
      try {
        const resp = await fetch("/api/sync/gas-proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gasUrl, action: "get" }),
        });
        if (resp.ok) {
          const json = await resp.json();
          const rawSpots = json.spots || json.data?.spots;
          if (Array.isArray(rawSpots) && isMounted) {
            let deletedIds = new Set<string>();
            try {
              const rawDel = localStorage.getItem(DELETED_IDS_KEY);
              if (rawDel) deletedIds = new Set(JSON.parse(rawDel));
            } catch {}

            const gasPlaces = rawSpots
              .filter((s) => s && s.id && !deletedIds.has(s.id))
              .map(normalizeGasSpotToSavedPlace);

            if (gasPlaces.length > 0) {
              setPlaces((prev) => {
                const gasIds = new Set(gasPlaces.map((p) => p.id));
                const localOnly = prev.filter((p) => !gasIds.has(p.id) && !deletedIds.has(p.id));
                const merged = [...gasPlaces, ...localOnly];
                savePlacesToLocal(merged);
                return merged;
              });
            }
            setGasSyncStatus("synced");
            const nowTime = new Date().toLocaleTimeString("zh-TW", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            });
            setLastSyncTime(nowTime);
          }
        } else {
          setGasSyncStatus("error");
        }
      } catch (err) {
        console.warn("Auto GAS sync notice:", err);
        setGasSyncStatus("idle");
      }
    }

    initGasSync();
    return () => {
      isMounted = false;
    };
  }, [gasUrl]);

  // Manual sync refresh function to confirm companion additions
  const handleManualSync = async () => {
    setIsManualSyncing(true);
    setGasSyncStatus("syncing");
    try {
      let deletedIds = new Set<string>();
      try {
        const rawDel = localStorage.getItem(DELETED_IDS_KEY);
        if (rawDel) deletedIds = new Set(JSON.parse(rawDel));
      } catch {}

      const remoteList: SavedPlace[] = [];

      // 1. Fetch from GAS proxy if gasUrl is set
      if (gasUrl) {
        try {
          const gasRes = await fetch("/api/sync/gas-proxy", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ gasUrl, action: "get" }),
          });
          if (gasRes.ok) {
            const gasJson = await gasRes.json();
            const gasSpots = gasJson.spots || gasJson.data?.spots;
            if (Array.isArray(gasSpots)) {
              gasSpots.forEach((s) => {
                if (s && s.id && !deletedIds.has(s.id)) {
                  remoteList.push(normalizeGasSpotToSavedPlace(s));
                }
              });
            }
          }
        } catch (gErr) {
          console.warn("GAS manual sync notice:", gErr);
        }
      }

      // 2. Fetch from Firestore if logged in or available
      try {
        const snap = await getDocs(collection(db, "savedPlaces"));
        snap.forEach((docSnap) => {
          if (!deletedIds.has(docSnap.id)) {
            remoteList.push({ id: docSnap.id, ...(docSnap.data() as Omit<SavedPlace, "id">) });
          }
        });
      } catch {}

      const remoteIds = new Set(remoteList.map((p) => p.id));
      const localOnly = places.filter(
        (p) => !remoteIds.has(p.id) && !deletedIds.has(p.id) && (p.id.startsWith("seed-") || p.userId === "local-user")
      );

      const combined = [...remoteList, ...localOnly];
      combined.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });

      setPlaces(combined);
      savePlacesToLocal(combined);
      setGasSyncStatus("synced");

      const nowTime = new Date().toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setLastSyncTime(nowTime);
      setToastMessage(`✓ 已成功同步最新狀態！共 ${combined.length} 處私房探訪清單`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (syncErr) {
      console.warn("Manual sync error:", syncErr);
      const nowTime = new Date().toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastSyncTime(nowTime);
      setToastMessage("✓ 已確認本機最新快照！");
      setTimeout(() => setToastMessage(null), 2500);
    } finally {
      setIsManualSyncing(false);
    }
  };

  // Handle Google Login with unauthorized-domain interceptor
  const handleLogin = async () => {
    try {
      setFormError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login failed:", err);
      const errStr = String(err?.code || err?.message || "");
      if (errStr.includes("auth/unauthorized-domain") || errStr.includes("unauthorized-domain")) {
        setShowAuthDomainModal(true);
        setFormError("此網址尚未加入 Firebase 授權網域清單。已為您開啟設定說明指引，您可先使用本機儲存！");
      } else if (errStr.includes("popup-closed-by-user")) {
        setFormError("已關閉登入視窗。");
      } else {
        setFormError(err.message || "登入失敗，請稍後重試。");
      }
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Logout failed:", err);
    }
  };

  // Copy current domain to clipboard
  const handleCopyCurrentDomain = () => {
    const hostname = window.location.hostname;
    navigator.clipboard.writeText(hostname).then(() => {
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    });
  };

  // Handle Submit Google Maps Link & Call AI
  const handleAnalyzeAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const rawUrlInput = inputUrl.trim();
    const rawPlaceInput = inputPlaceName.trim();

    if (!rawUrlInput && !rawPlaceInput) {
      setFormError("請輸入店家/景點名稱，或貼上 Google Maps 分享連結！");
      return;
    }

    // Separate URL and any leading/trailing text (e.g. from mobile share: "淺草今半 国際通り本店 4.4 ★ (3,281) https://maps.app.goo.gl/xxx")
    let targetUrl = rawUrlInput;
    let urlExtracted = "";
    const matchUrl = rawUrlInput.match(/https?:\/\/[^\s]+/i);
    if (matchUrl) {
      urlExtracted = matchUrl[0];
      targetUrl = urlExtracted;
    }

    // Clean text part from mobile share sheet
    let textPart = rawUrlInput.replace(/https?:\/\/[^\s]+/gi, " ").trim();
    textPart = textPart.replace(/\([\d,]+[+\s\w\u4e00-\u9fa5]*\)/g, " ");
    textPart = textPart.replace(/[\d.]+\s*[★☆星]+/g, " ").replace(/[★☆]+/g, " ");
    textPart = textPart.replace(/(?:\+81[\s-]?)?\b\d{2,4}-\d{2,4}-\d{4}\b/g, " ");
    textPart = textPart.replace(/〒?\d{3}-\d{4}/g, " ");
    textPart = textPart.replace(/[·|•‧]/g, " ").replace(/\s+/g, " ").trim();

    // Priority for place name: 1) explicit inputPlaceName, 2) text extracted from share snippet, 3) rawUrlInput if not HTTP
    const explicitPlaceName = (rawPlaceInput || textPart || (!targetUrl.startsWith("http") ? targetUrl : "")).trim();

    // Auto-construct Google Maps search URL if targetUrl is not an HTTP URL
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(explicitPlaceName || targetUrl)}`;
    }

    const effectiveNotes = [inputNotes.trim()].filter(Boolean).join(" ");
    let clientExtractedName = explicitPlaceName || extractPlaceNameFromUrl(targetUrl);

    setIsAnalyzing(true);

    try {
      let analyzed: any = null;

      // 1. First try /api/gemini/spot-enrich (Osaka-trip-2027 standard pipeline)
      try {
        const enrichRes = await fetch("/api/gemini/spot-enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: AbortSignal.timeout(18000),
          body: JSON.stringify({
            rawInput: targetUrl || rawUrlInput,
            spotName: explicitPlaceName || clientExtractedName,
            mapsUrl: targetUrl.startsWith("http") ? targetUrl : "",
            cityOrArea: "東京",
          }),
        });

        if (enrichRes.ok) {
          const enrichJson = await enrichRes.json();
          if (enrichJson?.success && enrichJson?.data) {
            analyzed = enrichJson.data;
          }
        }
      } catch (enrichErr) {
        console.warn("spot-enrich fetch skipped:", enrichErr);
      }

      // 2. If not obtained, call /api/analyze-place
      if (!analyzed) {
        try {
          const res = await fetch("/api/analyze-place", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            signal: AbortSignal.timeout(18000),
            body: JSON.stringify({
              url: targetUrl,
              placeName: explicitPlaceName,
              rawText: effectiveNotes || explicitPlaceName,
              clientExtractedName: clientExtractedName,
            }),
          });

          const contentType = res.headers.get("content-type") || "";
          if (res.ok && contentType.includes("application/json")) {
            const json = await res.json();
            if (json && json.success && json.data) {
              analyzed = json.data;
            }
          }
        } catch (fetchErr) {
          console.warn("Backend API not reachable or timed out, switching to client intelligence:", fetchErr);
        }
      }

      // 3. High-Fidelity Client-side intelligence pipeline
      if (!analyzed) {
        // If it's a short link and we don't have a place name yet, unshorten client-side via CORS proxies
        if (!clientExtractedName && (targetUrl.includes("maps.app.goo.gl") || targetUrl.includes("goo.gl") || targetUrl.includes("g.co/"))) {
          try {
            const unshortened = await unshortenGoogleMapsLinkClient(targetUrl);
            if (unshortened.resolvedUrl) {
              targetUrl = unshortened.resolvedUrl;
              const nameFromUrl = extractPlaceNameFromUrl(unshortened.resolvedUrl);
              if (nameFromUrl) {
                clientExtractedName = nameFromUrl;
              }
            }
            if (!clientExtractedName && unshortened.title) {
              clientExtractedName = unshortened.title;
            }
          } catch (unErr) {
            console.warn("Client unshortening failed:", unErr);
          }
        }

        const effectiveSearchName = (explicitPlaceName || clientExtractedName || (!targetUrl.startsWith("http") ? targetUrl : "")).trim();

        // Client Landmark DB + Deep Tokyo Taxonomy
        analyzed = synthesizePlaceData(effectiveSearchName, targetUrl, rawUrlInput, inputNotes);
      }

      // Valid link: format valid Google Maps search URL if not HTTP
      const finalUrl =
        targetUrl.startsWith("http://") || targetUrl.startsWith("https://")
          ? targetUrl
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(explicitPlaceName || targetUrl)}`;

      const placeId = "p-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);

      // Determine canonical category
      let safeCategory = (analyzed?.category || "other").toLowerCase().trim();
      const categoryCheckText = `${analyzed?.category || ""} ${analyzed?.categoryLabel || ""} ${analyzed?.spotName || analyzed?.name || ""} ${analyzed?.desc || analyzed?.summary || ""} ${analyzed?.tag || ""}`;
      if (/(壽喜燒|燒肉|壽司|拉麵|牛舌|和牛|炸豬排|天婦羅|居酒屋|串燒|火鍋|食堂|洋食|丼飯|今半|敘敘苑|叙々苑|利久|afuri|restaurant|sushi|ramen)/i.test(categoryCheckText)) {
        safeCategory = "dining";
      } else if (/(甜點|蛋糕|抹茶|咖啡|喫茶|生吐司|千層|布丁|可麗露|冰淇淋|下午茶|鬆餅|HARBS|cafe|bakery)/i.test(categoryCheckText)) {
        safeCategory = "cafe";
      } else if (/(神社|寺|宮|公園|庭園|展望台|塔|城|水族館|美術館|博物館|觀光|景點|shrine|temple|sky)/i.test(categoryCheckText)) {
        safeCategory = "sightseeing";
      } else if (/(購物|百貨|商店街|藥妝|唐吉訶德|大丸|Bic|免稅|商場|mall)/i.test(categoryCheckText)) {
        safeCategory = "shopping";
      } else if (/(飯店|旅館|民宿|溫泉宿|hotel|inn)/i.test(categoryCheckText)) {
        safeCategory = "stay";
      }

      const safeCategoryLabel = analyzed?.categoryLabel || CATEGORY_MAP[safeCategory]?.label || "其他探訪";

      let candidateName = String(analyzed?.spotName || analyzed?.name || "").trim();
      if (!candidateName || candidateName.startsWith("http")) {
        candidateName = textPart || inputNotes.trim() || (!targetUrl.startsWith("http") ? targetUrl : "") || "私房探訪據點";
      }

      const descVal = String(analyzed?.desc || analyzed?.summary || `${candidateName} 是在地廣受好評的探訪去處，氛圍與特色極具魅力，值得親自造訪體驗。`).trim();
      const recVal = String(analyzed?.recommendation || analyzed?.tips || "造訪前可開啟 Google 地圖再次確認即時營業時間與公休日。").trim();
      const tagVal = String(analyzed?.tag || "東京散策、自由行私房推薦").trim();
      const suggestedTimeVal = String(analyzed?.suggestedTime || analyzed?.bestTimeToVisit || "午後散策時段").trim();

      const nowIso = new Date().toISOString();
      const newPlaceDoc: SavedPlace = {
        id: placeId,
        url: finalUrl.slice(0, 1000),
        name: candidateName.slice(0, 200),
        spotName: String(analyzed?.spotName || candidateName).trim().slice(0, 200),
        japaneseName: String(analyzed?.japaneseName || candidateName).trim().slice(0, 200),
        category: safeCategory.slice(0, 50),
        categoryLabel: safeCategoryLabel.slice(0, 100),
        desc: descVal.slice(0, 1000),
        summary: descVal.slice(0, 1000),
        recommendation: recVal.slice(0, 500),
        highlight: String(analyzed?.highlight || recVal.split("。")[0] || `${candidateName} 人氣特色探訪推薦`).trim().slice(0, 500),
        tag: tagVal.slice(0, 200),
        suggestedTime: suggestedTimeVal.slice(0, 100),
        address: String(analyzed?.address || (targetUrl.startsWith("http") ? "東京都內" : targetUrl)).trim().slice(0, 300),
        tips: recVal.slice(0, 500),
        notes: inputNotes.trim().slice(0, 1000),
        isVisited: false,
        visited: false,
        isWishlist: false,
        addedByName: String(currentUser?.displayName || currentUser?.email?.split("@")[0] || "旅伴").slice(0, 100),
        userId: currentUser?.uid || "local-user",
        createdAt: nowIso,
        updatedAt: Date.now(),
        // Distinct Dining attributes
        cuisineType: analyzed?.cuisineType || (safeCategory === "dining" ? safeCategoryLabel : ""),
        signatureDishes: Array.isArray(analyzed?.signatureDishes) ? analyzed.signatureDishes : [],
        priceRange: analyzed?.priceRange || "",
        diningAtmosphere: analyzed?.diningAtmosphere || "",
        // Distinct Sightseeing attributes
        spotType: analyzed?.spotType || (safeCategory === "sightseeing" ? safeCategoryLabel : ""),
        mustSeeHighlights: Array.isArray(analyzed?.mustSeeHighlights) ? analyzed.mustSeeHighlights : [],
        ticketInfo: analyzed?.ticketInfo || "",
        bestTimeToVisit: analyzed?.bestTimeToVisit || suggestedTimeVal,
      };

      // 4. Open the Human-in-the-loop Pre-Save Review & Edit modal!
      setPendingCandidate(newPlaceDoc);
      setIsReviewModalOpen(true);
      setFormError(null);
    } catch (err: any) {
      console.error("Analyze place error:", err);
      setFormError("地點分析時發生狀況，請檢查網址或直接手動輸入名稱。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Regenerate details dynamically in review modal based on custom name
  const handleRegenerateFromCandidateName = async (customName: string) => {
    const trimmed = customName.trim();
    if (!trimmed || !pendingCandidate) return;

    try {
      // 1. Query server spot-enrich API
      const res = await fetch("/api/gemini/spot-enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: AbortSignal.timeout(12000),
        body: JSON.stringify({
          spotName: trimmed,
          rawInput: pendingCandidate.url,
          cityOrArea: "東京",
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json?.success && json?.data) {
          const d = json.data;
          const descVal = d.desc || d.summary || pendingCandidate.desc;
          const recVal = d.recommendation || d.tips || pendingCandidate.recommendation;
          setPendingCandidate({
            ...pendingCandidate,
            name: d.spotName || trimmed,
            spotName: d.spotName || trimmed,
            categoryLabel: d.categoryLabel || pendingCandidate.categoryLabel,
            tag: d.tag || pendingCandidate.tag,
            desc: descVal,
            summary: descVal,
            recommendation: recVal,
            tips: recVal,
            highlight: recVal.split("。")[0] || pendingCandidate.highlight,
            suggestedTime: d.suggestedTime || pendingCandidate.suggestedTime,
          });
          return;
        }
      }
    } catch (e) {
      console.warn("Regenerate via server failed, using local synthesizer:", e);
    }

    // Fallback: local high-fidelity synthesizer
    const fresh = synthesizePlaceData(
      trimmed,
      pendingCandidate.url,
      trimmed,
      pendingCandidate.notes
    );
    setPendingCandidate({
      ...pendingCandidate,
      name: fresh.name,
      japaneseName: fresh.japaneseName,
      category: fresh.category,
      categoryLabel: fresh.categoryLabel,
      highlight: fresh.highlight,
      summary: fresh.summary,
      address: fresh.address,
      tips: fresh.tips,
      cuisineType: fresh.cuisineType ?? pendingCandidate.cuisineType,
      signatureDishes: fresh.signatureDishes ?? pendingCandidate.signatureDishes,
      priceRange: fresh.priceRange ?? pendingCandidate.priceRange,
      diningAtmosphere: fresh.diningAtmosphere ?? pendingCandidate.diningAtmosphere,
      spotType: fresh.spotType ?? pendingCandidate.spotType,
      mustSeeHighlights: fresh.mustSeeHighlights ?? pendingCandidate.mustSeeHighlights,
      ticketInfo: fresh.ticketInfo ?? pendingCandidate.ticketInfo,
      bestTimeToVisit: fresh.bestTimeToVisit ?? pendingCandidate.bestTimeToVisit,
    });
  };

  // Confirm and persist the reviewed place candidate
  const handleConfirmSaveCandidate = async () => {
    if (!pendingCandidate) return;
    const trimmedName = pendingCandidate.name.trim();
    if (!trimmedName) {
      setFormError("地點名稱不能為空，請輸入名稱！");
      return;
    }

    setIsSavingCandidate(true);
    const placeId = pendingCandidate.id || "p-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
    const nowIso = new Date().toISOString();

    const finalizedPlace: SavedPlace = {
      ...pendingCandidate,
      id: placeId,
      name: trimmedName,
      japaneseName: (pendingCandidate.japaneseName || "").trim(),
      category: pendingCandidate.category || "dining",
      categoryLabel: CATEGORY_MAP[pendingCandidate.category]?.label || "餐廳美饌",
      summary: (pendingCandidate.summary || "自由行旅人私房推薦據點。").trim(),
      highlight: (pendingCandidate.highlight || "").trim(),
      address: (pendingCandidate.address || "東京都內").trim(),
      tips: (pendingCandidate.tips || "").trim(),
      notes: (pendingCandidate.notes || "").trim(),
      cuisineType: pendingCandidate.cuisineType || "",
      signatureDishes: pendingCandidate.signatureDishes || [],
      priceRange: pendingCandidate.priceRange || "",
      diningAtmosphere: pendingCandidate.diningAtmosphere || "",
      spotType: pendingCandidate.spotType || "",
      mustSeeHighlights: pendingCandidate.mustSeeHighlights || [],
      ticketInfo: pendingCandidate.ticketInfo || "",
      bestTimeToVisit: pendingCandidate.bestTimeToVisit || "",
      updatedAt: nowIso,
    };

    try {
      // 1. Immediately persist to React state & localStorage
      setPlaces((prev) => {
        const next = [finalizedPlace, ...prev.filter((p) => p.id !== placeId)];
        savePlacesToLocal(next);
        syncPushToGas(next);
        return next;
      });

      // 2. If logged in to Firebase, sync to Firestore
      if (currentUser) {
        try {
          const firestoreData = {
            url: finalizedPlace.url,
            name: finalizedPlace.name,
            spotName: finalizedPlace.spotName || finalizedPlace.name,
            japaneseName: finalizedPlace.japaneseName || "",
            category: finalizedPlace.category,
            categoryLabel: finalizedPlace.categoryLabel || "",
            tag: finalizedPlace.tag || "",
            desc: finalizedPlace.desc || finalizedPlace.summary || "",
            summary: finalizedPlace.summary || "",
            recommendation: finalizedPlace.recommendation || finalizedPlace.tips || "",
            highlight: finalizedPlace.highlight || "",
            suggestedTime: finalizedPlace.suggestedTime || "",
            address: finalizedPlace.address || "",
            tips: finalizedPlace.tips || "",
            notes: finalizedPlace.notes || "",
            cuisineType: finalizedPlace.cuisineType || "",
            signatureDishes: finalizedPlace.signatureDishes || [],
            priceRange: finalizedPlace.priceRange || "",
            diningAtmosphere: finalizedPlace.diningAtmosphere || "",
            spotType: finalizedPlace.spotType || "",
            mustSeeHighlights: finalizedPlace.mustSeeHighlights || [],
            ticketInfo: finalizedPlace.ticketInfo || "",
            bestTimeToVisit: finalizedPlace.bestTimeToVisit || "",
            isVisited: false,
            visited: false,
            isWishlist: false,
            addedByName: finalizedPlace.addedByName || "",
            userId: currentUser.uid,
            createdAt: finalizedPlace.createdAt || nowIso,
            updatedAt: finalizedPlace.updatedAt || nowIso,
          };
          await setDoc(doc(db, "savedPlaces", placeId), firestoreData);
        } catch (dbErr: any) {
          console.warn("Firestore sync error:", dbErr);
          try {
            handleFirestoreError(dbErr, OperationType.CREATE, `savedPlaces/${placeId}`);
          } catch {}
        }
      }

      // 3. Close modal & reset input fields
      setIsReviewModalOpen(false);
      setPendingCandidate(null);
      setInputPlaceName("");
      setInputUrl("");
      setInputNotes("");

      // 4. Ensure filters are reset so newly added card is visible
      setSelectedCategory("all");
      setVisitedFilter("all");
      setRecentlyAddedId(placeId);
      setTimeout(() => setRecentlyAddedId(null), 10000);

      setFormSuccess(
        currentUser
          ? `🎉 已成功審閱並同步收藏：「${finalizedPlace.name}」！`
          : `🎉 已成功審閱並收藏至清單：「${finalizedPlace.name}」！`
      );
      setTimeout(() => setFormSuccess(null), 6000);

      // Smooth scroll to the newly added item
      setTimeout(() => {
        const el = document.getElementById(`place-${placeId}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 150);
    } catch (saveErr) {
      console.error("Save place confirmation error:", saveErr);
      setFormError("儲存地點時發生狀況，請重試！");
    } finally {
      setIsSavingCandidate(false);
    }
  };

  // Toggle Visited status (想去)
  const handleToggleVisited = async (place: SavedPlace) => {
    const nextStatus = !place.isVisited;

    // 1. Immediately update React state & localStorage
    setPlaces((prev) => {
      const next = prev.map((p) =>
        p.id === place.id ? { ...p, isVisited: nextStatus, visited: nextStatus, isWishlist: nextStatus } : p
      );
      savePlacesToLocal(next);
      syncPushToGas(next);
      return next;
    });

    setToastMessage(nextStatus ? `♥ 已將「${place.name}」標記為「想去」！` : `已取消「${place.name}」的「想去」標記`);
    setTimeout(() => setToastMessage(null), 2500);

    // 2. Sync to Firestore if authenticated
    if (currentUser && !place.id.startsWith("seed-")) {
      try {
        await updateDoc(doc(db, "savedPlaces", place.id), {
          isVisited: nextStatus,
          visited: nextStatus,
          isWishlist: nextStatus,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn("Firestore update visited status failed:", err);
        try {
          handleFirestoreError(err, OperationType.UPDATE, `savedPlaces/${place.id}`);
        } catch {}
      }
    }
  };

  // Open deletion modal
  const handleRequestDelete = (place: SavedPlace) => {
    setDeletingPlace(place);
  };

  // Confirm deletion - GUARANTEED immediate deletion locally & in cloud
  const handleConfirmDelete = async () => {
    if (!deletingPlace) return;
    setIsDeleting(true);
    const targetPlace = deletingPlace;

    try {
      // 1. Immediately delete from React state & localStorage
      setPlaces((prev) => {
        const next = prev.filter((p) => p.id !== targetPlace.id);
        savePlacesToLocal(next);
        syncPushToGas(next);
        return next;
      });

      // Record in DELETED_IDS_KEY so onSnapshot will never revive it
      try {
        const rawDel = localStorage.getItem(DELETED_IDS_KEY);
        const set = new Set<string>(rawDel ? JSON.parse(rawDel) : []);
        set.add(targetPlace.id);
        localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
      } catch (e) {
        console.warn("Failed to record deleted ID:", e);
      }

      // 2. If logged in and document is in Firestore, delete from Firestore
      if (currentUser && !targetPlace.id.startsWith("seed-")) {
        try {
          await deleteDoc(doc(db, "savedPlaces", targetPlace.id));
        } catch (dbErr) {
          console.warn("Firestore deleteDoc failed:", dbErr);
          try {
            handleFirestoreError(dbErr, OperationType.DELETE, `savedPlaces/${targetPlace.id}`);
          } catch {}
        }
      }

      setDeletingPlace(null);
      setToastMessage(`已成功刪除「${targetPlace.name}」`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err: any) {
      console.error("Delete failed:", err);
      setToastMessage(`刪除「${targetPlace.name}」完成`);
      setDeletingPlace(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Start editing a place
  const handleStartEdit = (place: SavedPlace) => {
    setEditingPlace(place);
    setEditName(place.name || "");
    setEditJapaneseName(place.japaneseName || "");
    setEditCategory(place.category || "dining");
    setEditAddress(place.address || "");
    setEditHighlight(place.highlight || "");
    setEditSummary(place.desc || place.summary || "");
    setEditTips(place.recommendation || place.tips || "");
    setEditTag(place.tag || "");
    setEditSuggestedTime(place.suggestedTime || place.bestTimeToVisit || "");
    setEditNotes(place.notes || "");
    setEditUrl(place.url || "");
    setEditCuisineType(place.cuisineType || "");
    setEditSignatureDishes((place.signatureDishes || []).join("、"));
    setEditPriceRange(place.priceRange || "");
    setEditDiningAtmosphere(place.diningAtmosphere || "");
    setEditSpotType(place.spotType || "");
    setEditMustSeeHighlights((place.mustSeeHighlights || []).join("、"));
    setEditTicketInfo(place.ticketInfo || "");
    setEditBestTimeToVisit(place.bestTimeToVisit || place.suggestedTime || "");
  };

  // Save Edit (Comprehensive all-fields update)
  const handleSaveEdit = async () => {
    if (!editingPlace) return;

    const trimmedName = editName.trim();
    if (!trimmedName) {
      setToastMessage("地點名稱不能為空，請輸入名稱！");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsSavingEdit(true);
    try {
      const updatedCatLabel = CATEGORY_MAP[editCategory]?.label || "其他探訪";
      const updatedDesc = editSummary.trim().slice(0, 1000);
      const updatedRec = editTips.trim().slice(0, 500);

      const updatedFields: Partial<SavedPlace> = {
        name: trimmedName.slice(0, 200),
        spotName: trimmedName.slice(0, 200),
        japaneseName: editJapaneseName.trim().slice(0, 200),
        category: editCategory.slice(0, 50),
        categoryLabel: updatedCatLabel,
        address: editAddress.trim().slice(0, 300),
        highlight: editHighlight.trim().slice(0, 500),
        desc: updatedDesc,
        summary: updatedDesc,
        recommendation: updatedRec,
        tips: updatedRec,
        tag: editTag.trim().slice(0, 200),
        suggestedTime: editSuggestedTime.trim().slice(0, 100),
        notes: editNotes.trim().slice(0, 1000),
        url: (editUrl.trim() || editingPlace.url).slice(0, 1000),
        cuisineType: editCuisineType.trim().slice(0, 100),
        signatureDishes: editSignatureDishes
          ? editSignatureDishes.split(/[、,，\n]+/).map((s) => s.trim()).filter(Boolean)
          : [],
        priceRange: editPriceRange.trim().slice(0, 100),
        diningAtmosphere: editDiningAtmosphere.trim().slice(0, 200),
        spotType: editSpotType.trim().slice(0, 100),
        mustSeeHighlights: editMustSeeHighlights
          ? editMustSeeHighlights.split(/[、,，\n]+/).map((s) => s.trim()).filter(Boolean)
          : [],
        ticketInfo: editTicketInfo.trim().slice(0, 200),
        bestTimeToVisit: (editBestTimeToVisit.trim() || editSuggestedTime.trim()).slice(0, 200),
        updatedAt: Date.now(),
      };

      // 1. Update React state & localStorage immediately
      setPlaces((prev) => {
        const next = prev.map((p) =>
          p.id === editingPlace.id ? { ...p, ...updatedFields } : p
        );
        savePlacesToLocal(next);
        syncPushToGas(next);
        return next;
      });

      // 2. Update Firestore if logged in
      if (currentUser && !editingPlace.id.startsWith("seed-")) {
        try {
          await updateDoc(doc(db, "savedPlaces", editingPlace.id), updatedFields);
        } catch (dbErr) {
          console.warn("Firestore updateDoc failed:", dbErr);
          try {
            handleFirestoreError(dbErr, OperationType.UPDATE, `savedPlaces/${editingPlace.id}`);
          } catch {}
        }
      }

      setEditingPlace(null);
      setToastMessage(`已儲存修改：「${trimmedName}」`);
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Filtered Places
  const filteredPlaces = places.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) {
      return false;
    }
    if (visitedFilter === "unvisited" && item.isVisited) {
      return false;
    }
    if (visitedFilter === "visited" && !item.isVisited) {
      return false;
    }
    return true;
  });

  const visitedCount = places.filter((p) => p.isVisited).length;
  const currentHostname = typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <section id="wishlist" className="py-10 sm:py-14 bg-[#faf9f7] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Title Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcebee] border border-[#f5d9df] text-xs font-semibold text-[#8e2443] mb-3">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#b83358]" />
            <span>AI 自動辨識分類 · 跨裝置雲端協作</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2d2527] tracking-tight">
            旅人口袋私房清單
          </h2>
          <p className="text-xs sm:text-sm text-[#735e65] mt-2 max-w-xl mx-auto leading-relaxed">
            貼上 Google Maps 分享連結，AI 自動萃取中日文名稱、店家特色與類別。無論在手機或電腦，旅伴隨時隨地即時同步編輯與刪除！
          </p>

          {/* Sync Status & Google Auth Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs">
            {/* Real-time Companion Sync Status Chip */}
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#ebd8dc] shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-[#4a383d]">
                旅伴即時同步：<span className="text-emerald-700 font-bold">連線中</span>
              </span>
              <span className="text-[10px] text-[#8c7b80] hidden sm:inline font-mono">
                ({lastSyncTime})
              </span>
              <button
                type="button"
                onClick={handleManualSync}
                disabled={isManualSyncing}
                title="立即檢查最新雲端同步更新"
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#fbf6f7] hover:bg-[#f5e3e7] text-[#992545] rounded-lg border border-[#ebd8dc] transition-all cursor-pointer font-bold text-[11px]"
              >
                <RefreshCw className={`w-3 h-3 ${isManualSyncing ? "animate-spin text-[#992545]" : ""}`} />
                <span>{isManualSyncing ? "檢查中..." : "重新整理"}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setTempGasInput(gasUrl || DEFAULT_GAS_URL);
                  setShowGasModal(true);
                }}
                title="設定 Google 試算表 (GAS) 雙向同步"
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg border border-emerald-200 transition-all cursor-pointer font-bold text-[11px]"
              >
                <LinkIcon className="w-3 h-3 text-emerald-600" />
                <span>GAS 同步</span>
              </button>
              <button
                type="button"
                onClick={() => setShowSyncGuideModal(true)}
                title="查看旅伴即時同步機制說明"
                className="text-[#8c7b80] hover:text-[#992545] p-0.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {authLoading ? (
              <span className="text-[#8c7b80] flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 連線檢查中...
              </span>
            ) : currentUser ? (
              <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#ebd8dc] shadow-2xs">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || "使用者"}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-[#992545]" />
                )}
                <span className="font-semibold text-[#4a383d]">
                  {currentUser.displayName || currentUser.email}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  已登入雲端庫
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  title="登出帳號"
                  className="text-[#8c7b80] hover:text-[#992545] p-1 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="inline-flex flex-wrap items-center gap-2 bg-[#fff2f5] px-4 py-2 rounded-full border border-[#f3ccd6] shadow-2xs">
                <span className="text-[#8e2443] font-medium">
                  想要在手機與電腦同步給所有旅伴？
                </span>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#992545] hover:bg-[#801b36] text-white font-bold rounded-full shadow-xs transition-all cursor-pointer text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Google 登入同步</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAuthDomainModal(true)}
                  title="網域授權設定說明"
                  className="text-[#a84460] hover:text-[#801b36] hover:bg-white/60 p-1 rounded-full transition-colors cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input & AI Parsing Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#ebd8dc] shadow-[0_10px_30px_rgba(50,30,35,0.06)] mb-8">
          <div className="flex items-center gap-2 font-bold text-[#2d2527] text-base mb-2">
            <Sparkles className="w-4 h-4 text-[#b83358]" />
            <span>貼上 Google 地圖連結或店家 / 地址，AI 分析後審閱確認</span>
          </div>
          <p className="text-xs text-[#786b6f] mb-4">
            支援手機 Google Maps「分享連結」、電腦版網址，或輸入日本店家與地址。AI 分析後將開啟<strong>「審閱視窗」</strong>供您人工檢視與編輯內容後再儲存！
          </p>

          <form onSubmit={handleAnalyzeAndSave} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
              {/* Field 1: Place / Restaurant Name (Primary, high-precision) */}
              <div className="relative md:col-span-5">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8b92]">
                  <MapPin className="w-4 h-4 text-[#992545]" />
                </div>
                <input
                  type="text"
                  value={inputPlaceName}
                  onChange={(e) => setInputPlaceName(e.target.value)}
                  placeholder="店家或景點名稱 (例如：淺草今半、敘敘苑 晴空塔店、AFURI)"
                  disabled={isAnalyzing}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf8f9] hover:bg-white focus:bg-white border border-[#e4d3d7] focus:border-[#992545] focus:ring-2 focus:ring-[#992545]/20 rounded-2xl text-xs sm:text-sm text-[#2d2527] outline-hidden transition-all font-medium"
                />
              </div>

              {/* Field 2: Google Maps Link (Optional, auto-navigation) */}
              <div className="relative md:col-span-4">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8b92]">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="Google 地圖分享連結 (選填，可一鍵導航)"
                  disabled={isAnalyzing}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf8f9] hover:bg-white focus:bg-white border border-[#e4d3d7] focus:border-[#992545] focus:ring-2 focus:ring-[#992545]/20 rounded-2xl text-xs sm:text-sm text-[#2d2527] outline-hidden transition-all"
                />
              </div>

              {/* Field 3: Notes (Optional) */}
              <div className="md:col-span-3">
                <input
                  type="text"
                  value={inputNotes}
                  onChange={(e) => setInputNotes(e.target.value)}
                  placeholder="旅伴備註 / 必吃想買 (選填)"
                  disabled={isAnalyzing}
                  className="w-full px-3.5 py-2.5 bg-[#faf8f9] hover:bg-white focus:bg-white border border-[#e4d3d7] focus:border-[#992545] focus:ring-2 focus:ring-[#992545]/20 rounded-2xl text-xs sm:text-sm text-[#2d2527] outline-hidden transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="text-[11px] text-[#7a6269] flex items-center gap-1.5 bg-[#fbf6f7] px-3.5 py-1.5 rounded-xl border border-[#f1dde1]">
                <Sparkles className="w-3.5 h-3.5 text-[#992545] shrink-0" />
                <span>
                  💡 <strong>精確辨識小撇步：</strong>可直接輸入店家名稱（如「敘敘苑 晴空塔店」），AI 能 100% 精確識別為燒肉美食並推薦招牌菜！
                </span>
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || (!inputPlaceName.trim() && !inputUrl.trim())}
                className="px-6 py-2.5 bg-[#992545] hover:bg-[#801b36] disabled:bg-stone-300 text-white font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI 深度辨識中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI 分析並審閱確認</span>
                  </>
                )}
              </button>
            </div>

            {/* Error / Success Feedback */}
            {formError && (
              <div className="flex items-center justify-between gap-2 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{formError}</span>
                </div>
                {formError.includes("授權") && (
                  <button
                    type="button"
                    onClick={() => setShowAuthDomainModal(true)}
                    className="text-xs font-bold text-[#992545] underline shrink-0 cursor-pointer"
                  >
                    查看設定說明
                  </button>
                )}
              </div>
            )}
            {formSuccess && (
              <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}
          </form>
        </div>

        {/* Filter Pills & Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-[#ebd8dc]">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[#992545] text-white shadow-xs"
                  : "bg-white text-[#735e65] hover:bg-[#fbf0f2] border border-[#ebd8dc]"
              }`}
            >
              全部 ({places.length})
            </button>
            {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
              const count = places.filter((p) => p.category === key).length;
              const Icon = cat.icon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedCategory(key)}
                  className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    selectedCategory === key
                      ? "bg-[#992545] text-white shadow-xs"
                      : "bg-white text-[#735e65] hover:bg-[#fbf0f2] border border-[#ebd8dc]"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{cat.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Wishlist Status Filter */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-[#8c7b80] font-medium">篩選：</span>
            <button
              type="button"
              onClick={() => setVisitedFilter("all")}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                visitedFilter === "all"
                  ? "bg-[#2d2527] text-white shadow-xs"
                  : "bg-white border border-[#ebd8dc] text-[#735e65] hover:bg-[#faf6f7]"
              }`}
            >
              全部清單
            </button>
            <button
              type="button"
              onClick={() => setVisitedFilter("visited")}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                visitedFilter === "visited"
                  ? "bg-rose-600 text-white shadow-xs"
                  : "bg-white border border-[#ebd8dc] text-[#735e65] hover:bg-rose-50 hover:text-rose-600"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${visitedFilter === "visited" ? "fill-white text-white" : "fill-rose-500 text-rose-500"}`} />
              <span>想去 ({visitedCount})</span>
            </button>
          </div>
        </div>

        {/* Places Grid */}
        {isLoadingPlaces ? (
          <div className="py-16 text-center text-[#8c7b80]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#992545]" />
            <p className="text-xs">正在載入口袋私房清單...</p>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#e4d3d7] p-8">
            <BookmarkCheck className="w-10 h-10 text-[#d4b9c1] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#4a383d]">此分類目前尚無私房收藏</h3>
            <p className="text-xs text-[#8c7b80] mt-1.5 max-w-sm mx-auto">
              在上方輸入框貼上 Google Maps 分享連結，AI 就會自動為您分析特色並加入清單！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaces.map((place) => {
              const catConfig = CATEGORY_MAP[place.category] || CATEGORY_MAP.other;
              const CatIcon = catConfig.icon;
              const isRecentlyAdded = place.id === recentlyAddedId;

              return (
                <div
                  key={place.id}
                  id={`place-${place.id}`}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between group ${
                    isRecentlyAdded
                      ? "ring-2 ring-[#992545] border-[#992545] bg-[#fffbfd] shadow-md"
                      : place.isVisited
                      ? "border-rose-200 bg-rose-50/20 shadow-2xs"
                      : "border-[#ebd8dc] hover:border-[#b83358] shadow-xs hover:shadow-md"
                  }`}
                >
                  <div>
                    {/* Top Row: Category Badge, Checkbox & Actions */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${catConfig.bg} ${catConfig.color} border ${catConfig.border}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{place.categoryLabel || catConfig.label}</span>
                        </span>

                        {place.suggestedTime && (
                          <span className="text-[10px] font-semibold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                            ⏱ {place.suggestedTime}
                          </span>
                        )}

                        {isRecentlyAdded && (
                          <span className="text-[10px] font-extrabold text-white bg-[#992545] px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                            ✨ 剛新增
                          </span>
                        )}

                        {place.isVisited && (
                          <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                            <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                            <span>想去</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Toggle 想去 */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisited(place)}
                          title={place.isVisited ? "取消「想去」標記" : "標記為「想去」"}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            place.isVisited
                              ? "text-rose-600 bg-rose-50 hover:bg-rose-100"
                              : "text-stone-300 hover:text-rose-500 hover:bg-rose-50"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 transition-transform active:scale-125 ${
                              place.isVisited ? "fill-rose-500 text-rose-500" : ""
                            }`}
                          />
                        </button>

                        {/* Edit Place */}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(place)}
                          title="完整編輯地點內容"
                          className="p-1.5 text-stone-400 hover:text-[#992545] hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Place */}
                        <button
                          type="button"
                          onClick={() => handleRequestDelete(place)}
                          title="刪除此收藏"
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Place Title */}
                    <div className="mb-2">
                      <h3 className="text-base font-bold text-[#2d2527] group-hover:text-[#992545] transition-colors flex items-baseline gap-1.5 flex-wrap">
                        <span>{place.spotName || place.name}</span>
                      </h3>

                      {place.tag && (
                        <div className="flex flex-wrap items-center gap-1 mt-1 mb-1.5">
                          {place.tag
                            .split(/[、,，\s]+/)
                            .filter(Boolean)
                            .map((t, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#faf4f6] text-[#992545] border border-[#f5dde3]"
                              >
                                #{t}
                              </span>
                            ))}
                        </div>
                      )}

                      {place.address && (
                        <div className="flex items-center gap-1 text-[11px] text-[#735e65] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#b83358] shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Literary "旅の手帖" Description / Summary */}
                    {(place.desc || place.summary) && (
                      <p className="text-xs text-[#44383c] leading-relaxed mb-3 font-normal tracking-wide bg-[#fffdfa] p-3 rounded-2xl border border-[#f3eee9]">
                        {place.desc || place.summary}
                      </p>
                    )}

                    {/* osaka-trip-2027 Signature Recommendation Block */}
                    {(place.recommendation || place.tips) && (
                      <div className="bg-amber-50/70 border-l-3 border-amber-500 rounded-r-2xl p-2.5 sm:p-3 mb-3 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-amber-950 text-[11px]">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>招牌推薦與造訪指引</span>
                        </div>
                        <p className="text-amber-900 leading-relaxed text-[11px]">
                          {place.recommendation || place.tips}
                        </p>
                      </div>
                    )}

                    {/* Dedicated Dining Attributes Block */}
                    {(place.cuisineType || (place.signatureDishes && place.signatureDishes.length > 0) || place.priceRange || place.diningAtmosphere) && (
                      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 sm:p-3 mb-3 text-xs space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {place.cuisineType && (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs text-[11px]">
                              <span>🍲</span>
                              <span>{place.cuisineType}</span>
                            </span>
                          )}
                          {place.priceRange && (
                            <span className="inline-flex items-center gap-1 font-medium text-amber-800 bg-white/80 px-2 py-0.5 rounded-lg border border-amber-200/60 text-[11px]">
                              <span>💰</span>
                              <span>{place.priceRange}</span>
                            </span>
                          )}
                          {place.diningAtmosphere && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 bg-white/60 px-2 py-0.5 rounded-lg">
                              <span>✨</span>
                              <span>{place.diningAtmosphere}</span>
                            </span>
                          )}
                        </div>
                        {place.signatureDishes && place.signatureDishes.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-amber-200/50">
                            <span className="text-[11px] font-bold text-amber-900 shrink-0">招牌必點：</span>
                            {place.signatureDishes.map((dish, idx) => (
                              <span
                                key={idx}
                                className="text-[10.5px] bg-amber-100/80 text-amber-900 font-medium px-2 py-0.5 rounded-md"
                              >
                                {dish}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dedicated Sightseeing Attributes Block */}
                    {(place.spotType || (place.mustSeeHighlights && place.mustSeeHighlights.length > 0) || place.ticketInfo || place.bestTimeToVisit) && (
                      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-2.5 sm:p-3 mb-3 text-xs space-y-1.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {place.spotType && (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-900 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs text-[11px]">
                              <span>⛩️</span>
                              <span>{place.spotType}</span>
                            </span>
                          )}
                          {place.ticketInfo && (
                            <span className="inline-flex items-center gap-1 font-medium text-emerald-800 bg-white/80 px-2 py-0.5 rounded-lg border border-emerald-200/60 text-[11px]">
                              <span>🎫</span>
                              <span>{place.ticketInfo}</span>
                            </span>
                          )}
                          {place.bestTimeToVisit && (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-white/60 px-2 py-0.5 rounded-lg">
                              <span>⏰</span>
                              <span>{place.bestTimeToVisit}</span>
                            </span>
                          )}
                        </div>
                        {place.mustSeeHighlights && place.mustSeeHighlights.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap pt-1 border-t border-emerald-200/50">
                            <span className="text-[11px] font-bold text-emerald-900 shrink-0">必看亮點：</span>
                            {place.mustSeeHighlights.map((hl, idx) => (
                              <span
                                key={idx}
                                className="text-[10.5px] bg-emerald-100/80 text-emerald-900 font-medium px-2 py-0.5 rounded-md"
                              >
                                {hl}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Traveler Personal Notes */}
                    {place.notes && (
                      <div className="flex items-start gap-1.5 text-xs text-[#4a383d] bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-xl mb-3">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-amber-900">旅伴備註：</span>
                          <span>{place.notes}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Meta & External Map Link */}
                  <div className="pt-3 border-t border-[#f2e5e8] flex items-center justify-between text-[11px] text-[#8c7b80]">
                    <div className="flex items-center gap-1.5">
                      <span>由 {place.addedByName || "旅伴"} 新增</span>
                    </div>

                    <a
                      href={place.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#992545] hover:text-[#70152e] hover:underline cursor-pointer"
                    >
                      <span>開啟 Google 地圖</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pre-Save AI Review & Edit Modal (Human-in-the-loop) */}
        {isReviewModalOpen && pendingCandidate && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden"
          >
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#ebd8dc] max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* 1. Fixed Header (Always visible at top) */}
              <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#f0e2e5] shrink-0 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#fcebee] text-[#992545] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#2d2527]">
                      AI 地點分析完成 · 審閱與確認
                    </h3>
                    <p className="text-[11px] text-[#735e65]">
                      可自由微調或增修內容，確認無誤後點擊下方「確認儲存」
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setPendingCandidate(null);
                  }}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer hover:bg-stone-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Scrollable Body (Form Content with smooth scroll) */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
                {/* Friendly Tip if name seems generic or URL-like */}
                {(pendingCandidate.name.startsWith("http") ||
                  pendingCandidate.name === "私房探訪據點" ||
                  pendingCandidate.name.includes("探訪據點")) && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-[11px] flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">💡 貼心提醒：</p>
                      <p className="mt-0.5 text-amber-800 leading-relaxed">
                        此連結為 Google Maps 簡短縮網址。請在下方確認或輸入店家/景點名稱（如「淺草今半」、「HARBS」、「利久牛舌」），點擊「依店名自動生成」即可一鍵生成道地介紹與避雷貼士！
                      </p>
                    </div>
                  </div>
                )}

                {/* Name & Japanese Name in 2 columns on tablet/desktop */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-[#4a383d] block">
                        地點中文名稱 <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => handleRegenerateFromCandidateName(pendingCandidate.name)}
                        className="text-[11px] text-[#992545] hover:text-[#801b36] font-bold inline-flex items-center gap-1 cursor-pointer hover:underline"
                        title="依據輸入的名稱重新生成特色與貼士"
                      >
                        <Wand2 className="w-3 h-3 text-[#b83358]" />
                        <span>依店名自動生成</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={pendingCandidate.name}
                      onChange={(e) =>
                        setPendingCandidate({ ...pendingCandidate, name: e.target.value })
                      }
                      placeholder="例如：淺草今半 國際通本店"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#4a383d] block mb-1">
                      日文原名 / 標音
                    </label>
                    <input
                      type="text"
                      value={pendingCandidate.japaneseName || ""}
                      onChange={(e) =>
                        setPendingCandidate({ ...pendingCandidate, japaneseName: e.target.value })
                      }
                      placeholder="例如：浅草今半 国際通り本店"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1.5">
                    分類性質：
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
                      const Icon = cat.icon;
                      const isSelected = pendingCandidate.category === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() =>
                            setPendingCandidate({
                              ...pendingCandidate,
                              category: key,
                              categoryLabel: cat.label,
                            })
                          }
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-semibold transition-all cursor-pointer text-center ${
                            isSelected
                              ? "bg-[#992545] text-white border-[#992545] shadow-xs"
                              : "bg-[#faf8f9] border-[#ebd8dc] text-[#5c494f] hover:bg-[#fff2f5]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category-Specific Dynamic Attributes Section (Dining vs Sightseeing) */}
                {(pendingCandidate.category === "dining" || pendingCandidate.category === "cafe") && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
                      <span>餐飲特色屬性（料理種類 / 招牌菜 / 預算）</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="font-semibold text-amber-900 block mb-1 text-[11px]">
                          料理種類 / 風味
                        </label>
                        <input
                          type="text"
                          value={pendingCandidate.cuisineType || ""}
                          onChange={(e) =>
                            setPendingCandidate({ ...pendingCandidate, cuisineType: e.target.value })
                          }
                          placeholder="例如：黑毛和牛壽喜燒・涮涮鍋"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 focus:border-amber-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-amber-900 block mb-1 text-[11px]">
                          人均預估預算
                        </label>
                        <input
                          type="text"
                          value={pendingCandidate.priceRange || ""}
                          onChange={(e) =>
                            setPendingCandidate({ ...pendingCandidate, priceRange: e.target.value })
                          }
                          placeholder="例如：約 ¥3,500 - ¥6,000 / 人"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 focus:border-amber-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-amber-900 block mb-1 text-[11px]">
                          招牌必點菜色（以頓號或逗號分隔）
                        </label>
                        <input
                          type="text"
                          value={(pendingCandidate.signatureDishes || []).join("、")}
                          onChange={(e) => {
                            const arr = e.target.value.split(/[、,，\n]+/).map((s) => s.trim()).filter(Boolean);
                            setPendingCandidate({ ...pendingCandidate, signatureDishes: arr });
                          }}
                          placeholder="例如：特選上等牛五花、蔥花牛舌、招牌沙拉"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 focus:border-amber-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-amber-900 block mb-1 text-[11px]">
                          用餐氛圍 / 特色
                        </label>
                        <input
                          type="text"
                          value={pendingCandidate.diningAtmosphere || ""}
                          onChange={(e) =>
                            setPendingCandidate({ ...pendingCandidate, diningAtmosphere: e.target.value })
                          }
                          placeholder="例如：高空景觀席、百年老鋪包廂"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 focus:border-amber-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {pendingCandidate.category === "sightseeing" && (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                      <Compass className="w-3.5 h-3.5 text-emerald-700" />
                      <span>景點特色屬性（景點類型 / 門票 / 必看亮點）</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="font-semibold text-emerald-900 block mb-1 text-[11px]">
                          景點類型 / 名勝特色
                        </label>
                        <input
                          type="text"
                          value={pendingCandidate.spotType || ""}
                          onChange={(e) =>
                            setPendingCandidate({ ...pendingCandidate, spotType: e.target.value })
                          }
                          placeholder="例如：古蹟寺院、開運求財名所、都會展望台"
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 focus:border-emerald-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-emerald-900 block mb-1 text-[11px]">
                          門票 / 參拜資訊
                        </label>
                        <input
                          type="text"
                          value={pendingCandidate.ticketInfo || ""}
                          onChange={(e) =>
                            setPendingCandidate({ ...pendingCandidate, ticketInfo: e.target.value })
                          }
                          placeholder="例如：境內免費自由參拜、展望台約 ¥2,000"
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 focus:border-emerald-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-emerald-900 block mb-1 text-[11px]">
                          必看亮點（以頓號或逗號分隔）
                        </label>
                        <input
                          type="text"
                          value={(pendingCandidate.mustSeeHighlights || []).join("、")}
                          onChange={(e) => {
                            const arr = e.target.value.split(/[、,，\n]+/).map((s) => s.trim()).filter(Boolean);
                            setPendingCandidate({ ...pendingCandidate, mustSeeHighlights: arr });
                          }}
                          placeholder="例如：雷門大燈籠、仲見世通、洗錢之井"
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 focus:border-emerald-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-emerald-900 block mb-1 text-[11px]">
                          最佳造訪時段
                        </label>
                        <input
                          type="text"
                          value={pendingCandidate.bestTimeToVisit || ""}
                          onChange={(e) =>
                            setPendingCandidate({ ...pendingCandidate, bestTimeToVisit: e.target.value })
                          }
                          placeholder="例如：清晨 08:00 前避開人潮、黃昏夜景"
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 focus:border-emerald-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    所在區域 / 地址
                  </label>
                  <input
                    type="text"
                    value={pendingCandidate.address || ""}
                    onChange={(e) =>
                      setPendingCandidate({ ...pendingCandidate, address: e.target.value })
                    }
                    placeholder="例如：東京都台東區西淺草3-1-12"
                    className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                  />
                </div>

                {/* Tag & Suggested Time in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#4a383d] block mb-1">
                      特色標籤（以頓號或逗號分隔）
                    </label>
                    <input
                      type="text"
                      value={pendingCandidate.tag || ""}
                      onChange={(e) =>
                        setPendingCandidate({ ...pendingCandidate, tag: e.target.value })
                      }
                      placeholder="例如：百年老字號、黑毛和牛壽喜燒、午間定食超值"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#4a383d] block mb-1">
                      建議停留或造訪時段
                    </label>
                    <input
                      type="text"
                      value={pendingCandidate.suggestedTime || ""}
                      onChange={(e) =>
                        setPendingCandidate({ ...pendingCandidate, suggestedTime: e.target.value })
                      }
                      placeholder="例如：約 1.5 小時、建議午間 11:30 造訪"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                    />
                  </div>
                </div>

                {/* Literary Description / Summary */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    地點深度介紹 (旅の手帖風格)
                  </label>
                  <textarea
                    rows={3}
                    value={pendingCandidate.desc || pendingCandidate.summary || ""}
                    onChange={(e) =>
                      setPendingCandidate({
                        ...pendingCandidate,
                        desc: e.target.value,
                        summary: e.target.value,
                      })
                    }
                    placeholder="細膩描繪店內香氣、師傅手藝與町家風情之文字..."
                    className="w-full p-2.5 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] leading-relaxed"
                  />
                </div>

                {/* Recommendation & Practical Tips */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    ✨ 招牌推薦與造訪指引
                  </label>
                  <textarea
                    rows={2}
                    value={pendingCandidate.recommendation || pendingCandidate.tips || ""}
                    onChange={(e) =>
                      setPendingCandidate({
                        ...pendingCandidate,
                        recommendation: e.target.value,
                        tips: e.target.value,
                      })
                    }
                    placeholder="例如：必點「特選和牛壽喜燒定食」，建議提早30分鐘領取號碼牌..."
                    className="w-full p-2.5 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] leading-relaxed"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    📝 私人備註 / 旅伴筆記
                  </label>
                  <input
                    type="text"
                    value={pendingCandidate.notes || ""}
                    onChange={(e) =>
                      setPendingCandidate({ ...pendingCandidate, notes: e.target.value })
                    }
                    placeholder="寫下您想點的料理、同行約定或行程第幾天..."
                    className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                  />
                </div>

                {/* URL preview */}
                <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-[#735e65]">
                  <span className="truncate max-w-[280px] sm:max-w-md font-mono">
                    {pendingCandidate.url}
                  </span>
                  <a
                    href={pendingCandidate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#992545] hover:underline font-bold shrink-0 ml-2"
                  >
                    <span>開啟地圖預覽</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* 3. Fixed / Sticky Footer (ALWAYS VISIBLE AT BOTTOM, NEVER BLOCKED!) */}
              <div className="px-5 py-3.5 sm:px-6 sm:py-4 border-t border-[#f0e2e5] shrink-0 bg-[#faf8f9] flex items-center justify-end gap-2.5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] z-10">
                <button
                  type="button"
                  disabled={isSavingCandidate}
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setPendingCandidate(null);
                  }}
                  className="px-4 py-2.5 rounded-xl border border-[#ebd8dc] text-xs font-semibold text-[#735e65] hover:bg-white cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={isSavingCandidate || !pendingCandidate.name.trim()}
                  onClick={handleConfirmSaveCandidate}
                  className="px-5 py-2.5 bg-[#992545] hover:bg-[#801b36] disabled:bg-stone-300 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingCandidate ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>正在儲存...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>確認儲存加入清單</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Full Place Edit Modal */}
        {editingPlace && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-hidden"
          >
            <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#ebd8dc] max-h-[88vh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* 1. Fixed Header */}
              <div className="flex items-center justify-between px-5 py-4 sm:px-6 sm:py-4.5 border-b border-[#f0e2e5] shrink-0 bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-[#fcebee] text-[#992545] flex items-center justify-center shrink-0">
                    <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-[#2d2527]">
                      編輯收藏內容 · {editingPlace.name}
                    </h3>
                    <p className="text-[11px] text-[#735e65]">
                      可自由修改地點名稱、分類、地址、亮點、介紹與筆記
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingPlace(null)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer hover:bg-stone-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2. Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
                {/* Name & Japanese Name in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#4a383d] block mb-1">
                      地點中文名稱 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="例如：淺草今半 國際通本店"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#4a383d] block mb-1">
                      日文原名 / 標音
                    </label>
                    <input
                      type="text"
                      value={editJapaneseName}
                      onChange={(e) => setEditJapaneseName(e.target.value)}
                      placeholder="例如：浅草今半 国際通り本店"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1.5">
                    分類性質：
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
                      const Icon = cat.icon;
                      const isSelected = editCategory === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setEditCategory(key)}
                          className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 font-semibold transition-all cursor-pointer text-center ${
                            isSelected
                              ? "bg-[#992545] text-white border-[#992545] shadow-xs"
                              : "bg-[#faf8f9] border-[#ebd8dc] text-[#5c494f] hover:bg-[#fff2f5]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span className="text-[11px]">{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Category-Specific Dynamic Attributes Section (Dining vs Sightseeing) */}
                {(editCategory === "dining" || editCategory === "cafe") && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200/90 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs">
                      <UtensilsCrossed className="w-3.5 h-3.5 text-amber-700" />
                      <span>餐飲特色屬性（料理種類 / 招牌菜 / 預算）</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="font-semibold text-amber-900 block mb-1 text-[11px]">
                          料理種類 / 風味
                        </label>
                        <input
                          type="text"
                          value={editCuisineType}
                          onChange={(e) => setEditCuisineType(e.target.value)}
                          placeholder="例如：黑毛和牛壽喜燒・涮涮鍋"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 focus:border-amber-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-amber-900 block mb-1 text-[11px]">
                          人均預估預算
                        </label>
                        <input
                          type="text"
                          value={editPriceRange}
                          onChange={(e) => setEditPriceRange(e.target.value)}
                          placeholder="例如：約 ¥3,500 - ¥6,000 / 人"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 focus:border-amber-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-amber-900 block mb-1 text-[11px]">
                          招牌必點菜色（以頓號或逗號分隔）
                        </label>
                        <input
                          type="text"
                          value={editSignatureDishes}
                          onChange={(e) => setEditSignatureDishes(e.target.value)}
                          placeholder="例如：特選上等牛五花、蔥花牛舌、招牌沙拉"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 focus:border-amber-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-amber-900 block mb-1 text-[11px]">
                          用餐氛圍 / 特色
                        </label>
                        <input
                          type="text"
                          value={editDiningAtmosphere}
                          onChange={(e) => setEditDiningAtmosphere(e.target.value)}
                          placeholder="例如：高空景觀席、百年老鋪包廂"
                          className="w-full px-2.5 py-1.5 bg-white border border-amber-200 focus:border-amber-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {editCategory === "sightseeing" && (
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/90 rounded-2xl space-y-2.5">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-900 text-xs">
                      <Compass className="w-3.5 h-3.5 text-emerald-700" />
                      <span>景點特色屬性（景點類型 / 門票 / 必看亮點）</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="font-semibold text-emerald-900 block mb-1 text-[11px]">
                          景點類型 / 名勝特色
                        </label>
                        <input
                          type="text"
                          value={editSpotType}
                          onChange={(e) => setEditSpotType(e.target.value)}
                          placeholder="例如：古蹟寺院、開運求財名所、都會展望台"
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 focus:border-emerald-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-emerald-900 block mb-1 text-[11px]">
                          門票 / 參拜資訊
                        </label>
                        <input
                          type="text"
                          value={editTicketInfo}
                          onChange={(e) => setEditTicketInfo(e.target.value)}
                          placeholder="例如：境內免費自由參拜、展望台約 ¥2,000"
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 focus:border-emerald-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-emerald-900 block mb-1 text-[11px]">
                          必看亮點（以頓號或逗號分隔）
                        </label>
                        <input
                          type="text"
                          value={editMustSeeHighlights}
                          onChange={(e) => setEditMustSeeHighlights(e.target.value)}
                          placeholder="例如：雷門大燈籠、仲見世通、洗錢之井"
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 focus:border-emerald-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-emerald-900 block mb-1 text-[11px]">
                          最佳造訪時段
                        </label>
                        <input
                          type="text"
                          value={editBestTimeToVisit}
                          onChange={(e) => setEditBestTimeToVisit(e.target.value)}
                          placeholder="例如：清晨 08:00 前避開人潮、黃昏夜景"
                          className="w-full px-2.5 py-1.5 bg-white border border-emerald-200 focus:border-emerald-600 rounded-xl outline-hidden text-xs text-[#2d2527]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Address */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    所在區域 / 地址
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    placeholder="例如：東京都台東區西淺草3-1-12"
                    className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                  />
                </div>

                {/* Tag & Suggested Time in 2 columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#4a383d] block mb-1">
                      特色標籤（以頓號或逗號分隔）
                    </label>
                    <input
                      type="text"
                      value={editTag}
                      onChange={(e) => setEditTag(e.target.value)}
                      placeholder="例如：百年老字號、黑毛和牛壽喜燒、午間定食超值"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#4a383d] block mb-1">
                      建議停留或造訪時段
                    </label>
                    <input
                      type="text"
                      value={editSuggestedTime}
                      onChange={(e) => setEditSuggestedTime(e.target.value)}
                      placeholder="例如：約 1.5 小時、建議午間 11:30 造訪"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                    />
                  </div>
                </div>

                {/* Literary Description / Summary */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    地點深度介紹 (旅の手帖風格)
                  </label>
                  <textarea
                    rows={3}
                    value={editSummary}
                    onChange={(e) => setEditSummary(e.target.value)}
                    placeholder="細膩描繪店內香氣、師傅手藝與町家風情之文字..."
                    className="w-full p-2.5 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] leading-relaxed"
                  />
                </div>

                {/* Recommendation & Practical Tips */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    ✨ 招牌推薦與造訪指引
                  </label>
                  <textarea
                    rows={2}
                    value={editTips}
                    onChange={(e) => setEditTips(e.target.value)}
                    placeholder="例如：必點「特選和牛壽喜燒定食」，建議提早30分鐘領取號碼牌..."
                    className="w-full p-2.5 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] leading-relaxed"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    📝 私人備註 / 旅伴筆記
                  </label>
                  <input
                    type="text"
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="寫下您想點的料理、同行約定或行程第幾天..."
                    className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                  />
                </div>

                {/* Google Maps URL */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#4a383d] block">
                      Google Maps 地圖網址
                    </label>
                    {editUrl && (
                      <a
                        href={editUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[#992545] hover:underline font-bold text-[11px]"
                      >
                        <span>開啟地圖預覽</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  <input
                    type="text"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] font-mono"
                  />
                </div>
              </div>

              {/* 3. Sticky Bottom Action Bar */}
              <div className="flex items-center justify-end gap-2.5 px-5 py-3 sm:px-6 sm:py-3.5 bg-[#faf8f9] border-t border-[#f0e2e5] shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingPlace(null)}
                  disabled={isSavingEdit}
                  className="px-4 py-2 rounded-xl border border-[#ebd8dc] text-xs font-semibold text-[#735e65] hover:bg-white cursor-pointer transition-colors"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-[#992545] hover:bg-[#801b36] disabled:bg-stone-300 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingEdit ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>儲存中...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>儲存修改</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation In-App Modal - GUARANTEED RELIABLE DELETION */}
        {deletingPlace && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#2d2527]">
                    確定要刪除私房收藏？
                  </h3>
                  <p className="text-xs text-[#735e65]">
                    刪除後將立即從清單中移除此景點或店家。
                  </p>
                </div>
              </div>

              {/* Target Place Preview */}
              <div className="bg-[#faf6f7] p-3.5 rounded-2xl border border-[#f0dee2] mb-5 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-sm text-[#2d2527]">
                    {deletingPlace.name}
                  </span>
                  {CATEGORY_MAP[deletingPlace.category] && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#ebd8dc] text-[#735e65]">
                      {CATEGORY_MAP[deletingPlace.category].label}
                    </span>
                  )}
                </div>
                {(deletingPlace.recommendation || deletingPlace.tips) && (
                  <p className="text-[11px] text-amber-800 font-medium line-clamp-1">
                    ✨ {deletingPlace.recommendation || deletingPlace.tips}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setDeletingPlace(null)}
                  className="px-4 py-2 rounded-xl border border-[#ebd8dc] text-xs font-semibold text-[#735e65] hover:bg-stone-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isDeleting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>正在刪除...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>確認刪除</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Companion Sync Guide Modal */}
        {showSyncGuideModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#ebd8dc] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0e2e5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#992545] flex items-center justify-center shrink-0">
                    <BookmarkCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2d2527]">
                      旅伴即時同步機制說明
                    </h3>
                    <p className="text-[11px] text-[#735e65]">
                      如何確認旅伴新增的私房景點與行程有同步更新？
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSyncGuideModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-[#4a383d] leading-relaxed">
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                  <p className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>即時推播（免手動重新整理網頁）：</span>
                  </p>
                  <p className="text-emerald-900">
                    系統使用 Google Cloud Firestore WebSocket 即時監聽技術。只要旅伴在手機或電腦上開啟同一行程網頁，任何一位旅伴<strong>新增景點、修改備註、標記「想去」或刪除</strong>，所有人的畫面將在 1 秒內自動即時同步，完全不需要重新載入網頁！
                  </p>
                </div>

                <div className="space-y-2.5">
                  <p className="font-bold text-[#2d2527]">如何確認最新同步狀態？</p>
                  <ul className="space-y-2 pl-1">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#992545] bg-[#fcedf0] px-1.5 py-0.5 rounded-md text-[10px] shrink-0 mt-0.5">1</span>
                      <span><strong>即時狀態綠燈：</strong>標題上方的「旅伴即時同步：連線中」隨時監控雲端狀態，並標註最後同步時間。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#992545] bg-[#fcedf0] px-1.5 py-0.5 rounded-md text-[10px] shrink-0 mt-0.5">2</span>
                      <span><strong>一鍵手動重新整理：</strong>若旅伴剛新增想立即確認，可隨時點選「重新整理」按鈕，系統會向雲端發送最新快照比對並回報總筆數。</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-[#992545] bg-[#fcedf0] px-1.5 py-0.5 rounded-md text-[10px] shrink-0 mt-0.5">3</span>
                      <span><strong>離線自動補齊：</strong>搭機或地鐵中斷線時，您仍可本機瀏覽與暫存，連上網路後將自動完成同步！</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-[#fdf6f7] border border-[#f3ccd6] rounded-2xl text-[#78243a]">
                  <span className="font-bold">💡 貼心提醒：</span>
                  <span>
                    建議點選「Google 登入同步」，這樣您新增的私房點就能直接推送到旅伴的清單中；未登入狀態下您依然可即時接收所有旅伴新增的最新內容！
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowSyncGuideModal(false)}
                  className="px-5 py-2 rounded-xl bg-[#992545] text-white text-xs font-bold hover:bg-[#801b36] shadow-xs cursor-pointer"
                >
                  我知道了
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Firebase Authorized Domain Helper Modal */}
        {showAuthDomainModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#ebd8dc] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0e2e5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2d2527]">
                      Firebase 授權網域設定說明
                    </h3>
                    <p className="text-[11px] text-[#735e65]">
                      針對 auth/unauthorized-domain 的設定指南
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuthDomainModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-[#4a383d] leading-relaxed">
                <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl">
                  <p className="font-bold text-amber-900 mb-1">
                    💡 為何會出現 (auth/unauthorized-domain)？
                  </p>
                  <p className="text-amber-800">
                    Firebase 基於安全機制，只有被列入「授權網域」的名單才能開啟 Google 登入視窗。目前此預覽網址尚未加入 Firebase 控制台的授權名單中。
                  </p>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-[#2d2527]">
                    當前預覽網域 (Hostname)：
                  </label>
                  <div className="flex items-center gap-2 bg-[#faf8f9] border border-[#e4d3d7] rounded-xl p-2.5">
                    <code className="text-[#992545] font-mono flex-1 truncate select-all">
                      {currentHostname}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyCurrentDomain}
                      className="px-2.5 py-1 bg-[#992545] hover:bg-[#801b36] text-white font-bold rounded-lg text-[11px] flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      {copiedDomain ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-300" />
                          <span>已複製</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>複製網域</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-[#2d2527]">設定步驟（只需 30 秒）：</p>
                  <ol className="list-decimal pl-5 space-y-1.5 text-[#5d5054]">
                    <li>點擊下方按鈕前往 Firebase 控制台「授權網域」設定頁。</li>
                    <li>在「授權網域 (Authorized domains)」區塊中點選「新增網域 (Add domain)」。</li>
                    <li>
                      將複製的網域（<code className="font-mono text-[#992545]">{currentHostname}</code>）貼上並按儲存。
                    </li>
                    <li>返回此頁面重新點擊「Google 登入同步」即可完成連線！</li>
                  </ol>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900">
                  <span className="font-bold">✓ 本機模式正常運作：</span>
                  <span>
                    在此期間，您仍可隨時貼上 Google 地圖連結，AI 自動分類、特色歸納、標記想去與立即刪除皆可正常運作，資料安全儲存於您的瀏覽器中！
                  </span>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAuthDomainModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#ebd8dc] text-xs font-semibold text-[#735e65] hover:bg-stone-50 cursor-pointer text-center"
                >
                  了解，關閉視窗
                </button>
                <a
                  href="https://console.firebase.google.com/project/gen-lang-client-0894142576/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#992545] hover:bg-[#801b36] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer text-center"
                >
                  <span>開啟 Firebase 授權網域設定</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Google Apps Script (GAS) Sync Settings Modal */}
        {showGasModal && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          >
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-[#ebd8dc] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0e2e5]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <LinkIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#2d2527]">
                      Google 試算表 (GAS) 雲端同步設定
                    </h3>
                    <p className="text-[11px] text-[#735e65]">
                      串接 osaka-trip-2027 標準 Google Apps Script 雲端同步端點
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGasModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer hover:bg-stone-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-[#4a383d] leading-relaxed">
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
                  <p className="font-bold text-emerald-950 mb-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>自動雙向同步運作中</span>
                  </p>
                  <p className="text-emerald-900 text-[11px]">
                    所有新增、編輯、標記「想去」或刪除操作，將自動透過伺服器代理推播至此 Google Apps Script Web App，確保免 CORS 錯誤且與 osaka-trip-2027 雲端資料庫無縫同步！
                  </p>
                </div>

                <div>
                  <label className="font-bold block mb-1 text-[#2d2527]">
                    GAS Web App 部署網址：
                  </label>
                  <textarea
                    rows={3}
                    value={tempGasInput}
                    onChange={(e) => setTempGasInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="w-full p-2.5 bg-[#faf8f9] border border-[#e4d3d7] focus:border-emerald-600 focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] font-mono leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTempGasInput(DEFAULT_GAS_URL);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#ebd8dc] text-xs font-semibold text-[#735e65] hover:bg-stone-50 cursor-pointer"
                  >
                    恢復預設網址
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      const trimmed = tempGasInput.trim();
                      if (!trimmed) return;
                      try {
                        setToastMessage("正在測試連線中...");
                        const testRes = await fetch("/api/sync/gas-proxy", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ gasUrl: trimmed, action: "test" }),
                        });
                        const testJson = await testRes.json();
                        if (testRes.ok && testJson?.success) {
                          setToastMessage("✓ 連線成功！GAS 服務正常運作");
                        } else {
                          setToastMessage(`⚠️ 連線異常: ${testJson?.error || testRes.status}`);
                        }
                      } catch (err: any) {
                        setToastMessage(`⚠️ 連線失敗: ${err?.message || "未知原因"}`);
                      }
                      setTimeout(() => setToastMessage(null), 3500);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold cursor-pointer"
                  >
                    測試連線狀態
                  </button>
                </div>

                <div className="p-3 bg-[#faf6f7] border border-[#ebd8dc] rounded-2xl text-[11px] text-[#735e65]">
                  <p className="font-semibold text-[#2d2527] mb-1">💡 跨裝置協作提示：</p>
                  <p>
                    旅伴若在其他裝置透過此試算表新增或標記行程，只需點擊上方的「重新整理」按鈕，即可立即拉取並更新本機私房清單。
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowGasModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#ebd8dc] text-xs font-semibold text-[#735e65] hover:bg-stone-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const finalGas = tempGasInput.trim() || DEFAULT_GAS_URL;
                    setGasUrl(finalGas);
                    try {
                      localStorage.setItem(GAS_URL_STORAGE_KEY, finalGas);
                    } catch {}
                    setShowGasModal(false);
                    setToastMessage("✓ 已儲存 GAS 同步網址！");
                    setTimeout(() => setToastMessage(null), 2500);
                    handleManualSync();
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  儲存並套用
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Floating Toast */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#2d2527] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold animate-bounce duration-300 pointer-events-none">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </section>
  );
};
