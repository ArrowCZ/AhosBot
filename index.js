const Discord = require("discord.js");
const YTDL = require("ytdl-core");
const weather = require("weather-js");
var randomCat = require('random-cat'); // lorem pixel dow


const PREFIX = "!";

var bot = new Discord.Client();
var servers = {};
var isReady = true;

function play(connection, msg) {
	var server = servers[msg.guild.id];
	
	server.dispatcher = connection.playStream(YTDL(server.queue[0], {filter: "audioonly"}));
	
	server.queue.shift();
	
	server.dispatcher.on("end", () => {
		if(server.queue[0]) play(connection,msg);
		else connection.disconnect();
	});
}

var express = require('express');
var app     = express();

app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
    var result = 'App is running'
    response.send(result);
}).listen(app.get('port'), function() {
    console.log('App is running, server is listening on port ', app.get('port'));
});

var hlasky = [

				"Jou Arrow ty jedes",
                "Zenského pohlavi jsi muj jediny pritel",
                "Pekny auto je zakladem toho, aby sis nasel devku.",
                "Pozri ako sa tam priopeka ten debil, ako spekacik",
                "I don't want any nasili",
                "Bussines is normal",
                "Jaro je jedním ze ctyr rocnich obdobi",
                "Ukradnu ti svacinu - Jaro, neznámé datum",
                "Naladte si harny radio!",
                "Dostavam zachvaty lehke mentalni nestability",
                "Tys tam se mnou musela ztratit pulku zivota",
                "Ja jsem ten loupeznik",
                "100% not cringe",
                "<:Harny:265111708081586177>",
                "<:arrowgasm:295176080615276544>",
                "<:Hello:266983130198573073>"

];

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
  bot.user.setActivity("!help");
  
});

bot.on("guildMemberAdd", member => {
	member.guild.channels.find("name", "prosuta").sendMessage(member.toString() + " Ahoj krasavce!");
	
	member.addRole(member.guild.roles.find("name", "Šupák"));
	
	
});



