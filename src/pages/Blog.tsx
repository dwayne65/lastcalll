import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { usePublishedPosts, useCategories } from "@/hooks/useApi";

const Blog = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const { data, isLoading } = usePublishedPosts({ page, limit: 9, search: search || undefined, categoryId });
  const { data: categories } = useCategories();

  const posts = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
              Our <span className="text-gradient-gold">Blog</span>
            </h1>
            <p className="mt-3 text-muted-foreground text-lg max-w-xl">
              Articles, devotionals, and insights from our ministry
            </p>
          </motion.div>

          {/* Filters */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10 bg-card border-border focus-visible:ring-gold"
              />
            </div>
            {categories && categories.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => { setCategoryId(undefined); setPage(1); }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${!categoryId ? "bg-gold text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategoryId(cat.id); setPage(1); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryId === cat.id ? "bg-gold text-primary" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Posts grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block">
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all">
                    {post.featuredImage && (
                      <img src={post.featuredImage} alt={post.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-5">
                      {post.category && (
                        <span className="text-xs font-semibold text-gold uppercase tracking-wider">{post.category.name}</span>
                      )}
                      <h3 className="mt-1 text-lg font-serif font-semibold text-foreground group-hover:text-gold-dark transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                      )}
                      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                        {post.author && (
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author.firstName} {post.author.lastName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {!isLoading && posts.length === 0 && (
            <div className="mt-16 text-center text-muted-foreground">
              <p className="text-lg">No posts found</p>
              <p className="text-sm mt-1">Check back soon for new articles!</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded text-sm ${p === page ? "bg-gold text-primary font-semibold" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Blog;
