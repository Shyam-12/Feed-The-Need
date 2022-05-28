     mapboxgl.accessToken = 'pk.eyJ1Ijoic2h5YW1wcjE3IiwiYSI6ImNsMnNvMzQ1cjAwa2gzYm81dGZnZjFuMnIifQ.9dGoZt4LQCD7CK6CpPaGKg'; // set the access token
     
     // const southWest = new mapboxgl.LngLat(26.09991, 91.61216);
     // const northEast = new mapboxgl.LngLat(26.18742, 91.84275);
     const map = new mapboxgl.Map({
          container: 'map', // The container ID
          style: 'mapbox://styles/mapbox/light-v10', // The map style to use
          center: [91.749, 26.186], // Starting position [lng, lat]
          zoom: 12 // Starting zoom level
     });
     
     map.on('load', () => {
          const geocoder = new MapboxGeocoder({
          // Initialize the geocoder
          accessToken: mapboxgl.accessToken, // Set the access token
          mapboxgl: mapboxgl, // Set the mapbox-gl instance
               zoom: 13, // Set the zoom level for geocoding results
               placeholder: 'Enter an address or place name', // This placeholder text will display in the search bar
               // bbox: [91.627, 26.137, 91.848, 26.157] // Set a bounding box
               bbox: [91.61216, 26.09991, 91.84275, 26.18742]
          });
          // Add the geocoder to the map
          map.addControl(geocoder, 'top-left'); // Add the search box to the top left

          const marker = new mapboxgl.Marker({ color: '#008000' }); // Create a new green marker

          geocoder.on('result', async (event) => {
               // When the geocoder returns a result
               const point = event.result.center; // Capture the result coordinates

               const tileset = 'shyampr17.cl3fzn2h500yr27p6gkqt3hcd-50wiy'; // replace this with the ID of the tileset you created
               const radius = 2500; // 1609 meters is roughly equal to one mile
               const limit = 10; // The maximum amount of results to return

               marker.setLngLat(point).addTo(map); // Add the marker to the map at the result coordinates
               const query = await fetch(
               `https://api.mapbox.com/v4/${tileset}/tilequery/${point[0]},${point[1]}.json?radius=${radius}&limit=${limit}&access_token=${mapboxgl.accessToken}`,
               { method: 'GET' }
          );
          const json = await query.json();
           // Use the response to populate the 'tilequery' source
          console.log(json);
          map.getSource('tilequery').setData(json);   
     });

     map.addSource('tilequery', {
  // Add a new source to the map style: https://docs.mapbox.com/mapbox-gl-js/api/#map#addsource
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: []
  }
});

map.addLayer({
               // Add a new layer to the map style: https://docs.mapbox.com/mapbox-gl-js/api/#map#addlayer
               id: 'tilequery-points',
               type: 'circle',
               source: 'tilequery', // Set the layer source
               paint: {
               'circle-stroke-color': 'white',
               'circle-stroke-width': {
                    // Set the stroke width of each circle: https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-circle-circle-stroke-width
                    stops: [
                    [0, 0.1],
                    [18, 3]
                    ],
                    base: 5
               },
               'circle-radius': {
                    // Set the radius of each circle, as well as its size at each zoom level: https://docs.mapbox.com/mapbox-gl-js/style-spec/#paint-circle-circle-radius
                    stops: [
                    [12, 5],
                    [22, 180]
                    ],
                    base: 5
               },
               'circle-color': [
                    // Specify the color each circle should be
                    'match', // Use the 'match' expression: https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-match
                    ['get', 'name'], // Use the result 'STORE_TYPE' property
                    'Deepshikha Sishu Ashray Sthal',
                    '#008000',
                    'Sahayak NGO',
                    '#008000',
                    'Destination',
                    '#008000',
                    'Pragya Reeb(NGO)',
                    '#008000',
                    'FEED THE POOR FOUNDATION',
                    '#008000',
                    'Zublee Foundation',
                    '#008000',
                    'Action for food',
                    '#008000',
                    'Gana Sewa',
                    '#008000',
                    'Childline Guwahati',
                    '#008000',
                    '#008000' // any other store type
               ]
               }
          });
     
     const popup = new mapboxgl.Popup(); // Initialize a new popup

     map.on('mouseenter', 'tilequery-points', (event) => {
          map.getCanvas().style.cursor = 'pointer'; // When the cursor enters a feature, set it to a pointer
          const properties = event.features[0].properties;
          const obj = JSON.parse(properties.tilequery); // Get the feature's tilequery object (https://docs.mapbox.com/api/maps/#response-retrieve-features-from-vector-tiles)
          const coordinates = new mapboxgl.LngLat(
               properties.longitude,
               properties.latitude
          ); // Create a new LngLat object (https://docs.mapbox.com/mapbox-gl-js/api/#lnglatlike)

          const content = `<h3>${properties.Name}</h3><h4>${
          properties.Contact
          }</h4><p>${properties.Address}</p><p>${(
          obj.distance / 1000
          ).toFixed(2)} km from location</p>`;

          popup
          .setLngLat(coordinates) // Set the popup at the given coordinates
          .setHTML(content) // Set the popup contents equal to the HTML elements you created
          .addTo(map); // Add the popup to the map
     });

     map.on('mouseleave', 'tilequery-points', () => {
     map.getCanvas().style.cursor = ''; // Reset the cursor when it leaves the point
     popup.remove(); // Remove the popup when the cursor leaves the point
     });

});

// var content = json;
//           const output = document.getElementById('mapData');
//           output.innerHTML = "List of Places: ";
//           output.innerHTML = content.Name + " " + content.Address +  " " + content.Contact;