const csv_to_json = require('./csv_to_json');
const fs = require('fs');
const csv_path = 'data/thanks_obama_content.csv';
const json_path = 'data/events.json';
const async = require('async');

async.waterfall([
    function(callback) {
        console.log('Converting to json');
        csv_to_json.convert_to_json(csv_path, callback);
    },
    function(json, callback) {
        console.log('Fetching assets');
        csv_to_json.fetch_assets(json, callback);
    },
    function(json) {
        console.log('Exporting to ' + json_path);
        fs.writeFile(json_path, JSON.stringify(json), function (error) {
            if (error) {
                return console.log(error);
            }
        });
    }
], function(err, results) {
    console.log('Error', err);
});

// TODO grab blurps from text/word document?