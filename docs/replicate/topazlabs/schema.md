---
title: topazlabsvideoupscale
slug: topazlabsvideoupscale-1760343090881
source: https://replicate.com/topazlabs/video-upscale/api/schema
datetime: 2025-10-13T08:11:30.881Z
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

1.  [Input schema](#input-schema)
2.  [Output schema](#output-schema)

[API reference](/topazlabs/video-upscale/api/api-reference)

## Input schema

TableJSON

videouri

Video file to upscale

target_fpsinteger

Target FPS (choose from 15-60fps)

Default

30

Minimum

15

Maximum

60

target_resolutionstring

Target resolution

Default

"1080p"

## Output schema

TableJSON

Type

uri
