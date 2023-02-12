public with sharing class CommandsControllerApex {

    @AuraEnabled
    public static String stopsInOrder(String stopsJSON, String originJSON) {
        
        List<Account> stops = (List<Account>)JSON.deserialize(stopsJSON,List<Account>.class);
        Account origin = (Account)JSON.deserialize(originJSON,Account.class);
        Account destination = stops.remove(stops.size()-1);
        
        String baseURL = 'https://maps.googleapis.com/maps/api/directions/json?';
        String originURL = '&origin='+origin.BillingStreet+','+origin.BillingCity+','+origin.BillingState+' '+origin.BillingPostalCode;
        String waypointURL = '&waypoints=optimize:true|';
        String keyURL = '&key=<INSERT KEY HERE>';
        String destinationURL = '&destination='+destination.BillingStreet+','+destination.BillingCity+','+destination.BillingState+' '+destination.BillingPostalCode;
        
        for(Account stop : stops) {
          waypointURL = waypointURL+stop.BillingStreet+','+stop.BillingCity+','+stop.BillingState+' '+stop.BillingPostalCode+'|';
        }
        
        waypointURL = waypointURL.left(waypointURL.length()-1);
        
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();
        
        req.setEndpoint(baseURL+originURL.replace(' ','+')+destinationURL.replace(' ','+')+waypointURL.replace(' ','+')+keyURL);
        req.setMethod('GET');
        
        try {
            res = h.send(req);
        } catch(System.CalloutException e) {
            System.debug('Callout error: '+ e);
            System.debug(res.toString());
        }
        return res.getBody();
        }
        
    @AuraEnabled
    public static String sendSMSMessage(String phoneNumber,String message) {
        
        Http h = new Http();
        HttpRequest req = new HttpRequest();
        HttpResponse res = new HttpResponse();
        String account = '<INSERT ACCT # HERE>';
        String token = '<INSERT TOKEN HERE>';

        req.setEndpoint('https://api.twilio.com/2010-04-01/Accounts/<INSER ACCT # HERE>/Messages.json');
        req.setMethod('POST');
        req.setHeader('Authorization', 'Basic '+ EncodingUtil.base64Encode(Blob.valueOf(account + ':' +token )));
        req.setBody('From=' + EncodingUtil.urlEncode('<INSERT FROM NUMBER HERE>', 'UTF-8')
               + '&To=' + EncodingUtil.urlEncode(phoneNumber, 'UTF-8')
               + '&Body=' + EncodingUtil.urlEncode(message, 'UTF-8')
               );
        
        try {
            res = h.send(req);
        } catch(System.CalloutException e) {
            System.debug('Callout error: '+ e);
            System.debug(res.toString());
        }
        return res.getStatus();
        }
        
}