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
  Plus,
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
  Share2,
} from "lucide-react";
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
  orderBy,
  onSnapshot,
  setDoc,
  deleteDoc,
  updateDoc,
  OperationType,
  handleFirestoreError,
} from "../services/firebase";
import { SparkleDoodle } from "./CuteDoodles";

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
    url: "https://maps.app.goo.gl/rikyu-ariake",
    name: "牛たん炭焼 利久 有明花園店",
    japaneseName: "牛たん炭焼 利久 有明ガーデン店",
    category: "dining",
    categoryLabel: "餐廳美饌",
    summary: "仙台炭火極厚牛舌名店，外酥內嫩多汁，搭配麥飯、香滑山藥泥與牛尾湯。",
    highlight: "極厚切牛舌定食、16:20 提前晚餐免排隊",
    address: "東京都江東區有明2-1-8 有明花園 5F",
    tips: "推薦點選「極」定食，厚度普通兩倍超滿足！",
    notes: "DAY 1 晚餐排定！看劇前先吃飽補元氣。",
    isVisited: false,
    addedByName: "散策領隊",
    userId: "seed-user",
    createdAt: new Date().toISOString(),
  },
  {
    url: "https://maps.app.goo.gl/dixans-ningyocho",
    name: "DIXANS 人形町店",
    japaneseName: "ディゾン 人形町",
    category: "cafe",
    categoryLabel: "甜點咖啡",
    summary: "日本橋人氣厚片生吐司咖啡館，4 公分厚黑糖黃油生吐司配精緻拉花拿鐵。",
    highlight: "黑糖焦香厚吐司、栗子蒙布朗蛋糕",
    address: "東京都中央區日本橋富澤町16-5",
    tips: "參拜完小網神社步行過來剛好 09:30，環境雅緻舒適。",
    notes: "DAY 2 晨間早餐名單，想試試蒙布朗布丁！",
    isVisited: false,
    addedByName: "甜點控",
    userId: "seed-user",
    createdAt: new Date().toISOString(),
  },
  {
    url: "https://maps.app.goo.gl/koami-shrine",
    name: "小網神社（強運厄除・錢洗弁天）",
    japaneseName: "小網神社（こあみじんじゃ）",
    category: "sightseeing",
    categoryLabel: "觀光景點",
    summary: "東京知名的強運厄除神域，二戰奇蹟完好，境內可於神泉中洗滌硬幣作為錢母。",
    highlight: "強運龍御守、金運錢洗井泉",
    address: "東京都中央區日本橋小網町16-23",
    tips: "準備 5 円或 500 円硬幣放在竹簍洗滌，放入皮夾帶來源源好運。",
    notes: "DAY 2 早上 08:30 參拜避開人潮。",
    isVisited: false,
    addedByName: "神社達人",
    userId: "seed-user",
    createdAt: new Date().toISOString(),
  },
];

