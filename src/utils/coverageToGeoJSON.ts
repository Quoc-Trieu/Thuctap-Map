export function coverageToGeoJSON(input: any) {
  if (!input.routes || !input.routes.length) {
    return null;
  }
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
  let coordinates = input.routes[0].geometry.coordinates;
  Geometry.features[0].geometry.coordinates = coordinates;

  return Geometry;
}

export function getCoodinatesFromResponse(input: any) {
  const Geometry = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {},
      },
    ],
  };
  const {routes} = input;
  const {geometry} = routes[0];
  Geometry.features[0].geometry = geometry;
  return Geometry;
}
