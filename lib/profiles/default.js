module.exports = {
	createRecordMutator: function (metadata) {
		
		return function(record){
			return record;
		}
	},
	getMetadata: function () {
		return [];
	}
};
