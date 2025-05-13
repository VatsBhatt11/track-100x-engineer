"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Home, MessageSquare } from "lucide-react"
import axios from "axios"
import {Tweet} from 'react-tweet'

import AppLayout from "@/components/layout/AppLayout"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import "@/styles/community.css"

interface Post {
  id: number
  username: string
  time: string
  content: string
  embedUrl: string
  platform: string
  likes: number
  comments: number
  avatarSrc?: string
}

interface Contributor {
  id: string
  name: string
  avatar: string
  currentStreak: number
  totalPosts: number
}

function extractTweetId(tweetUrlOrHtml: string): string | null {
  const match = tweetUrlOrHtml.match(/status\/(\d+)/);
  return match ? match[1] : null;
}


const CommunityPost = ({
  id,
  username,
  time,
  content,
  platform,
  embedUrl,
  likes,
  comments,
  avatarSrc,
}: Post) => {
  return (
    <div className="community-post">
      <div className="post-header">
        <Avatar className="avatar">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>{username[0]}</AvatarFallback>
        </Avatar>
        <div>
          <div className="username">{username}</div>
          <div className="post-time">{time}</div>
        </div>
      </div>

      <div className="post-content">
        {platform === "twitter" ? (
          <Tweet id={extractTweetId(content)||""}/>
        ) : platform === "linkedin" ? (
          <div dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p className="text-sm">{content}</p>
        )}
      </div>

      <div className="post-actions">
        <div className="post-buttons">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            👍 {likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <MessageSquare className="mr-1 h-4 w-4" /> {comments}
          </Button>
        </div>
        <Button variant="outline" size="sm">
          Share
        </Button>
      </div>
    </div>
  )
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCommunityData = async () => {
      try {
        const response = await axios.get("/api/community")
        setPosts(response.data.posts)
        setContributors(response.data.topContributors)
      } catch (err) {
        setError("Failed to fetch community data")
        console.error("Error fetching community data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCommunityData()
  }, [])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Loading community data...</p>
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <Breadcrumb className="breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">
                <Home className="icon" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>Community</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="page-heading">
        <h1 className="text-2xl font-bold">Community</h1>
        <p className="text-muted-foreground">
          Connect with other engineers on their #0to100xEngineer journey
        </p>
      </div>

      <div className="community-grid">
        <div className="left-column">
          <div className="posts-container bg-card rounded-lg p-4 shadow-sm">
            {posts.map((post) => (
              <CommunityPost
                key={post.id}
                id={post.id}
                username={post.username}
                time={post.time}
                content={post.content}
                platform={post.platform}
                likes={post.likes}
                comments={post.comments}
                avatarSrc={post.avatarSrc}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="right-column">
            <h3 className="contributors">Top Contributors</h3>
            <div className="contributors-list">
              {contributors.map((contributor) => (
                <div
                  key={contributor.id}
                  className="contributor-item"
                >
                  <div className="contributor-info">
                    <Avatar className="avatar-small">
                      <AvatarImage src={contributor.avatar} />
                      <AvatarFallback>{contributor.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{contributor.name}</span>
                  </div>
                  <Badge variant="outline" className="streak-badge">
                    {contributor.currentStreak}d streak
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="view-all-btn">
              View All
            </Button>
          </div>

          <div className="popular-topics">
            <h3 className="font-medium mb-3">Popular Topics</h3>
            <div className="topics-list">
              {[
                "AI Projects",
                "Prompt Engineering",
                "RAG Systems",
                "GenAI Basics",
                "Midjourney",
                "ChatGPT",
                "LLMs",
              ].map((topic, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="topic-badge"
                >
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
