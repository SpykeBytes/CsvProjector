module.exports = {
        description: "the default profile",
        createRecordMutator: function (metadata) {

		return function(record){
			return record;
		}
	},
	getMetadata: function () {
		return [];
	}
};
