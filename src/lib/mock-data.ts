export type ComputerStatus = "active" | "idle" | "offline" | "sleeping" | "shutdown";

export interface Computer {
  id: string;
  name: string;
  lab: string;
  status: ComputerStatus;
  cpu: number;
  ram: number;
  disk: number;
  network: "online" | "offline";
  idleMinutes: number;
  powerWatts: number;
  lastActivity: string;
  ip: string;
  mac: string;
  os: string;
  cpuModel: string;
  ramSize: string;
  storage: string;
  currentUser: string;
  software: string[];
}

export interface Lab {
  id: string;
  name: string;
  location: string;
  computerCount: number;
  activeCount: number;
  idleCount: number;
}

export interface Notification {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const LABS: Lab[] = [
  { id: "lab-a", name: "Lab A - CS Block", location: "Building 1, Floor 2", computerCount: 32, activeCount: 18, idleCount: 8 },
  { id: "lab-b", name: "Lab B - AI Research", location: "Building 2, Floor 3", computerCount: 24, activeCount: 15, idleCount: 4 },
  { id: "lab-c", name: "Lab C - Networking", location: "Building 1, Floor 1", computerCount: 28, activeCount: 12, idleCount: 10 },
  { id: "lab-d", name: "Lab D - Library", location: "Central Library", computerCount: 20, activeCount: 9, idleCount: 6 },
  { id: "lab-e", name: "Lab E - Training", location: "Training Center", computerCount: 16, activeCount: 8, idleCount: 3 },
];

const STATUSES: ComputerStatus[] = ["active", "idle", "offline", "sleeping", "shutdown"];
const OS_LIST = ["Windows 11 Pro", "Windows 10 Enterprise", "Ubuntu 22.04 LTS", "Windows 11 Edu"];
const USERS = ["student01", "student14", "faculty.rao", "admin.lab", "guest", "s.mehta", "a.khan", "—"];
const APPS = ["Chrome", "VS Code", "MS Office", "IntelliJ IDEA", "Python 3.11", "MATLAB", "Adobe Reader", "Zoom"];

function seededRand(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export const labs: Lab[] = LABS;

export const computers: Computer[] = Array.from({ length: 60 }, (_, i) => {
  const r = seededRand(i + 1);
  const lab = LABS[i % LABS.length];
  const status = STATUSES[Math.floor(r * STATUSES.length)];
  const isOn = status === "active" || status === "idle";
  return {
    id: `PC-${String(i + 1).padStart(4, "0")}`,
    name: `${lab.id.toUpperCase()}-WS-${String(i + 1).padStart(2, "0")}`,
    lab: lab.name,
    status,
    cpu: isOn ? Math.floor(r * 90) + 5 : 0,
    ram: isOn ? Math.floor(seededRand(i + 100) * 80) + 10 : 0,
    disk: Math.floor(seededRand(i + 200) * 70) + 20,
    network: status === "offline" ? "offline" : "online",
    idleMinutes: status === "idle" ? Math.floor(seededRand(i + 300) * 45) + 5 : 0,
    powerWatts: status === "active" ? 120 + Math.floor(r * 60) : status === "idle" ? 80 : status === "sleeping" ? 5 : 0,
    lastActivity: status === "active" ? "just now" : `${Math.floor(seededRand(i + 400) * 120)} min ago`,
    ip: `10.0.${(i % 5) + 1}.${(i % 254) + 1}`,
    mac: `00:1A:2B:${((i * 7) % 255).toString(16).padStart(2, "0").toUpperCase()}:${((i * 13) % 255).toString(16).padStart(2, "0").toUpperCase()}:${((i * 19) % 255).toString(16).padStart(2, "0").toUpperCase()}`,
    os: OS_LIST[i % OS_LIST.length],
    cpuModel: "Intel Core i5-12400 @ 2.5GHz",
    ramSize: "16 GB DDR4",
    storage: "512 GB NVMe SSD",
    currentUser: isOn ? USERS[i % USERS.length] : "—",
    software: APPS.slice(0, 4 + (i % 4)),
  };
});

export function statusCounts() {
  const counts: Record<ComputerStatus, number> = {
    active: 0, idle: 0, offline: 0, sleeping: 0, shutdown: 0,
  };
  computers.forEach((c) => counts[c.status]++);
  return counts;
}

export const notifications: Notification[] = [
  { id: "n1", type: "warning", title: "Computer became idle", message: "LAB-A-WS-05 has been idle for 12 minutes", time: "2 min ago", read: false },
  { id: "n2", type: "info", title: "AI prediction completed", message: "Batch scan of 60 computers completed", time: "5 min ago", read: false },
  { id: "n3", type: "success", title: "Sleep mode activated", message: "8 computers entered sleep mode, saving 640W", time: "12 min ago", read: false },
  { id: "n4", type: "info", title: "New login", message: "admin@sidms.io signed in", time: "1 hr ago", read: true },
  { id: "n5", type: "warning", title: "High idle time", message: "Lab C has 10 idle computers", time: "2 hr ago", read: true },
];

// Analytics data
export const dailyEnergyData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  saved: Math.round(15 + seededRand(i + 500) * 25),
  consumed: Math.round(40 + seededRand(i + 600) * 20),
}));

export const weeklyBarData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => ({
  day: d,
  saved: Math.round(80 + seededRand(i + 700) * 60),
  co2: Math.round(30 + seededRand(i + 800) * 30),
}));

export const labUsageData = LABS.map((l) => ({
  name: l.name.split(" - ")[0],
  active: l.activeCount,
  idle: l.idleCount,
  offline: l.computerCount - l.activeCount - l.idleCount,
}));

export const savingsSummary = {
  energyToday: 128.4, // kWh
  co2Today: 61.2, // kg
  moneyToday: 1284, // ₹
  energyMonth: 3820,
  co2Month: 1820,
  moneyMonth: 38200,
};
