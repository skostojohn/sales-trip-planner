({
    updateDisplayInfo : function(component,event,helper) {
        var record = event.getParam("record");
        component.set("v.record",record);
    }
})