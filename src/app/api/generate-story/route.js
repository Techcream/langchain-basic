import { NextResponse } from 'next/server'
import { PromptTemplate } from "@langchain/core/prompts";
import { OpenAI } from '@langchain/openai'
import { LLMChain } from "langchain/chains";

export async function POST(req) {
  try {
    const { topic } = await req.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key is not set' }, { status: 500 })
    }

    const model = new OpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    })

    const template = 'Write a short story about {topic} in 3-4 sentences.'
    const promptTemplate = new PromptTemplate({
      template: template,
      inputVariables: ['topic'],
    })

    // const promptTemplate = PromptTemplate.fromTemplate(
    //   "Write a short story about {topic} in 3-4 sentences."
    // );
    

    const chain = new LLMChain({ llm: model, prompt: promptTemplate })

    const result = await chain.invoke({ topic: topic })

    if (!result.text) {
      throw new Error('No story was generated')
    }

    return NextResponse.json({ story: result.text })
  } catch (error) {
    console.error('Error in generate-story API:', error)
    // Ensure we always return a JSON response
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

