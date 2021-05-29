sap.ui.define([],

	function(

) {
	return {

		available_capacity: function (sValue) {
			if( sValue === '0' ){
				sValue = 'No Slots';
				return sValue;
			}
		}
	};
});
