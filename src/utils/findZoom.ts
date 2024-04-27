export function findZoomFromTwoPoints(
  point1: [number, number],
  point2: [number, number],
) {
  const lat1 = point1[0];
  const lon1 = point1[1];
  const lat2 = point2[0];
  const lon2 = point2[1];

  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  const zoom = Math.round(14 - Math.log(d) / Math.LN2) + 0.5;
  return zoom;
}

export function findCenterPoint(
  point1: [number, number],
  point2: [number, number],
): [number, number] {
  const lat1 = Number(point1[0]);
  const lon1 = Number(point1[1]);
  const lat2 = Number(point2[0]);
  const lon2 = Number(point2[1]);
  const lat = (lat1 + lat2) / 2;
  const lon = (lon1 + lon2) / 2;
  return [lat, lon];
}
