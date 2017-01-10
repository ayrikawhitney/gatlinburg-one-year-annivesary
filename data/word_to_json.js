const word_path = "Blurbs.docx";

var run_mammoth = function(path, callback) {
    mammoth.convertToHtml({path: path}, options).then(function(result){
        var html = result.value; // The generated HTML
        var messages = result.messages; // Any messages, such as warnings during conversion
        if (messages.length) {
            console.warn(messages);
        }
        callback(html);
    })
    .done();
};
