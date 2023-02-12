public class GeoNamesResponse {

	public class GeoCoderResult {
		public String adminCode2;
		public String streetName;
		public String adminCode1;
		public String adminName2;
		public String lng;
		public String city;
		public String countryCode;
		public String postalCode;
		public String adminName1;
		public String lat;
	}

	public GeoCoderResult geoCoderResult;
	
	public static GeoNamesResponse parse(String json) {
		return (GeoNamesResponse) System.JSON.deserialize(json, GeoNamesResponse.class);
	}
}