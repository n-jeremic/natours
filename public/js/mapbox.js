export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidGhlamVyYSIsImEiOiJjazYweTd1aDAwYzIyM29ueTl0bnRjcDZpIn0.K9m3iot3krOL3Q7DBcd9Pg';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/thejera/ck60zixkl07vf1il903l54bln',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup()
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
