export default function coverageToGeoJSON(input: any) {
  const Geometry = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [],
        },
      },
    ],
  };
  let coordinates = input['routes'][0]['geometry']['coordinates'];
  Geometry.features[0].geometry.coordinates = coordinates;

  return Geometry;
}
