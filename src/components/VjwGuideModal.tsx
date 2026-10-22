import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  QrCode,
  ListChecks,
  FileText,
  Upload,
  Trash2,
  Maximize2,
  Sparkles,
  Info,
  Smartphone,
  Plane,
  Building,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface VjwGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface VjwChecklistItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

const DEFAULT_VJW_CHECKLIST: VjwChecklistItem[] = [
  {
    id: "vjw-1",
    title: "1. 註冊與登入帳號",
    description: "至 Visit Japan Web 註冊會員（建議使用常用 Email，並開啟雙重驗證以確保資訊安全）。",
    checked: false,
  },
  {
    id: "vjw-2",
    title: "2. 登錄同行者與本人資料",
    description: "登錄護照資料（可直接使用手機鏡頭拍照辨識護照相片頁，並勾選免稅 QR 碼意願）。",
    checked: false,
  },
  {
    id: "vjw-3",
    title: "3. 登錄入境日程（去程航班 TR866）",
    description: "填寫旅行名稱、預定抵達日本日（2026/11/28）、航空公司（SCOOT 酷航）與班機號碼 866。",
    checked: false,
  },
  {
    id: "vjw-4",
    title: "4. 填寫日本停留處（VIA INN PRIME）",
    description: "輸入郵遞區號 103-0013，系統自動帶出東京都中央區，再填入飯店名稱與聯絡電話。",
    checked: false,
  },
  {
    id: "vjw-5",
    title: "5. 外國人入境紀錄填寫",
    description: "填寫入境目的（觀光）、停留天數（2 天），以及日本海關常規審查確認問卷。",
    checked: false,
  },
  {
    id: "vjw-6",
    title: "6. 攜帶品・分開寄送品申報（海關申報）",
    description: "確認無超額現金、未攜帶違禁肉製品或植物，依序勾選海關申報項目完成申報。",
    checked: false,
  },
  {
    id: "vjw-7",
    title: "7. 取得 QR Code 並截圖存入保險箱",
    description: "完成後產生入境審查與海關申報 QR Code，截圖並上傳至本工具保險箱，供下機時離線出示。",
    checked: false,
  },
];

