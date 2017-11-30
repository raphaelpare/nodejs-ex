var request = require('request');


module.exports = {
    slack: function(args) {
        request.post(
            'https://hooks.slack.com/services/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',
            { json: { text: 'Vous avez reçu un virement de ' + args.money + " EUR par " + args.receiver } },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body)
                }
            }
        );
    }
}

