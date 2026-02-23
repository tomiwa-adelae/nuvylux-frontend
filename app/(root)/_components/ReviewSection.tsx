"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  IconStar,
  IconStarFilled,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { reviewService } from "@/lib/reviews";
import { useAuth } from "@/store/useAuth";
import { Review, ReviewSummary } from "@/types";
import { DEFAULT_PROFILE_IMAGE } from "@/constants";
import { cn } from "@/lib/utils";

interface ReviewSectionProps {
  productId?: string;
  serviceId?: string;
}

// ─── Star picker ──────────────────────────────────────────────────────────────

function StarPicker({
  value,
  onChange,
  size = 24,
}: {
  value: number;
  onChange: (v: number) => void;
  size?: number;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            className="text-amber-400 transition-transform hover:scale-110"
          >
            {filled ? (
              <IconStarFilled size={size} />
            ) : (
              <IconStar size={size} className="text-neutral-300" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Star display (read-only) ──────────────────────────────────────────────────

function StarDisplay({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>
          {star <= rating ? (
            <IconStarFilled size={size} className="text-amber-400" />
          ) : (
            <IconStar size={size} className="text-neutral-300" />
          )}
        </span>
      ))}
    </div>
  );
}

// ─── Aggregate header ────────────────────────────────────────────────────────

function RatingSummary({ summary }: { summary: ReviewSummary }) {
  const { averageRating, totalCount, distribution } = summary;

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center p-5 bg-muted/30 rounded-2xl">
      {/* Big number */}
      <div className="text-center shrink-0">
        <p className="text-5xl font-black text-primary">
          {averageRating.toFixed(1)}
        </p>
        <StarDisplay rating={Math.round(averageRating)} size={16} />
        <p className="text-xs text-muted-foreground mt-1">
          {totalCount} {totalCount === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Distribution bars */}
      <div className="flex-1 w-full space-y-1.5">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = distribution[star] ?? 0;
          const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
          return (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-right text-muted-foreground">
                {star}
              </span>
              <IconStarFilled size={11} className="text-amber-400 shrink-0" />
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-5 text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Review form modal ────────────────────────────────────────────────────────

function ReviewFormModal({
  open,
  onClose,
  onSubmit,
  initial,
  submitting,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  initial?: { rating: number; comment: string };
  submitting: boolean;
}) {
  const [rating, setRating] = useState(initial?.rating ?? 0);
  const [comment, setComment] = useState(initial?.comment ?? "");

  // Reset when opened
  useEffect(() => {
    if (open) {
      setRating(initial?.rating ?? 0);
      setComment(initial?.comment ?? "");
    }
  }, [open, initial?.rating, initial?.comment]);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initial ? "Edit your review" : "Write a Review"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <p className="text-sm font-medium mb-2">Your rating</p>
            <StarPicker value={rating} onChange={setRating} size={28} />
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Your review (optional)</p>
            <Textarea
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              onClick={() => onSubmit(rating, comment)}
              disabled={rating === 0 || submitting}
            >
              {submitting ? "Submitting..." : initial ? "Update" : "Submit"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Single review card ───────────────────────────────────────────────────────

function ReviewCard({
  review,
  isOwn,
  onEdit,
  onDelete,
}: {
  review: Review;
  isOwn: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const name = `${review.user.firstName} ${review.user.lastName}`;
  const date = new Date(review.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex gap-3 py-4">
      <div className="relative h-9 w-9 rounded-full overflow-hidden bg-neutral-100 border shrink-0">
        <Image
          src={review.user.image || DEFAULT_PROFILE_IMAGE}
          alt={name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold">{name}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <StarDisplay rating={review.rating} />
              <span className="text-[10px] text-muted-foreground">{date}</span>
            </div>
          </div>
          {isOwn && (
            <div className="flex gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onEdit}
              >
                <IconPencil size={13} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive"
                onClick={onDelete}
              >
                <IconTrash size={13} />
              </Button>
            </div>
          )}
        </div>
        {review.comment && (
          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
            {review.comment}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Main ReviewSection ───────────────────────────────────────────────────────

export const ReviewSection = ({ productId, serviceId }: ReviewSectionProps) => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = useCallback(async () => {
    try {
      const data = productId
        ? await reviewService.getProductReviews(productId)
        : await reviewService.getServiceReviews(serviceId!);
      setSummary(data);
    } catch {
      setSummary({
        reviews: [],
        averageRating: 0,
        totalCount: 0,
        distribution: {},
      });
    } finally {
      setLoading(false);
    }
  }, [productId, serviceId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const userReview =
    summary?.reviews.find((r) => r.userId === user?.id) ?? null;

  const handleSubmit = async (rating: number, comment: string) => {
    setSubmitting(true);
    try {
      if (editing) {
        await reviewService.updateReview(editing.id, { rating, comment });
        toast.success("Review updated");
      } else {
        await reviewService.createReview({
          rating,
          comment: comment || undefined,
          productId,
          serviceId,
        });
        toast.success("Review submitted");
      }
      setFormOpen(false);
      setEditing(null);
      await fetchReviews();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reviewService.deleteReview(id);
      toast.success("Review deleted");
      await fetchReviews();
    } catch {
      toast.error("Failed to delete review");
    }
  };

  return (
    <section className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Reviews</h2>
        {user && !userReview && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <IconStarFilled size={14} className="text-amber-400" />
            Write a Review
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 py-4">
              <Skeleton className="h-9 w-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : summary && summary.totalCount > 0 ? (
        <>
          <RatingSummary summary={summary} />
          <div className="divide-y">
            {summary.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwn={review.userId === user?.id}
                onEdit={() => {
                  setEditing(review);
                  setFormOpen(true);
                }}
                onDelete={() => handleDelete(review.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-10 bg-muted/30 rounded-2xl space-y-2">
          <p className="text-muted-foreground text-sm">No reviews yet.</p>
          {user && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              Be the first to review
            </Button>
          )}
        </div>
      )}

      <ReviewFormModal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initial={
          editing
            ? { rating: editing.rating, comment: editing.comment ?? "" }
            : undefined
        }
        submitting={submitting}
      />
    </section>
  );
};
