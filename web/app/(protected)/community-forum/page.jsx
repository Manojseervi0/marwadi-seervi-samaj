"use client";

import { useRef, useState } from "react";
import { FaComments, FaQuestion, FaLightbulb, FaUsers, FaHeart, FaReply, FaShare } from "react-icons/fa";
import { useToast } from "@/lib/toast-context";

const initialPosts = [
  {
    id: 1,
    title: "How to transition from IT to Data Science?",
    content: "I have 5 years of experience in software development and want to switch to data science. Any advice on courses and certifications?",
    author: "Rahul Kumar",
    category: "career",
    replies: 2,
    likes: 15,
    timeAgo: "2 hours ago",
    tags: ["career-change", "data-science", "certification"],
    repliesList: [
      { id: 101, author: "Priya Sharma", text: "Start with Python, then take Andrew Ng's Machine Learning course on Coursera.", timeAgo: "1 hour ago" },
      { id: 102, author: "Amit Patel", text: "Kaggle competitions helped me a lot during my transition. Build a good project portfolio.", timeAgo: "45 mins ago" },
    ],
  },
  {
    id: 2,
    title: "Best MBA programs for working professionals",
    content: "Looking for recommendations for part-time or online MBA programs that are well-recognized in the industry.",
    author: "Priya Sharma",
    category: "education",
    replies: 1,
    likes: 23,
    timeAgo: "1 day ago",
    tags: ["mba", "online-education", "part-time"],
    repliesList: [
      { id: 201, author: "Sunita Verma", text: "ISB PGPpro and IIM executive MBA programs are top tier for working professionals.", timeAgo: "18 hours ago" },
    ],
  },
  {
    id: 3,
    title: "Starting a small business in the community",
    content: "I want to start a catering business focusing on traditional Marwadi cuisine. Any tips on getting started?",
    author: "Meera Patel",
    category: "business",
    replies: 0,
    likes: 18,
    timeAgo: "3 days ago",
    tags: ["entrepreneurship", "catering", "traditional-business"],
    repliesList: [],
  },
];

const categories = [
  { id: "career", name: "Career & Jobs", icon: FaLightbulb, solid: "bg-blue-500 text-white", outline: "border border-blue-500 text-blue-600", badge: "bg-blue-100 text-blue-800" },
  { id: "education", name: "Education", icon: FaUsers, solid: "bg-green-500 text-white", outline: "border border-green-500 text-green-600", badge: "bg-green-100 text-green-800" },
  { id: "business", name: "Business", icon: FaQuestion, solid: "bg-purple-500 text-white", outline: "border border-purple-500 text-purple-600", badge: "bg-purple-100 text-purple-800" },
  { id: "general", name: "General", icon: FaComments, solid: "bg-orange-500 text-white", outline: "border border-orange-500 text-orange-600", badge: "bg-orange-100 text-orange-800" },
];

