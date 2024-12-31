'use client'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useState } from 'react' 
export default function StoryGenerator() {
  const [topic, setTopic] = useState('')
  const [story, setStory] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Fetches a story from the server based on the current topic
   */
  const generateStory = async () => {
    setIsLoading(true)
    setStory('')
    setError('')
    try {
      // Send a POST request to the server with the current topic
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.indexOf("application/json") !== -1) {
        // If the response is JSON, parse it
        data = await response.json()
      } else {
        // If the response is not JSON, read it as text and throw an error
        const text = await response.text()
        throw new Error(`Received non-JSON response: ${text}`)
      }

      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }
      if (data.story) {
        // If the response contains a story, set it
        setStory(data.story)
      } else {
        // If the response does not contain a story, throw an error
        throw new Error('No story was generated')
      }
    } catch (error) {
      // Catch any errors and log them
      console.error('Error generating story:', error)
      // Set the error message
      setError(error instanceof Error ? error.message : String(error))
    } finally {
      // Set isLoading to false when the function is done
      setIsLoading(false)
    }
  }



  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>LangChain Story Generator</CardTitle>
          <CardDescription>Enter a topic to generate a short story</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Enter a topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
            <Button onClick={generateStory} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate Story'}
            </Button>
          </div>
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              <h3 className="font-semibold mb-2">Error:</h3>
              <p>{error}</p>
            </div>
          )}
          {story && (
            <div className="mt-4 p-4 bg-gray-800 rounded-md">
              <h3 className="font-semibold mb-2 ">Generated Story:</h3>
              <p>{story}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