export const VjwGuideModal: React.FC<VjwGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"copier" | "checklist" | "vault">("copier");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Checklist state stored in localStorage
  const [checklist, setChecklist] = useState<VjwChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem("vjw_trip_checklist_state");
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_VJW_CHECKLIST;
  });

  // Offline QR Code Vault state
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(() => {
    try {
      return localStorage.getItem("vjw_qr_code_vault_img");
    } catch {
      return null;
    }
  });

  const [isQrFullscreen, setIsQrFullscreen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync checklist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("vjw_trip_checklist_state", JSON.stringify(checklist));
    } catch {
      // ignore
    }
  }, [checklist]);

  // Sync QR code to localStorage
  useEffect(() => {
    try {
      if (qrCodeDataUrl) {
        localStorage.setItem("vjw_qr_code_vault_img", qrCodeDataUrl);
      } else {
        localStorage.removeItem("vjw_qr_code_vault_img");
      }
    } catch {
      // ignore
    }
  }, [qrCodeDataUrl]);

  if (!isOpen) return null;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2500);
  };

  const handleToggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleResetChecklist = () => {
    setChecklist(DEFAULT_VJW_CHECKLIST.map((item) => ({ ...item, checked: false })));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("請選擇圖片格式檔案（JPG, PNG 或 WebP）");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setQrCodeDataUrl(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearQr = () => {
    if (window.confirm("確定要移除目前保存的 VJW QR Code 嗎？")) {
      setQrCodeDataUrl(null);
    }
  };

  const completedCount = checklist.filter((item) => item.checked).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#ebd8dc] overflow-hidden my-auto max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#fff5f7] via-white to-[#faf8f6] border-b border-[#eee4e7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#992545] text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#992545] uppercase tracking-wider">
                  VISIT JAPAN WEB ASSISTANT
                </span>
                <span className="text-[10px] bg-[#fdf2f4] text-[#8e2443] border border-[#f3d9de] px-2 py-0.5 rounded-full font-medium">
                  離線保險箱
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#2d2527]">
                Visit Japan Web 入境設定與 QR Code 助手
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f6edef] hover:bg-[#ebd8dc] text-[#5d5054] flex items-center justify-center transition-all cursor-pointer"
            aria-label="關閉視窗"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#eee4e7] bg-[#fcf9f9] px-4 pt-2 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab("copier")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "copier"
                ? "border-[#992545] text-[#992545] bg-white rounded-t-xl"
                : "border-transparent text-[#786b6f] hover:text-[#2d2527]"
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>預填複製助手</span>
          </button>

          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "checklist"
                ? "border-[#992545] text-[#992545] bg-white rounded-t-xl"
                : "border-transparent text-[#786b6f] hover:text-[#2d2527]"
            }`}
          >
            <ListChecks className="w-3.5 h-3.5" />
            <span>申辦進度清單 ({completedCount}/7)</span>
          </button>

          <button
            onClick={() => setActiveTab("vault")}
            className={`px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "vault"
                ? "border-[#992545] text-[#992545] bg-white rounded-t-xl"
                : "border-transparent text-[#786b6f] hover:text-[#2d2527]"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>離線 QR 保險箱</span>
            {qrCodeDataUrl && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* ============================================================== */}
          {/* TAB 1: PRE-FILL COPY ASSISTANT                                 */}
          {/* ============================================================== */}
          {activeTab === "copier" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#fdf2f4] rounded-2xl border border-[#f3d9de] text-xs text-[#8e2443] flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#992545] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  點擊各欄位右側「複製」按鈕，即可將本次行程的航班、成田抵達日及日本橋飯店英文/日文地址一鍵複製，快速貼入
                  Visit Japan Web 系統！
                </div>
              </div>

              {/* Flight Details */}
              <div className="bg-[#faf8f6] p-4 rounded-2xl border border-[#eee4e7] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8e2443]">
                  <Plane className="w-4 h-4 text-[#992545]" />
                  <span>1. 預定入境日程與航班資訊</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">預定入境日期</span>
                      <span className="text-xs font-bold text-[#2d2527]">2026/11/28</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("entry-date", "2026/11/28")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "entry-date" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "entry-date" ? "已複製" : "複製"}</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">航空公司名 (社名)</span>
                      <span className="text-xs font-bold text-[#2d2527]">SCOOT (TZ / TR)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("airline", "SCOOT")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "airline" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "airline" ? "已複製" : "複製"}</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">航班號碼 (便名)</span>
                      <span className="text-xs font-bold text-[#2d2527]">866 (TR866)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("flight-no", "866")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "flight-no" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "flight-no" ? "已複製" : "複製"}</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">出發地 (出発地)</span>
                      <span className="text-xs font-bold text-[#2d2527]">TAIPEI / TAOYUAN (TPE)</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("departure", "TAIPEI")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "departure" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "departure" ? "已複製" : "複製"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hotel / Contact Details */}
              <div className="bg-[#faf8f6] p-4 rounded-2xl border border-[#eee4e7] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#8e2443]">
                  <Building className="w-4 h-4 text-[#992545]" />
                  <span>2. 日本停留處（飯店）聯絡資訊</span>
                </div>

                <div className="space-y-2.5">
                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">郵遞區號 (郵便番号)</span>
                      <span className="text-xs font-bold text-[#2d2527] font-mono">103-0013</span>
                      <span className="text-[10px] text-[#992545] ml-2 font-normal">輸入後點自動輸入地址</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("postal", "103-0013")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "postal" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "postal" ? "已複製" : "複製"}</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">都道府縣 / 市区町村</span>
                      <span className="text-xs font-bold text-[#2d2527]">東京都 中央区</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("prefecture", "東京都中央区")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "prefecture" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "prefecture" ? "已複製" : "複製"}</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">町域・番地 (町名與門牌)</span>
                      <span className="text-xs font-bold text-[#2d2527]">日本橋人形町2-24-3</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("street", "日本橋人形町2-24-3")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "street" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "street" ? "已複製" : "複製"}</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">飯店名稱 (停留先・ホテル名)</span>
                      <span className="text-xs font-bold text-[#2d2527]">VIA INN PRIME NIHONBASHI NINGYOCHO</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("hotel-name", "VIA INN PRIME NIHONBASHI NINGYOCHO")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "hotel-name" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "hotel-name" ? "已複製" : "複製"}</span>
                    </button>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-[#ebd8dc] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[#786b6f] block">日本聯絡電話 (電話番号)</span>
                      <span className="text-xs font-bold text-[#2d2527] font-mono">03-3667-5489</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard("phone", "0336675489")}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#fdf2f4] hover:bg-[#fae4e8] text-[#8e2443] transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === "phone" ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === "phone" ? "已複製" : "複製"}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direct Portal Link */}
              <div className="pt-2">
                <a
                  href="https://vjw-lp.digital.go.jp/zh-hant/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-[#992545] hover:bg-[#7e1c36] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all hover:-translate-y-0.5"
                >
                  <span>開啟 Visit Japan Web 官方網站申辦</span>
                  <ExternalLink className="w-4 h-4 text-pink-200" />
                </a>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: INTERACTIVE CHECKLIST                                   */}
          {/* ============================================================== */}
          {activeTab === "checklist" && (
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="bg-[#faf8f6] p-4 rounded-2xl border border-[#eee4e7]">
                <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                  <span className="text-[#8e2443]">VJW 申辦完成進度</span>
                  <span className="text-[#2d2527] font-mono">{progressPercent}%</span>
                </div>
                <div className="w-full bg-[#eee4e7] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#992545] to-[#c73b5f] h-full transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-[#786b6f]">
                  <span>已完成 {completedCount} 項 / 共 {checklist.length} 項</span>
                  {completedCount === checklist.length && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      所有手續已就緒！
                    </span>
                  )}
                </div>
              </div>

              {/* Checklist Items */}
              <div className="space-y-2.5">
                {checklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleCheck(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      item.checked
                        ? "bg-[#fdf2f4] border-[#f3d9de] text-[#8e2443]"
                        : "bg-white border-[#ebd8dc] text-[#2d2527] hover:bg-[#fcf9f9]"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                        item.checked
                          ? "bg-[#992545] border-[#992545] text-white shadow-2xs"
                          : "border-[#d4c0c4] bg-white"
                      }`}
                    >
                      {item.checked && <Check className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 text-xs">
                      <div className={`font-bold ${item.checked ? "text-[#8e2443]" : "text-[#2d2527]"}`}>
                        {item.title}
                      </div>
                      <div className={`mt-0.5 leading-relaxed ${item.checked ? "text-[#8c606c]" : "text-[#5d5054]"}`}>
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={handleResetChecklist}
                  className="text-xs text-[#8c7b80] hover:text-[#992545] underline transition-all"
                >
                  重設所有勾選狀態
                </button>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: OFFLINE QR CODE VAULT                                   */}
          {/* ============================================================== */}
          {activeTab === "vault" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#fdf2f4] rounded-2xl border border-[#f3d9de] text-xs text-[#8e2443] flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#992545] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  將 Visit Japan Web 產生的 <strong>入境審查與海關申報 QR Code 截圖</strong>{" "}
                  上傳保存於此。資料僅保存在您的手機瀏覽器中，<strong>下飛機免開網路即可隨時點開出示掃描</strong>！
                </div>
              </div>

              {/* Upload or View Vault Card */}
              {qrCodeDataUrl ? (
                <div className="bg-[#faf8f6] p-4 sm:p-5 rounded-2xl border border-[#eee4e7] flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>QR Code 已離線保存在本機</span>
                  </div>

                  {/* QR Image Preview */}
                  <div
                    className="relative max-w-xs bg-white p-3 rounded-2xl border border-[#ebd8dc] shadow-sm cursor-pointer group"
                    onClick={() => setIsQrFullscreen(true)}
                  >
                    <img
                      src={qrCodeDataUrl}
                      alt="Visit Japan Web QR Code"
                      className="w-full h-auto rounded-xl max-h-72 object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                      <Maximize2 className="w-4 h-4" />
                      <span>點擊全螢幕放大</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#5d5054] mt-3">
                    提示：在成田機場過關時，請點擊上方圖片放大，並<strong>將手機螢幕亮度調至最大</strong>以利讀取！
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => setIsQrFullscreen(true)}
                      className="px-4 py-2 text-xs font-bold text-white bg-[#992545] hover:bg-[#7e1c36] rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>放大出示掃描</span>
                    </button>

                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 text-xs font-semibold text-[#5d5054] bg-white hover:bg-[#f6edef] border border-[#ebd8dc] rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>更換截圖</span>
                    </button>

                    <button
                      onClick={handleClearQr}
                      className="px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>移除</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#faf8f6] p-6 rounded-2xl border-2 border-dashed border-[#ebd8dc] text-center flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#fdf2f4] text-[#992545] flex items-center justify-center mb-3">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#2d2527]">
                    尚未保存 VJW QR Code 截圖
                  </h4>
                  <p className="text-xs text-[#786b6f] max-w-sm mt-1 leading-relaxed">
                    請上傳您在 Visit Japan Web 系統取得的 QR Code 畫面截圖，日後即可完全離線出示。
                  </p>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#992545] hover:bg-[#7e1c36] rounded-full transition-all shadow-xs flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                  >
                    <Upload className="w-4 h-4 text-pink-200" />
                    <span>選擇 QR Code 截圖上傳</span>
                  </button>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-[#faf8f6] border-t border-[#eee4e7] flex items-center justify-between text-xs text-[#786b6f] shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>離線安全儲存・日本通關專用</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white hover:bg-[#f6edef] border border-[#ebd8dc] font-semibold text-[#5d5054] transition-all cursor-pointer"
          >
            關閉
          </button>
        </div>
      </div>

      {/* Fullscreen QR Code Overlay */}
      {isQrFullscreen && qrCodeDataUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[80] bg-white flex flex-col items-center justify-center p-4"
          onClick={() => setIsQrFullscreen(false)}
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsQrFullscreen(false)}
              className="p-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition-all cursor-pointer"
              aria-label="離開全螢幕"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="text-center mb-4">
            <span className="text-xs font-bold text-[#992545] uppercase tracking-wider block">
              VISIT JAPAN WEB QR CODE
            </span>
            <h3 className="text-lg font-black text-stone-900 mt-1">
              海關與入境審查出示中
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              請保持螢幕高亮度供自動閘門或海關掃描儀讀取
            </p>
          </div>

          <div className="max-w-md w-full bg-white p-4 rounded-3xl shadow-lg border border-stone-200 flex items-center justify-center">
            <img
              src={qrCodeDataUrl}
              alt="Visit Japan Web Fullscreen QR Code"
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          </div>

          <button
            onClick={() => setIsQrFullscreen(false)}
            className="mt-6 px-8 py-3 rounded-full bg-stone-900 text-white font-bold text-sm shadow-md hover:bg-black transition-all cursor-pointer"
          >
            完成掃描，返回指南
          </button>
        </div>
      )}
    </div>
  );
};
