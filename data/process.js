const csv_to_json = require('./csv_to_json');
const word_to_json = require('./word_to_json')
const fs = require('fs');
const async = require('async');

const csv_path = 'data/thanks_obama_content.csv';
const json_path = 'assets/data/events.json';
const word_path = "data/Blurbs.docx";

async.waterfall([
    function(callback) {
        console.log('Converting csv to json');
        csv_to_json.convert_to_json(csv_path, callback);
    },
    function(csv_json, callback) {
        console.log('Fetching json assets');
        csv_to_json.fetch_assets(csv_json, callback);
    },
    function(csv_json, callback) {
        console.log('Extracting blurbs from docx');
        word_to_json.convert_docx_to_json(word_path, function(word_json) {
            callback(null, csv_json, word_json);
        });
    },
    function(csv_json, word_json, callback) {
        console.log('Merging blurbs with csv data');
        for (var i = 0; i < csv_json.length; i += 1) {
            var item = csv_json[i];
            if (word_json[item.blurb]) {
                // update blubs
                item.blurb = word_json[item.blurb].blurb;
            }
            // no blurb in word document, remove reference id
            else {
                delete item.blurb
            }
            // remove assets
            delete item.asset;
        }
        callback(null, csv_json);
    },
    function(result) {
        console.log('Exporting to ' + json_path);
        fs.writeFile(json_path, JSON.stringify(result), function (error) {
            if (error) {
                return console.log(error);
            }
        });
    }
], function(err, results) {
    console.log('Error', err);
});