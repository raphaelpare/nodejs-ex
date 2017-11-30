var request = require('request');

<<<<<<< HEAD

module.exports = {
    slack: function(args) {
        request.post(
            'https://hooks.slack.com/services/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',
            { json: { text: 'Vous avez reçu un virement de ' + args.money + " EUR par " + args.receiver } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
=======
var slack = function(args) {
    request.post(
        'https://hooks.slack.com/services/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',
        { json: { text: 'Vous avez reçu un virement' } },
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
>>>>>>> e6eceed3da3f88c65d329d9d8b689e3e7f4b51b7
            }
        );
    }
}

