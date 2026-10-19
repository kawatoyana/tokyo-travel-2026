import { jsPDF } from "jspdf";
import { RUNNING_SEGMENTS } from "../data/tripData";

/**
 * Generates an offline Tokyo Bay 10K Running Guide PDF.
 * Uses a high-DPI HTML5 canvas to guarantee clean CJK rendering (Traditional Chinese & Japanese),
 * drawing vector route schematics, checkpoint tables, and emergency notes.
 */
export async function downloadRoutePdf(): Promise<void> {
  // A4 dimensions in mm: 210 x 297. Scale 2.5x for crisp print quality
  const width = 1200;
  const height = 1697; // ~ 1:1.414 ratio
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas context");
  }

  // Background: clean Japanese warm white
  ctx.fillStyle = "#faf9f6";
  ctx.fillRect(0, 0, width, height);

  // Top header banner: Modern Japanese indigo accent
  const headerGrad = ctx.createLinearGradient(0, 0, width, 0);
  headerGrad.addColorStop(0, "#1e3a5f");
  headerGrad.addColorStop(1, "#2d527c");
  ctx.fillStyle = headerGrad;
  ctx.fillRect(40, 40, width - 80, 140);

  // Decorative border
  ctx.strokeStyle = "#e2d9cc";
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, width - 72, height - 72);

  // Header Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 38px 'Noto Sans TC', 'PingFang TC', 'Microsoft JhengHei', sans-serif";
  ctx.fillText("東京灣岸 10K 夜跑離線導航指南", 70, 95);

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "20px 'Noto Sans TC', sans-serif";
  ctx.fillText("Tokyo Bay 10K Waterfront Running Route Offline Sheet", 70, 130);

  ctx.fillStyle = "#fbbf24";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("2026/11/28（六）18:00–19:20 ｜ 起訖點：東京花園劇場 2F 外廣場", 70, 160);

  // Summary Metrics Strip
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(40, 200, width - 80, 70);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 200, width - 80, 70);

  const metrics = [
    { label: "全程距離", val: "10.0 公里環線" },
    { label: "路線特性", val: "全平坦無折返 · 0 紅綠燈" },
    { label: "預估耗時", val: "約 55 ~ 75 分鐘" },
    { label: "補給 / 廁所", val: "每 1.5K 設有公園設施" },
  ];

  metrics.forEach((m, idx) => {
    const x = 70 + idx * 270;
    ctx.fillStyle = "#64748b";
    ctx.font = "14px 'Noto Sans TC', sans-serif";
    ctx.fillText(m.label, x, 228);
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 18px 'Noto Sans TC', sans-serif";
    ctx.fillText(m.val, x, 254);
  });

  // Section 1: Visual schematic map card
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(40, 290, width - 80, 310);
  ctx.strokeStyle = "#e2e8f0";
  ctx.strokeRect(40, 290, width - 80, 310);

  // Map card title
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 20px 'Noto Sans TC', sans-serif";
  ctx.fillText("【路線航跡示意】零折返大環線 (Symbol Promenade → 台場 → 潮風 → 青海 → Big Sight)", 70, 325);

  // Draw simplified high-contrast vector route on dark map background
  ctx.fillStyle = "#0f172a";
  ctx.fillRect(70, 345, width - 140, 235);

  // Route path coordinates inside map box
  const ox = 100;
  const oy = 360;
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#0284c7";
  ctx.font = "14px 'Noto Sans TC', sans-serif";
  ctx.fillText("← 東京灣海域 (Tokyo Bay) · 彩虹大橋夜景", ox + 20, oy + 50);

  // Main Route Line
  ctx.beginPath();
  ctx.moveTo(ox + 850, oy + 40); // 0K
  ctx.lineTo(ox + 600, oy + 55); // 1.2K
  ctx.lineTo(ox + 350, oy + 55); // 2.0K DiverCity
  ctx.lineTo(ox + 200, oy + 40); // 2.5K Odaiba Marine Park
  ctx.lineTo(ox + 80, oy + 70);  // 3.5K Rainbow Bridge View
  ctx.lineTo(ox + 60, oy + 120); // 4.5K Liberty Statue
  ctx.lineTo(ox + 80, oy + 160); // 5.5K Shiokaze Park
  ctx.lineTo(ox + 160, oy + 190); // 6.5K Museum of Maritime Science
  ctx.lineTo(ox + 300, oy + 205); // 7.2K Aomi Pier Park
  ctx.lineTo(ox + 480, oy + 195); // 8.2K Telecom Center
  ctx.lineTo(ox + 720, oy + 130); // 9.1K Big Sight
  ctx.lineTo(ox + 830, oy + 85);  // 9.6K Ariake Outer path
  ctx.closePath();
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke();

  // Draw Checkpoint nodes
  const nodes = [
    { name: "起訖點 0K / 10K", x: ox + 850, y: oy + 40, col: "#ef4444" },
    { name: "2.5K 台場海濱", x: ox + 200, y: oy + 40, col: "#38bdf8" },
    { name: "3.5K 彩虹大橋", x: ox + 80, y: oy + 70, col: "#f59e0b" },
    { name: "5.5K 潮風公園", x: ox + 80, y: oy + 160, col: "#10b981" },
    { name: "8.2K 電信中心", x: ox + 480, y: oy + 195, col: "#a855f7" },
    { name: "9.1K Big Sight", x: ox + 720, y: oy + 130, col: "#ec4899" },
  ];

  nodes.forEach((n) => {
    ctx.beginPath();
    ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = n.col;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 13px 'Noto Sans TC', sans-serif";
    ctx.fillText(n.name, n.x - 35, n.y - 12);
  });

  // Section 2: Detailed 5-stage turn-by-turn breakdown
  let currY = 625;
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 22px 'Noto Sans TC', sans-serif";
  ctx.fillText("【五階段分段指引與關鍵轉折地標】", 45, currY);
  currY += 20;

  RUNNING_SEGMENTS.forEach((seg, idx) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(40, currY, width - 80, 125);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 1;
    ctx.strokeRect(40, currY, width - 80, 125);

    // Segment distance badge
    ctx.fillStyle = "#0284c7";
    ctx.fillRect(55, currY + 16, 120, 30);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(seg.distance, 68, currY + 37);

    // Segment Title
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 18px 'Noto Sans TC', sans-serif";
    ctx.fillText(`第 ${idx + 1} 階段：${seg.title}`, 190, currY + 38);

    // Route Description
    ctx.fillStyle = "#334155";
    ctx.font = "14px 'Noto Sans TC', sans-serif";
    ctx.fillText(seg.routeDescription, 55, currY + 70);

    // Highlights & Surface info
    ctx.fillStyle = "#64748b";
    ctx.font = "13px 'Noto Sans TC', sans-serif";
    ctx.fillText(`▶ 景觀重點：${seg.sceneryHighlights.join(" · ")}`, 55, currY + 95);
    ctx.fillText(`▶ 路面狀態：${seg.surface} ｜ 坡度：${seg.elevation}`, 55, currY + 115);

    currY += 138;
  });

  // Section 3: Safety & Emergency Box
  ctx.fillStyle = "#fffbeb";
  ctx.fillRect(40, currY + 10, width - 80, 160);
  ctx.strokeStyle = "#fef3c7";
  ctx.lineWidth = 2;
  ctx.strokeRect(40, currY + 10, width - 80, 160);

  ctx.fillStyle = "#92400e";
  ctx.font = "bold 18px 'Noto Sans TC', sans-serif";
  ctx.fillText("⚠️ 跑者注意事項 ＆ 日本緊急聯絡資訊", 65, currY + 40);

  ctx.fillStyle = "#78350f";
  ctx.font = "14px 'Noto Sans TC', sans-serif";
  ctx.fillText("1. 夜間能見度：18:00 天色已暗，建議穿著反光運動背心或攜帶閃爍警示燈。", 65, currY + 70);
  ctx.fillText("2. 海風保暖：臨東京灣路段風勢較大（體感約 10~12°C），建議著防風薄外套與防風手套。", 65, currY + 95);
  ctx.fillText("3. 完跑會合點：約 19:20 跑完後，於有明花園 5F 休息或至「東京花園劇場 2F 主入口」與看劇同伴碰頭。", 65, currY + 120);
  ctx.fillText("4. 緊急專線：日本警察局撥打 110 ｜ 日本救護車撥打 119 ｜ 台北駐日經濟文化代表處：03-3280-7811", 65, currY + 145);

  // Footer stamp
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px sans-serif";
  ctx.fillText("台北東京 2026 秋末漫遊與東京灣 10K ｜ Offline Running Sheet ｜ Generated by Applet", 40, height - 20);

  // Convert to PDF
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
  pdf.save("tokyo_bay_10k_running_guide.pdf");
}
