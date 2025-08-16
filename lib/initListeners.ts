// lib/initListeners.ts
import { startUSDTListener } from "./usdtListener";

let bootstrapped = false;

export function initListeners() {
  if (bootstrapped) return;
  console.log("🚀 Iniciando listeners…");
  startUSDTListener();
  bootstrapped = true;
}