bot.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('Pong!');
  }
 
  
  if(!msg.content.startsWith(PREFIX)) return;
  
  var args = msg.content.substring(PREFIX.length).split(" ");
  
  switch (args[0].toLowerCase()) {
	   case "help":
		msg.channel.sendMessage("Ahoj, jsem oficialni bot verze 2.0 psany pomoci jazyku JavaScript serveru AHOS CREW. Pomoci prikazu '!prikazy se muzes podivat na seznam prikazu.");
		break;
		case "hlasky":
				msg.channel.sendMessage(hlasky[Math.floor(Math.random() * hlasky.length)]);		
		break;
		case "prikazy":
		var embed = new Discord.RichEmbed()
			.addField("!help", "Info o botu")
			.addField("!prikazy", "Seznam vsech dostupnych prikazu")
			.addField("!hlasky", "Popularni hlasky nasi party")
			.addField("!play", "Zahraju muziku. Musis udat Youtube url songu, ktery chces hrat ve formatu '!play url'")
			.addField("!skip", "Pokud das play na vice songu, naskladaji se za sebou do poradi. Prikazem !skip skocis na dalsi songu v poradi.")
			.addField("!stop", "Nechces-li dale poslouchat bota, timto ho zastavis.")
			.addField("!spaghet, !shutup, !gj", "Tajne hlasky")
			.addField("!pocasi 'MESTO'", "Ukazu pocasi pro zadane mesto, podporuji ceske nazvy ci PSC.")
			.addField("!kocka", "Poslu nahodnou kocku ^^")
			.addField("!brb [delka], [h,m]", "Ukaze vsem, na jak dlouho jdes afkovat a prehodi te do AFK kanalu. h = hodiny, m = minuty.")
			.addBlankField()
			.addField("RADIA", "-")
			.addField("!e2", "Budu hrat radio Evropa 2. Pro zastaveni pouzij !stop.")
			.addField("!pohadka", "Budu hrat radio Pohadka")
			.addField("!cr2", "Budu hrat radio Cesky Rozhlas 2")
			.addField("!ddur", "Budu hrat radio Cesky Rozhlas - Ddur")
			.addField("!country", "Budu hrat Country radio")
			.addField("!fajn", "Budu hrat Fajn radio")
			.setColor(0x0080FF)
			.setTimestamp(new Date())
			.setFooter("@By Arrow", bot.user.avatarURL)
			.setThumbnail(bot.user.avatarURL);
			msg.channel.sendEmbed(embed);
		break;
		case "play":
			if(!args[1]) {
				msg.channel.sendMessage("Potrebuji validni link");
				return;
			}
			
			if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
			
			if (!servers[msg.guild.id]) servers[msg.guild.id] = {
				queue: []
			}
		
			var server = servers[msg.guild.id];
			
			server.queue.push(args[1]);
			
			if (!msg.guild.voiceConnection) msg.member.voiceChannel.join().then(function(connection) {
				play(connection,msg);
			});
		break;
		case "skip":
			var server = servers[msg.guild.id];
			
			if(server.dispatcher) server.dispatcher.end();
		break;
		case "stop":
			var server = servers[msg.guild.id];
			
			if (msg.guild.voiceConnection) msg.guild.voiceConnection.disconnect();
		break;
		case "shutup":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
			if (isReady)
			{
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playFile('./sounds/shutup.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "spaghet":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
		if (isReady)
			{
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playFile('./sounds/spaghet.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "e2":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
		if (isReady)
			{
				msg.channel.sendMessage("Prave hraji radio Evropa 2.");
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playArbitraryInput('http://icecast3.play.cz/evropa2-64.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "pohadka":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
		if (isReady)
			{
				msg.channel.sendMessage("Prave hraji radio Pohadka.");
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playArbitraryInput('http://ice3.abradio.cz/pohadka64.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "cr2":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
		if (isReady)
			{
				msg.channel.sendMessage("Prave hraji radio Cesky Rozhlas 2.");
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playArbitraryInput('http://icecast4.play.cz/cro2-64.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "country":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
		if (isReady)
			{
				msg.channel.sendMessage("Prave hraji Country radio.");
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playArbitraryInput('http://icecast2.play.cz:8000/country64.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "fajn":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
		if (isReady)
			{
				msg.channel.sendMessage("Prave hraji Fajn radio.");
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playArbitraryInput('http://ice.abradio.cz:8000/fajn128.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "ddur":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
		if (isReady)
			{
				msg.channel.sendMessage("Prave hraji radio Cesky rozhlas - Ddur.");
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playArbitraryInput('http://icecast8.play.cz/croddur-64.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "pocasi":
		
		weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
		  if(err) msg.channel.send.log(err);		 
	
			 if (result === undefined || result.length === 0) {
				  msg.channel.send('Zadej validni lokaci.') 
                return; 
				 
			 }
	
		 // msg.channel.send(JSON.stringify(result[0].current, null, 2));
		 
		  var current = result[0].current;
          var location = result[0].location;
		 
		 const embed = new Discord.RichEmbed()
		   .setDescription(`${current.skytext}`)
		 .setAuthor(`Pocasi pro ${current.observationpoint}`) 
          .setThumbnail(current.imageUrl) 
          .setColor(0x0080FF) 
          .addField('Casova zona',`UTC${location.timezone}`, true)
                .addField('Teplota',`${current.temperature} Stupnu C`, true)
                .addField('Pocitova teplota', `${current.feelslike} Stupnu C`, true)
                .addField('Vzduch',current.winddisplay, true)
                .addField('Vlhkost vzduchu', `${current.humidity}%`, true)
				 .addField('Den', `${current.day}`, true)
				 .addField('Datum', `${current.date}`, true)
				.setTimestamp(new Date())
			.setFooter("@By Arrow", bot.user.avatarURL)
		 
		 msg.channel.send({embed});
		});
		break;
		//case "loop": 
		//	var interval = setInterval (function () {
			//	msg.channel.send("Evi peces maso")
			//}, 1 * 900000); 
		//break;
		case "kocka":
		
		var url = randomCat.get();
		
		
		 msg.channel.sendMessage({
        "embed": {
                "image": {
                "url": url,
                }
            }
        });
		
		break;
		case "gj":
		if (!msg.member.voiceChannel) {
				msg.channel.sendMessage("Musis byt ve voice kanalu.");
				return;
			}
			if (isReady)
			{
				isReady = false;
				var voiceChannel = msg.member.voiceChannel;
			  voiceChannel.join().then(connection =>
			  {
				 const dispatcher = connection.playFile('./sounds/gj.mp3');
				 dispatcher.on("end", end => {
				   voiceChannel.leave();
				   });
			   }).catch(err => console.log(err));
			   isReady = true;
			}
		break;
		case "brb":
		
		if(!args[1]) {
				msg.channel.sendMessage("Zadej cas tveho afkovani");
				return;
			}
			if(!args[2]) {
				msg.channel.sendMessage("Zadej jednotku casu (m,h)");
				return;
			}
			var minuty;
			var cas = args[1] ;
			var jednotka = args[2];
			if (args[2] == "m")
			{
				if (cas >= 60)
				{
					hodiny = Math.round(cas / 60);
					minuty = cas%60;
					msg.channel.sendMessage("Uzivatel " + msg.author + " sel afkovat po dobu " + hodiny + " hodin a " + minuty + " minut" );
					msg.member.setVoiceChannel('261872041379102721');
					
				}
				else
				{
					msg.channel.sendMessage("Uzivatel " + msg.author + " sel afkovat po dobu " + cas + " minut" );
					msg.member.setVoiceChannel('261872041379102721');
				}
		
			}
			else if (args[2] == "h")
			{
				msg.channel.sendMessage("Uzivatel " + msg.author + " sel afkovat po dobu " + cas + " hodin" );
				msg.member.setVoiceChannel('261872041379102721');
			}
			else
			{
				msg.channel.sendMessage("Spatna jednotka casu");
			}

						
		break;
		
		default:
		msg.channel.sendMessage("Nerozumim...");
  }
  
});

bot.login(TOKEN);