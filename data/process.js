const csv_to_json = require('./csv_to_json');
const word_to_json = require('./word_to_json')
const fs = require('fs');
const async = require('async');

const csv_path = 'data/thanks_obama_content.csv';
const json_path = 'data/events.json';
const word_path = "data/Blurbs.docx";

async.waterfall([
    // function(callback) {
    //     console.log('Converting csv to json');
    //     csv_to_json.convert_to_json(csv_path, callback);
    // },
    // function(csv_json, callback) {
    //     console.log('Fetching json assets');
    //     csv_to_json.fetch_assets(csv_json, callback);
    // },
    // // function(csv_json, callback) {
    // //     console.log('Fetching json assets');
    // //     csv_to_json.fetch_assets(csv_json, callback);
    // // },
    function(callback) {
        word_to_json.convert_docx_to_json(word_path, callback);
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