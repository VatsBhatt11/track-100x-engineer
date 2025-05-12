"use client"

import Link from "next/link"
import { Home, MessageSquare } from "lucide-react"

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

const CommunityPost = ({
  username,
  time,
  content,
  likes,
  comments,
  avatarSrc,
}: {
  username: string
  time: string
  content: string
  likes: number
  comments: number
  avatarSrc?: string
}) => {
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
        <p className="text-sm">{content}</p>
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
  const communityPosts = [
    {
      id: 1,
      username: "alex_developer",
      time: "2 hours ago",
      content:
        "Just completed my Day 15 challenge for #0to100xEngineer! Built a simple AI chatbot that can summarize articles. Check it out on my profile.",
      likes: 24,
      comments: 5,
    },
    {
      id: 2,
      username: "sara_coder",
      time: "Yesterday",
      content:
        "Struggling with prompt engineering for my RAG application. Any tips from the community? #0to100xEngineer Day 23 is kicking my butt!",
      likes: 18,
      comments: 12,
    },
    {
      id: 3,
      username: "tech_marco",
      time: "2 days ago",
      content:
        "🎉 Just hit a 30-day streak on my #0to100xEngineer journey! The key is consistency and building in public. Happy to help anyone who's just getting started!",
      likes: 45,
      comments: 8,
    },
  ]

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
          <div className="post-box">
            <textarea
              placeholder="Share your progress with the community..."
              className="w-full p-3 bg-secondary rounded-lg text-sm mb-3"
              rows={3}
            />
            <div className="post-footer">
              <div className="post-hit">
                Add #0to100xEngineer to your post
              </div>
              <Button className="post-button">
                Post Update
              </Button>
            </div>
          </div>

          {communityPosts.map((post) => (
            <CommunityPost
              key={post.id}
              username={post.username}
              time={post.time}
              content={post.content}
              likes={post.likes}
              comments={post.comments}
            />
          ))}
        </div>

        <div>
          <div className="right-column">
            <h3 className="contributors">Top Contributors</h3>
            <div className="contributors-list">
              {["alex_developer", "sara_coder", "tech_marco", "jenny_ai"].map(
                (user, i) => (
                  <div
                    key={i}
                    className="contributor-item"
                  >
                    <div className="contributor-info">
                      <Avatar className="avatar-small">
                        <AvatarFallback>{user[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user}</span>
                    </div>
                    <Badge variant="outline" className="streak-badge">
                      {30 - i * 5}d streak
                    </Badge>
                  </div>
                )
              )}
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
