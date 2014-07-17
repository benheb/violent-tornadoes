var App = function() {

  this._initUI();
  this._createMap();
  this._buildCharts();

}

App.prototype._initUI = function() {
  var height = $(window).height();
  var width = $(window).width();

  $('#map-section').css({'height': height+'px'});

  $(window).on('resize', function() {
    var height = $(window).height();
    var width = $(window).width();

    $('#map-section').css({'height': height+'px'});
  });
}

App.prototype._createMap = function() {
  /* map */
  var self = this;

  var options = {
    scrollWheelZoom: false
  }

  this.map = L.mapbox.map('map', 'mapbox.blue-marble-topo-bathy-jul-bw', options)
      .setView([40, -80.50], 5);

  this.style = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }

  function states(feature) {
    return {
        fillColor: "none",
        weight: 2,
        opacity: 0.5,
        color: 'white',
        weight:0.5,
        fillOpacity: 0.3
    };
  }

  L.geoJson(statesData, {style: states}).addTo(this.map);

  $.getJSON('data/violent-tors.json', function(data) {
    console.log('data', data);

    function onEachFeature(feature, layer) {
      layer.on({
        click: function(e){
          self._onClick(feature);
          self._clearSelection();
          self._selectFeature(e);
        }
      });
    }

    self.layer = L.geoJson(data, {

      onEachFeature: onEachFeature,

      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, self.style);
      }
    }).addTo(self.map);

  });

}

App.prototype._onClick = function(feature) {
  
  var year = moment(feature.properties.Date).format("dddd, MMMM Do YYYY"); 
  var fatalities = feature.properties.Fatalities;
  var injuries = feature.properties.Injuries;
  var damage = feature.properties.Damage;
  var research = feature.properties.RESEARCH;
  var youtube = function() {
    if ( feature.properties.YOUTUBE ) {
      return '<iframe width="100%" height="300px" src="//www.youtube.com/embed/-FI1OYyI4Kg" frameborder="0" allowfullscreen></iframe>';
    } else {
      return "";
    }
  
  }
  $('#content').show();
  $('#year').html(year);
  $('#fatalities').html(fatalities);
  $('#injuries').html(injuries);
  $('#damage').html((damage !== "$-") ? damage : "n/a");
  $('#research').html(research);
  $('#youtube').html(youtube);
}

App.prototype._selectFeature = function(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 5,
      color: '#FFF',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera) {
      layer.bringToFront();
  }
}

App.prototype._clearSelection = function(e) {
  this.layer.setStyle(this.style);
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

}