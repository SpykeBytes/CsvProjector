var parsers = require('./parsers');

var metadata = [];

metadata.push({
	category: 'country-gender-counts'
});

function updateCountryGenderCounts(record) {

	var country = record.country;

	metadata[0][country] = metadata[0][country] || { maleStreams: 0, femaleStreams: 0, unknownStreams: 0 };

	if (record.gender === 'male')
		metadata[0][country].maleStreams += record.streams;
	else if (record.gender === 'female')
		metadata[0][country].femaleStreams += record.streams;
	else
		metadata[0][country].unknownStreams += record.streams;

	return metadata;
}

module.exports = {
        description: "A Playlist demo profile",
	createRecordMutator: function () {

		return function(record){

			record.date = parsers.parseDate(record.date);

			updateCountryGenderCounts(record);
		}
	},
	getMetadata: function () {
		return metadata;
	}
};
