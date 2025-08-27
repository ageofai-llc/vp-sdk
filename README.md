# vp-sdk

[![npm version](https://img.shields.io/npm/v/@ageofai/vp-sdk)](https://www.npmjs.com/package/@ageofai/vp-sdk)
[![License](https://img.shields.io/badge/license-Proprietary-blue)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)]()
[![TypeScript](https://img.shields.io/badge/typescript-supported-blue)]()

The official Node.js SDK for the Scoreexl API—a secure audio AI platform providing Speech-to-Text (STT), Text-to-Speech (TTS) with Google Chirp3 HD & Deepgram Aura-2, RAG-based knowledge, analytics, credits, and notifications.

## Features

- Complete API Coverage  
- TypeScript Support  
- Authentication Management  
- Error Handling  
- Modular Architecture  
- File Upload Support  
- Retry Logic  
- Pagination Support  

## Installation

```bash
# npm
npm install @ageofai/vp-sdk

# yarn
yarn add @ageofai/vp-sdk
```

## Quick Start

```javascript
const { VpSdk } = require('@ageofai/vp-sdk');
(async () => {
  const client = new VpSdk({ apiKey: 'YOUR_API_KEY' });
  try {
    // Register & log in
    const user = await client.auth.register({ email: 'user@example.com', password: 'StrongP@ssw0rd' });
    await client.auth.login({ email: user.email, password: 'StrongP@ssw0rd' });

    // List voices & synthesize text
    const voices = await client.tts.listVoices();
    const synth = await client.tts.synthesize({
      text: 'Hello, Scoreexl!',
      voiceId: voices[0].id
    });
    console.log('Synthesis started:', synth);
  } catch (error) {
    console.error('Quick start error:', error);
  }
})();
```

## API Reference

### Authentication
- **register(userData)**  
  Register a new user.  
  ```javascript
  const user = await client.auth.register({ email, password });
  ```
- **login(credentials)**  
  Log in and store tokens.  
  ```javascript
  await client.auth.login({ email, password });
  ```
- **logout()**  
  Log out and clear tokens.  
  ```javascript
  await client.auth.logout();
  ```

### Users
- **getUser(userId)**  
  Fetch user details by ID.  
  ```javascript
  const user = await client.users.getUser(userId);
  ```
- **updateUser(userId, data)**  
  Update user profile.  
  ```javascript
  await client.users.updateUser(userId, updateData);
  ```
- **deleteUser(userId)**  
  Remove a user account.  
  ```javascript
  await client.users.deleteUser(userId);
  ```

### Text-to-Speech (TTS)
- **listVoices()**  
  Get available voices.  
  ```javascript
  const voices = await client.tts.listVoices();
  ```
- **synthesize(options)**  
  Start a synthesis job.  
  ```javascript
  const { synthesisId } = await client.tts.synthesize({ text, voiceId });
  ```
- **getSynthesisStatus(synthesisId)**  
  Check synthesis status.  
  ```javascript
  const status = await client.tts.getSynthesisStatus(synthesisId);
  ```
- **downloadAudio(synthesisId)**  
  Download completed audio.  
  ```javascript
  const stream = await client.tts.downloadAudio(synthesisId);
  ```

### Speech-to-Text (STT)
- **transcribe(options)**  
  Submit an audio file for transcription.  
  ```javascript
  const { transcriptionId } = await client.stt.transcribe({ file: fsStream });
  ```
- **getTranscriptionStatus(transcriptionId)**  
  Check transcription status.  
  ```javascript
  const result = await client.stt.getTranscriptionStatus(transcriptionId);
  ```

### Credits
- **getCredits()**  
  Retrieve current credit balance.  
  ```javascript
  const credits = await client.credits.getCredits();
  ```
- **purchaseCredits(amount)**  
  Purchase additional credits.  
  ```javascript
  await client.credits.purchaseCredits(amount);
  ```

### Analytics
- **getUsageStats(params)**  
  Fetch usage analytics.  
  ```javascript
  const stats = await client.analytics.getUsageStats({ from, to });
  ```

### Notifications
- **listNotifications()**  
  Retrieve user notifications.  
  ```javascript
  const list = await client.notifications.listNotifications();
  ```
- **markAsRead(notificationId)**  
  Mark a notification as read.  
  ```javascript
  await client.notifications.markAsRead(notificationId);
  ```

### RAG
- **createSession(context)**  
  Start a RAG session with context.  
  ```javascript
  const { sessionId } = await client.rag.createSession({ documents });
  ```
- **query(sessionId, query)**  
  Query the RAG session.  
  ```javascript
  const response = await client.rag.query(sessionId, 'Your question');
  ```

### API Keys
- **listKeys()**  
  List all API keys.  
  ```javascript
  const keys = await client.apiKeys.listKeys();
  ```
- **createKey(params)**  
  Generate a new API key.  
  ```javascript
  const key = await client.apiKeys.createKey({ name });
  ```
- **revokeKey(keyId)**  
  Revoke an existing key.  
  ```javascript
  await client.apiKeys.revokeKey(keyId);
  ```

### Agents
- **listAgents()**  
  Fetch available agents.  
  ```javascript
  const agents = await client.agents.listAgents();
  ```
- **runAgent(agentId, input)**  
  Execute an agent with input.  
  ```javascript
  const result = await client.agents.runAgent(agentId, { prompt });
  ```

### Usage Tracking
- **trackEvent(eventData)**  
  Record a custom event.  
  ```javascript
  await client.usage.trackEvent({ event, metadata });
  ```
- **getEvents(params)**  
  Retrieve tracked events.  
  ```javascript
  const events = await client.usage.getEvents({ limit, offset });
  ```

## Error Handling

All SDK errors extend a base `ScoreexlError` and include:
- **message**: human-readable error  
- **statusCode**: HTTP status  
- **code**: machine error code  
- **details**: additional metadata  

```javascript
const {
  AuthenticationError,
  RateLimitError,
  TranscriptionError,
  SynthesisError
} = require('@ageofai/vp-sdk').errors;

try {
  await client.auth.login({ email, password });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Auth failed:', error.message, error.statusCode, error.code);
  } else if (error instanceof RateLimitError) {
    console.error('Too many requests:', error.details);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Advanced Configuration

### Custom Axios Configuration
```javascript
const client = new VpSdk({
  apiKey: 'KEY',
  axiosConfig: { baseURL: 'https://api.scoreexl.com', timeout: 10000 }
});
```

### Manual Token Management
```javascript
client.setAccessToken('ACCESS_TOKEN');
client.setRefreshToken('REFRESH_TOKEN');
```

### File Uploads
Node.js:
```javascript
const fs = require('fs');
await client.stt.transcribe({ file: fs.createReadStream('audio.wav') });
```
Browser:
```javascript
await client.stt.transcribe({ file: new File([blob], 'audio.wav') });
```

## TypeScript Support

Full type definitions are included.

```typescript
import { VpSdk, AuthClient } from '@ageofai/vp-sdk';
const client: VpSdk = new VpSdk({ apiKey: 'KEY' });
```

## Examples

### Complete TTS Workflow

```javascript
const fs = require('fs');
(async () => {
  const client = new VpSdk({ apiKey: 'YOUR_API_KEY' });
  await client.auth.login({ email: 'user@example.com', password: 'StrongP@ssw0rd' });

  const voices = await client.tts.listVoices();
  const { synthesisId } = await client.tts.synthesize({
    text: 'Hello, Scoreexl!',
    voiceId: voices[0].id
  });

  let status;
  do {
    await new Promise(r => setTimeout(r, 2000));
    status = await client.tts.getSynthesisStatus(synthesisId);
  } while (status.state !== 'completed');

  const audioStream = await client.tts.downloadAudio(synthesisId);
  const writeStream = fs.createWriteStream('output.mp3');
  audioStream.pipe(writeStream);
  console.log('Audio saved to output.mp3');
})();
```

### STT Transcription with Error Handling

```javascript
const fs = require('fs');
const { TranscriptionError } = require('@ageofai/vp-sdk').errors;

(async () => {
  const client = new VpSdk({ apiKey: 'YOUR_API_KEY' });
  try {
    await client.auth.login({ email: 'user@example.com', password: 'StrongP@ssw0rd' });
    const fileStream = fs.createReadStream('input.wav');
    const { transcriptionId } = await client.stt.transcribe({ file: fileStream });

    let result;
    do {
      await new Promise(r => setTimeout(r, 2000));
      result = await client.stt.getTranscriptionStatus(transcriptionId);
    } while (result.state !== 'completed');

    console.log('Transcribed text:', result.text);
    console.table(result.segments);
  } catch (error) {
    if (error instanceof TranscriptionError) {
      console.error('Transcription failed:', error.details);
    } else {
      throw error;
    }
  }
})();
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Support

Open an issue in this repository

<!-- ## License

Proprietary. See [LICENSE](LICENSE).

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes.

## API Version Compatibility

Compatible with Scoreexl API **v2.0.0+**.

## Browser Support

Works in Node.js and modern browsers.

## Security

Report vulnerabilities to security@ageofai.com. -->
