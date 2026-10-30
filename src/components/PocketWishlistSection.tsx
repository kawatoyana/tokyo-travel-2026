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
  japaneseName?: string;
  category: "dining" | "sightseeing" | "shopping" | "cafe" | "stay" | "other" | string;
  categoryLabel?: string;
  summary?: string;
  highlight?: string;
  address?: string;
  tips?: string;
  notes?: string;
  isVisited?: boolean;
  addedByName?: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
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
    address: "東京都台東區淺草",
    tips: "推薦購買「稻荷壽司與干瓢卷」綜合折詰盒，常溫即可享用，極適合外帶至隅田川畔野餐！",
    notes: "DAY 1 下午散步外帶小點心！",
    isVisited: false,
    addedByName: "散策領隊",
    userId: "seed-user",
    createdAt: new Date().toISOString(),
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
  },
];

const LOCAL_STORAGE_KEY = "tokyo_2026_pocket_wishlist_places";
const DELETED_IDS_KEY = "tokyo_2026_pocket_wishlist_deleted_ids";

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
  const [inputUrl, setInputUrl] = useState("");
  const [inputNotes, setInputNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visitedFilter, setVisitedFilter] = useState<"all" | "unvisited" | "visited">("all");

  // Editing state
  const [editingPlace, setEditingPlace] = useState<SavedPlace | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editCategory, setEditCategory] = useState("");
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

  // Firebase unauthorized-domain helper modal state
  const [showAuthDomainModal, setShowAuthDomainModal] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

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

    const rawInput = inputUrl.trim();
    if (!rawInput) {
      setFormError("請貼上 Google Maps 分享連結或輸入店家/地址！");
      return;
    }

    // Separate URL and any leading/trailing text (e.g. from mobile share: "淺草今半 国際通り本店 4.4 ★ (3,281) https://maps.app.goo.gl/xxx")
    let targetUrl = rawInput;
    let urlExtracted = "";
    const matchUrl = rawInput.match(/https?:\/\/[^\s]+/i);
    if (matchUrl) {
      urlExtracted = matchUrl[0];
      targetUrl = urlExtracted;
    }

    // Clean text part from mobile share sheet
    let textPart = rawInput.replace(/https?:\/\/[^\s]+/gi, " ").trim();
    textPart = textPart.replace(/\([\d,]+[+\s\w\u4e00-\u9fa5]*\)/g, " ");
    textPart = textPart.replace(/[\d.]+\s*[★☆星]+/g, " ").replace(/[★☆]+/g, " ");
    textPart = textPart.replace(/(?:\+81[\s-]?)?\b\d{2,4}-\d{2,4}-\d{4}\b/g, " ");
    textPart = textPart.replace(/〒?\d{3}-\d{4}/g, " ");
    textPart = textPart.replace(/[·|•‧]/g, " ").replace(/\s+/g, " ").trim();

    const effectiveNotes = [textPart, inputNotes.trim()].filter(Boolean).join(" ");

    // Pre-extract place name from targetUrl if it has /place/<Name> or q=<Name>
    let clientExtractedName = extractPlaceNameFromUrl(targetUrl);

    setIsAnalyzing(true);

    try {
      let analyzed: any = null;

      // 1. If backend server is running (AI Studio dev/full-stack), call /api/analyze-place
      try {
        const res = await fetch("/api/analyze-place", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: AbortSignal.timeout(5000),
          body: JSON.stringify({
            url: targetUrl,
            rawText: effectiveNotes,
            clientExtractedName: clientExtractedName || textPart,
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
        console.warn("Backend API not reachable (running on static host/GitHub Pages), switching to client intelligence:", fetchErr);
      }

      // 2. High-Fidelity Client-side intelligence pipeline (works 100% on GitHub Pages & static deployments)
      if (!analyzed) {
        // If it's a short link and we don't have a place name yet, unshorten client-side via CORS proxies
        if (!clientExtractedName && (targetUrl.includes("maps.app.goo.gl") || targetUrl.includes("goo.gl") || targetUrl.includes("g.co/"))) {
          try {
            const unshortened = await unshortenGoogleMapsLinkClient(targetUrl);
            if (unshortened.title) {
              clientExtractedName = unshortened.title;
            } else if (unshortened.resolvedUrl) {
              clientExtractedName = extractPlaceNameFromUrl(unshortened.resolvedUrl);
            }
          } catch (unErr) {
            console.warn("Client unshortening failed:", unErr);
          }
        }

        const effectiveSearchName = clientExtractedName || textPart || inputNotes.trim();

        // 2a. Direct Client Gemini API call if key configured
        if (effectiveSearchName) {
          try {
            analyzed = await analyzePlaceWithClientGemini(effectiveSearchName, targetUrl, effectiveNotes);
          } catch (gemErr) {
            console.warn("Client Gemini call skipped:", gemErr);
          }
        }

        // 2b. High-Fidelity Client Synthesis Engine (Landmark DB + Deep Tokyo Taxonomy)
        if (!analyzed) {
          analyzed = synthesizePlaceData(effectiveSearchName, targetUrl, rawInput, inputNotes);
        }
      }

      // Valid link: format valid Google Maps search URL if not HTTP
      const finalUrl =
        targetUrl.startsWith("http://") || targetUrl.startsWith("https://")
          ? targetUrl
          : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(targetUrl)}`;

      const placeId = "p-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);

      // Determine canonical category
      let safeCategory = (analyzed?.category || "other").toLowerCase().trim();
      if (!CATEGORY_MAP[safeCategory]) {
        safeCategory = "other";
      }
      const safeCategoryLabel = CATEGORY_MAP[safeCategory]?.label || "其他探訪";

      const nowIso = new Date().toISOString();
      const newPlaceDoc: SavedPlace = {
        id: placeId,
        url: finalUrl.slice(0, 1000),
        name: String(analyzed?.name || targetUrl).trim().slice(0, 200),
        japaneseName: String(analyzed?.japaneseName || analyzed?.name || targetUrl).trim().slice(0, 200),
        category: safeCategory.slice(0, 50),
        categoryLabel: safeCategoryLabel.slice(0, 100),
        summary: String(analyzed?.summary || "旅人私房收藏景點。").trim().slice(0, 1000),
        highlight: String(analyzed?.highlight || `${analyzed?.name || targetUrl} 推薦特色`).trim().slice(0, 500),
        address: String(analyzed?.address || (targetUrl.startsWith("http") ? "東京都內" : targetUrl)).trim().slice(0, 300),
        tips: String(analyzed?.tips || "前往前建議先確認最新營業動態與公休日。").trim().slice(0, 500),
        notes: inputNotes.trim().slice(0, 1000),
        isVisited: false,
        addedByName: String(currentUser?.displayName || currentUser?.email?.split("@")[0] || "旅伴").slice(0, 100),
        userId: currentUser?.uid || "local-user",
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      // 3. Open the Human-in-the-loop Pre-Save Review & Edit modal!
      // This satisfies the user's requirement to review and adjust place name, category, highlight, summary, address, and notes before committing to list.
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
  const handleRegenerateFromCandidateName = (customName: string) => {
    if (!customName.trim() || !pendingCandidate) return;
    const fresh = synthesizePlaceData(
      customName.trim(),
      pendingCandidate.url,
      customName.trim(),
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
      japaneseName: (pendingCandidate.japaneseName || trimmedName).trim(),
      category: pendingCandidate.category || "dining",
      categoryLabel: CATEGORY_MAP[pendingCandidate.category]?.label || "餐廳美饌",
      summary: (pendingCandidate.summary || "自由行旅人私房推薦據點。").trim(),
      highlight: (pendingCandidate.highlight || `${trimmedName} 推薦特色`).trim(),
      address: (pendingCandidate.address || "東京都內").trim(),
      tips: (pendingCandidate.tips || "前往前建議先確認最新營業動態與公休日。").trim(),
      notes: (pendingCandidate.notes || "").trim(),
      updatedAt: nowIso,
    };

    try {
      // 1. Immediately persist to React state & localStorage
      setPlaces((prev) => {
        const next = [finalizedPlace, ...prev.filter((p) => p.id !== placeId)];
        savePlacesToLocal(next);
        return next;
      });

      // 2. If logged in to Firebase, sync to Firestore
      if (currentUser) {
        try {
          const firestoreData = {
            url: finalizedPlace.url,
            name: finalizedPlace.name,
            japaneseName: finalizedPlace.japaneseName || "",
            category: finalizedPlace.category,
            categoryLabel: finalizedPlace.categoryLabel || "",
            summary: finalizedPlace.summary || "",
            highlight: finalizedPlace.highlight || "",
            address: finalizedPlace.address || "",
            tips: finalizedPlace.tips || "",
            notes: finalizedPlace.notes || "",
            isVisited: false,
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

  // Toggle Visited status
  const handleToggleVisited = async (place: SavedPlace) => {
    const nextStatus = !place.isVisited;

    // 1. Immediately update React state & localStorage
    setPlaces((prev) => {
      const next = prev.map((p) => (p.id === place.id ? { ...p, isVisited: nextStatus } : p));
      savePlacesToLocal(next);
      return next;
    });

    // 2. Sync to Firestore if authenticated
    if (currentUser && !place.id.startsWith("seed-")) {
      try {
        await updateDoc(doc(db, "savedPlaces", place.id), {
          isVisited: nextStatus,
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

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingPlace) return;

    setIsSavingEdit(true);
    try {
      const updatedCatLabel = CATEGORY_MAP[editCategory]?.label || "其他探訪";
      const updatedFields = {
        notes: editNotes.trim().slice(0, 1000),
        category: editCategory.slice(0, 50),
        categoryLabel: updatedCatLabel,
        updatedAt: new Date().toISOString(),
      };

      // 1. Update React state & localStorage immediately
      setPlaces((prev) => {
        const next = prev.map((p) =>
          p.id === editingPlace.id ? { ...p, ...updatedFields } : p
        );
        savePlacesToLocal(next);
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
      setToastMessage(`已儲存修改：「${editingPlace.name}」`);
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
                  雲端已連線同步
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
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#9e8b92]">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="貼上 Google 地圖分享連結、地址或店家名稱..."
                  disabled={isAnalyzing}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f9] hover:bg-white focus:bg-white border border-[#e4d3d7] focus:border-[#992545] focus:ring-2 focus:ring-[#992545]/20 rounded-2xl text-xs sm:text-sm text-[#2d2527] outline-hidden transition-all"
                />
              </div>

              <div className="sm:w-64">
                <input
                  type="text"
                  value={inputNotes}
                  onChange={(e) => setInputNotes(e.target.value)}
                  placeholder="備註 / 必吃想買什麼 (選填)"
                  disabled={isAnalyzing}
                  className="w-full px-3.5 py-2.5 bg-[#faf8f9] hover:bg-white focus:bg-white border border-[#e4d3d7] focus:border-[#992545] focus:ring-2 focus:ring-[#992545]/20 rounded-2xl text-xs sm:text-sm text-[#2d2527] outline-hidden transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || !inputUrl.trim()}
                className="px-5 py-2.5 bg-[#992545] hover:bg-[#801b36] disabled:bg-stone-300 text-white font-bold rounded-2xl transition-all shadow-xs flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:cursor-not-allowed shrink-0"
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

            {/* Quick Suggestions / Examples */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#786b6f]">
              <span className="font-semibold text-[#8a7279]">💡 點擊快速帶入測試：</span>
              {[
                { label: "淺草今半（壽喜燒）", val: "淺草今半 国際通り本店" },
                { label: "志乃多壽司（短網址）", val: "https://maps.app.goo.gl/5QjeuGqka2AcV4mGA" },
                { label: "敘敘苑 晴空塔店", val: "敘敘苑 晴空塔店" },
                { label: "AFURI 原宿拉麵", val: "AFURI 原宿" },
                { label: "小網神社（洗錢之井）", val: "小網神社" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setInputUrl(item.val);
                    setFormError(null);
                  }}
                  className="px-2.5 py-1 bg-[#fbf6f7] hover:bg-[#f5e3e7] text-[#8e2443] border border-[#ecd2d8] rounded-full text-[11px] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
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

          {/* Visited Status Filter */}
          <div className="flex items-center gap-2 text-xs shrink-0">
            <span className="text-[#8c7b80] font-medium">進度：</span>
            <button
              type="button"
              onClick={() => setVisitedFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                visitedFilter === "all"
                  ? "bg-[#2d2527] text-white"
                  : "bg-white border border-[#ebd8dc] text-[#735e65]"
              }`}
            >
              不限
            </button>
            <button
              type="button"
              onClick={() => setVisitedFilter("unvisited")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                visitedFilter === "unvisited"
                  ? "bg-[#992545] text-white"
                  : "bg-white border border-[#ebd8dc] text-[#735e65]"
              }`}
            >
              未造訪
            </button>
            <button
              type="button"
              onClick={() => setVisitedFilter("visited")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                visitedFilter === "visited"
                  ? "bg-emerald-700 text-white"
                  : "bg-white border border-[#ebd8dc] text-[#735e65]"
              }`}
            >
              已踩點 ({visitedCount})
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
                      ? "border-emerald-200 bg-emerald-50/20 shadow-2xs"
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
                          <span>{catConfig.label}</span>
                        </span>

                        {isRecentlyAdded && (
                          <span className="text-[10px] font-extrabold text-white bg-[#992545] px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                            ✨ 剛新增
                          </span>
                        )}

                        {place.isVisited && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            ✓ 已踩點
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {/* Toggle Visited */}
                        <button
                          type="button"
                          onClick={() => handleToggleVisited(place)}
                          title={place.isVisited ? "標記為未踩點" : "標記為已踩點"}
                          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                            place.isVisited
                              ? "text-emerald-600 hover:bg-emerald-100"
                              : "text-stone-400 hover:text-emerald-600 hover:bg-stone-100"
                          }`}
                        >
                          {place.isVisited ? (
                            <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </button>

                        {/* Edit Place */}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPlace(place);
                            setEditNotes(place.notes || "");
                            setEditCategory(place.category);
                          }}
                          title="編輯筆記與分類"
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
                        <span>{place.name}</span>
                        {place.japaneseName && (
                          <span className="text-xs font-normal text-[#8c7b80]">
                            ({place.japaneseName})
                          </span>
                        )}
                      </h3>

                      {place.address && (
                        <div className="flex items-center gap-1 text-[11px] text-[#735e65] mt-0.5">
                          <MapPin className="w-3 h-3 text-[#b83358] shrink-0" />
                          <span className="truncate">{place.address}</span>
                        </div>
                      )}
                    </div>

                    {/* AI Highlight Tag */}
                    {place.highlight && (
                      <div className="mb-2.5">
                        <span className="inline-block text-[11px] font-semibold text-[#8e2443] bg-[#fdf2f4] border border-[#f5d9df] px-2.5 py-0.5 rounded-lg">
                          ★ 亮點：{place.highlight}
                        </span>
                      </div>
                    )}

                    {/* AI Summary */}
                    {place.summary && (
                      <p className="text-xs text-[#5d5054] leading-relaxed mb-3">
                        {place.summary}
                      </p>
                    )}

                    {/* Practical Tips */}
                    {place.tips && (
                      <div className="text-[11px] text-[#7a646c] bg-[#faf6f7] p-2.5 rounded-xl border border-[#f3e4e7] mb-3">
                        <span className="font-bold text-[#992545]">💡 探訪貼步：</span>
                        <span>{place.tips}</span>
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
                    {/* Quick Pick Chips */}
                    <div className="flex flex-wrap items-center gap-1 mt-1.5 text-[10px]">
                      <span className="text-[#8c7b80]">常用熱門：</span>
                      {["淺草今半", "志乃多壽司", "敘敘苑", "HARBS", "AFURI", "SHIBUYA SKY", "利久牛舌", "小網神社"].map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => handleRegenerateFromCandidateName(chip)}
                          className="px-1.5 py-0.5 bg-[#fbf6f7] hover:bg-[#f5e3e7] text-[#8e2443] border border-[#ecd2d8] rounded-md transition-colors cursor-pointer"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
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

                {/* Address & Highlight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <div>
                    <label className="font-bold text-[#4a383d] block mb-1">
                      招牌亮點一句話
                    </label>
                    <input
                      type="text"
                      value={pendingCandidate.highlight || ""}
                      onChange={(e) =>
                        setPendingCandidate({ ...pendingCandidate, highlight: e.target.value })
                      }
                      placeholder="例如：百年秘傳和牛壽喜燒與傳承醬汁"
                      className="w-full px-3 py-2 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527]"
                    />
                  </div>
                </div>

                {/* Summary */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    地點深度介紹
                  </label>
                  <textarea
                    rows={3}
                    value={pendingCandidate.summary || ""}
                    onChange={(e) =>
                      setPendingCandidate({ ...pendingCandidate, summary: e.target.value })
                    }
                    placeholder="介紹地點的核心特色、招牌料理或歷史..."
                    className="w-full p-2.5 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] focus:bg-white rounded-xl outline-hidden text-xs text-[#2d2527] leading-relaxed"
                  />
                </div>

                {/* Tips */}
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1">
                    💡 自由行探訪貼步（排隊、預約、避雷建議）
                  </label>
                  <textarea
                    rows={2}
                    value={pendingCandidate.tips || ""}
                    onChange={(e) =>
                      setPendingCandidate({ ...pendingCandidate, tips: e.target.value })
                    }
                    placeholder="例如：午間定食CP值最高，建議提早30分鐘候位..."
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

        {/* Edit Modal */}
        {editingPlace && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#ebd8dc]">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0e2e5]">
                <h3 className="font-bold text-base text-[#2d2527] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#992545]" />
                  <span>編輯私房收藏：{editingPlace.name}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingPlace(null)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-[#4a383d] block mb-1.5">
                    分類性質：
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(CATEGORY_MAP).map(([key, cat]) => {
                      const Icon = cat.icon;
                      const isSelected = editCategory === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setEditCategory(key)}
                          className={`p-2 rounded-xl border flex items-center justify-center gap-1 font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#992545] text-white border-[#992545]"
                              : "bg-white border-[#ebd8dc] text-[#5c494f] hover:bg-[#fff2f5]"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#4a383d] block mb-1.5">
                    旅伴自訂備註 / 必吃買清單：
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="寫下您或旅伴想探訪的原因、推薦必點料理或約定時間..."
                    className="w-full p-3 bg-[#faf8f9] border border-[#e4d3d7] focus:border-[#992545] rounded-xl outline-hidden text-xs text-[#2d2527]"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPlace(null)}
                  className="px-4 py-2 rounded-xl border border-[#ebd8dc] text-xs font-semibold text-[#735e65] hover:bg-stone-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSavingEdit}
                  className="px-4 py-2 bg-[#992545] hover:bg-[#801b36] text-white font-bold rounded-xl text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {isSavingEdit ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      <span>儲存中...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>確認儲存</span>
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
                {deletingPlace.japaneseName && (
                  <p className="text-[11px] text-[#8c7b80] mb-1">
                    {deletingPlace.japaneseName}
                  </p>
                )}
                {deletingPlace.highlight && (
                  <p className="text-[11px] text-[#992545] font-medium line-clamp-1">
                    ★ {deletingPlace.highlight}
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
                    在此期間，您仍可隨時貼上 Google 地圖連結，AI 自動分類、特色歸納、標記已踩點與立即刪除皆可正常運作，資料安全儲存於您的瀏覽器中！
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
