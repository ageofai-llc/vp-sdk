# Scoreexl Voice Assistant SDK

## Description

This is a Node.js SDK for the Scoreexl Voice Assistant API. It provides a simple and convenient way to interact with the Scoreexl Voice Assistant service in your Node.js applications.

## Installation

```bash
npm install scoreexl-voice-assistant-sdk
```

## Usage

```javascript
const { ScoreexlVoiceSdk } = require("scoreexl-voice-assistant-sdk");

const sdk = new ScoreexlVoiceSdk({ apiKey: "YOUR_API_KEY" });

async function main() {
  try {
    // Register
    const registerResponse = await sdk.auth.register({
      email: "test@example.com",
      password: "password123",
    });
    console.log("Register Response:", registerResponse);

    // Login
    const loginResponse = await sdk.auth.login({
      email: "test@example.com",
      password: "password123",
    });
    console.log("Login Response:", loginResponse);

    const authToken = loginResponse.token;
    sdk.setAuthToken(authToken);

    // Create Agent
    const createAgentResponse = await sdk.agent.createAgent({
      name: "My Agent",
      description: "A test agent",
    });
    console.log("Create Agent Response:", createAgentResponse);

    const agentId = createAgentResponse.id;

    // Start Session
    const startSessionResponse = await sdk.session.startSession({
      agentId: agentId,
    });
    console.log("Start Session Response:", startSessionResponse);

    const sessionId = startSessionResponse.id;

    // Send Chat
    const sendChatResponse = await sdk.session.sendChat({
      sessionId: sessionId,
      message: "Hello, agent!",
    });
    console.log("Send Chat Response:", sendChatResponse);
  } catch (error) {
    console.error(error);
  }
}

main();
```

## API Documentation

The SDK provides the following clients for interacting with different aspects of the Scoreexl Voice Assistant API:

- **AdminClient**: For administrative tasks.
- **AgentClient**: For managing agents.
- **APIKeyClient**: For managing API keys.
- **AuthClient**: For authentication.
- **HealthClient**: For checking the health of the API.
- **SessionClient**: For managing sessions.
- **StreamClient**: For streaming audio.
- **UserClient**: For managing users.
- **VoiceClient**: For synthesizing speech and other voice-related tasks.
- **WebhookClient**: For managing webhooks.

Refer to the individual client documentation for more details on the available methods and parameters.

## Types

The SDK includes the following types:

- [See src/types.ts for available types]

## License

ISC
