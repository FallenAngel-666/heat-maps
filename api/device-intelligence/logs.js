function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const now = Date.now();
  const demoZones = [
    { name: 'Main Academic Wing', id: 'ZONE-MAIN-01' },
    { name: 'Central Library', id: 'ZONE-LIB-02' },
    { name: 'BMS Management Quad', id: 'ZONE-BMS-03' },
    { name: 'Hostel-3 Courtyard', id: 'ZONE-HOST-04' },
    { name: 'Student Pavilion', id: 'ZONE-CAFE-05' }
  ];

  const limit = Math.min(parseInt(req.query.limit || '40', 10), 100);
  const logs = [];

  for (let i = 0; i < limit; i++) {
    const timeOffset = (limit - i) * 1400;
    const t = new Date(now - timeOffset);
    const timeStr = t.toTimeString().split(' ')[0] + '.' + String(t.getMilliseconds()).padStart(3, '0');
    const z = demoZones[Math.floor(Math.random() * demoZones.length)];
    const hex = Math.random().toString(16).substring(2, 10).toUpperCase() + Math.random().toString(16).substring(2, 6).toUpperCase();
    const anonId = `DEV-${hex.substring(0, 12)}`;
    const rssi = getRandomInt(-88, -55);
    const isStrong = rssi >= -70;
    const isMod = rssi >= -85;
    const proximity = isStrong 
      ? `Nearby Mobile Phone (< 2.5m) [${z.name}]` 
      : isMod 
      ? `Mid-Range Mobile Device (2.5m - 8m) [${z.name}]` 
      : `Peripheral / Wearable (8m - 15m) [${z.name}]`;
    const isNew = Math.random() < 0.25;

    logs.push({
      id: `cloud-log-${t.getTime()}-${i}`,
      timestamp: timeStr,
      type: isNew ? 'discovery' : 'packet',
      anon_id: anonId,
      rssi: rssi,
      signal_level: isStrong ? 'strong' : isMod ? 'moderate' : 'weak',
      proximity_est: proximity,
      packet_count: getRandomInt(1, 18),
      message: `${isNew ? 'New mobile device discovered' : 'Signal packet received'}: ${anonId} (${rssi} dBm)`
    });
  }

  return res.status(200).json({
    status: 'ok',
    scanner_status: 'active',
    mode: 'demo',
    count: logs.length,
    logs: logs
  });
}
