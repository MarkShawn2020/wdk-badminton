---
title: topazlabsvideoupscale
slug: topazlabsvideoupscale-1760343062827
source: https://replicate.com/topazlabs/video-upscale/api
datetime: 2025-10-13T08:11:02.827Z
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

[Schema](/topazlabs/video-upscale/api/schema)

[API reference](/topazlabs/video-upscale/api/api-reference)

Use one of our client libraries to get started quickly.

Node.js

Python

HTTP

Set the `REPLICATE_API_TOKEN` environment variable

```shell
export REPLICATE_API_TOKEN=r8_7SB**********************************
```

VisibilityCopy

[

Learn more about authentication

](/topazlabs/video-upscale/api/learn-more#authentication)

Install Replicate’s Node.js client library

```shell
npm install replicate
```

Copy

[Learn more about setup](/topazlabs/video-upscale/api/learn-more#setup)

Run **topazlabs/video-upscale** using Replicate’s API. Check out the model's [schema](/topazlabs/video-upscale/api/schema) for an overview of inputs and outputs.

```javascript
import { writeFile } from 'fs/promises'
import Replicate from 'replicate'
const replicate = new Replicate()

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

[Learn more](/topazlabs/video-upscale/api/learn-more)
