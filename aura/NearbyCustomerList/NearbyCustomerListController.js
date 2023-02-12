({
    getNearbyCustomers : function(component,event,helper) {
        var record = event.getParam("record");
        
        var action = component.get('c.getCustomers');

        action.setParams({
            baseCustomer : record.Id,
            miles : 10
        });
        
        action.setCallback(component,function(a){
            if (a.getState() === 'SUCCESS') {
                var results = a.getReturnValue();
                results.sort(function(a,b) {return a.distanceFromBase-b.distanceFromBase;});
                component.set("v.nearbyCustomers", results);
                var addMarkersEvent = $A.get("e.c:addMarkers");
		        addMarkersEvent.setParams({"records":results});
		        addMarkersEvent.fire();
            }
        });
        $A.enqueueAction(action); 
    }
})