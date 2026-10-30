"""
CampusOps - Live PowerShell / Terminal Streaming Client
Streams real-time phone detections and BLE packets directly into your terminal.
Works whether the backend server is already running or standalone!
"""

import os
import sys
import time
import urllib.request
import json
from datetime import datetime

# Enable ANSI escape codes on Windows 10/11
if os.name == 'nt':
    try:
        import ctypes
        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except Exception:
        pass

C_RESET = "\033[0m"
C_BOLD = "\033[1m"
C_DIM = "\033[2m"
C_GREEN = "\033[92m"
C_CYAN = "\033[96m"
C_YELLOW = "\033[93m"
C_RED = "\033[91m"
C_MAGENTA = "\033[95m"
C_WHITE = "\033[97m"

def print_banner():
    print(f"\n{C_CYAN}======================================================================{C_RESET}")
    print(f"{C_GREEN}{C_BOLD}  CAMPUSOPS - LIVE MOBILE DEVICE DETECTION CONSOLE (PowerShell)       {C_RESET}")
    print(f"  Hardware: Windows 11 Built-in Bluetooth Low Energy (BLE) Adapter    ")
    print(f"  Target:   Nearby Smartphones (Apple, Samsung, Google, Xiaomi, BLE)  ")
    print(f"  Privacy:  Ephemeral Salted SHA-256 (Zero Personal Names or MACs)    ")
    print(f"{C_CYAN}======================================================================{C_RESET}\n")

def stream_from_backend(base_url="http://127.0.0.1:8000"):
    print(f"{C_DIM}Connecting to CampusOps Bluetooth service at {base_url}...{C_RESET}")
    printed_ids = set()
    
    while True:
        try:
            req = urllib.request.Request(f"{base_url}/api/device-intelligence/status", headers={"User-Agent": "PowerShellConsole/1.0"})
            with urllib.request.urlopen(req, timeout=2.5) as response:
                data = json.loads(response.read().decode("utf-8"))
            
            logs = data.get("recent_logs", [])
            active_count = data.get("detected_devices", 0)

            for log in logs:
                log_id = log.get("id")
                if log_id not in printed_ids:
                    printed_ids.add(log_id)
                    if len(printed_ids) > 500:
                        printed_ids.clear()
                        printed_ids.add(log_id)

                    time_str = log.get("timestamp", "")
                    anon_id = log.get("anon_id", "")
                    rssi = log.get("rssi")
                    log_type = log.get("type")
                    proximity = log.get("proximity_est", "")

                    if rssi is not None:
                        if rssi >= -70:
                            rssi_str = f"{C_GREEN}{rssi:>3} dBm [STRONG]{C_RESET}"
                        elif rssi >= -85:
                            rssi_str = f"{C_YELLOW}{rssi:>3} dBm [MEDIUM]{C_RESET}"
                        else:
                            rssi_str = f"{C_DIM}{rssi:>3} dBm [WEAK]  {C_RESET}"
                    else:
                        rssi_str = f"{C_DIM}   N/A         {C_RESET}"

                    if log_type == "purge":
                        print(f"{C_DIM}[{time_str}]{C_RESET} {C_RED}{C_BOLD}[SLIDING PURGE 60S]{C_RESET}   Cleaned inactive devices | Active in 60s: {C_GREEN}{C_BOLD}{active_count}{C_RESET}")
                    elif log_type == "discovery":
                        print(
                            f"{C_DIM}[{time_str}]{C_RESET} {C_GREEN}{C_BOLD}[NEW PHONE DISCOVERED]{C_RESET} "
                            f"{C_WHITE}{C_BOLD}{anon_id}{C_RESET} | "
                            f"RSSI: {rssi_str} | "
                            f"{C_MAGENTA}{proximity:<36}{C_RESET} | "
                            f"Active(60s): {C_GREEN}{C_BOLD}{active_count}{C_RESET}"
                        )
                    else:
                        print(
                            f"{C_DIM}[{time_str}]{C_RESET} {C_CYAN}[BLE ADVERTISEMENT]  {C_RESET} "
                            f"{C_WHITE}{C_BOLD}{anon_id}{C_RESET} | "
                            f"RSSI: {rssi_str} | "
                            f"{C_YELLOW}{proximity:<36}{C_RESET} | "
                            f"Active(60s): {C_GREEN}{C_BOLD}{active_count}{C_RESET}"
                        )

            time.sleep(0.4)
        except urllib.error.URLError:
            print(f"{C_YELLOW}[CONNECTING] Waiting for backend at {base_url}... (or run start-backend.bat){C_RESET}", end="\r")
            time.sleep(1.0)
        except KeyboardInterrupt:
            print(f"\n{C_CYAN}[STOPPED] PowerShell BLE console detached.{C_RESET}")
            break

if __name__ == "__main__":
    print_banner()
    stream_from_backend()
