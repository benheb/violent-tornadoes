var App = function() {

  this._initUI();
  this._createMap();
  this._buildCharts();

}

App.prototype._initUI = function() {
  var height = $(window).height();
  var width = $(window).width();

  $('#map-section').css({'height': height+'px'});
}

App.prototype._createMap = function() {
  /* map */
  var self = this;

  var options = {
    scrollWheelZoom: false
  }

  this.map = L.mapbox.map('map', 'mapbox.blue-marble-topo-bathy-jul-bw', options)
      .setView([40, -97.50], 5);

  $.getJSON('data/violent-tors.json', function(data) {
    console.log('data', data);

    function onEachFeature(feature, layer) {
      var popupContent = "<p>I started out as a GeoJSON " +
          feature.geometry.type + ", but now I'm a Leaflet vector!</p>";

      if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
      }

      layer.bindPopup(popupContent);
    }


    L.geoJson(data, {

      style: function (feature) {
        return feature.properties && feature.properties.style;
      },

      onEachFeature: onEachFeature,

      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      }
    }).addTo(self.map);

  });

}



App.prototype._buildCharts = function() {
  var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: [
          ['data1', 30, 200, 100, 400, 150, 250],
          ['data2', 50, 20, 10, 40, 15, 25]
        ],
        axes: {
          data2: 'y2'
        },
        types: {
          data2: 'bar' // ADD
        }
      },
      axis: {
        y: {
          label: {
            text: 'Y Label',
            position: 'outer-middle'
          }
        },
        y2: {
          show: true,
          label: {
            text: 'Y2 Label',
            position: 'outer-middle'
          }
        }
      }
  });
  console.log('notice me')

}