"use client";
import { useState } from "react";
import {
  FaHome,
  FaQuestion,
  FaEnvelope,
  FaTag,
  FaUser,
  FaBuilding,
  FaPlus,
  FaPython,
  FaJava,
  FaCode,
  FaThumbsUp,
  FaComment,
  FaEye,
  FaJs,
  FaReact,
  FaNodeJs,
  FaPhp,
  FaRust,
  FaSwift,
  FaHtml5,
  FaCss3,
  FaTimes,
  FaGooglePlay,
  FaApple,
  FaTwitter,
  FaGithub,
  FaLinkedin,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { initialQuestions } from "@/lib/utils/initial-questions";
import { UserButton } from "@clerk/nextjs";

interface User {
  name: string;
  image: string;
}

interface Question {
  id: number;
  title: string;
  code: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  user: User;
  timestamp: string;
  isFollowing: boolean;
  commentList: string[];
}

interface Collective {
  name: string;
  icon: React.ReactNode;
  members: number;
}

const collectives: Collective[] = [
  { name: "Python", icon: <FaPython />, members: 21000 },
  { name: "Java", icon: <FaJava />, members: 15000 },
  { name: "JavaScript", icon: <FaJs />, members: 23000 },
  { name: "React", icon: <FaReact />, members: 18000 },
  { name: "Node.js", icon: <FaNodeJs />, members: 16000 },
  { name: "PHP", icon: <FaPhp />, members: 12000 },
  { name: "Rust", icon: <FaRust />, members: 9000 },
  { name: "Swift", icon: <FaSwift />, members: 8000 },
  { name: "HTML5", icon: <FaHtml5 />, members: 25000 },
  { name: "CSS3", icon: <FaCss3 />, members: 24000 },
];

// Components
function Header({
  onToggleSidebar,
  isSidebarOpen,
}: {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}) {
  return (
    <header className="fixed top-0 z-50 w-full bg-blue-700 dark:bg-blue-900 text-white shadow-md transition-all duration-300">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={onToggleSidebar}
              className="inline-flex items-center p-2 text-sm text-white rounded-lg md:hidden hover:bg-blue-800 dark:hover:bg-blue-950 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <span className="sr-only">Toggle sidebar</span>
              {isSidebarOpen ? (
                <FaTimes className="w-6 h-6" />
              ) : (
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              )}
            </button>
            <a href="#" className="flex items-center ml-2">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg">
                <FaCode className="text-white text-xl" />
              </div>
              <span className="self-center text-lg font-semibold whitespace-nowrap">
                COD1NG
              </span>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <UserButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function PremiumCard({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="bg-gradient-to-r from-indigo-400 to-blue-600 text-white p-4 rounded-lg shadow-md mb-4 hover:shadow-xl transition-shadow duration-200">
      <h3 className="text-sm font-bold">Premium Plan</h3>
      <p className="text-xs">
        Upgrade to Premium for lifetime access to all features.
      </p>
      <button
        onClick={onUpgrade}
        className="bg-white text-indigo-600 px-4 py-2 rounded mt-2 hover:bg-indigo-100 transition-colors duration-200"
      >
        Upgrade Now
      </button>
    </div>
  );
}

function LeftSidebar({
  className,
  isSidebarOpen,
  currentView,
  setCurrentView,
  setIsUpgradeModalOpen,
}: {
  className?: string;
  isSidebarOpen: boolean;
  currentView: string;
  setCurrentView: (view: string) => void;
  setIsUpgradeModalOpen: (open: boolean) => void;
}) {
  const navItems = [
    { name: "Home", icon: FaHome, view: "home" },
    { name: "Questions", icon: FaQuestion, view: "questions" },
    { name: "Messages", icon: FaEnvelope, view: "messages" },
    { name: "Tags", icon: FaTag, view: "tags" },
    { name: "Users", icon: FaUser, view: "users" },
    { name: "Companies", icon: FaBuilding, view: "companies" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-gray-50 dark:bg-gray-900 text-black dark:text-white ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 ${className}`}
    >
      <div className="h-full px-3 pb-4 scrollable">
        <div className="pt-2 pb-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <FaCode className="text-white text-xl" />
            </div>
          </div>
          <div className="flex flex-col items-center mt-4">
            <h3 className="font-semibold text-lg">COD1NG</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Coding Community
            </p>
          </div>
        </div>
        <div className="py-2">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    if (item.view !== "questions") {
                      toast.info(`${item.name} page is under construction.`);
                    }
                    setCurrentView(item.view);
                  }}
                  className={`flex items-center w-full  p-2 rounded-lg transition-all duration-200 ${
                    item.view === "questions"
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  } ${
                    currentView === item.view
                      ? "bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  <span className="font-light">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="pt-2">
          <div className="text-xs text-gray-600 dark:text-gray-400 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <h3 className="text-sm font-light uppercase tracking-wider mb-3">
              Your Stats
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span>Total Questions</span>
              <span className="text-gray-800 dark:text-gray-100">100</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Answered</span>
              <span className="text-gray-800 dark:text-gray-100">50</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Reputation</span>
              <span className="text-gray-800 dark:text-gray-100">200</span>
            </div>
          </div>
        </div>
        <div className="pt-4">
          <PremiumCard onUpgrade={() => setIsUpgradeModalOpen(true)} />
        </div>
      </div>
    </aside>
  );
}

const tagColors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

function QuestionCard({
  question,
  onClick,
  onLike,
  onComment,
}: {
  question: Question;
  onClick: (q: Question) => void;
  onLike: (id: number) => void;
  onComment: (id: number, text: string) => void;
}) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      onComment(question.id, commentText);
      setCommentText("");
      setIsCommenting(false);
    }
  };

  return (
    <div id={`question-${question.id}`} className="mb-6">
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
        <div className="flex items-center mb-2 gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md">
            <Image
              src={question.user.image}
              width={32}
              height={32}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
              unoptimized={false}
            />
          </div>
          <div>
            <span className="font-semibold">{question.user.name}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
              {question.timestamp}
            </span>
          </div>
        </div>
        <h3
          className="text-lg font-bold mb-2 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          onClick={() => onClick(question)}
        >
          {question.title}
        </h3>
        <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm overflow-x-auto">
          <code>{question.code}</code>
        </pre>
        <div className="flex flex-wrap gap-2 mt-2">
          {question.tags.map((tag, index) => (
            <span
              key={index}
              className={`${
                tagColors[index % tagColors.length]
              } text-white px-2 py-1 rounded text-xs`}
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex space-x-4 mt-2 text-gray-600 dark:text-gray-400">
          <button
            onClick={() => onLike(question.id)}
            className="flex items-center space-x-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <FaThumbsUp />
            <span>{question.likes}</span>
          </button>
          <button
            onClick={() => setIsCommenting(!isCommenting)}
            className="flex items-center space-x-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <FaComment />
            <span>{question.comments}</span>
          </button>
          <span className="flex items-center space-x-1">
            <FaEye />
            <span>{question.views}</span>
          </span>
        </div>
        {isCommenting && (
          <div className="mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCommentSubmit();
              }}
              className="w-full bg-gray-100 dark:bg-gray-700 text-black dark:text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write a comment..."
            />
          </div>
        )}
        {isCommenting && question.commentList.length > 0 && (
          <div className="mt-2">
            {question.commentList.map((comment, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-sm mt-1"
              >
                <div className="flex items-center mb-2 gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500 shadow-md">
                    <Image
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3"
                      alt="Profile"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="font-semibold">Sidul Islam</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                    {new Date().toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    })}
                  </span>
                </div>
                <p className="break-all mt-1 text-sm text-gray-700 dark:text-gray-400">
                  {comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type RightProps = {
  onSeeAllPopular: () => void;
  joinedCollectives: string[];
  onJoinCollective: (name: string) => void;
};

function RightSidebar({
  onSeeAllPopular,
  joinedCollectives,
  onJoinCollective,
}: RightProps) {
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const [showAllCollectives, setShowAllCollectives] = useState(false);

  const popularQuestions = initialQuestions.filter((q) => q.views > 750);
  const displayedQuestions = showAllQuestions
    ? popularQuestions
    : popularQuestions.slice(0, 5);
  const displayedCollectives = showAllCollectives
    ? collectives
    : collectives.slice(0, 5);

  const handleJoin = (name: string) => {
    onJoinCollective(name);
    toast.success(`You joined ${name}!`);
  };

  return (
    <aside className="bg-gray-50 dark:bg-gray-900 text-black dark:text-white p-4 max-h-screen scrollable">
      {/* Popular Questions */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2 flex justify-between items-center">
          Popular Questions
          <span
            onClick={() => {
              setShowAllQuestions((prev) => !prev);
              onSeeAllPopular();
            }}
            className="text-gray-500 dark:text-gray-400 text-xs hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
          >
            {showAllQuestions ? "See less" : "See all"}
          </span>
        </h3>
        {displayedQuestions.map((q) => (
          <div key={q.id} className="mb-4">
            <p
              className="text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
              onClick={() => {
                const element = document.getElementById(`question-${q.id}`);
                if (element)
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
              }}
            >
              {q.title}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {q.user.name} • {q.timestamp}
            </p>
          </div>
        ))}
      </div>

      {/* Collectives */}
      <div>
        <h3 className="text-lg font-bold mb-2 flex justify-between items-center">
          Collectives
          <span
            onClick={() => setShowAllCollectives((prev) => !prev)}
            className="text-gray-500 dark:text-gray-400 text-xs hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
          >
            {showAllCollectives ? "See less" : "See all"}
          </span>
        </h3>
        {displayedCollectives.map((c) => (
          <div key={c.name} className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{c.icon}</span>
              <div>
                <p className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
                  {c.name}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {c.members.toLocaleString()} members
                </p>
              </div>
            </div>
            {joinedCollectives.includes(c.name) ? (
              <span className="text-green-500 text-sm">Joined</span>
            ) : (
              <button
                onClick={() => handleJoin(c.name)}
                className="bg-indigo-600 text-white px-2 py-1 rounded text-sm hover:bg-indigo-700 transition-colors"
              >
                Join
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}

function Messages() {
  const [messages, setMessages] = useState<
    { user: string; text: string; timestamp: string }[]
  >([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = {
        user: "Current User",
        text: input,
        timestamp: new Date().toLocaleString(),
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold mb-2">Messages</h3>
      <div className="space-y-2 mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-2 rounded animate-fade-in"
          >
            <p className="text-sm">
              <span className="font-semibold">{msg.user}:</span> {msg.text}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              {msg.timestamp}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          className="flex-1 bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Write a message..."
        />
      </div>
    </div>
  );
}

function AskQuestionModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (q: Question) => void;
}) {
  // if (!isOpen) return null;
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [tags, setTags] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !code.trim() || !tags.trim()) {
      toast.error("Please fill out all fields before submitting.");
      return;
    }

    const newQuestion: Question = {
      id: Date.now(),
      title: title.trim(),
      code: code.trim(),
      tags: tags.split(",").map((tag) => tag.trim()),
      likes: 0,
      comments: 0,
      views: 0,
      user: {
        name: "Sidul Islam",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      },
      timestamp: new Date().toLocaleString(),
      isFollowing: false,
      commentList: [],
    };

    onSubmit(newQuestion);
    setTitle("");
    setCode("");
    setTags("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-[#1c1e27] p-6 rounded-2xl shadow-xl w-full max-w-xl mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Ask a Question
            </h2>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ask Your Question"
              required
              className="w-full bg-[#16161a] text-white p-3 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste Your Code Here..."
              className="w-full bg-[#16161a] text-white p-3 rounded mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={5}
              required
            />
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (comma separated)"
              required
              className="w-full bg-[#16161a] text-white p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function UpgradeModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Upgrade to Premium</h2>
        <p className="mb-4">
          Get lifetime unlimited access to all questions for a one-time fee!
        </p>
        <button
          onClick={onClose}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

type Props = {
  displayedQuestions: Question[];
  filter: string;
  setFilter: (f: string) => void;
  setIsAskQuestionModalOpen: (open: boolean) => void;
  setSelectedQuestion: (q: Question) => void;
  onLike: (id: number) => void;
  onComment: (id: number, text: string) => void;
};

function QuestionsView({
  displayedQuestions,
  filter,
  setFilter,
  setIsAskQuestionModalOpen,
  setSelectedQuestion,
  onLike,
  onComment,
}: Props) {
  const filters = ["all", "following", "unanswered", "relevant", "popular"];

  // Show a toast when a question is liked
  const handleLike = (id: number) => {
    onLike(id);
    toast.success("You liked a question!");
  };

  // Show a toast when a comment is posted
  const handleComment = (id: number, text: string) => {
    onComment(id, text);
    toast.info("Your comment has been posted!");
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 text-sm">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded transition-colors ${
              filter === f
                ? "bg-indigo-600 text-white"
                : "text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsAskQuestionModalOpen(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-4 hover:bg-indigo-700 transition-colors"
      >
        <FaPlus className="inline mr-1" /> Ask a Question
      </button>

      {displayedQuestions.map((q) => (
        <QuestionCard
          key={q.id}
          question={q}
          onClick={setSelectedQuestion}
          onLike={handleLike}
          onComment={handleComment}
        />
      ))}
    </>
  );
}

function MessagesView() {
  return <Messages />;
}

function PlaceholderView({ viewName }: { viewName: string }) {
  return (
    <div className="text-center text-gray-400 dark:text-gray-500">
      <h2 className="text-2xl font-bold mb-4">{viewName} Page</h2>
      <p>Content for {viewName} goes here.</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full mt-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-6 md:mb-0">
          <h3
            className={`text-2xl font-bold mb-2 text-gray-800 dark:text-white`}
          >
            Coding <span className="text-purple-600">Community</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 max-w-md">
            This is a community platform where developers can share and discuss
            coding questions.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#"
            className="flex items-center bg-black text-white p-3 rounded-xl hover:bg-gray-900 transition-colors duration-200"
          >
            <FaGooglePlay className="mr-3 text-xl" />
            <div>
              <p className="text-xs text-gray-400">Download on</p>
              <p className="font-semibold">Google Play</p>
            </div>
          </a>
          <a
            href="#"
            className="flex items-center bg-black text-white p-3 rounded-xl hover:bg-gray-900 transition-colors duration-200"
          >
            <FaApple className="mr-3 text-xl" />
            <div>
              <p className="text-xs text-gray-400">Download on</p>
              <p className="font-semibold">App Store</p>
            </div>
          </a>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex flex-wrap space-x-6 mb-4 md:mb-0">
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              About
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              Terms
            </a>
          </div>
          <div className="flex space-x-6">
            <a
              title="twitter link"
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <FaTwitter className="text-xl" />
            </a>
            <a
              title="GitHub link"
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <FaGithub className="text-xl" />
            </a>
            <a
              title="LinkedIn link"
              href="#"
              className="text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            >
              <FaLinkedin className="text-xl" />
            </a>
          </div>
        </div>
        <p className="text-xs mt-3">
          &copy; {new Date().getFullYear()} COD1NG Community. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("questions");
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [filter, setFilter] = useState("all");
  const [isAskQuestionModalOpen, setIsAskQuestionModalOpen] = useState(false);
  const [, setSelectedQuestion] = useState<Question | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [joinedCollectives, setJoinedCollectives] = useState<string[]>([]);

  const handleLike = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, likes: q.likes + 1 } : q
      )
    );
  };

  const handleComment = (questionId: number, commentText: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              comments: q.comments + 1,
              commentList: [...q.commentList, commentText],
            }
          : q
      )
    );
  };

  let filteredQuestions = questions;
  if (filter === "following")
    filteredQuestions = questions.filter((q) => q.isFollowing);
  else if (filter === "unanswered")
    filteredQuestions = questions.filter((q) => q.comments === 0);
  else if (filter === "popular")
    filteredQuestions = questions.filter((q) => q.likes > 50);

  return (
    <>
      <div
        className={`bg-gray-50 dark:bg-gray-950 text-black dark:text-white min-h-screen`}
      >
        <Header
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />
        <LeftSidebar
          isSidebarOpen={isSidebarOpen}
          currentView={currentView}
          setCurrentView={setCurrentView}
          setIsUpgradeModalOpen={setIsUpgradeModalOpen}
        />
        <div className="pt-24 p-4 md:ml-64">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300">
            <main className="md:col-span-2 max-h-screen scrollable">
              {currentView === "questions" && (
                <QuestionsView
                  displayedQuestions={filteredQuestions}
                  filter={filter}
                  setFilter={setFilter}
                  setIsAskQuestionModalOpen={setIsAskQuestionModalOpen}
                  setSelectedQuestion={setSelectedQuestion}
                  onLike={handleLike}
                  onComment={handleComment}
                />
              )}
              {currentView === "messages" && <MessagesView />}
              {currentView === "home" && <PlaceholderView viewName="Home" />}
              {currentView === "tags" && <PlaceholderView viewName="Tags" />}
              {currentView === "users" && <PlaceholderView viewName="Users" />}
              {currentView === "companies" && (
                <PlaceholderView viewName="Companies" />
              )}
            </main>
            <RightSidebar
              onSeeAllPopular={() => setFilter("popular")}
              joinedCollectives={joinedCollectives}
              onJoinCollective={(name) =>
                setJoinedCollectives([...joinedCollectives, name])
              }
            />
          </div>
          <Footer />
        </div>
        <AskQuestionModal
          isOpen={isAskQuestionModalOpen}
          onClose={() => setIsAskQuestionModalOpen(false)}
          onSubmit={(newQuestion) => setQuestions([newQuestion, ...questions])}
        />
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
        />
      </div>
    </>
  );
}
