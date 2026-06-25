import { useParams, Link } from "react-router-dom";
import { Clock, Tag, ArrowLeft, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Navbar from "../frontend/Navbar";
import Footer from "../frontend/Footer";
import blogs from "../../data/blogsData";

const BlogDetail = () => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <>
        <Navbar />
        <main className="bg-slate-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Article not found</h1>
            <p className="text-slate-500 mb-6">The article you're looking for doesn't exist.</p>
            <Link to="/blog" className="text-blue-600 hover:underline font-medium">
              ← Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Render inline content: bold **text** and [text](url) hyperlinks
  const renderInline = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="text-slate-900 font-semibold">
            {part.replace(/\*\*/g, "")}
          </strong>
        );
      }
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a key={j} href={linkMatch[2]} target="_blank" rel="noopener noreferrer"
            className="text-blue-600 hover:underline font-medium">
            {linkMatch[1]}
          </a>
        );
      }
      return part;
    });
  };

  // Render content: bold **text**, [links](url), bullet lists, tables and paragraphs
  const renderContent = (text) => {
    return text.split("\n\n").map((para, i) => {
      if (!para.trim()) return null;

      // Section heading (starts with **)
      if (para.startsWith("**") && para.endsWith("**")) {
        return (
          <h3 key={i} className="text-slate-900 font-bold text-base mt-6 mb-2">
            {para.replace(/\*\*/g, "")}
          </h3>
        );
      }

      // Image ![alt](url)
      if (para.startsWith("![")) {
        const imgMatch = para.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        if (imgMatch) {
          return (
            <div key={i} className="my-5 flex justify-center">
              <img
                src={imgMatch[2]}
                alt={imgMatch[1]}
                className="rounded-xl border border-slate-200 shadow-sm max-w-full"
              />
            </div>
          );
        }
      }

      // Table (lines starting with |)
      if (para.startsWith("| ") || para.startsWith("|")) {
        const rows = para.split("\n").filter(line => line.trim() && !line.match(/^\|[-| ]+\|$/));
        const headers = rows[0].split("|").filter(c => c.trim()).map(c => c.trim());
        const bodyRows = rows.slice(1);
        return (
          <div key={i} className="my-4 overflow-x-auto rounded-xl border border-yellow-300">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-yellow-300">
                  {headers.map((h, j) => (
                    <th key={j} className="text-left px-4 py-2.5 font-bold text-slate-800 bg-yellow-50 text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, j) => {
                  const cells = row.split("|").filter(c => c.trim()).map(c => c.trim());
                  return (
                    <tr key={j} className={`border-b border-yellow-200 ${j % 2 === 1 ? "bg-slate-50" : "bg-white"}`}>
                      {cells.map((cell, k) => (
                        <td key={k} className="px-4 py-2.5 text-slate-700 font-medium text-xs">
                          {renderInline(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );
      }

      // Bullet list (lines starting with -)
      if (para.includes("\n- ") || para.startsWith("- ")) {
        const lines = para.split("\n");
        return (
          <ul key={i} className="space-y-1.5 my-3 pl-1">
            {lines.map((line, j) => {
              if (line.startsWith("- ")) {
                return (
                  <li key={j} className="flex gap-2 text-slate-700 text-sm leading-relaxed">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                    <span>{renderInline(line.slice(2))}</span>
                  </li>
                );
              }
              return (
                <p key={j} className="text-slate-700 text-sm leading-relaxed font-medium mb-1">
                  {renderInline(line)}
                </p>
              );
            })}
          </ul>
        );
      }

      return (
        <p key={i} className="text-slate-700 text-sm leading-relaxed my-3">
          {renderInline(para)}
        </p>
      );
    });
  };

  const related = blogs.filter((b) => b.id !== blog.id && b.category === blog.category).slice(0, 2);

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title}</title>
        <meta name="description" content={blog.metaDescription || blog.excerpt} />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta property="og:description" content={blog.metaDescription || blog.excerpt} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={blog.metaTitle || blog.title} />
        <meta name="twitter:description" content={blog.metaDescription || blog.excerpt} />
      </Helmet>
      <Navbar />

      <main className="bg-slate-50 min-h-screen">
        {/* Hero */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-900 text-white py-14 px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-5 transition-colors"
            >
              <ArrowLeft size={15} />
              Back to Blog
            </Link>
            <div className="mb-4">
              <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                {blog.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-5">{blog.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {blog.readTime}
              </span>
              <span>{blog.date}</span>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

          {/* Article Body */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
            <p className="text-slate-600 text-sm leading-relaxed italic border-l-4 border-blue-200 pl-4 mb-6">
              {blog.excerpt}
            </p>
            <div>{renderContent(blog.content)}</div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-10">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full"
              >
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-slate-800 mb-4">Related Articles</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/blog/${r.id}`}
                    className="bg-white rounded-xl border border-slate-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-2"
                  >
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
                      {r.category}
                    </span>
                    <p className="text-slate-800 font-semibold text-sm leading-snug line-clamp-2">
                      {r.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock size={11} /> {r.readTime}
                      </span>
                      <ChevronRight size={14} className="text-blue-400" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogDetail;