export const PocketWishlistSection: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Places list synced via Firestore onSnapshot
  const [places, setPlaces] = useState<SavedPlace[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);

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

  // Deletion modal state
  const [deletingPlace, setDeletingPlace] = useState<SavedPlace | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 1. Listen for Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Firestore Sync with onSnapshot
  useEffect(() => {
    setIsLoadingPlaces(true);
    const placesQuery = query(collection(db, "savedPlaces"));

    const unsubscribe = onSnapshot(
      placesQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SavedPlace[] = [];
          snapshot.forEach((docSnap) => {
            list.push({ id: docSnap.id, ...(docSnap.data() as Omit<SavedPlace, "id">) });
          });
          // Sort client-side by createdAt desc
          list.sort((a, b) => {
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          });
          setPlaces(list);
        } else {
          // If empty in remote Firestore, display initial defaults locally
          setPlaces(DEFAULT_SEEDS.map((s, idx) => ({ id: `seed-${idx}`, ...s })));
        }
        setIsLoadingPlaces(false);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        // Fall back gracefully to local default seeds
        setPlaces(DEFAULT_SEEDS.map((s, idx) => ({ id: `seed-${idx}`, ...s })));
        setIsLoadingPlaces(false);
        try {
          handleFirestoreError(error, OperationType.LIST, "savedPlaces");
        } catch {
          // Keep user experience smooth
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Handle Google Login
  const handleLogin = async () => {
    try {
      setFormError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error("Login failed:", err);
      setFormError(err.message || "登入失敗，請稍後重試");
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

  // Handle Submit Google Maps Link & Call AI
  const handleAnalyzeAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const cleanUrl = inputUrl.trim();
    if (!cleanUrl) {
      setFormError("請貼上 Google Maps 分享連結！");
      return;
    }

    if (!currentUser) {
      setFormError("💡 跨裝置協作同步需要驗證身分，請先點擊上方「Google 登入」即可同步給旅伴！");
      return;
    }

    setIsAnalyzing(true);

    try {
      // 1. Call server-side API to unshorten and analyze with Gemini 3.8 Flash
      const res = await fetch("/api/analyze-place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: cleanUrl,
          rawText: inputNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "無法分析此連結");
      }

      const analyzed = json.data;
      const placeId = "p-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7);
      const newPlaceDoc = {
        url: cleanUrl.slice(0, 1000),
        name: (analyzed.name || "私房推薦店家").slice(0, 200),
        japaneseName: (analyzed.japaneseName || "").slice(0, 200),
        category: (analyzed.category || "dining").slice(0, 50),
        summary: (analyzed.summary || "旅人私房收藏景點。").slice(0, 1000),
        highlight: (analyzed.highlight || "熱門推薦私房清單").slice(0, 500),
        address: (analyzed.address || "").slice(0, 300),
        tips: (analyzed.tips || "").slice(0, 500),
        notes: inputNotes.trim().slice(0, 1000),
        isVisited: false,
        addedByName: (currentUser.displayName || currentUser.email?.split("@")[0] || "旅伴").slice(0, 100),
        userId: currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 2. Save directly to Firestore /savedPlaces/{placeId}
      try {
        await setDoc(doc(db, "savedPlaces", placeId), newPlaceDoc);
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.CREATE, `savedPlaces/${placeId}`);
      }

      setInputUrl("");
      setInputNotes("");
      setFormSuccess(`🎉 已成功由 AI 辨識並收藏：「${newPlaceDoc.name}」！`);
      setTimeout(() => setFormSuccess(null), 5000);
    } catch (err: any) {
      console.error("Save place failed:", err);
      let errorMsg = "分析或儲存失敗，請檢查連結是否有效。";
      if (err?.message) {
        try {
          const parsedErr = JSON.parse(err.message);
          if (parsedErr.error && parsedErr.error.includes("Missing or insufficient permissions")) {
            errorMsg = "雲端權限校驗中，請確認已登入 Google 帳號後重試。";
          } else {
            errorMsg = parsedErr.error || err.message;
          }
        } catch {
          errorMsg = err.message;
        }
      }
      setFormError(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Toggle Visited status
  const handleToggleVisited = async (place: SavedPlace) => {
    if (!currentUser) {
      setFormError("請先登入 Google 帳號以同步變更。");
      return;
    }

    try {
      const nextStatus = !place.isVisited;
      // Optimistic update
      setPlaces((prev) =>
        prev.map((p) => (p.id === place.id ? { ...p, isVisited: nextStatus } : p))
      );

      if (!place.id.startsWith("seed-")) {
        await updateDoc(doc(db, "savedPlaces", place.id), {
          isVisited: nextStatus,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `savedPlaces/${place.id}`);
    }
  };

  // Delete Place - Open in-app confirmation modal
  const handleRequestDelete = (place: SavedPlace) => {
    setDeletingPlace(place);
  };

  // Perform deletion
  const handleConfirmDelete = async (syncToCloud: boolean) => {
    if (!deletingPlace) return;
    setIsDeleting(true);
    const targetPlace = deletingPlace;

    try {
      if (syncToCloud && !currentUser) {
        // Prompt Google login first if cloud sync is requested
        await signInWithPopup(auth, googleProvider);
      }

      // Optimistically delete from UI state immediately
      setPlaces((prev) => prev.filter((p) => p.id !== targetPlace.id));

      if (syncToCloud && !targetPlace.id.startsWith("seed-")) {
        await deleteDoc(doc(db, "savedPlaces", targetPlace.id));
      }

      setDeletingPlace(null);
      setToastMessage(
        syncToCloud
          ? `已成功為所有旅伴同步刪除「${targetPlace.name}」`
          : `已從此畫面移除「${targetPlace.name}」`
      );
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      console.error("Delete failed:", err);
      let errMsg = "刪除時發生問題，請稍後重試。";
      if (err?.message?.includes("popup-closed-by-user")) {
        errMsg = "已取消登入。若無需雲端同步，可選擇「僅從此裝置移除」。";
      } else if (err?.message?.includes("Missing or insufficient permissions")) {
        errMsg = "權限驗證中，請登入後再進行雲端同步刪除。";
      }
      setFormError(errMsg);
      setDeletingPlace(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Edit
  const handleSaveEdit = async () => {
    if (!editingPlace) return;
    if (!currentUser) {
      setFormError("請先登入以同步修改。");
      return;
    }

    setIsSavingEdit(true);
    try {
      const updatedFields = {
        notes: editNotes.trim().slice(0, 1000),
        category: editCategory.slice(0, 50),
        updatedAt: new Date().toISOString(),
      };

      setPlaces((prev) =>
        prev.map((p) => (p.id === editingPlace.id ? { ...p, ...updatedFields } : p))
      );

      if (!editingPlace.id.startsWith("seed-")) {
        await updateDoc(doc(db, "savedPlaces", editingPlace.id), updatedFields);
      }

      setEditingPlace(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `savedPlaces/${editingPlace.id}`);
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

  return (
    <section id="wishlist" className="py-10 sm:py-14 bg-[#faf9f7] min-h-[70vh]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Title Section */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fcebee] border border-[#f5d9df] text-xs font-semibold text-[#8e2443] mb-3">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#b83358]" />
            <span>AI 自動分類 · 跨裝置雲端協作</span>
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
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> 連線同步中...
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
                  已連線同步
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
              <div className="inline-flex items-center gap-2 bg-[#fff2f5] px-4 py-2 rounded-full border border-[#f3ccd6] shadow-2xs">
                <span className="text-[#8e2443] font-medium">
                  想要在手機或電腦共同新增/編輯？
                </span>
                <button
                  type="button"
                  onClick={handleLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#992545] hover:bg-[#801b36] text-white font-bold rounded-full shadow-xs transition-all cursor-pointer text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Google 登入同步</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Input & AI Parsing Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#ebd8dc] shadow-[0_10px_30px_rgba(50,30,35,0.06)] mb-8">
          <div className="flex items-center gap-2 font-bold text-[#2d2527] text-base mb-2">
            <Sparkles className="w-4 h-4 text-[#b83358]" />
            <span>貼上 Google Maps 連結，交給 AI 自動歸納</span>
          </div>
          <p className="text-xs text-[#786b6f] mb-4">
            支援手機 Google Maps App「分享連結」（如 <code className="text-[#b83358] font-mono">https://maps.app.goo.gl/...</code>）或電腦版完整地點網址。
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
                  placeholder="貼上 Google 地圖分享連結..."
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
                    <span>AI 辨識中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>AI 自動分析收藏</span>
                  </>
                )}
              </button>
            </div>

            {/* Error / Success Feedback */}
            {formError && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
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
            <p className="text-xs">正在載入雲端私房收藏清單...</p>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#e4d3d7] p-8">
            <BookmarkCheck className="w-10 h-10 text-[#d4b9c1] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#4a383d]">此分類目前尚無私房收藏</h3>
            <p className="text-xs text-[#8c7b80] mt-1.5 max-w-sm mx-auto">
              在上方輸入框貼上 Google Maps 分享連結，AI 就會自動幫您分析並同步給所有旅伴！
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaces.map((place) => {
              const catConfig = CATEGORY_MAP[place.category] || CATEGORY_MAP.other;
              const CatIcon = catConfig.icon;

              return (
                <div
                  key={place.id}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-300 flex flex-col justify-between group ${
                    place.isVisited
                      ? "border-emerald-200 bg-emerald-50/20 shadow-2xs"
                      : "border-[#ebd8dc] hover:border-[#b83358] shadow-xs hover:shadow-md"
                  }`}
                >
                  <div>
                    {/* Top Row: Category Badge, Checkbox & Actions */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${catConfig.bg} ${catConfig.color} border ${catConfig.border}`}
                        >
                          <CatIcon className="w-3 h-3" />
                          <span>{catConfig.label}</span>
                        </span>

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
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
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
                      <span>同步儲存</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation In-App Modal */}
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
                    請確認是否從行程清單中移除此景點或店家。
                  </p>
                </div>
              </div>

              {/* Target Place Preview */}
              <div className="bg-[#faf6f7] p-3.5 rounded-2xl border border-[#f0dee2] mb-4 text-xs">
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

              {currentUser ? (
                <div>
                  <p className="text-xs text-[#5c494f] mb-5 leading-relaxed">
                    確認刪除後，將會從雲端即時移除，所有旅伴的手機與電腦畫面將同步更新。
                  </p>
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
                      onClick={() => handleConfirmDelete(true)}
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
              ) : (
                <div>
                  <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl mb-4 text-xs text-amber-900 leading-relaxed">
                    <strong>提示：</strong>您目前尚未登入 Google 帳號。您可以選擇僅在此裝置移除，或登入 Google 同步為全體旅伴移除此筆收藏。
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setDeletingPlace(null)}
                      className="px-3.5 py-2 rounded-xl border border-[#ebd8dc] text-xs font-semibold text-[#735e65] hover:bg-stone-50 text-center cursor-pointer order-3 sm:order-1"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleConfirmDelete(false)}
                      className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-[#4a383d] font-bold rounded-xl text-xs transition-all text-center cursor-pointer order-2 sm:order-2"
                    >
                      僅從此裝置移除
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => handleConfirmDelete(true)}
                      className="px-3.5 py-2 bg-[#992545] hover:bg-[#801b36] text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer order-1 sm:order-3"
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>登入並全體同步刪除</span>
                    </button>
                  </div>
                </div>
              )}
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
