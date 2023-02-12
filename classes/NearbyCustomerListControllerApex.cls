public with sharing class NearbyCustomerListControllerApex {
    
    @AuraEnabled
    public static List<AccountDistance> getCustomers(String baseCustomer,Integer miles) {
    
        Account baseAccount = [SELECT Id, Name,Location__Latitude__s,Location__Longitude__s,OwnerId FROM Account WHERE Id = :baseCustomer LIMIT 1];
        
        Decimal baselat = baseAccount.Location__Latitude__s;
        Decimal baselong = baseAccount.Location__Longitude__s;
        
        List<Account> salesreprecords = [SELECT Id, Name, BillingStreet, BillingCity,BillingState,BillingPostalCode,Location__Latitude__s,Location__Longitude__s,
                                        DISTANCE( Location__c, GEOLOCATION( :baselat, :baselong ), 'mi' ) dist
                                        FROM Account WHERE OwnerId = :baseAccount.OwnerId AND Id <> :baseAccount.Id AND Location__Latitude__s != null 
                                        ORDER BY DISTANCE( Location__c, GEOLOCATION( :baselat, :baselong ), 'mi' ) ];
        
        List<AccountDistance> adrecords = new List<AccountDistance>();

        for(Account a : salesreprecords) {
            if (baseAccount.Location__latitude__s != null) {
                AccountDistance ad = new AccountDistance();
                ad.account = a;
                ad.distanceFromBase = (Double)a.get('dist');
                ad.friendlyDistance = Decimal.valueOf(ad.distanceFromBase);
                ad.friendlyDistance= ad.friendlyDistance.setScale(3);
                Double milesdouble = Double.valueOf(miles);
               if(ad.distanceFromBase < milesdouble) {
                    adrecords.add(ad);
                }
            }
        }
        
        return adrecords;
    }
    public with sharing class AccountDistance {
        @AuraEnabled public Account account {get; set;}
        @AuraEnabled public Double distanceFromBase {get; set;}
        @AuraEnabled public Decimal friendlyDistance {get; set;}
    }

}