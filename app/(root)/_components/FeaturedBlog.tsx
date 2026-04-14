"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublishedPosts, type PostSummary } from "@/lib/blog-api";
import { formatDate } from "@/lib/utils";
import { DEFAULT_IMAGE } from "@/constants";

export const FeaturedBlog = () => {
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedPosts({ limit: 3 })
      .then((res) => setPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-primary font-semibold mb-2">
              From the Blog
            </p>
            <h2 className="font-semibold text-2xl md:text-3xl 2xl:text-4xl text-gray-900">
              News &amp; Insights
            </h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Stories, guides, and updates from the Nuvylux world.
            </p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex">
            <Link href="/blog">View all articles</Link>
          </Button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => <BlogCardSkeleton key={i} />)
            : posts.map((post, i) => (
                <BlogCard key={post.id} post={post} featured={i === 0} />
              ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/blog">View all articles</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

function BlogCard({
  post,
  featured,
}: {
  post: PostSummary;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-col rounded-xl border bg-white overflow-hidden hover:border-primary/50 hover:shadow-md transition-all duration-300"
    >
      {/* Cover */}
      <div className="aspect-video w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImage || DEFAULT_IMAGE}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs capitalize">
            {post.category.toLowerCase()}
          </Badge>
          {post.publishedAt && (
            <span className="text-xs text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
          )}
        </div>

        <h3
          className={`font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2 ${
            featured ? "text-lg" : "text-base"
          }`}
        >
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}

        <p className="text-xs text-muted-foreground pt-1">
          By {post.author.firstName} {post.author.lastName}
        </p>
      </div>
    </Link>
  );
}

function BlogCardSkeleton() {
  return (
    <div className="rounded-xl border bg-white overflow-hidden space-y-0">
      <Skeleton className="aspect-video w-full" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
