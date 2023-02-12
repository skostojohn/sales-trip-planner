({
    drawMap : function(component,event) {
        
        var lat = component.get("v.baselat");
        var long = component.get("v.baselong");
        
        var currmap = component.get("v.map");
        
        if (currmap)
            {
                currmap.remove();
            }
            
        var mapDiv = component.find('mapid').getElement();
        var mymap = L.map(mapDiv).setView([lat, long], 14);
        
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1Ijoic2tvc3Rvam9obiIsImEiOiJjamEyMWcxMHowamFxMzJsZnV3NjBmOTVzIn0.EZcG4PH_aAdmyaeYBTMGnA',
            maxZoom: 18,
            detectRetina: true
        }).addTo(mymap);
        
        L.marker([lat, long]).addTo(mymap);
        
        component.set("v.map",mymap);
        
    },
    toggleMarker : function(component,record,selected) {
        
        var markers = component.get("v.markers");
        var map = component.get("v.map");
        var that = this;
        
        var oldmarker = markers.find(x => x.options.record.Id == record.Id);
        oldmarker.remove();
        var orangeIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
            });
        var greyIcon = new L.Icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
            });
        if (selected) {
            var newmarker = L.marker([record.Location__Latitude__s, record.Location__Longitude__s],{icon: orangeIcon,record:record,selected:true})
        } 
        else {
            var newmarker = L.marker([record.Location__Latitude__s, record.Location__Longitude__s],{icon: greyIcon,record:record,selected:false})
        }
        newmarker.addTo(map).on('click',function(e) {var record = this.options.record; 
            var selected = !this.options.selected; that.handleMarkerClick(component,record,selected);});
        var newmarkers = markers.filter(x => x.options.record.Id != record.Id);
        newmarkers.push(newmarker);
        component.set("v.markers",newmarkers);
    },
    handleMarkerClick : function (component,record,selected) {

        this.toggleMarker(component,record,selected);
        component.set("v.recordtocheck",record);

    }
})