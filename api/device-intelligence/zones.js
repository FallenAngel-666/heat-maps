export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const zones = [
    {
      zone_id: 'ZONE-MAIN-01',
      name: 'Easwari Main Academic Wing (Laptop Sensor)',
      building_id: 'EEC-MAIN-01',
      position_3d: [-6.0, 1.8, 30.0],
      coverage_radius: 22.0,
      is_physical_sensor: true,
      detected_devices: 26,
      density_status: 'congested'
    },
    {
      zone_id: 'ZONE-LIB-02',
      name: 'Central Library & Convention Hall',
      building_id: 'EEC-LIB-03',
      position_3d: [18.0, 1.8, 30.0],
      coverage_radius: 20.0,
      is_physical_sensor: false,
      detected_devices: 19,
      density_status: 'high'
    },
    {
      zone_id: 'ZONE-BMS-03',
      name: 'BMS Management Studies Quad',
      building_id: 'SRM-BMS-05',
      position_3d: [-48.0, 1.8, 5.0],
      coverage_radius: 24.0,
      is_physical_sensor: false,
      detected_devices: 15,
      density_status: 'high'
    },
    {
      zone_id: 'ZONE-HOST-04',
      name: 'SRM Boys Hostel-3 Courtyard',
      building_id: 'SRM-HOST-06',
      position_3d: [50.0, 1.8, -10.0],
      coverage_radius: 25.0,
      is_physical_sensor: false,
      detected_devices: 21,
      density_status: 'congested'
    },
    {
      zone_id: 'ZONE-CAFE-05',
      name: 'Student Pavilion & Health Center',
      building_id: 'SRM-AMENITY-10',
      position_3d: [2.0, 1.8, -24.0],
      coverage_radius: 20.0,
      is_physical_sensor: false,
      detected_devices: 12,
      density_status: 'medium'
    }
  ];

  return res.status(200).json({ zones });
}
