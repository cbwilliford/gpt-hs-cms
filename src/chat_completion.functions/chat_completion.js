// called over https://www.grocerygardens.com/_hcms/api/chat/completion (or any other connected domain)

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.openai_token,
});

const openai = new OpenAIApi(configuration);

const model = "gpt-3.5-turbo"

const getChatCompletion = async (messagesArray, model) => {
  return await openai.createChatCompletion({
    model,
    messages: messagesArray,
  });
}

exports.main = async ({ body }, sendResponse) => {

  const {messages=[]} = body;
  const systemPrompt = { role: "system", content: "You are a friendly assistant." }

  try{
    const completion = await getChatCompletion([systemPrompt, ...messages], model)

    sendResponse({ body: { response: completion.data.choices[0].message.content}, statusCode: 200 });

  } catch (error) {
    if (error.response) {
      console.log("inner error: ", error.data)
      sendResponse({ body: { error: error.data.message }, statusCode: error.response.status });
    } else {
      console.log("outererror: ", error)
      sendResponse({ body: { error: error.message }, statusCode: 500 });
    }
  }

};
