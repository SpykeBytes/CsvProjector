# CsvProjector
This utility will allow you to take CSV files and mutate them into JSON with a configured set of mapped mutator functions.

Using the sample mutator file, create your own file for mutations and call on it by name.

  ex., csvprojector -project 'csvfile.csv' -with 'myMutations.json'
