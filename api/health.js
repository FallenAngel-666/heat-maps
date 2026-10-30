export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  return res.status(200).json({
    status: 'healthy',
    platform: 'CampusPulse OS on Vercel',
    timestamp: new Date().toISOString(),
    services: {
      frontend: 'online',
      device_intelligence_api: 'online',
      simulation_engine: 'online'
    }
  });
}
