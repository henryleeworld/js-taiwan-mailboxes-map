function initAutocomplete() {
    var taiwan = {
        lat: 25.033493,
        lng: 121.564101
    };
    var marker
    var map = new google.maps.Map(document.getElementById('map'), {
        center: taiwan,
        zoom: 7,
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        fullscreenControl: false
    });

    var image = {
        url: 'images/mailbox.png',
        scaledSize: new google.maps.Size(25, 25),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32)
    };

    var post_markers = [];

    function bindInfoWindow(marker, map, infowindow, html) {
        marker.addListener('click', function() {
            infowindow.open(map, this);
            infowindow.setContent(html);
        });
    }

    for (i = 0; i < locations.length; i++) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i]["lat"], locations[i]["lng"]),
            map: map,
            icon: image,
            title: locations[i]["postbox_type"]
        });
        post_markers.push(marker);
        var infowindow = new google.maps.InfoWindow();
        var contentString = '<h4>' + locations[i]["postbox_type"] + '</h4><p>' + locations[i]["full_address"] + '</p>';
        bindInfoWindow(marker, map, infowindow, contentString);
    }

    var markerCluster = new MarkerClusterer(map, post_markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
    });

    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    var markers = [];
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        markers.forEach(function(marker) {
            marker.setMap(null);
        });

        markers = [];

        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
            map.setZoom(17);
            map.setCenter(pos);
        });
    } else {
        alert("未允許或遭遇錯誤！");
    }
}