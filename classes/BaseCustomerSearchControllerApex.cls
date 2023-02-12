public with sharing class BaseCustomerSearchControllerApex {

    @AuraEnabled
    public static String AccountSearch(String searchString) {
    
        searchString= String.escapeSingleQuotes(searchString.trim());
        
        String query = 'SELECT Id,Name,BillingStreet,BillingCity,BillingState,BillingPostalCode,Location__Latitude__s,Location__Longitude__s FROM Account WHERE Name LIKE \'%' +
            searchString + '%\' LIMIT 20';
        
        List<Account> accounts = Database.query(query);
        
        return JSON.serialize(accounts);
        
    }
    
    
}