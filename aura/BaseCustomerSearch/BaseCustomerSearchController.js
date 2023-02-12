({
    runSearch : function(component,event,helper) {

        var searchString = component.get("v.searchString");
        if(searchString != '' && searchString.length > 2) {
            var action = component.get('c.AccountSearch');
            action.setStorable();
            
            action.setParams({
                searchString : searchString,
            });
    
            action.setCallback(component,function(a){
                if (a.getState() === 'SUCCESS') {
                    var retObj = JSON.parse(a.getReturnValue());
                    if(retObj.length <= 0){
                        var noResult = JSON.parse('[{"text":"No Results Found"}]');
                        component.set("v.server_result",noResult); 
                    }else{
                        component.set("v.server_result",retObj); 
                    }
                }
            });
            $A.enqueueAction(action); 
        }
    },
    clearSearch : function(component,event,helper) {
        component.set("v.searchString","");
        
    }
})