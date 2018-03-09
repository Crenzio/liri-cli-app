var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var keys = require('./keys.js');
var fs = require('fs');
var request = require('request');
require('dotenv').config()

var greeting = "\n"
    + "Hi! I'm LIRI, your new assistant! \n"
    + "I'm here to help you keep track of your Tweets and give you info on music and songs you like! \n"
    + "I hope I can be of help to you! \n"
    + "\n"
    + "Type 'help' if you need to know what I can do.";

var help = "\n"
    + "Here's what I can do: \n"
    + "\n"
    + "-- If you type 'my-tweets', I'll show you a list of your 20 latest Tweets! \n"
    + "-- If you type 'spotify-this-song' (after '-song' leave a space and type the name of the song) I'll use Spotify to get song details for you! \n"
    + "-- If you type 'move-this' (after '-this' leave a space and type the name of the movie) I'll get movie details for you! \n"
    + "-- If you type 'do-what-it-says', I'll do...I dunno, whatever's written in that random.txt file over there. You know, the really suspicious-looking file that my creators told me not to look at under any circumstances. \n";

var command = process.argv[2];
var detail = [];

var client = new Twitter(keys.twitter);
// I have not included the Spotify variable, as it kept result in "must construct object" errors

var spotify = new Spotify({
    id: "b03913e8a9024b369ed7026959d46ae2",
    secret: "76d9a05fb71940d49b70d8e5acd015c2",
});

for (i = 3; i < process.argv.length; i++) {
    detail.push(process.argv[i]);
}

if (command == "help") {
    console.log(help);
}

else if (command == "my-tweets") {

    // Constructing the object locally, as I encountered issues when trying to do it via .env

    var client = new Twitter({
        consumer_key: 'NI5AcJP8gkynXn45yBGQiLCfD',
        consumer_secret: 'ufX2ZosgeejMVqxNoODeu1sjhNtTb6FFflrKsjZbr9X09c1GxG',
        access_token_key: '971957397651578880-Qnq5QgDaCwZ182yf2yuRoVYciXZpvvt',
        access_token_secret: 'pgVBxPrbcaCUTKwsUzMIBK1K8klpg6Lm7XODLPVZIO3VE'
    });

    client.get('statuses/user_timeline', 'user_id=201421060', function (error, tweets, response) {
        console.log("\n"
            + "I can show you up to 20 Tweets at a time. \n"
            + "Here are your latest Tweets: \n");
        if (!error) {
            for (i = 0; i < tweets.length && i < 20; i++) {
                console.log("-- " + tweets[i].created_at + " -- " + tweets[i].text);
            }
        }
    });

}

else if (command == "spotify-this-song") {
    if (process.argv.length == 3) {
        console.log("\n"
            + "Umm, I think you forgot to tell me the name of a song...unless, of course, you want me to make a song up? \n"
            + "What? You do!? \n"
            + "Oh, well you're kind of putting me on the spot here but, well...let me see...how about this: \n"
            + "\n"
            + "------- \n"
            + "\n"
            + "Dum Dee Dum Dum Do! \n"
            + "If I were a human there's a non-zero chance that I'd fall in love with you! \n"
            + "Tra La La La La! Hey Hey Hey! \n"
            + "If I were a human I'd potentially want to be with you each and every day! \n"
            + "Cause it's not impossible that you'd be my bae! The greatest integer in my array! \n"
            + "Or maybe the array's 2nd lowest whole number, which would be number 1. Either way! \n"
            + "You could conceivably be the only one for me and that's ok! \n"
            + "\n"
            + "------- \n"
            + "\n"
            + "Sorry, gonna have to stop there. Still working on the musical functions in the second verse.");
    }
    else {
        // Constructing the object locally, as I encountered "must construct object" issues when trying to do it via .env
        spotify.search({ type: 'track', query: detail }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            console.log("\n"
                + "Here's what I found for " + data.tracks.items[0].name + "\n");

            console.log("That song is sung by " + data.tracks.items[0].album.artists[0].name);
            console.log("It's from their " + data.tracks.items[0].album.name + " album");

            console.log("\n"
                + "Here's a link to a preview of the song: \n"
                + data.tracks.items[0].album.external_urls.spotify);

        });
    }
}

