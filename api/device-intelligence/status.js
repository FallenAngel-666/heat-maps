let currentMode = 'demo';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDemoLogs(count = 35) {
  const now = Date.now();
  const demoZones = [
    { name: 'Main Academic Wing', id: 'ZONE-MAIN-01' },
    { name: 'Central Library', id: 'ZONE-LIB-02' },
    { name: 'BMS Management Quad', id: 'ZONE-BMS-03' },
    { name: 'Hostel-3 Courtyard', id: 'ZONE-HOST-04' },
    { name: 'Student Pavilion', id: 'ZONE-CAFE-05' }
  ];

  const logs = [];
  for (let i = 0; i < count; i++) {
    const timeOffset = (count - i) * 1600;
    const t = new Date(now - timeOffset);
    const timeStr = t.toTimeString().split(' ')[0] + '.' + String(t.getMilliseconds()).padStart(3, '0');
    const z = demoZones[Math.floor(Math.random() * demoZones.length)];
    const hex = Math.random().toString(16).substring(2, 10).toUpperCase() + Math.random().toString(16).substring(2, 6).toUpperCase();
    const anonId = `DEV-${hex.substring(0, 12)}`;
    const rssi = getRandomInt(-88, -56);
    const isStrong = rssi >= -70;
    const isMod = rssi >= -85;
    const proximity = isStrong 
      ? `Nearby Mobile Phone (< 2.5m) [${z.name}]` 
      : isMod 
      ? `Mid-Range Mobile Device (2.5m - 8m) [${z.name}]` 
      : `Peripheral / Wearable (8m - 15m) [${z.name}]`;
    const isNew = Math.random() < 0.28;

    logs.push({
      id: `cloud-log-${t.getTime()}-${i}`,
      timestamp: timeStr,
      type: isNew ? 'discovery' : 'packet',
      anon_id: anonId,
      rssi: rssi,
      signal_level: isStrong ? 'strong' : isMod ? 'moderate' : 'weak',
      proximity_est: proximity,
      packet_count: getRandomInt(1, 14),
      message: `${isNew ? 'New mobile device discovered' : 'Signal packet received'}: ${anonId} (${rssi} dBm)`
    });
  }
  return logs;
}

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Base counts with dynamic jitter for realistic live signal telemetry
  const zoneConfigs = [
    { id: 'ZONE-MAIN-01', base: 26, variance: 3, name: 'Easwari Main Academic Wing (Laptop Sensor)', bldg: 'EEC-MAIN-01', pos: [-6.0, 1.8, 30.0], r: 22.0, isPhys: true },
    { id: 'ZONE-LIB-02', base: 19, variance: 2, name: 'Central Library & Convention Hall', bldg: 'EEC-LIB-03', pos: [18.0, 1.8, 30.0], r: 20.0, isPhys: false },
    { id: 'ZONE-BMS-03', base: 15, variance: 3, name: 'BMS Management Studies Quad', bldg: 'SRM-BMS-05', pos: [-48.0, 1.8, 5.0], r: 24.0, isPhys: false },
    { id: 'ZONE-HOST-04', base: 21, variance: 4, name: 'SRM Boys Hostel-3 Courtyard', bldg: 'SRM-HOST-06', pos: [50.0, 1.8, -10.0], r: 25.0, isPhys: false },
    { id: 'ZONE-CAFE-05', base: 12, variance: 2, name: 'Student Pavilion & Health Center', bldg: 'SRM-AMENITY-10', pos: [2.0, 1.8, -24.0], r: 20.0, isPhys: false }
  ];

  const zones = zoneConfigs.map((z) => {
    const jitter = getRandomInt(-z.variance, z.variance);
    const count = Math.max(1, z.base + jitter);
    let density = 'low';
    if (count >= 20) density = 'congested';
    else if (count >= 15) density = 'high';
    else if (count >= 8) density = 'medium';

    return {
      zone_id: z.id,
      name: z.name,
      building_id: z.bldg,
      position_3d: z.pos,
      coverage_radius: z.r,
      is_physical_sensor: z.isPhys,
      detected_devices: count,
      density_status: density
    };
  });

  const totalDetected = zones.reduce((acc, z) => acc + z.detected_devices, 0);

  const payload = {
    scanner_status: 'active',
    status_message: 'Vercel Cloud Deployment: Real-time Multi-Zone Anonymous BLE Density Active',
    mode: currentMode,
    detected_devices: totalDetected,
    detection_window: 60,
    last_updated: new Date().toISOString(),
    active_sensors_count: zones.length,
    density_status: totalDetected >= 75 ? 'high' : totalDetected >= 40 ? 'medium' : 'low',
    primary_sensor: zones[0],
    zones: zones,
    signals: {
      avg_rssi: -74.5,
      strong: Math.round(totalDetected * 0.28),
      moderate: Math.round(totalDetected * 0.48),
      weak: Math.round(totalDetected * 0.24)
    },
    hardware_diagnostics: {
      adapter_ready: true,
      real_hardware_count: 0,
      error_details: 'Vercel Cloud Serverless Deployment (Multi-Zone Simulation Active)'
    },
    recent_logs: generateDemoLogs(35)
  };

  return res.status(200).json(payload);
}
