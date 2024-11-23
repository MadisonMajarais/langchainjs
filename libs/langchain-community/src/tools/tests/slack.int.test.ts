import { test } from "@jest/globals";
import {
 SlackGetMessagesTool,
} from "../slack.js";
// import { AgentExecutor, createOpenAIToolsAgent } from "@langchain/agents";

// const chat = new ChatOpenAI({
//     model: "gpt-3.5-turbo-1106",
//     temperature: 0,
//   });

//   const prompt = ChatPromptTemplate.fromMessages([
//     [
//       "system",
//       "You are a helpful assistant. You may not need to use tools for every query - the user may just want to chat!",
//     ],
//     new MessagesPlaceholder("messages"),
//     new MessagesPlaceholder("agent_scratchpad"),
//   ]);

// const tools = [
//     new SlackGetMessagesTool()
// ]
//   const agent = await createOpenAIToolsAgent({
//     llm: chat,
//     tools,
//     prompt,
//   });
  
//   const agentExecutor = new AgentExecutor({ agent, tools });

test("SlackGetMessagesTool", async () => {
    // Search and get message
const getMessageTool = new SlackGetMessagesTool();
const messageResults = await getMessageTool.invoke("test");
console.log("inside here");
console.log(messageResults);
})
