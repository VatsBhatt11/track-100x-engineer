"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import '@/styles/postSubmission.css'

interface Submission {
  id: string;
  url: string;
  platform: "twitter" | "linkedin" | "unknown";
  date: string;
}

const PostSubmission = () => {
  const [url, setUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);

  // Fetch recent submissions on component mount
  useEffect(() => {
    fetchRecentSubmissions();
  }, []);

  const fetchRecentSubmissions = async () => {
    try {
      const { data } = await axios.get<Submission[]>("/api/posts");
      setRecentSubmissions(data);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch recent submissions",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a valid LinkedIn or Twitter post URL",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await axios.post<Submission>("/api/posts", {
        url: trimmedUrl,
      });

      // Refresh the recent submissions
      await fetchRecentSubmissions();
      
      setUrl("");
      toast({
        title: "Post submitted successfully!",
        description: "Your streak has been updated.",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Failed to submit post",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="card-container">
      <CardHeader>
        <CardTitle>Submit Today&apos;s Post</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="submission-form">
          <div className="form-group">
            <label htmlFor="post-url" className="form-label">
              Post URL
            </label>
            <Input
              id="post-url"
              placeholder="https://twitter.com/... or https://linkedin.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <Button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Post"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="card-footer">
        <h4 className="recent-title">Recent Submissions</h4>
        {recentSubmissions.length > 0 ? (
          <ul className="submission-list">
            {recentSubmissions.map((submission) => (
              <li
                key={submission.id}
                className="submission-item"
              >
                <div className="submission-link">
                  <Badge
                    variant={
                      submission.platform === "twitter"
                        ? "default"
                        : submission.platform === "linkedin"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {submission.platform === "twitter"
                      ? "Twitter"
                      : submission.platform === "linkedin"
                      ? "LinkedIn"
                      : "Unknown"}
                  </Badge>
                  <a
                    href={submission.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="submission-url" 
                  >
                    {submission.url}
                  </a>
                </div>
                <span className="submission-date">
                  {submission.date}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-submissions">No recent submissions</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default PostSubmission;
