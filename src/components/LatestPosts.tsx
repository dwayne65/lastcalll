import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { usePublishedPosts } from "@/hooks/useApi";

const LatestPosts = () => {
  const { data } = usePublishedPosts({ limit: 3 });
  const posts = data?.data || [];

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-background">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              From the <span className="text-gradient-gold">Blog</span>
            </h2>
            <p className="mt-2 text-muted-foreground">
              Articles, devotionals, and ministry updates.
            </p>
          </motion.div>
          <Link to="/blog" className="hidden md:block">
            <Button variant="ghost" className="text-gold hover:text-gold-dark gap-2">
              All Posts <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`}>
                <Card className="bg-card border-border hover:border-gold/30 transition-all group h-full">
                  {post.featuredImage && (
                    <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    {post.category && (
                      <span className="text-xs font-semibold text-gold uppercase tracking-wider">
                        {post.category.name}
                      </span>
                    )}
                    <h3 className="mt-2 font-serif font-bold text-foreground text-lg leading-tight group-hover:text-gold transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      {post.readingTime && (
                        <>
                          <span>&middot;</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readingTime} min</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/blog">
            <Button variant="ghost" className="text-gold hover:text-gold-dark gap-2">
              All Posts <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
