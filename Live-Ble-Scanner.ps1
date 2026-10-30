<#
.SYNOPSIS
    CampusOps - Live Mobile Bluetooth Detection Stream for PowerShell
.DESCRIPTION
    Streams real-time anonymous Bluetooth Low Energy detections (including nearby
    Apple, Samsung, Google, and Xiaomi smartphones) directly in PowerShell.
#>

[CmdletBinding()]
param(
    [string]$ApiUrl = "http://127.0.0.1:8000",
    [int]$PollIntervalMs = 500
)

# Set window title if in interactive console
try {
    $host.UI.RawUI.WindowTitle = "CampusOps - Live BLE Phone Detection Console (PowerShell)"
} catch {}

Clear-Host

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  CAMPUSOPS - LIVE MOBILE DEVICE DETECTION CONSOLE (PowerShell)       " -ForegroundColor Green
Write-Host "  Hardware: Windows 11 Built-in Bluetooth Low Energy (BLE) Adapter    " -ForegroundColor White
Write-Host "  Privacy:  Ephemeral Salted SHA-256 (Zero Personal Names or MACs)    " -ForegroundColor Gray
Write-Host "  Target:   Nearby Smartphones (Apple, Samsung, Google, Xiaomi, BLE)  " -ForegroundColor Magenta
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Connecting to CampusOps Bluetooth service at $ApiUrl..." -ForegroundColor DarkGray

# Verify backend status
try {
    $statusCheck = Invoke-RestMethod -Uri "$ApiUrl/api/device-intelligence/status" -Method Get -TimeoutSec 3 -ErrorAction Stop
    Write-Host "[CONNECTED] Backend scanner is ACTIVE. Streaming live mobile detections below:" -ForegroundColor Green
    Write-Host "Press Ctrl+C at any time to exit.`n" -ForegroundColor DarkGray
} catch {
    Write-Host "[WARNING] Backend is not responding at $ApiUrl" -ForegroundColor Yellow
    Write-Host "Attempting to launch backend with Python..." -ForegroundColor DarkGray
    
    $pythonCmd = "python"
    if (Test-Path "C:\Users\Sripriyan\python.exe") {
        $pythonCmd = "C:\Users\Sripriyan\python.exe"
    }

    $backendScript = Join-Path $PSScriptRoot "backend\main.py"
    if (Test-Path $backendScript) {
        Start-Process -FilePath $pythonCmd -ArgumentList "`"$backendScript`"" -WindowStyle Minimized
        Write-Host "Backend process spawned. Waiting 3 seconds..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 3
    } else {
        Write-Host "[ERROR] Could not find $backendScript. Please run start-backend.bat first." -ForegroundColor Red
        return
    }
}

# Keep track of printed log IDs to avoid duplicates
$printedIds = New-Object 'System.Collections.Generic.HashSet[string]'
$totalPacketsSeen = 0

while ($true) {
    try {
        $response = Invoke-RestMethod -Uri "$ApiUrl/api/device-intelligence/status" -Method Get -TimeoutSec 2 -ErrorAction Stop
        $logs = $response.recent_logs
        $activeCount = $response.detected_devices

        if ($logs -and $logs.Count -gt 0) {
            foreach ($log in $logs) {
                if (-not $printedIds.Contains($log.id)) {
                    [void]$printedIds.Add($log.id)
                    $totalPacketsSeen++

                    # Keep hashset bounded to prevent memory growth
                    if ($printedIds.Count -gt 500) {
                        $printedIds.Clear()
                        [void]$printedIds.Add($log.id)
                    }

                    $timeStr = "[$($log.timestamp)]"
                    $rssi = $log.rssi
                    $anonId = $log.anon_id
                    $proximity = $log.proximity_est
                    $type = $log.type

                    # Format RSSI color
                    $rssiColor = "DarkGray"
                    $rssiLabel = "[WEAK]"
                    if ($rssi -ne $null) {
                        if ($rssi -ge -70) {
                            $rssiColor = "Green"
                            $rssiLabel = "[STRONG]"
                        } elseif ($rssi -ge -85) {
                            $rssiColor = "Yellow"
                            $rssiLabel = "[MEDIUM]"
                        }
                    }

                    # Print based on event type
                    if ($type -eq "purge") {
                        Write-Host $timeStr -NoNewline -ForegroundColor DarkGray
                        Write-Host " [SLIDING PURGE 60S]   " -NoNewline -ForegroundColor Red
                        Write-Host "Inactive devices purged " -NoNewline -ForegroundColor DarkRed
                        Write-Host "| Active in 60s: " -NoNewline -ForegroundColor Gray
                        Write-Host "$activeCount" -ForegroundColor Green
                    } elseif ($type -eq "discovery") {
                        Write-Host $timeStr -NoNewline -ForegroundColor DarkGray
                        Write-Host " [NEW PHONE DISCOVERED]" -NoNewline -ForegroundColor Green
                        Write-Host " $anonId " -NoNewline -ForegroundColor White
                        Write-Host "| RSSI: " -NoNewline -ForegroundColor Gray
                        Write-Host ("{0,4} dBm {1} " -f $rssi, $rssiLabel) -NoNewline -ForegroundColor $rssiColor
                        Write-Host "| " -NoNewline -ForegroundColor Gray
                        Write-Host "$proximity " -NoNewline -ForegroundColor Magenta
                        Write-Host "| Active(60s): " -NoNewline -ForegroundColor Gray
                        Write-Host "$activeCount" -ForegroundColor Green
                    } else {
                        Write-Host $timeStr -NoNewline -ForegroundColor DarkGray
                        Write-Host " [BLE ADVERTISEMENT]  " -NoNewline -ForegroundColor Cyan
                        Write-Host " $anonId " -NoNewline -ForegroundColor White
                        Write-Host "| RSSI: " -NoNewline -ForegroundColor Gray
                        Write-Host ("{0,4} dBm {1} " -f $rssi, $rssiLabel) -NoNewline -ForegroundColor $rssiColor
                        Write-Host "| " -NoNewline -ForegroundColor Gray
                        Write-Host "$proximity " -NoNewline -ForegroundColor DarkYellow
                        Write-Host "| Active(60s): " -NoNewline -ForegroundColor Gray
                        Write-Host "$activeCount" -ForegroundColor Green
                    }
                }
            }
        }
    } catch {
        Write-Host "[$((Get-Date).ToString('HH:mm:ss.fff'))] [CONNECTING] Reconnecting to scanner..." -ForegroundColor DarkGray
    }

    Start-Sleep -Milliseconds $PollIntervalMs
}
