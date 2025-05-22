"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
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
     await axios.post<Submission>("/api/posts", {
        url: trimmedUrl,
      });
      
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
            <p className="text-sm text-muted-foreground mt-2">
              Your post must contain the hashtag <span className="font-semibold">#0to100xEngineer</span> to be accepted.
            </p>
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
    </Card>
  );
};

export default PostSubmission;
