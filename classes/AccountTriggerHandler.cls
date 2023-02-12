public with sharing class AccountTriggerHandler implements ITriggerHandler
{
	public static Boolean TriggerDisabled = false;

	public Boolean IsDisabled()
	{
		return TriggerDisabled;
	}

	public void BeforeInsert(List<SObject> newItems) {}

	public void BeforeUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {}

	public void BeforeDelete(Map<Id, SObject> oldItems) {}

	public void AfterInsert(Map<Id, SObject> newItems) {

		if (IsDisabled() == false) {

			AccountTriggerHandler.TriggerDisabled = true;
			AccountGeoCode(newItems);
		}

	}

	public void AfterUpdate(Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {

		if (IsDisabled() == false) {

			AccountTriggerHandler.TriggerDisabled = true;
			AccountGeoCode(newItems,oldItems);
		}

	}

	public void AfterDelete(Map<Id, SObject> oldItems) {}

	public void AfterUndelete(Map<Id, SObject> oldItems) {}

	


	public void AccountGeoCode (Map<Id, SObject> newItems) {

		Map<Id, Account> toUpdate = new Map<Id,Account>();

		for (SObject theSObject : newItems.values()) {

			Account acct = (Account)theSObject;
			toUpdate.put(acct.Id,acct);
			
			if (toUpdate.size() > 99 && CodeSettings__c.getInstance('AccountGeoCode').Enabled__c) {
					Id jobId = System.enqueueJob(new UpdateLatLonFromGeoNames(toUpdate, 'Account'));
					toUpdate.clear();
			}
		}
		if (toUpdate.size() > 0 && CodeSettings__c.getInstance('AccountGeoCode').Enabled__c) {
			Id jobId = System.enqueueJob(new UpdateLatLonFromGeoNames(toUpdate, 'Account'));
		}
	}

	public void AccountGeoCode (Map<Id, SObject> newItems, Map<Id, SObject> oldItems) {

		Map<Id, Account> toUpdate = new Map<Id,Account>();

		for (SObject theSObject : newItems.values()) {

			Account acct = (Account)theSObject;
			Account oldAcct = (Account)oldItems.get(acct.Id);

			if (oldAcct.BillingStreet != acct.BillingStreet || 
				oldAcct.BillingCity != acct.BillingCity ||
				oldAcct.BillingState != acct.BillingState ||
				oldAcct.BillingPostalCode != acct.BillingPostalCode ||
				oldAcct.BillingCountry != acct.BillingCountry) {

				toUpdate.put(acct.Id,acct);
			}
			if (toUpdate.size() > 99 && CodeSettings__c.getInstance('AccountGeoCode').Enabled__c) {
					Id jobId = System.enqueueJob(new UpdateLatLonFromGeoNames(toUpdate, 'Account'));
					toUpdate.clear();
			}
		}
		if (toUpdate.size() > 0 && CodeSettings__c.getInstance('AccountGeoCode').Enabled__c) {
			Id jobId = System.enqueueJob(new UpdateLatLonFromGeoNames(toUpdate, 'Account'));
		}
	}

}