sap.ui.define([
	],

	// eslint-disable-next-line strict
	function(
	json

) {
	return {

		// eslint-disable-next-line camelcase
		available_capacity: function (sValue) {
			if ( sValue === 0 ){
				sValue = 'No Slots';

			} else {
				sValue = 'Available: '+sValue;
			}
			return sValue;
		},
	};
});
