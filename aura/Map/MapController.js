({
    afterLeafletLoaded : function(component, event, helper) {
        
        helper.drawMap(component,event);
    },
    updateBaseCustomer : function(component,event,helper) {
        var record = event.getParam("record");
        component.set("v.baseCustomer",record);
        component.set("v.baselat",record.Location__Latitude__s);
        component.set("v.baselong",record.Location__Longitude__s);
        helper.drawMap(component,event);
    },
    addMarkers : function(component,event,helper) {
        var map = component.get("v.map");
        var records = event.getParam("records");
        records.forEach(function(record) {
           if (record.account.Location__Latitude__s && record.account.Location__Longitude__s) {
               var greyIcon = new L.Icon({
                        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
                        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                        });
               var marker = L.marker([record.account.Location__Latitude__s, record.account.Location__Longitude__s],{icon: greyIcon,record:record.account,selected:false})
                .addTo(map).on('click',function(e) {var record = this.options.record; var selected = !this.options.selected; helper.handleMarkerClick(component,record,selected);});
               var markers = component.get("v.markers");
               markers.push(marker);
               component.set("v.markers",markers);
           } 
        });

    },
    toggleNearbyCustomerItem : function(component,event,helper) {
        var nearbyCustomer = event.getParam("nearbyCustomer");
        var selected = event.getParam("selected");
        helper.toggleMarker(component,nearbyCustomer,selected);
    },
    updateCheckboxes : function(component,event,helper) {
        var record = component.get("v.recordtocheck");
        var markerClickedEvent = $A.get("e.c:markerClicked");
		markerClickedEvent.setParams({"record":record});
		markerClickedEvent.fire();
    }
})