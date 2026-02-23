"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  IconStarFilled,
  IconTrash,
  IconExternalLink,
} from "@tabler/icons-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { reviewService } from "@/lib/reviews";
import { Review } from "@/types";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import { formatDate } from "@/lib/utils";

type AdminReview = Review & {
  product?: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
  } | null;
  service?: {
    id: string;
    name: string;
    slug: string;
    thumbnail: string;
  } | null;
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getAllReviews();
      setReviews(data);
    } catch {
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await reviewService.deleteReview(id);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        back
        title="Reviews"
        description={`${reviews.length} total review${reviews.length !== 1 ? "s" : ""}`}
      />

      <div className="mt-6">
        {reviews.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No reviews yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reviewer</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => {
                const item = review.product ?? review.service;
                const itemType = review.product ? "product" : "service";
                const itemHref = review.product
                  ? `/${review.product.slug}`
                  : `/services/${review.service?.slug}`;

                return (
                  <TableRow key={review.id}>
                    {/* Reviewer */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="relative h-8 w-8 rounded-full overflow-hidden bg-neutral-100 shrink-0">
                          <Image
                            src={review.user.image || DEFAULT_PROFILE_IMAGE}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {review.user.firstName} {review.user.lastName}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Item */}
                    <TableCell>
                      {item ? (
                        <Link
                          href={itemHref}
                          target="_blank"
                          className="flex items-center gap-2 hover:underline text-sm"
                        >
                          <div className="relative h-8 w-8 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                            <Image
                              src={item.thumbnail || DEFAULT_PROFILE_IMAGE}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="truncate max-w-32">{item.name}</span>
                          <IconExternalLink
                            size={12}
                            className="text-muted-foreground shrink-0"
                          />
                        </Link>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>

                    {/* Rating */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconStarFilled size={14} className="text-amber-400" />
                        <span className="text-sm font-semibold">
                          {review.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          /5
                        </span>
                      </div>
                    </TableCell>

                    {/* Comment */}
                    <TableCell className="max-w-56">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.comment || (
                          <span className="italic">No comment</span>
                        )}
                      </p>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDate(review.createdAt)}
                    </TableCell>

                    {/* Delete */}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive h-8 w-8"
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                      >
                        {deletingId === review.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <IconTrash size={14} />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
