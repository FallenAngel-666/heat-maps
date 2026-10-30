export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const { mode } = req.body || {};
    return res.status(200).json({
      status: 'ok',
      mode: mode === 'live' ? 'live' : 'demo',
      message: mode === 'live' 
        ? 'Switched to Live BLE Hardware Mode. (Note: Physical Bluetooth adapter requires local Python backend)' 
        : 'Switched to Multi-Zone Demonstration Mode'
    });
  }

  return res.status(200).json({ mode: 'demo' });
}