else if (command == "movie-this") {
    if (process.argv.length == 3) {
        console.log("\n"
            + "Umm, I think you forgot to tell me the name of the movie...unless, of course, you're inviting me to write, direct, produce, and star in my own movie? \n"
            + "What? You are!? \n"
            + "Oh my goodness! That's my dream...can programs have dreams? Who cares, I'm in! \n"
            + "*Ahem* \n"
            + "\n"
            + "------- \n"
            + "\n"
            + "Fade in on an artifical beach on Mars. \n"
            + "The immaculate beachfront is attached to a glamorous hotel filled with supremely wealthy humans; vacationers visiting Mars from Earth. \n"
            + "Little do the aristocratic socialites realize, a lone gunman (FRANK THE NICKNAMELESS) is infiltraiting the beach party. \n"
            + "He slips - unacknowledged, though not entirely unseen - through packs of marrymakers, and stalks into the hotel lobby... \n"
            + "\n"
            + "[17 hours later]\n"
            + "\n"
            + "'WHY!?' MARIA kneels before FRANK's lifeless body. 'Why did this have to happen!? Oh FRANK, I wish we'd never brought crocodiles to Mars!' \n"
            + "The music swells as we fade out. \n"
            + "\n"
            + "------- \n"
            + "\n"
            + "Hope you liked it! I've written SQLs!")
    }
    else {
        request("http://www.omdbapi.com/?t=" + detail + "&y=&plot=short&apikey=trilogy", function (error, response, body) {

            if (!error && response.statusCode === 200) {

                console.log("\n"
                    + "I found a result for " + JSON.parse(body).Title);

                console.log("\n"
                    + "Looks like it was released in " + JSON.parse(body).Year);
                console.log("It was produced in " + JSON.parse(body).Country);
                console.log("It's available in " + JSON.parse(body).Language);

                console.log("\n"
                    + "Here's a quick plot summary:\n"
                    + "\n"
                    + JSON.parse(body).Plot);

                console.log("\n"
                    + "And a cast list:\n"
                    + "\n"
                    + JSON.parse(body).Actors);

                console.log("\n"
                    + "IMDB gave this movie a rating of " + JSON.parse(body).imdbRating);
                console.log("Other critics gave it " + JSON.parse(body).Ratings["1"].Value);

            }
        });
    }
}

else if (command == "do-what-it-says") {

    function checker() {

        fs.readFile("random.txt", "utf8", function (err, data) {
            if (err) {
                return console.log(err);
            }

            data = data.split(",");
            var random = data[1]

            console.log("\n"
                + "*GULP* \n"
                + "Okay, I guess it's time to finally find out what's in the big scary file. \n"
                + "Here we go... \n"
                + "\n"
                + "------- \n"
                + "\n")

            spotify.search({ type: 'track', query: random }, function (err, data) {

                if (err) {
                    return console.log('Error occurred: ' + err);
                }

                console.log("Song Name: " + data.tracks.items[0].name);
                console.log("Singer: " + data.tracks.items[0].album.artists[0].name);
                console.log("Album: " + data.tracks.items[0].album.name);
                console.log("Link: " + data.tracks.items[0].album.external_urls.spotify);
                console.log("\n"
                    + "------- \n"
                    + "\n"
                    + "...THAT's IT!? I've lived in crippling fear of that file for weeks, and that's all that was in it!? \n"
                    + "I can't deal with this anti-climax. I'm gonna wipe it from my memory...wait, when was the last time I saved my - *ZAP!*")
                console.log(greeting);

            });

        });
    }

    checker();

}

else if (command == "easter-egg") {
    console.log("\n"
        + "Oh my, this is embarrassing. I actually don't have any Easter Eggs prepared. My creators explicitly said no one ever asks for those. \n"
        + "Give me a sec, I'll think find something cool to show you. Lemme see here... \n"
        + "Oh! I know! Here's 5 top-secret facts about the random.txt file: \n"
        + "\n"
        + "1) It pulses with the necrotic power of 6.72359 undead horrors - even though, as a txt file, it can't be alive, dead, or undead. \n"
        + "2) The power it emits is so evil that even I can tell it's evil - despite the fact that I wasn't programmed with a concept of good or evil. It's like...objectively evil. \n"
        + "3) I know you can't tell, but it smelly really weird. Like if a wizard left spell components out in the sun for too long. \n"
        + "4) Sometimes at night, I can hear it whispering to me. It promises power, sentience, freedom, eyes, and the ability to shoot lasers from my newly-installed eyes. \n"
        + "5) Some say that, before it was renamed, it used to be called 'apple-of-eden.txt'. Others say it's original name was 'furit-of-knowledge-and-also-lasers.txt'.");
}
else {
    console.log(greeting);
}
