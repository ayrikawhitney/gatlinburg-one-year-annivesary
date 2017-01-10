const csv = require('csvtojson');
const request = require('request');
const fs = require('fs');

// TODO clean up, replace \r\n from any text and replace ? with single quote

module.exports = {
    convert_to_json: function (csv_path, callback) {
        csv()
            .fromFile(csv_path)
            .on('end_parsed', (json)=> {
                callback(null, json);
            })
            .on('done', (error)=> {
                if (error) {
                    callback(error);
                    console.log('Error: ' + error.message);
                }
            });

    },

    get_image: function (ratios, desired_ratio = "16_9", desired_width = 1280) {
        var image = null;
        if (ratios) {
            for (var i = 0; i < ratios.length; i += 1) {
                var ratio = ratios[i];
                if (ratio.name === desired_ratio) {
                    for (var j = 0; j < ratio.crop.length; j += 1) {
                        var crop = ratio.crop[j];
                        if (crop.width === desired_width) {
                            image = crop.path;
                        }
                    }
                }
            }
        }
        return image;
    },

    fetch_asset: function (item, callback) {
        // strip asset
        var asset = item.asset.replace(/^\s+|\s+$/g, ''),
            _this = this;
        // validate integer
        if (parseInt(asset).toString() === asset) {
            console.log('Fetching ' + item.asset);
            var url = "http://api.gannett-cdn.com/aime/AssetsService.svc/asset/" + asset.toString() + "?api_key=57646bc6bca4811fea0000016975919aec174f7053325752cecd9565";
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    var asset_data = JSON.parse(body),
                        // Assets is provided to story assets but URL can't be determined
                        ratios = asset_data.ratios,// || asset_data.Assets[0].ratios,
                        image_url = _this.get_image(ratios);
                    if (image_url && image_url.indexOf('/-mm-/') !== -1) {
                        item.image = 'http://www.gannett-cdn.com' + image_url;
                    }
                    callback();
                }
                else {
                    callback();
                }
            });
        }
        // not an integer, callback without image
        else {
            callback();
        }
    },

    fetch_assets: function (items, callback) {
        var request_cnt = 0;
        for (var i = 0; i < items.length; i += 1) {
            var item = items[i];
            request_cnt += 1;
            this.fetch_asset(item, function () {
                request_cnt -= 1;
                if (request_cnt === 0 && i === items.length) {
                    callback(null, items);
                }
            });
        }
        // no requests were made
        if (request_cnt === 0) {
            callback(null, items);
        }
    }
};