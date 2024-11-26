import {
    WebClient
  } from "@slack/web-api";
  import { getEnvironmentVariable } from "@langchain/core/utils/env";
  import { Tool } from "@langchain/core/tools";
 
  /**
   * Base tool parameters for the Slack tools
   */
  interface SlackToolParams {
    token?: string;
    client?: WebClient;
  } 
 
  /**
   * A tool for retrieving messages from a slack channel using a bot.
   * It extends the base Tool class and implements the _call method to
   * perform the retrieval operation. Requires a slack token which can be set
   * in the environment variables.
   * The _call method takes the search query as the input argument.
   * It returns the messages including the channel and text.
   */
  export class SlackGetMessagesTool extends Tool {
    static lc_name() {
      return "SlackGetMessagesTool";
    }
 
    name = "slack-get-messages";
 
    description = `A slack tool. useful for reading messages from a slack channel.
    Input should be a search query.`;
 
    protected token: string;
 
    protected client: WebClient;
 
    constructor(fields?: SlackToolParams) {
      super();
 
      const {
        token = getEnvironmentVariable("SLACK_TOKEN"),
        client,
      } = fields ?? {};
 
      if (!token) {
        throw new Error(
          "Environment variable SLACK_TOKEN missing, but is required for SlackGetMessagesTool."
        );
      }
     
      this.client =
        client ??
        new WebClient(token);

      this.token = token;
    }
 
    /** @ignore */
    async _call(searchTerm: string): Promise<string> {
      try {

        const results = await this.client.search.messages({
            query: searchTerm
        })
 
        return JSON.stringify(results);
      } catch (err) {
        return "Error getting messages.";
      }
    }
  }

   
 
  /**
   * A tool for retrieving channels from a slack team.
   * It extends the base Tool class and implements the _call method to
   * perform the retrieval operation. Requires a slack token which can be set
   * in the environment variables.
   * It returns channel information including the channel name and id.
   */
  export class SlackGetChannelsTool extends Tool {
    static lc_name() {
      return "SlackGetChannelsTool";
    }
 
    name = "slack-get-channels";
 
    description = `A slack tool. useful for retrieving a list of details about channels in a slack team.
    This includes channel names and channel ids. There is no input to this tool.`;
 
    protected token: string;
 
    protected client: WebClient;
 
    constructor(fields?: SlackToolParams) {
      super();
 
      const {
        token = getEnvironmentVariable("SLACK_TOKEN"),
        client,
      } = fields ?? {};
 
      if (!token) {
        throw new Error(
          "Environment variable SLACK_TOKEN missing, but is required for SlackGetChannelsTool."
        );
      }
     
      this.client =
        client ??
        new WebClient(token);

      this.token = token;
    }
 
    /** @ignore */
    async _call(_input: string): Promise<string> {
      try {

        const results = await this.client.conversations.list();
 
        return JSON.stringify(results);
      } catch (err) {
        return "Error getting channel information.";
      }
    }
  }


  /**
   * A tool for scheduling messages to be posted on slack channels using a bot.
   * It extends the base Tool class and implements the _call method to
   * perform the schedule operation. Requires a slack token which can be set
   * in the environment variables.
   * The _call method takes the a JSON object in the format 
   * {text: [text here], channel_id: [channel id here], post_at: [post at here]} as its input.
   */
    export class SlackScheduleMessageTool extends Tool {
        static lc_name() {
          return "SlackScheduleMessageTool";
        }
     
        name = "slack-schedule-message";
     
        description = `A slack tool. useful for scheduling messages to send on a specific date and time.
         Input is a JSON object as follows {text: [text here], channel_id: [channel id here], post_at: [post at here]} where post_at is the datetime for when the message should be sent in the following format: YYYY-MM-DDTHH:MM:SS±hh:mm, where "T" separates the date
         and time components, and the time zone offset is specified as ±hh:mm.
         For example: "2023-06-09T10:30:00+03:00" represents June 9th
         2023, at 10:30 AM in a time zone with a positive offset of +03:00
         hours from Coordinated Universal Time (UTC).`;
     
        protected token: string;
     
        protected client: WebClient;
     
        constructor(fields?: SlackToolParams) {
          super();
     
          const {
            token = getEnvironmentVariable("SLACK_TOKEN"),
            client
          } = fields ?? {};
     
          if (!token) {
            throw new Error(
              "Environment variable SLACK_TOKEN missing, but is required for SlackScheduleMessageTool."
            );
          }
         
          this.client =
            client ??
            new WebClient(token);
    
    
          this.token = token;
        }
     
        /** @ignore */
        async _call(input: string): Promise<string> {      
          try {
            const obj = JSON.parse(input);
            const date = new Date(obj.post_at);
            const utcTimestamp = date.getTime() / 1000;
    
            const results = await this.client.chat.scheduleMessage({
                channel: obj.channel_id,
                post_at: utcTimestamp,
                text: obj.text
            })
     
            return JSON.stringify(results);
          } catch (err) {
            return "Error scheduling message.";
          }
        }
      }


  /**
   * A tool for posting messages to a slack channel using a bot.
   * It extends the base Tool class and implements the _call method to
   * perform the post operation. Requires a slack token which can be set
   * in the environment variables.
   * The _call method takes a JSON object in the format {chanel id, text} as its input.
   * It returns the message information including the timestamp ID.
   */
    export class SlackPostMessageTool extends Tool {
        static lc_name() {
          return "SlackPostMessageTool";
        }
     
        name = "slack-post-message";
     
        description = `A slack tool. useful for posting a message to a channel
        Input is a JSON object as follows '{channel_id, text}'`;
     
        protected token: string;
     
        protected client: WebClient;
     
        constructor(fields?: SlackToolParams) {
          super();
     
          const {
            token = getEnvironmentVariable("SLACK_TOKEN"),
            client
          } = fields ?? {};
     
          if (!token) {
            throw new Error(
              "Environment variable SLACK_TOKEN missing, but is required for SlackPostMessageTool."
            );
          }
         
          this.client =
            client ??
            new WebClient(token);
    
    
          this.token = token;
        }
     
        /** @ignore */
        async _call(input: string): Promise<string> {    
          try {
            const obj = JSON.parse(input)
            const results = await this.client.chat.postMessage({
                text: obj.text,
                channel: obj.channel_id
            })
     
            return JSON.stringify(results);
          } catch (err) {
            return "Error posting message.";
          }
        }
      }