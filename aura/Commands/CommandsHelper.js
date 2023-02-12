({
    getDirections : function(component,stops,result) {
        
        var baseCustomer = component.get("v.baseCustomer");
        var baseCustomerJSON = JSON.stringify(baseCustomer);
        var stopsJSON = JSON.stringify(stops);
        var stoporder = new Array();
        var action = component.get('c.stopsInOrder');
        var that = this;
            
        action.setParams({
            stopsJSON : stopsJSON,
            originJSON : baseCustomerJSON
        });

        action.setCallback(component,function(a){
            if (a.getState() === 'SUCCESS') {
                var retObj = a.getReturnValue();
                if(retObj.length <= 0){
                    console.log("no result from apex controller call"); 
                }else{
                    var response = JSON.parse(retObj);
                    stoporder = response.routes[0].waypoint_order;

                    var base = "https://www.google.com/maps/dir/?api=1";
                    var origin = "&origin="+baseCustomer.BillingStreet+","+baseCustomer.BillingCity+','+baseCustomer.BillingState+' '+baseCustomer.BillingPostalCode;
                    var waypoints = "&waypoints=";
                    
                    var optimizedstops = new Array();
                    
                    stoporder.forEach(function(index) {
                        optimizedstops.push(stops[index]);
                    });
                    
                    var dest = stops.pop();
                    var destination = "&destination="+dest.BillingStreet+','+dest.BillingCity+','+dest.BillingState+' '+dest.BillingPostalCode;
                    
                    optimizedstops.forEach(function(stop) {
                        var address = stop.BillingStreet;
                        var city = stop.BillingCity;
                        var state = stop.BillingState;
                        var postcode = stop.BillingPostalCode;
                        waypoints = waypoints + address+','+city+','+state+' '+postcode+"|";
                    });
                    
                    waypoints = waypoints.slice(0,-1);
                    var url = encodeURI(base+origin+destination+waypoints);
                    component.set("v.url",url);
                    
                    if(result=='show') {
                        window.open(url);
                    }
                    else if (result=='send') {
                        that.sendSMS(component);
                    }
                    
                }
            }
        });
        $A.enqueueAction(action); 
    },
    sendSMS : function (component) {
        var action = component.get('c.sendSMSMessage');
        var phoneNumber = component.get("v.phonenumber");
        var message = component.get("v.url");
            
        action.setParams({
            phoneNumber : phoneNumber,
            message : message
        });

        action.setCallback(component,function(a){
            if (a.getState() === 'SUCCESS') {
                var retObj = a.getReturnValue();
                if(retObj.length <= 0){
                    console.log("no result from apex controller call"); 
                }else{
                    console.log(retObj);
                }
            }
        });
        $A.enqueueAction(action); 
    }
})