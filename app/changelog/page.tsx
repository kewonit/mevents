import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowLeft, Github } from "lucide-react"
import Link from "next/link"

export default function Changelog() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
      <Button variant="ghost" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
      </Button>

      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-4 font-instrument-serif">Changelog</h1>
          <p className="text-muted-foreground font-instrument-sans mb-6">
            Track all updates and improvements to mevents
          </p>
          <Button asChild>
            <a
              href="https://github.com/kewonit/mevents/commits/main/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="mr-2 h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User Experience & Dynamic Routing (PR #10 & #11)</span>
                <span className="text-sm text-muted-foreground">Feb 23, 2025</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Add search functionality to TopicPageContent and CommunityGrid</li>
                <li>Enhance LandingPage layout and content</li>
                <li>Improve TopicCard with better loading states</li>
                <li>Add LoadingOverlay component</li>
                <li>Implement TopicCard and TopicCardSkeleton components</li>
                <li>Refactor TopicsTable for dynamic rendering</li>
                <li>Add Contact page</li>
                <li>Update README documentation</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Community Pages Update (PR #8)</span>
                <span className="text-sm text-muted-foreground">Feb 23, 2025</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Refactor Dropdown and Select components for improved styling</li>
                <li>Remove unused vote props from CommunityCard</li>
                <li>Implement voting context with optimistic UI updates</li>
                <li>Update VoteButton component functionality</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Community Features (PR #6)</span>
                <span className="text-sm text-muted-foreground">Feb 23, 2025</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Implement voting functionality for communities</li>
                <li>Add VoteButton component</li>
                <li>Update CommunityCard and TopicPage for vote handling</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Layout Improvements (PR #5)</span>
                <span className="text-sm text-muted-foreground">Feb 22, 2025</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Refactor CommunityCard for improved styling</li>
                <li>Enhance TopicPage layout and sidebar spacing</li>
                <li>Implement community votes and stats display</li>
                <li>Add community slug API and CommunityGrid component</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Topics Page Implementation (PR #4 & #3)</span>
                <span className="text-sm text-muted-foreground">Feb 22, 2025</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Add Instrument Serif font files</li>
                <li>Enhance Topics page with API integration</li>
                <li>Add TopicsTable component and Badge component</li>
                <li>Implement Topics API route</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Initial Setup (PR #2)</span>
                <span className="text-sm text-muted-foreground">Feb 22, 2025</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Initialize Next.js application</li>
                <li>Add login and onboarding pages</li>
                <li>Implement header and footer components</li>
                <li>Set up Supabase client and utility functions</li>
                <li>Add font management system</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
