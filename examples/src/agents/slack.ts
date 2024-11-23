import {
 SlackGetMessagesTool,SlackGetChannelsTool, SlackScheduleMessageTool, SlackPostMessageTool
} from "../../../libs/langchain-community/src/tools/slack.ts";
import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
  } from "@langchain/core/prompts";
import { MyCallbackHandler } from "callbacks/custom_handler.js";

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
    new SlackPostMessageTool()
]

const model = new ChatOpenAI({
    temperature: 0,
  });
  
  const agent = await createOpenAIToolsAgent({
    llm: chat,
    tools,
    prompt,
  });
  

  
  const agentExecutor = new AgentExecutor({ agent, tools });

  interface AgentStep {
    // Define fields based on what a 'step' includes. Here's an example.
    action: string;
    tool: string;
    input: string;
    output: string;
  }

  const callback = (step: AgentStep) => {
    console.log("Callback: Step executed", step);
  };

  const res = await agentExecutor.invoke({
    messages: [new HumanMessage("Send the messge 'heyy' to the   all-fireflies channel")],
    callback: callback
  });

  //    messages: [new HumanMessage("Give me a detail list of the steps you, as an agent would take to send a message to the  all-fireflies channel")],

  console.log("Response is:")
console.log(res.output);