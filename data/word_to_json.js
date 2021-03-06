const mammoth = require("mammoth");
const fs = require('fs');
const jsdom = require("jsdom");
const async = require('async');

module.exports = {

    convert_docx_to_json: function(word_path, complete_callback) {
        var _this = this;
        async.waterfall([
            function(callback) {
                console.log('Converting to html');
                _this.convert_docx_to_html(word_path, callback);
            },
            function(html, callback) {
                console.log('Converting to json assets');
                var json = _this.convert_html_to_json(html);
                complete_callback(json);
            }
        ], function(err, results) {
            console.log('Error', err);
        });
    },

    convert_docx_to_html: function (path, callback) {
        mammoth.convertToHtml({path: path}, {
            styleMap: []
        }).then(function (result) {
            var html = result.value; // The generated HTML
            var messages = result.messages; // Any messages, such as warnings during conversion
            if (messages.length) {
                console.warn(messages);
            }
            callback(null, html);
        })
        .done();
    },

    find_obj_placeholder: function (obj, placeholder = '@') {
        var keys = Object.keys(obj),
            placeholder_key = null;
        for (var i = 0; i < keys.length; i += 1) {
            var key = keys[i],
                property = obj[key];
            if (property === placeholder) {
                placeholder_key = key;
                break;
            }
        }
        return placeholder_key;
    },

    convert_html_to_json: function (html_str) {
        var _this = this,
            json = {},
            document = jsdom.jsdom(html_str),
            lines = document.querySelectorAll('p'),
            text_json = null,
            property_placeholder = null,
            fetch_next_line = false;
        for (var i = 0; i < lines.length; i += 1) {
            var line = lines[i],
                text = line.innerHTML;
            if (fetch_next_line) {
                text_json[property_placeholder] = text;
                fetch_next_line = false;
            }
            // [[ ]] contain json within
            else if (text.indexOf('[[') !== -1 && text.indexOf(']]') !== -1) {
                text = text.replace('[[', '');
                text = text.replace(']]', '');
                // word has a tendency to use “ and ” for quotes, replace all
                text = text.replace(new RegExp("“", 'g'), '"');
                text = text.replace(new RegExp("”", 'g'), '"');
                // convert text to json
                try {
                    text_json = JSON.parse(text);
                    if (text_json.id) {
                        json[text_json.id] = text_json;
                        property_placeholder = _this.find_obj_placeholder(text_json);
                        if (property_placeholder) {
                            fetch_next_line = true;
                        }
                    }
                }
                catch (e) {
                    console.log('unable to parse "' + text + '"');
                }
            }
        }
        return json;
    }
};