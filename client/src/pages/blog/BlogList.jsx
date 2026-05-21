import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, User, Tag, ChevronRight } from "lucide-react";
import Navbar from "../frontend/Navbar";
import Footer from "../frontend/Footer";
import blogs from "../../data/blogsData";

const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

const BlogList = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? blogs
      : blogs.filter((b) => b.category === activeCategory);

  return (
    <>
      <Navbar />

      <main className="bg-slate-50 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-14 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              Resources
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">Blog &amp; Insights</h1>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Expert articles on tax filing, GST, business registration, and compliance — written by our CA and CS professionals.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                {/* Category badge */}
                <div className="p-6 flex flex-col flex-1">
                  <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-3 w-fit">
                    {blog.category}
                  </span>

                  <h2 className="text-slate-900 font-bold text-base leading-snug mb-3 line-clamp-2">
                    {blog.title}
                  </h2>

                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full"
                      >
                        <Tag size={10} />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <User size={12} />
                      {blog.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {blog.readTime}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-blue-400" />
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              No articles found in this category.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogList;
