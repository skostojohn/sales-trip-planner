({
    toggleNearbyCustomerItem : function(component,event,helper) {
        
        var checkbox = component.find("checkbox");
        var selected = checkbox.get("v.value");
        
        var nearbyCustomer = component.get("v.nearbyCustomer");
        var nearbyCustomerItemToggledEvent = $A.get("e.c:nearbyCustomerItemToggled");
		nearbyCustomerItemToggledEvent.setParams({"nearbyCustomer":nearbyCustomer.account,"selected":selected});
		nearbyCustomerItemToggledEvent.fire();
    },
    updateMarker : function(component,event,helper) {
        var checkbox = component.find("checkbox");
        var selected = checkbox.get("v.value");
        var record = event.getParam("record");
        var nearbyCustomer = component.get("v.nearbyCustomer.account");
        
        if (selected && nearbyCustomer.Id == record.Id) {
            checkbox.set("v.value",false);
        }
        else if (!selected && nearbyCustomer.Id == record.Id) {
            checkbox.set("v.value",true);
        }
    }
})