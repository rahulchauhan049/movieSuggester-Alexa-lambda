let speechOutput;
let reprompt;
let welcomeOutput = "HI! i am your movie suggester. Please Tell me a genre you prefer, like action or comedy or any other.";
let welcomeReprompt = "Try saying,  suggest me a comedy movie.";
// 2. Skill Code =======================================================================================================
"use strict";
const Alexa = require('alexa-sdk');
const APP_ID = "amzn1.ask.skill.90da6ae1-fa48-4709-80be-b493e71998b4";  // TODO replace with your app ID (OPTIONAL).
speechOutput = '';
const handlers = {
	'LaunchRequest': function () {
		this.emit(':ask', welcomeOutput, welcomeReprompt);
	},
	'AMAZON.HelpIntent': function () {
		speechOutput = 'I suggest you various movies. To continue please tell me a genre you prefer like comedy, animated or any other.';
		reprompt = 'Try saying suggest me a animated movie';
		this.emit(':ask', speechOutput, reprompt);
	},
   'AMAZON.CancelIntent': function () {
		speechOutput = 'Alright cancelling';
		this.emit(':tell', speechOutput);
	},
   'AMAZON.StopIntent': function () {
		speechOutput = 'Alright Stopping now. Come back anytime if you can not decide what to watch.';
		this.emit(':tell', speechOutput);
   },
   'SessionEndedRequest': function () {
		speechOutput = '';
		//this.emit(':saveState', true);//uncomment to save attributes to db on session end
		this.emit(':tell', speechOutput);
   },
	'AMAZON.FallbackIntent': function () {
		speechOutput = 'Oops!, i dont know about that genre. Try saying something similar like, tell me a horror movie to watch tonight.';

		//any intent slot variables are listed here for convenience


		//Your custom intent handling goes here
		speechOutput = "Oops!, i dont know about that genre. Try saying something similar like, tell me a horror movie to watch tonight.";
		this.emit(":ask", speechOutput, speechOutput);
    },
	'AMAZON.NavigateHomeIntent': function () {
		speechOutput = '';

		//any intent slot variables are listed here for convenience


		//Your custom intent handling goes here
		speechOutput = "Try saying i want to see a comedy movie tonight";
		this.emit(":ask", speechOutput, speechOutput);
    },
	'movie': function () {
		speechOutput = '';

		//any intent slot variables are listed here for convenience

		let genreSlotRaw = this.event.request.intent.slots.genre.value;
		console.log(genreSlotRaw);
		let genreSlot = resolveCanonical(this.event.request.intent.slots.genre);
		console.log(genreSlot);
		let movie = movieSuggest(genreSlot);

		//Your custom intent handling goes here
		speechOutput = `I suggest you to watch ${movie}. I find it so intresting. Do you want any other movie suggestions? If yes tell me genre you prefer, otherwise say stop.`;
		this.emit(":ask", speechOutput, speechOutput);
    },	
	'Unhandled': function () {
        speechOutput = "The skill didn't quite understand what you wanted.  Do you want to try something else?";
        this.emit(':ask', speechOutput, speechOutput);
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
	//alexa.dynamoDBTableName = 'DYNAMODB_TABLE_NAME'; //uncomment this line to save attributes to DB
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function movieSuggest(genre){
    let movie;
    if(genre === 'comedy'){
            movie = [`Superbad`, `This Is Spinal Tap`, `Scary Movie`];
        }
        else if(genre === 'action'){
            movie = [`Die Hard`, `James Bond`, `The Avengers`, `Hitman`, `John wick`];
        }
        else if(genre === 'adventure'){
            movie = [`King Kong`, `Crouching Tiger Hidden Dragon`,`300`, `fast and furious`, `sherlock holmes`];
        }
        else if(genre === 'animation'){
            movie = [`Up`, `Ice age`, `Moana`, `emperor’s new groove`, `Kung fu panda`];
        }
        else if(genre === 'crime'){
            movie = [`Pulp Fiction`, `The Godfather`, `New Jack City`];
        }
        else if(genre === 'children'){
            movie = [`Space Jam`, `Wizard of Oz`, `Toy Story`];
        }
        else if(genre === 'drama'){
            movie = [`Taxi Driver`, `Do The Right Thing`, `Schindler’s List`];
        }
        else if(genre === 'fantasy'){
            movie = [`Harry Potter`, `The Neverending Story`];
        }
        else if(genre === 'historical'){
            movie = [`Gandhi`, `Apollo 13`, `The Diary of Anne Frank`];
        }
        else if(genre === 'horror'){
            movie = [`Dracula`, `The Exorcist`, `Rosemary’s Baby`];
        }
        else if(genre === 'mystery'){
            movie = [`Chinatown`, `L.A. Confidential`, `Vertigo`];
        }
        else if(genre === 'romance'){
            movie = [`Brokeback Mountain`, `Pretty Woman`, `Titanic`];
        }
        else if(genre === 'fiction'){
            movie = [`Star Trek`, `Alien`, `Blade Runner`, `Inception`, `Brazil`];
        }
        else if(genre === 'spy'){
            movie = [`Mission Impossible`, `James Bond`, `Austin Powers`];
        }
        else if(genre === 'thriller'){
            movie = [`Psycho`, `Silence of the Lambs`, `The Sixth Sense`, `The edge of tommorow`];
        }
        else{
            movie = undefined;
        }
        if(movie){
        let num = movie.length;
      return movie[Math.floor(Math.random()*num)];
        }
        else {
            movie = [`Psycho`, `Silence of the Lambs`, `The Sixth Sense`, `The edge of tommorow`,`Mission Impossible`, `James Bond`, `Austin Powers`, `Star Trek`, `Alien`, `Blade Runner`, `Inception`, `Brazil`, `Dracula`, `The Exorcist`, `Rosemary’s Baby`, `Space Jam`, `Wizard of Oz`, `Toy Story`, `Taxi Driver`, `Do The Right Thing`, `Schindler’s List`, `Superbad`, `This Is Spinal Tap`, `Scary Movie`];
            let num = movie.length;
            return movie[Math.floor(Math.random()*num)];
        }
}



function resolveCanonical(slot){
	//this function looks at the entity resolution part of request and returns the slot value if a synonyms is provided
	let canonical;
    try{
		canonical = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
	}catch(err){
	    console.log(err.message);
	    canonical = slot.value;
	};
	return canonical;
};

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
	  let updatedIntent= null;
	  // updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      //this.emit(":delegate", updatedIntent); //uncomment this is using ASK SDK 1.0.9 or newer
	  
	  //this code is necessary if using ASK SDK versions prior to 1.0.9 
	  if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', updatedIntent, null),
			shouldEndSession: false
		});
		this.emit(':responseReady', updatedIntent);
		
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      //this.emit(":delegate"); //uncomment this is using ASK SDK 1.0.9 or newer
	  
	  //this code necessary is using ASK SDK versions prior to 1.0.9
		if(this.isOverridden()) {
			return;
		}
		this.handler.response = buildSpeechletResponse({
			sessionAttributes: this.attributes,
			directives: getDialogDirectives('Dialog.Delegate', null, null),
			shouldEndSession: false
		});
		this.emit(':responseReady');
		
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.event.request.intent));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}


