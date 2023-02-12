({ itemSelected : function(component,event,helper) {
        var account = component.get("v.account");
        var baseCustomerSelectedEvent = $A.get("e.c:baseCustomerSelected");
		baseCustomerSelectedEvent.setParams({"record":account});
		baseCustomerSelectedEvent.fire();
    }
   })