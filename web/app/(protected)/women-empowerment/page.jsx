"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaHeart, FaPlus, FaComment, FaShare, FaUpload, FaChevronLeft, FaChevronRight, FaTimes,
} from "react-icons/fa";
import { useToast } from "@/lib/toast-context";

const initialQuestions = [
  {
    id: 1,
    author: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    question: "What are the best resources for learning digital marketing as a beginner?",
    answers: [
      { id: 1, author: "Meera Patel", text: "I recommend starting with Google Digital Garage and HubSpot Academy. Both are free and comprehensive!", likes: 12 },
      { id: 2, author: "Anjali Gupta", text: "YouTube channels like Neil Patel and Moz are also great for practical tips.", likes: 8 },
    ],
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    author: "Sunita Verma",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    question: "How do you balance work and family responsibilities?",
    answers: [
      { id: 3, author: "Rekha Singh", text: "Time management is key! I use the Pomodoro technique and delegate tasks when possible.", likes: 15 },
    ],
    timestamp: "5 hours ago",
  },
];

const initialArticles = [
  {
    id: 1,
    title: "Breaking Glass Ceilings: My Journey in Tech",
    author: "Dr. Kavita Mehta",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "As a woman in technology, I've faced numerous challenges but also discovered incredible opportunities...",
    likes: 45,
    category: "Career",
    timestamp: "1 day ago",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Traditional Values, Modern Success",
    author: "Smita Patel",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
    content: "How I built a successful business while maintaining our cultural heritage and family values...",
    likes: 32,
    category: "Entrepreneurship",
    timestamp: "3 days ago",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

const achievements = [
  { name: "Dr. Kavita Mehta", achievement: "First Marwadi woman to become CTO at a Fortune 500 company", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", year: "2023" },
  { name: "Priya Sharma", achievement: "Founded successful eco-friendly fashion brand with 100+ employees", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", year: "2023" },
  { name: "Meera Patel", achievement: "Published research on AI ethics, cited by 500+ academic papers", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", year: "2022" },
  { name: "Anjali Gupta", achievement: "Led community initiative providing education to 1000+ underprivileged children", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", year: "2022" },
];

export default function WomenEmpowermentPage() {
  const toast = useToast();
  const { t } = useTranslation();

  const [answerModalOpen, setAnswerModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);

  const [questions, setQuestions] = useState(initialQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [articles, setArticles] = useState(initialArticles);
  const [newArticle, setNewArticle] = useState({ title: "", content: "", category: "Career" });

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev === achievements.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? achievements.length - 1 : prev - 1));

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      const question = {
        id: questions.length + 1,
        author: "You",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        question: newQuestion,
        answers: [],
        timestamp: "Just now",
      };
      setQuestions([question, ...questions]);
      setNewQuestion("");
      toast({ title: "Question posted!", status: "success", duration: 3000 });
    }
  };

  const handleAddAnswer = () => {
    if (newAnswer.trim() && selectedQuestion) {
      const answer = { id: Date.now(), author: "You", text: newAnswer, likes: 0 };
      setQuestions(questions.map((q) => (q.id === selectedQuestion.id ? { ...q, answers: [...q.answers, answer] } : q)));
      setNewAnswer("");
      setSelectedQuestion(null);
      setAnswerModalOpen(false);
      toast({ title: "Answer posted!", status: "success", duration: 3000 });
    }
  };

  const handleLikeArticle = (articleId) => {
    setArticles(articles.map((article) => (article.id === articleId ? { ...article, likes: article.likes + 1 } : article)));
  };

  const handleSubmitArticle = () => {
    if (newArticle.title.trim() && newArticle.content.trim()) {
      const article = {
        id: articles.length + 1,
        title: newArticle.title,
        author: "You",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
        content: newArticle.content,
        likes: 0,
        category: newArticle.category,
        timestamp: "Just now",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      };
      setArticles([article, ...articles]);
      setNewArticle({ title: "", content: "", category: "Career" });
      setArticleModalOpen(false);
      toast({ title: "Article published!", status: "success", duration: 3000 });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold">{t("women_empowerment_page.title")}</h1>
          <p className="text-xl opacity-90 max-w-2xl">{t("women_empowerment_page.subtitle")}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById("ask-question-section")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 text-base font-medium bg-white/90 hover:bg-white text-orange-700 rounded-md px-6 py-3"
            >
              <FaPlus /> {t("women_empowerment_page.post_question")}
            </button>
            <button
              onClick={() => {
                setNewArticle({ title: "", content: "", category: "Career" });
                setArticleModalOpen(true);
              }}
              className="flex items-center gap-2 text-base font-medium border border-white text-white rounded-md px-6 py-3"
            >
              <FaUpload /> {t("women_empowerment_page.write_article")}
            </button>
          </div>
        </div>
      </div>

      {/* Achievements Carousel */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">{t("women_empowerment_page.achievements_title")}</h2>
            <p className="text-lg text-orange-600 max-w-2xl">{t("women_empowerment_page.achievements_subtitle")}</p>
          </div>

          <div className="relative w-full max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-xl bg-white shadow-2xl relative">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                  width: `${achievements.length * 100}%`,
                }}
              >
                {achievements.map((achievement, index) => (
                  <div key={index} className="text-center px-8 py-12" style={{ width: `${100 / achievements.length}%` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={achievement.image}
                      alt={achievement.name}
                      className="rounded-full w-[200px] h-[200px] mx-auto mb-6 object-cover shadow-lg"
                    />
                    <h3 className="text-2xl font-bold text-orange-800 mb-3">{achievement.name}</h3>
                    <p className="text-lg text-orange-600 mb-4 max-w-2xl mx-auto">{achievement.achievement}</p>
                    <span className="inline-block text-base font-semibold bg-orange-100 text-orange-800 rounded px-4 py-2">
                      {achievement.year}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={prevSlide}
                aria-label="Previous slide"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
              >
                <FaChevronRight />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {achievements.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-orange-500" : "bg-orange-200"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Q&A Feed Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="text-center w-full">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">{t("women_empowerment_page.ask_answer_title")}</h2>
            <p className="text-lg text-orange-600 mb-6">{t("women_empowerment_page.ask_answer_subtitle")}</p>

            <div id="ask-question-section" className="bg-white shadow-md rounded-xl p-6 mb-8 flex flex-col gap-4 text-left">
              <textarea
                placeholder={t("women_empowerment_page.ask_question")}
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleAddQuestion}
                disabled={!newQuestion.trim()}
                className="self-start flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                <FaComment /> {t("women_empowerment_page.post_question")}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {questions.map((question) => (
              <div key={question.id} className="bg-white shadow-md rounded-xl w-full p-6">
                <div className="flex items-center gap-4 mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={question.avatar} alt={question.author} className="w-11 h-11 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-orange-800">{question.author}</p>
                    <p className="text-sm text-gray-500">{question.timestamp}</p>
                  </div>
                </div>

                <p className="text-lg text-orange-700 mb-4">{question.question}</p>

                {question.answers.length > 0 && (
                  <div className="flex flex-col items-start gap-3 w-full mb-3">
                    <p className="font-semibold text-orange-600">
                      {question.answers.length} Answer{question.answers.length !== 1 ? "s" : ""}
                    </p>
                    {question.answers.map((answer) => (
                      <div key={answer.id} className="bg-orange-50 p-4 rounded-lg w-full">
                        <div className="flex items-center gap-3 mb-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-sm text-orange-800">{answer.author}</p>
                            <div className="flex items-center gap-2">
                              <FaHeart className="text-pink-500 text-xs" />
                              <span className="text-xs text-gray-500">{answer.likes} likes</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-orange-700">{answer.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => {
                    setSelectedQuestion(question);
                    setAnswerModalOpen(true);
                  }}
                  className="flex items-center gap-2 text-sm text-orange-600 hover:bg-orange-50 rounded-md px-2 py-1"
                >
                  <FaComment /> {t("women_empowerment_page.add_answer")}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="text-center w-full">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">{t("women_empowerment_page.articles_title")}</h2>
            <p className="text-lg text-orange-600 mb-6">{t("women_empowerment_page.articles_subtitle")}</p>

            <button
              onClick={() => {
                setNewArticle({ title: "", content: "", category: "Career" });
                setArticleModalOpen(true);
              }}
              className="flex items-center gap-2 mx-auto bg-orange-500 hover:bg-orange-600 text-white rounded-md px-6 py-3 font-medium"
            >
              <FaUpload /> {t("women_empowerment_page.write_article")}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {articles.map((article) => (
              <div key={article.id} className="bg-white shadow-lg rounded-xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.image} alt={article.title} className="w-full h-[200px] object-cover" />
                <div className="p-6">
                  <span className="inline-block text-xs font-semibold bg-orange-100 text-orange-800 rounded px-2 py-1 mb-3">
                    {article.category}
                  </span>
                  <h3 className="text-lg font-bold mb-3 text-orange-800 line-clamp-2">{article.title}</h3>
                  <p className="text-orange-600 mb-4 line-clamp-3">{article.content}</p>

                  <div className="flex items-center gap-3 mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={article.avatar} alt={article.author} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-sm text-orange-800">{article.author}</p>
                      <p className="text-xs text-gray-500">{article.timestamp}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => handleLikeArticle(article.id)}
                      className="flex items-center gap-2 text-sm text-pink-600 hover:bg-pink-50 rounded-md px-2 py-1"
                    >
                      <FaHeart /> {article.likes}
                    </button>
                    <button className="flex items-center gap-2 text-sm text-orange-600 hover:bg-orange-50 rounded-md px-2 py-1">
                      <FaShare /> {t("common.share")}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Modal */}
      {answerModalOpen && selectedQuestion && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-xl font-bold text-orange-800">{t("women_empowerment_page.add_answer")}</h2>
              <button onClick={() => setAnswerModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 pt-2 flex flex-col gap-4">
              <div className="bg-orange-50 p-4 rounded-lg w-full">
                <p className="font-semibold text-orange-800 mb-2">Question:</p>
                <p className="text-orange-700">{selectedQuestion.question}</p>
              </div>
              <textarea
                placeholder="Write your answer..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleAddAnswer}
                disabled={!newAnswer.trim()}
                className="self-start bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                {t("women_empowerment_page.add_answer")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article Modal */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-xl font-bold text-orange-800">{t("women_empowerment_page.write_article")}</h2>
              <button onClick={() => setArticleModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 pt-2 flex flex-col gap-4">
              <input
                placeholder="Article Title"
                value={newArticle.title}
                onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                className="w-full h-12 px-4 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
              />
              <textarea
                placeholder="Write your article content..."
                value={newArticle.content}
                onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                rows={10}
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleSubmitArticle}
                disabled={!newArticle.title.trim() || !newArticle.content.trim()}
                className="self-start flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-md px-4 py-2 text-sm font-medium"
              >
                <FaUpload /> {t("women_empowerment_page.publish_article")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t-2 border-orange-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-orange-600 text-sm text-center font-medium">© 2024 Marwadi Seervi Samaj. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
