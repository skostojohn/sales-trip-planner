({
    showDirections : function(component,event,helper) {
        
        var url = component.get("v.url");
        if (url != null) {
            window.open(url);
        }
        else {
            var markers = component.get("v.markers");
            var selectedmarkers = markers.filter(element => element.options.selected == true);
            var stops = new Array();
            selectedmarkers.forEach(function(item) {
                stops.push(item.options.record);
            });
            
            helper.getDirections(component,stops,'show');
        }
        
        },
    sendDirections : function(component,event,helper) {
        
        var url = component.get("v.url");
        if (url != null) {
            helper.sendSMS(component);
        }
        else {
            var markers = component.get("v.markers");
            var selectedmarkers = markers.filter(element => element.options.selected == true);
            var stops = new Array();
            selectedmarkers.forEach(function(item) {
                stops.push(item.options.record);
            });
            
            helper.getDirections(component,stops,'send');
        }
    },
    clearURL : function(component) {
        component.set("v.url",null);
    }
        
})