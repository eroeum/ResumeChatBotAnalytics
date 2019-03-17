import { ActivityTypes, ConversationState, MemoryStorage } from 'botbuilder-core';
import 'botframework-webchat/botchat.css';
import { App } from 'botframework-webchat/built/App';
import './css/app.css';
import { WebChatAdapter } from './webChatAdapter';

// Create the custom WebChatAdapter.
const webChatAdapter = new WebChatAdapter();

// Create user and bot profiles.
// These profiles fill out additional information on the incoming and outgoing Activities.
export const USER_PROFILE = { id: 'Me!', name: 'Me!', role: 'user' };
export const BOT_PROFILE = { id: 'bot', name: 'bot', role: 'bot' };

// Connect our BotFramework-WebChat App instance with the DOM.
App({
    user: USER_PROFILE,
    bot: BOT_PROFILE,
    botConnection: webChatAdapter.botConnection
}, document.getElementById('bot'));

let https = require ('https');
let accessKey = '57755f786c1a4c6f85404ac9d7e47c37';


let uri = 'eastus.api.cognitive.microsoft.com';
let path = '/text/analytics/v2.0/keyPhrases';

let response_handler = function (response) {
    let body = '';
    response.on ('data', function (d) {
        body += d;
    });
    response.on ('end', function () {
		let body_ = JSON.parse (body);
		let body__ = JSON.stringify (body_, null, '  ');
        console.log (body__);
    });
    response.on ('error', function (e) {
        console.log ('Error: ' + e.message);
    });
};

let get_key_phrases = function (documents) {
	let body = JSON.stringify (documents);

	let request_params = {
		method : 'POST',
		hostname : uri,
		path : path,
		headers : {
			'Ocp-Apim-Subscription-Key' : accessKey,
		}
	};

	let req = https.request (request_params, response_handler);
	req.write (body);
	req.end ();
}

// Instantiate MemoryStorage for use with the ConversationState class.
const memory = new MemoryStorage();

// Add the instantiated storage into ConversationState.
const conversationState = new ConversationState(memory);

// Create a property to keep track of how many messages are received from the user.
const countProperty = conversationState.createProperty('turnCounter');

// Register the business logic of the bot through the WebChatAdapter's processActivity implementation.
webChatAdapter.processActivity(async (turnContext) => {
    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    if (turnContext.activity.type === ActivityTypes.Message) {
        // Read from state.
        let count = await countProperty.get(turnContext);
        count = count === undefined ? 1 : count;
        if (count === 1) {
            //await turnContext.sendActivity(`${ count }: You said "${ turnContext.activity.text }"`);
            await turnContext.sendActivity('Hello and welcome to an in-chat resume builder!  To get started, let us get some general information.  What is your first and last name?');
            console.log(turnContext.activity.text);
        }

        if (count === 2) {
            await turnContext.sendActivity(`Hi "${ turnContext.activity.text}"! What school do you attend?`);
            console.log(turnContext.activity.text);
        }

        if (count === 3) {
            await turnContext.sendActivity(`What is currently your GPA out of a 4.0 scale?`);
            console.log(turnContext.activity.text);
        }

        if (count === 4) {
            await turnContext.sendActivity(`What are you currently studying in?`);
            console.log(turnContext.activity.text);
        }

        if (count === 5) {
            await turnContext.sendActivity(`Are you part of any clubs?  If so, please briefly describe them.  Make sure to include any leadership positions`);
            console.log(turnContext.activity.text);
        }

        if (count === 6) {
            await turnContext.sendActivity(`Have you participated in any internships?  If so, please briefly describe them.  Make sure to include any leadership positions`);
            let documents = {'documents': [
                { 'id': '1', 'language': 'en', 'text': turnContext.activity.text }
            ]};
            get_key_phrases(documents);
        }

        if (count === 7) {
            await turnContext.sendActivity(`Did you ever have any other form of employment?  If so, please briefly describe them.  Make sure to include any leadership positions`);
            let documents = {'documents': [
                { 'id': '1', 'language': 'en', 'text': turnContext.activity.text }
            ]};
            get_key_phrases(documents);
        }

        if (count === 8) {
            await turnContext.sendActivity(`Do you have any particular projects that you are proud of?  If so, please briefly describe them.  Make sure to include any leadership positions`);
            let documents = {'documents': [
                { 'id': '1', 'language': 'en', 'text': turnContext.activity.text }
            ]};
            get_key_phrases(documents);
        }

        if (count === 9) {
            await turnContext.sendActivity(`What are your interests?`);
            let documents = {'documents': [
                { 'id': '1', 'language': 'en', 'text': turnContext.activity.text }
            ]};
            get_key_phrases(documents);
        }

        if (count === 10) {
            await turnContext.sendActivity(`What are your skills?`);
            let documents = {'documents': [
                { 'id': '1', 'language': 'en', 'text': turnContext.activity.text }
            ]};
            get_key_phrases(documents);
        }

        if (count === 11) {
            await turnContext.sendActivity(`If you have any other information that you want me to know, please do so at this time.`);
            let documents = {'documents': [
                { 'id': '1', 'language': 'en', 'text': turnContext.activity.text }
            ]};
            get_key_phrases(documents);
        }

        // Increment and set turn counter.
        await countProperty.set(turnContext, ++count);
    } else {
        await turnContext.sendActivity(`[${ turnContext.activity.type } event detected]`);
    }
    await conversationState.saveChanges(turnContext);
});

// Prevent Flash of Unstyled Content (FOUC): https://en.wikipedia.org/wiki/Flash_of_unstyled_content
document.addEventListener('DOMContentLoaded', () => {
    window.requestAnimationFrame(() => {
        document.body.style.visibility = 'visible';
        // After the content has finished loading, send the bot a "conversationUpdate" Activity with the user's information.
        // When the bot receives a "conversationUpdate" Activity, the developer can opt to send a welcome message to the user.
        webChatAdapter.botConnection.postActivity({
            recipient: BOT_PROFILE,
            membersAdded: [ USER_PROFILE ],
            type: ActivityTypes.ConversationUpdate
        });
    });
});
