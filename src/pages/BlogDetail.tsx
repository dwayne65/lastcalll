import { useParams, Link } from "react-router-dom";
import { Calendar, User, ChevronLeft, Clock, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { usePostBySlug, usePublishedPosts } from "@/hooks/useApi";

const BlogDetail = () => {
  const { slug } = useParams();
  const { data: post, isLoading } = usePostBySlug(slug);
  const { data: relatedData } = usePublishedPosts({ limit: 4 });
  const relatedPosts = (relatedData?.data || []).filter((p) => p.slug !== slug).slice(0, 3);

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-20 bg-background min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!post) {
    return (
      <main>
        <Navbar />
        <div className="pt-24 pb-20 bg-background min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground text-lg">Post not found</p>
          <Link to="/blog"><Button variant="outline">Back to Blog</Button></Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      <div className="pt-24 pb-20 bg-background min-h-screen">
        <div className="container max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-gold transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to Blog
          </Link>

          <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {post.category && (
              <span className="text-xs font-semibold text-gold uppercase tracking-wider">{post.category.name}</span>
            )}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mt-2">
              {post.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {post.author && (
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author.firstName} {post.author.lastName}</span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              {post.readingTime && (
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{post.readingTime} min read</span>
              )}
            </div>

            {post.featuredImage && (
              <img src={post.featuredImage} alt={post.title} className="w-full rounded-xl mt-8 max-h-96 object-cover" />
            )}

            <div
              className="mt-8 prose prose-lg prose-neutral dark:prose-invert max-w-none font-serif"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag.id} className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                    <Tag className="w-3 h-3" />
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </motion.article>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16 border-t border-border pt-10">
              <h2 className="text-xl font-serif font-semibold text-foreground mb-6">More Articles</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedPosts.map((p) => (
                  <Link key={p.id} to={`/blog/${p.slug}`} className="group">
                    <div className="bg-card border border-border rounded-lg p-4 hover:border-gold/30 transition-all">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-gold-dark transition-colors line-clamp-2">{p.title}</h3>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(p.publishedAt || p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default BlogDetail;