function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    let i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
function isSlotValid(request, slotName){
        let slot = request.intent.slots[slotName];
        //console.log("request = "+JSON.stringify(request)); //uncomment if you want to see the request
        let slotValue;

        //if we have a slot, get the text and store it into speechOutput
        if (slot && slot.value) {
            //we have a value in the slot
            slotValue = slot.value.toLowerCase();
            return slotValue;
        } else {
            //we didn't get a value in the slot.
            return false;
        }
}

//These functions are here to allow dialog directives to work with SDK versions prior to 1.0.9
//will be removed once Lambda templates are updated with the latest SDK

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam['speech']
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam['speech'] || optionsParam
        };
    }
}

function buildSpeechletResponse(options) {
    let alexaResponse = {
        shouldEndSession: options.shouldEndSession
    };

    if (options.output) {
        alexaResponse.outputSpeech = createSpeechObject(options.output);
    }

    if (options.reprompt) {
        alexaResponse.reprompt = {
            outputSpeech: createSpeechObject(options.reprompt)
        };
    }

    if (options.directives) {
        alexaResponse.directives = options.directives;
    }

    if (options.cardTitle && options.cardContent) {
        alexaResponse.card = {
            type: 'Simple',
            title: options.cardTitle,
            content: options.cardContent
        };

        if(options.cardImage && (options.cardImage.smallImageUrl || options.cardImage.largeImageUrl)) {
            alexaResponse.card.type = 'Standard';
            alexaResponse.card['image'] = {};

            delete alexaResponse.card.content;
            alexaResponse.card.text = options.cardContent;

            if(options.cardImage.smallImageUrl) {
                alexaResponse.card.image['smallImageUrl'] = options.cardImage.smallImageUrl;
            }

            if(options.cardImage.largeImageUrl) {
                alexaResponse.card.image['largeImageUrl'] = options.cardImage.largeImageUrl;
            }
        }
    } else if (options.cardType === 'LinkAccount') {
        alexaResponse.card = {
            type: 'LinkAccount'
        };
    } else if (options.cardType === 'AskForPermissionsConsent') {
        alexaResponse.card = {
            type: 'AskForPermissionsConsent',
            permissions: options.permissions
        };
    }

    let returnResult = {
        version: '1.0',
        response: alexaResponse
    };

    if (options.sessionAttributes) {
        returnResult.sessionAttributes = options.sessionAttributes;
    }
    return returnResult;
}

function getDialogDirectives(dialogType, updatedIntent, slotName) {
    let directive = {
        type: dialogType
    };

    if (dialogType === 'Dialog.ElicitSlot') {
        directive.slotToElicit = slotName;
    } else if (dialogType === 'Dialog.ConfirmSlot') {
        directive.slotToConfirm = slotName;
    }

    if (updatedIntent) {
        directive.updatedIntent = updatedIntent;
    }
    return [directive];
}