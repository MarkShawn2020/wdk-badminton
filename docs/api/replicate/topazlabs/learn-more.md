---
title: topazlabsvideoupscale
slug: topazlabsvideoupscale-1760342997386
source: https://replicate.com/topazlabs/video-upscale/api/learn-more
datetime: 2025-10-13T08:09:57.386Z
---

### topazlabs/video-upscale

![](https://github.com/topazlabs.png)

[topazlabs](https://replicate.com/topazlabs)

/

video-upscale

Star

Copy

[View as Markdown](/topazlabs/video-upscale/llms.txt)[Open in ChatGPT](https://chatgpt.com/?hints=search&q=Show%20me%20how%20to%20run%20this%20model%20on%20Replicate%20https%3A%2F%2Freplicate.com%2Ftopazlabs%2Fvideo-upscale%2Fllms.txt)[Open in Claude](https://claude.ai/new?q=Show%20me%20how%20to%20run%20this%20model%20on%20Replicate%20https%3A%2F%2Freplicate.com%2Ftopazlabs%2Fvideo-upscale%2Fllms.txt)

Video Upscaling from Topaz Labs

[Warm](https://replicate.com/docs/reference/how-does-replicate-work#cold-boots)

[Official](https://replicate.com/docs/topics/models/official-models)

745.4K runs

[

Priced per unit

](/topazlabs/video-upscale#pricing)

Commercial use

Topaz Labs will be increasing the price of this model on October 15, 2025 at 9 am PT from $0.05 / unit to $0.08 / unit.

[Playground](/topazlabs/video-upscale) [API](/topazlabs/video-upscale/api) [Examples](/topazlabs/video-upscale/examples) [README](/topazlabs/video-upscale/readme)

Run replicate/topaz-video-upscale-internal with an API

Table of Contents

Node.jsPythonHTTP

Get startedLearn moreSchemaAPI reference

[Get started](/topazlabs/video-upscale/api)

[Learn more](/topazlabs/video-upscale/api/learn-more)

1.  [Authentication](#authentication)
2.  [Setup](#setup)
    1.  [ESM](#esm)
    2.  [CommonJS](#commonjs)
3.  [Run the model](#run-the-model)
4.  [File inputs](#file-inputs)
    1.  [Option 1: Hosted file](#option-1-hosted-file)
    2.  [Option 2: Local file](#option-2-local-file)
    3.  [Option 3: Data URI](#option-3-data-uri)
5.  [Prediction lifecycle](#prediction-lifecycle)
6.  [Webhooks](#webhooks)
7.  [Access a prediction](#access-a-prediction)
8.  [Cancel a prediction](#cancel-a-prediction)

[Schema](/topazlabs/video-upscale/api/schema)

[API reference](/topazlabs/video-upscale/api/api-reference)

## Authentication

Whenever you make an API request, you need to authenticate using a token. A token is like a password that uniquely identifies your account and grants you access.

The following examples all expect your Replicate access token to be available from the command line. Because tokens are secrets, they should not be in your code. They should instead be stored in [environment variables](https://12factor.net/config). Replicate clients look for the `REPLICATE_API_TOKEN` environment variable and use it if available.

To set this up you can use:

```shell
export REPLICATE_API_TOKEN=r8_7SB**********************************
```

VisibilityCopy

Some application frameworks and tools also support a text file named `.env` which you can edit to include the same token:

```
REPLICATE_API_TOKEN=r8_7SB**********************************
```

VisibilityCopy

The Replicate API uses the `Authorization` HTTP header to authenticate requests. If you’re using a [client library](https://replicate.com/docs/reference/client-libraries) this is handled for you.

You can test that your access token is setup correctly by using our [`account.get`](https://replicate.com/docs/reference/http#account.get) endpoint:

What is cURL?

[cURL](https://en.wikipedia.org/wiki/CURL) is a command line tool for sending HTTP requests (same as your browser does) to a web server. It will show all the parts needed to make a similar request in the programming language of your choice, the URL, request headers and the request body. We’ve tried to keep these examples as clear as possible using tools that are commonly available on most computers.

```bash
curl https://api.replicate.com/v1/account -H "Authorization: Bearer $REPLICATE_API_TOKEN"
# {"type":"user","username":"aron","name":"Aron Carroll","github_url":"https://github.com/aron"}
```

Copy

If it is working correctly you will see a JSON object returned containing some information about your account, otherwise ensure that your token is available:

```bash
echo "$REPLICATE_API_TOKEN"
# "r8_xyz"
```

Copy

## Setup

NodeJS supports two module formats [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and [CommonJS](https://en.wikipedia.org/wiki/CommonJS). Below details the setup for each environment. After setup, the code is identical regardless of module format.

### ESM

First you’ll need to ensure you have a NodeJS project:

```
npm create esm -y
```

Copy

Then install the `replicate` JavaScript library using `npm`:

```
npm install replicate
```

Copy

To use the library, first import and create an instance of it:

```jsx
import Replicate from 'replicate'

const replicate = new Replicate()
```

Copy

This will use the `REPLICATE_API_TOKEN` API token you’ve setup in your environment for authorization.

### CommonJS

First you’ll need to ensure you have a NodeJS project:

```
npm create -y
```

Copy

Then install the `replicate` JavaScript library using `npm`:

```
npm install replicate
```

Copy

To use the library, first import and create an instance of it:

```jsx
const Replicate = require('replicate')

const replicate = new Replicate()
```

Copy

This will use the `REPLICATE_API_TOKEN` API token you’ve setup in your environment for authorization.

## Run the model

Use the `replicate.run()` method to run the model:

```jsx
const input = {
  video:
    'https://replicate.delivery/pbxt/N8X2VIuePxg9JyNpTslqqZ9Rvrjwm45bNPAmjDAPHiyQida1/MPEG-4%20movie%205.mp4',
  target_fps: 60,
  target_resolution: '4k',
}

const output = await replicate.run('topazlabs/video-upscale', { input })

// To access the file URL:
console.log(output.url())
//=> "https://replicate.delivery/.../output.mp4"

// To write the file to disk:
await writeFile('output.mp4', output)
//=> output.mp4 written to disk
```

Copy

You can learn about pricing for this model on the [model page](/replicate/topaz-video-upscale-internal).

The `run()` function returns the output directly, which you can then use or pass as the input to another model. If you want to access the full prediction object (not just the output), use the `replicate.predictions.create()` method instead. This will include the prediction id, status, logs, etc.

## File inputs

This model accepts files as input. You can provide a file as input using a URL, a local file on your computer, or a base64 encoded object:

### Option 1: Hosted file

Use a URL as in the earlier example:

```js
const video =
  'https://replicate.delivery/pbxt/N8X2VIuePxg9JyNpTslqqZ9Rvrjwm45bNPAmjDAPHiyQida1/MPEG-4%20movie%205.mp4'
```

Copy

This is useful if you already have an image hosted somewhere on the internet.

### Option 2: Local file

You can provide Replicate with a `Blob`, `File` or `Buffer` object and the library will handle the upload for you:

```js
import { readFile } from 'node:fs/promises'
const video = await readFile('./path/to/my/video.mp4')
```

Copy

### Option 3: Data URI

You can create a data URI consisting of the base64 encoded data for your file, but this is only recommended if the file is < 1mb

```js
import { readFile } from 'node:fs/promises'
const data = (await readFile('./video.mp4')).toString('base64')
const video = `data:application/octet-stream;base64,${data}`
```

Copy

Then, pass `video` as part of the input:

```js
const input = {
  video: video,
  target_fps: 60,
  target_resolution: '4k',
}

const output = await replicate.run('topazlabs/video-upscale', { input })

// To access the file URL:
console.log(output.url())
//=> "https://replicate.delivery/.../output.mp4"

// To write the file to disk:
await writeFile('output.mp4', output)
//=> output.mp4 written to disk
```

Copy

## Prediction lifecycle

Running predictions and trainings can often take significant time to complete, beyond what is reasonable for an HTTP request/response.

When you run a model on Replicate, the prediction is created with a `“starting”` state, then instantly returned. This will then move to `"processing"` and eventual one of `“successful”`, `"failed"` or `"canceled"`.

Starting

Running

Succeeded

Failed

Canceled

You can explore the prediction lifecycle by using the `predictions.get()` method to retrieve the latest version of the prediction until completed.

Show example

```jsx
const input = {
  video:
    'https://replicate.delivery/pbxt/N8X2VIuePxg9JyNpTslqqZ9Rvrjwm45bNPAmjDAPHiyQida1/MPEG-4%20movie%205.mp4',
  target_fps: 60,
  target_resolution: '4k',
}
const prediction = await replicate.predictions.create({
  model: 'topazlabs/video-upscale',
  input,
})
// { "id": "xyz...", "status": "starting", ... }

const latest = await replicate.predictions.get(prediction.id)
// { "id": "xyz...", "status": "processing", ... }

let completed
for (let i = 0; i < 5; i++) {
  const latest = await replicate.predictions.get(prediction.id)
  if (latest.status !== 'starting' && latest.status !== 'processing') {
    completed = latest
    break
  }
  // Wait for 2 seconds and then try again.
  await new Promise((resolve) => setTimeout(resolve, 2000))
}

console.log(completed.output)
//=> output.mp4 written to disk
```

Copy

## Webhooks

Webhooks provide real-time updates about your prediction. Specify an endpoint when you [create a prediction](https://replicate.com/docs/reference/http#predictions.create), and Replicate will send HTTP POST requests to that URL when the prediction is created, updated, and finished.

It is possible to provide a URL to the `predictions.create()` function that will be requested by Replicate when the prediction status changes. This is an alternative to polling.

To receive webhooks you’ll need a web server. The following example uses [Hono](https://hono.dev/), a web standards based server, but this pattern applies to most frameworks.

Show example

```jsx
import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();
app.get('/webhooks/replicate', async (c) => {
  // Get the prediction from the request.
  const prediction = await c.req.json();
	console.log(prediction);
  //=> {"id": "xyz", "status": "successful", ... }

  // Acknowledge the webhook.
  c.status(200);
  c.json({ok: true});
}));

serve(app, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
  //=> Listening on http://localhost:3000
});
```

Copy

Then create the prediction passing in the webhook URL and specify which events you want to receive out of `"start"`, `"output"`, `”logs”` and `"completed"`.

```jsx
const input = {
  video:
    'https://replicate.delivery/pbxt/N8X2VIuePxg9JyNpTslqqZ9Rvrjwm45bNPAmjDAPHiyQida1/MPEG-4%20movie%205.mp4',
  target_fps: 60,
  target_resolution: '4k',
}

const callbackURL = `https://my.app/webhooks/replicate`
await replicate.predictions.create({
  model: 'topazlabs/video-upscale',
  input: input,
  webhook: callbackURL,
  webhook_events_filter: ['completed'],
})

// The server will now handle the event and log:
// => {"id": "xyz", "status": "successful", ... }
```

Copy

ℹ️ The `replicate.run()` method is not used here. Because we're using webhooks, and we don’t need to poll for updates.

Co-ordinating between a prediction request and a webhook response will require some glue. A simple implementation for a single JavaScript server could use an event emitter to manage this.

Show example

```jsx
import { EventEmitter } from "node:events";
const webhooks = new EventEmitter();

// In server code, emit the prediction on the event emitter.
app.get('/webhooks/replicate', async (c) => {
  const prediction = await c.req.json();

  // Emit the prediction on the EventEmitter.
  webhooks.emit(prediction.id, prediction)

  // ...
}));

// In request code
await replicate.predictions.create({
  model: "yorickvp/llava-13b",
  version: "a0fdc44e4f2e1f20f2bb4e27846899953ac8e66c5886c5878fa1d6b73ce009e5",
  input: input,
  webhook: callbackURL,
  webhook_events_filter: ["completed"],
});

// Wait for prediction to be emitted on the EventEmitter.
const prediction = await new Promise(resolve => webhooks.addEventListener(prediction.id, resolve));
// {"id": "xyz", "status": "successful", ... }
```

Copy

From a security perspective it is also possible to verify that the webhook came from Replicate. Check out our documentation on [verifying webhooks](https://replicate.com/docs/webhooks#verifying-webhooks) for more information.

## Access a prediction

You may wish to access the prediction object. In these cases it’s easier to use the `replicate.predictions.create()` or `replicate.deployments.predictions.create()` functions which will return the prediction object.

Though note that these functions will only return the created prediction, and it will not wait for that prediction to be completed before returning. Use `replicate.predictions.get()` to fetch the latest prediction.

```jsx
const input = {
  video:
    'https://replicate.delivery/pbxt/N8X2VIuePxg9JyNpTslqqZ9Rvrjwm45bNPAmjDAPHiyQida1/MPEG-4%20movie%205.mp4',
  target_fps: 60,
  target_resolution: '4k',
}
const prediction = replicate.predictions.create({
  model: 'topazlabs/video-upscale',
  input,
})
// { "id": "xyz123", "status": "starting", ... }
```

Copy

## Cancel a prediction

You may need to cancel a prediction. Perhaps the user has navigated away from the browser or canceled your application. To prevent unnecessary work and reduce runtime costs you can use the `replicate.predictions.cancel` function and pass it a prediction id.

```javascript
await replicate.predictions.cancel(prediction.id)
```

Copy
