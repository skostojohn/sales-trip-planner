public class UpdateLatLonFromGeoNames implements Queueable, Database.AllowsCallouts {
	
	private Map<Id, SObject> records;
	private String objectType;

	public UpdateLatLonFromGeoNames (Map<Id,SObject> records, String objectType) {
		this.records = records;
		this.objectType = objectType;
	}
                
	public void execute(QueueableContext context) {

		if (objectType == 'Account') {

			List<Account> accounts = [SELECT Id, Description, BillingStreet, BillingCity, 
				BillingState, BillingPostalCode, BillingCountry
				FROM Account
				WHERE Id IN :records.keySet()]; 

			String query = '';
			for (Account acct : accounts) {
				
				query = acct.BillingStreet + '+' + acct.BillingCity + '+' + acct.BillingState 
					+ '+' + acct.BillingPostalCode + '+' + acct.BillingCountry;
				query = query.replace(' ','+');
				query = query.escapeHtml4();
				acct.description = query;

				Http http = new Http();
				HttpRequest request = new HttpRequest();
				request.setEndpoint('http://api.geonames.org/geocodeJSON?q=' + query + 
					'&username=<INSERT USERNAME>');
				request.setMethod('GET');
				HttpResponse response = http.send(request);
				if (response.getStatusCode() == 200) {
					GeoNamesResponse results = GeoNamesResponse.parse(response.getBody());
					acct.Location__Latitude__s = Decimal.valueOf(results.geoCoderResult.lat);
					acct.Location__longitude__s = Decimal.valueOf(results.geoCoderResult.lng);
				}
				else {
					System.debug('web service returned status ' + response.getStatusCode());
				}
			}
		update accounts;
		}
	}	
}