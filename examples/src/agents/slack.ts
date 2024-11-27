import {
  SlackGetMessagesTool,
  SlackGetChannelsTool,
  SlackScheduleMessageTool,
  SlackPostMessageTool,
} from "@langchain/community/tools/slack";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const chat = new ChatOpenAI({
  model: "gpt-3.5-turbo-1106",
  temperature: 0,
});

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. You may not need to use tools for every query - the user may just want to chat!",
  ],
  new MessagesPlaceholder("messages"),
  new MessagesPlaceholder("agent_scratchpad"),
]);

const tools = [
  new SlackGetMessagesTool(),
  new SlackGetChannelsTool(),
  new SlackScheduleMessageTool(),
  new SlackPostMessageTool(),
];

const agent = await createOpenAIToolsAgent({
  llm: chat,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({ agent, tools });

const res = await agentExecutor.invoke({
  messages: [
    new HumanMessage("send a greeting message to the general channel"),
  ],
});

console.log(res.output);