export default function CommunityForumPage() {
  const [forumPosts, setForumPosts] = useState(initialPosts);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("career");
  const [replyingToPostId, setReplyingToPostId] = useState(initialPosts[0].id);

  const replyTextareaRef = useRef(null);
  const toast = useToast();

  const targetPost = forumPosts.find((p) => p.id === replyingToPostId) || forumPosts[0];

  const handleAskQuestion = () => {
    if (!newQuestion.trim()) {
      toast({ title: "Please enter a question", status: "warning", duration: 3000 });
      return;
    }

    const newPost = {
      id: Date.now(),
      title: newQuestion.slice(0, 60) + (newQuestion.length > 60 ? "..." : ""),
      content: newQuestion,
      author: localStorage.getItem("registeredEmail") || "Community Member",
      category: selectedCategory,
      replies: 0,
      likes: 0,
      timeAgo: "Just now",
      tags: [selectedCategory, "discussion"],
      repliesList: [],
    };

    setForumPosts([newPost, ...forumPosts]);
    setReplyingToPostId(newPost.id);
    toast({ title: "Question posted successfully!", status: "success", duration: 3000 });
    setNewQuestion("");
  };

  const handleSelectPostForReply = (post) => {
    setReplyingToPostId(post.id);
    const el = document.getElementById("quick-reply-box");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        if (replyTextareaRef.current) replyTextareaRef.current.focus();
      }, 400);
    }
  };

  const handleReply = () => {
    if (!newAnswer.trim()) {
      toast({ title: "Please enter a reply", status: "warning", duration: 3000 });
      return;
    }
    if (!targetPost) return;

    const newReply = {
      id: Date.now(),
      author: localStorage.getItem("registeredEmail") || "Community Member",
      text: newAnswer.trim(),
      timeAgo: "Just now",
    };

    setForumPosts((prevPosts) =>
      prevPosts.map((p) => {
        if (p.id === targetPost.id) {
          const list = p.repliesList || [];
          return { ...p, replies: (p.replies || 0) + 1, repliesList: [...list, newReply] };
        }
        return p;
      })
    );

    toast({ title: "Reply posted successfully!", description: `Added reply to "${targetPost.title}"`, status: "success", duration: 3000 });
    setNewAnswer("");
  };

  const handleLike = (id) => {
    setForumPosts(forumPosts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
  };

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-400 to-green-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold">Community Forum</h1>
          <p className="text-xl max-w-2xl">
            Ask questions, share knowledge, and connect with community members. Get help with your career, education, and more.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => document.getElementById("ask-question-box")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base font-medium bg-white/90 hover:bg-white text-blue-700 rounded-md px-6 py-3"
            >
              Ask a Question
            </button>
            <button
              onClick={() => document.getElementById("topics-box")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base font-medium border border-white text-white rounded-md px-6 py-3"
            >
              Browse Topics
            </button>
          </div>
        </div>
      </div>

      {/* Ask Question Section */}
      <div id="ask-question-box" className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Ask a Question</h2>

            <div className="flex flex-col gap-6">
              <div className="w-full">
                <p className="mb-2 font-medium">Category</p>
                <div className="flex flex-wrap gap-4">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 text-sm font-medium rounded-md px-3 py-1.5 ${
                        selectedCategory === category.id ? category.solid : category.outline
                      }`}
                    >
                      <category.icon /> {category.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full">
                <p className="mb-2 font-medium">Your Question</p>
                <textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Ask your question here..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={handleAskQuestion}
                className="w-full h-12 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Posts */}
      <div id="topics-box" className="py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <h2 className="text-3xl font-bold text-blue-800 w-full">Recent Discussions</h2>

          {forumPosts.map((post) => {
            const cat = categories.find((c) => c.id === post.category);
            return (
              <div key={post.id} className="bg-white shadow-md rounded-lg p-6 w-full flex flex-col gap-4">
                <div className="flex justify-between items-start w-full gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-orange-400 text-white flex items-center justify-center text-sm font-bold">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold">{post.author}</p>
                      <p className="text-sm text-gray-500">{post.timeAgo}</p>
                    </div>
                  </div>
                  {cat && (
                    <span className={`text-xs font-semibold rounded px-2 py-1 whitespace-nowrap ${cat.badge}`}>{cat.name}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-600">{post.content}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-1">#{tag}</span>
                  ))}
                </div>

                {post.repliesList && post.repliesList.length > 0 && (
                  <div className="flex flex-col gap-2 pt-2">
                    <p className="text-xs font-bold text-blue-700">Replies ({post.repliesList.length}):</p>
                    {post.repliesList.map((rep) => (
                      <div key={rep.id} className="bg-blue-50 p-3 rounded-md border-l-[3px] border-blue-400">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-semibold text-blue-900">{rep.author}</span>
                          <span className="text-xs text-gray-500">{rep.timeAgo}</span>
                        </div>
                        <p className="text-sm text-gray-800">{rep.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <hr />

                <div className="flex gap-6">
                  <button
                    onClick={() => handleSelectPostForReply(post)}
                    className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md px-2 py-1"
                  >
                    <FaReply /> Reply ({post.replies})
                  </button>
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 text-sm hover:bg-gray-50 rounded-md px-2 py-1"
                  >
                    <FaHeart /> Like ({post.likes})
                  </button>
                  <button
                    onClick={() => {
                      if (navigator.clipboard) navigator.clipboard.writeText(window.location.href);
                      toast({ title: "Discussion Link Copied!", status: "info", duration: 2000 });
                    }}
                    className="flex items-center gap-2 text-sm hover:bg-gray-50 rounded-md px-2 py-1"
                  >
                    <FaShare /> Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Reply Section */}
      <div id="quick-reply-box" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-2xl font-bold text-blue-800">Quick Reply</h2>
            {targetPost && (
              <p className="text-sm text-blue-600 mt-1 mb-4">
                Replying to: <b>&quot;{targetPost.title}&quot;</b> by {targetPost.author}
              </p>
            )}
            <div className="flex flex-col gap-4">
              <textarea
                ref={replyTextareaRef}
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder={targetPost ? `Write your reply to "${targetPost.title}"...` : "Share your thoughts or provide an answer..."}
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleReply}
                className="w-full h-12 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium"
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
