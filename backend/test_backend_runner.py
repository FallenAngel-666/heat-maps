import asyncio
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ble_scanner import AnonymousBLEScannerManager

async def test():
    print("[TEST] Initializing AnonymousBLEScannerManager...")
    m = AnonymousBLEScannerManager(detection_window_seconds=60)
    await m.start()
    print("[TEST] Scanner started. Accumulating BLE detections for 5 seconds...")
    await asyncio.sleep(5)
    
    payload = m.get_status_payload()
    print("\n--- [LIVE PAYLOAD TEST RESULTS] ---")
    print(f"Scanner Status:      {payload['scanner_status']}")
    print(f"Active Mode:         {payload['mode']}")
    print(f"Detected Devices:    {payload['detected_devices']} unique devices in last 60s")
    print(f"Packets Captured:    {payload['total_packets_received']}")
    print(f"Density Status:      {payload['density_status']}")
    print(f"Signal Breakdown:    {payload['signals']}")
    print(f"Primary Sensor:      {payload['primary_sensor']['name']} at {payload['primary_sensor']['position_3d']}")
    print("-----------------------------------\n")

    # Now test switching to DEMO mode
    m.set_mode("demo")
    demo_payload = m.get_status_payload()
    print("--- [DEMO MODE TEST RESULTS] ---")
    print(f"Demo Mode:           {demo_payload['mode']}")
    print(f"Demo Total Devices:  {demo_payload['detected_devices']}")
    print(f"Demo Active Sensors: {demo_payload['active_sensors_count']}")
    for z in demo_payload['zones']:
        print(f"  • {z['zone_id']} ({z['name']}): {z['detected_devices']} devices [{z['density_status']}]")
    print("--------------------------------\n")

    await m.stop()
    print("[TEST] Completed successfully.")

if __name__ == "__main__":
    asyncio.run(test())
