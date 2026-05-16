'use client';

import React from 'react';
import Link from 'next/link';
import { Page } from '@/app/lib/types';
import { TiptapRenderer } from '@/app/components/ui/TiptapRenderer';
import { getImageSrc, cn } from '@/app/lib/utils';
import { OptimizedImage } from '@/app/components/ui/OptimizedImage';
import {
  useThemeColors,
  useThemeFonts
} from '@/app/hooks/useTheme';
import { useWebBuilder } from '@/app/providers/WebBuilderProvider';
import { CardLoader } from '@/app/components/ui/SkeletonLoader';
import {
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

const tiptapLightSecondary =
  'max-w-none text-inherit [&_a]:text-[var(--wb-primary)] [&_a:hover]:opacity-90 [&_em]:text-inherit [&_p]:mt-0 [&_p]:text-inherit [&_strong]:text-inherit';

function resolvePostImageRaw(post: any): string | undefined {
  const img = post?.featuredImage;
  if (typeof img === 'string' && img.trim()) return img;
  if (img?.url) return img.url;
  if (post?.seo?.ogImageUrl) return post.seo.ogImageUrl;
  return undefined;
}

function getPostImageSrc(post: any): string {
  const raw = resolvePostImageRaw(post);
  return raw ? getImageSrc(raw) : '';
}

function getPostImageAlt(post: any): string {
  const img = post?.featuredImage;
  if (img && typeof img === 'object' && img.altText) return img.altText;
  return post?.title || '';
}

function formatPostDate(
  iso: string | undefined,
  show: boolean
): string | null {
  if (!show || !iso) return null;

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

interface BlogSectionProps {
  blogSection: Page['blogSection'];
  className?: string;
}

export const BlogSection: React.FC<
  BlogSectionProps
> = ({ blogSection, className }) => {
  const themeColors = useThemeColors();
  const themeFonts = useThemeFonts();

  const { blogPosts, loading, site } =
    useWebBuilder();

  if (!blogSection?.enabled) return null;

  const brandColor =
    themeColors.primaryButton ||
    themeColors.mainText;

  const count = Math.min(
    Math.max(
      blogSection.postsToShow || 3,
      1
    ),
    12
  );

  const displayPosts = blogPosts.slice(
    0,
    count
  );

  const showExcerpt = Boolean(
    blogSection.showExcerpt
  );

  const showDate = Boolean(
    blogSection.showDate
  );

  if (
    loading &&
    blogPosts.length === 0
  ) {
    return (
      <section
        className={cn(
          'relative overflow-hidden py-24 lg:py-40',
          className
        )}
        style={{
          backgroundColor:
            themeColors.sectionBackground
        }}
      >
        <div className="container mx-auto px-6 lg:px-10">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden border p-6 animate-pulse"
                style={{
                  backgroundColor:
                    themeColors.cardBackground,
                  borderColor: `${themeColors.inactive}20`
                }}
              >
                <CardLoader />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (displayPosts.length === 0) {
    return (
      <section
        className={cn(
          'py-24 lg:py-32',
          className
        )}
        style={{
          backgroundColor:
            themeColors.sectionBackground,
          fontFamily: themeFonts.body
        }}
      >
        <div className="container mx-auto px-6 lg:px-10 text-center">
          <p
            className="text-sm md:text-base font-light"
            style={{
              color: themeColors.secondaryText,
              fontFamily: themeFonts.body
            }}
          >
            No published posts yet. Add
            posts in the builder to show
            them here.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden py-24 md:py-32 lg:py-40',
        className
      )}
      style={{
        backgroundColor:
          themeColors.sectionBackground,
        fontFamily: themeFonts.body
      }}
    >
      {/* Ambient Glow */}
      <div
        className="absolute left-0 top-0 w-[600px] h-[600px] rounded-full blur-[140px] opacity-10 pointer-events-none"
        style={{
          backgroundColor: brandColor
        }}
      />

      <div className="container mx-auto px-6 lg:px-10 relative z-10">
        {/* Section Header */}
        <div className="max-w-6xl mb-20 lg:mb-28">
          {/* Top Meta */}
          <div className="flex items-center gap-4 mb-8">
            <div
              className="w-14 h-[1px]"
              style={{
                backgroundColor:
                  brandColor
              }}
            />

            <span
              className="text-[11px] uppercase tracking-[0.4em] font-semibold"
              style={{
                color: themeColors.secondaryText,
                fontFamily: themeFonts.body
              }}
            >
              {site?.business?.tagline ||
                'Latest Insights'}
            </span>
          </div>

          {/* Heading */}
          {blogSection.title && (
            <div
              className="text-4xl md:text-6xl lg:text-7xl font-extralight uppercase leading-[0.95] tracking-[-0.03em]"
              style={{
                color:
                  themeColors.mainText,
                fontFamily:
                  themeFonts.heading
              }}
            >
              <TiptapRenderer
                content={
                  blogSection.title
                }
                as="inline"
              />
            </div>
          )}

          {/* Description */}
          {blogSection.description && (
            <div
              className="mt-8 max-w-2xl text-sm md:text-base lg:text-lg leading-relaxed font-light"
              style={{
                color:
                  themeColors.secondaryText
              }}
            >
              <TiptapRenderer
                content={
                  blogSection.description
                }
                className={
                  tiptapLightSecondary
                }
              />
            </div>
          )}
        </div>

        {/* Featured Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
          {displayPosts.map(
            (post, idx) => {
              const imgSrc = getPostImageSrc(post) || null;

              const dateLabel =
                formatPostDate(
                  post.publishedAt ||
                    post.createdAt,
                  showDate
                );

              const category =
                post.categories?.[0];

              const isFeatured =
                idx === 0;

              return (
                <article
                  key={post._id}
                  className={cn(
                    'group relative overflow-hidden border transition-all duration-700 hover:-translate-y-1',
                    isFeatured
                      ? 'xl:col-span-7'
                      : 'xl:col-span-5'
                  )}
                  style={{
                    backgroundColor: `${themeColors.cardBackground}75`,
                    borderColor: `${themeColors.inactive}20`,
                    backdropFilter:
                      'blur(18px)'
                  }}
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full no-underline"
                  >
                    {/* Image */}
                    <div
                      className={cn(
                        'relative overflow-hidden',
                        isFeatured
                          ? 'aspect-[16/10]'
                          : 'aspect-[4/3]'
                      )}
                    >
                      {imgSrc ? (
                        <>
                          <OptimizedImage
                            src={imgSrc}
                            alt={getPostImageAlt(post)}
                            fill
                            sizes="100vw"
                            className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                            priority={
                              idx < 2
                            }
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        </>
                      ) : (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            backgroundColor:
                              themeColors.cardBackground
                          }}
                        >
                          <Sparkles
                            size={26}
                            style={{
                              color:
                                themeColors.secondaryText
                            }}
                          />
                        </div>
                      )}

                      {/* Category */}
                      {category && (
                        <div
                          className="absolute top-5 left-5 px-4 py-2 backdrop-blur-xl"
                          style={{
                            backgroundColor:
                              'rgba(0,0,0,0.35)',
                            border:
                              '1px solid rgba(255,255,255,0.08)'
                          }}
                        >
                          <span
                            className="text-[10px] uppercase tracking-[0.35em] text-white"
                            style={{ fontFamily: themeFonts.body }}
                          >
                            {category}
                          </span>
                        </div>
                      )}

                      {/* Floating Arrow */}
                      <div
                        className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center backdrop-blur-xl opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                        style={{
                          backgroundColor:
                            'rgba(0,0,0,0.35)',
                          border:
                            '1px solid rgba(255,255,255,0.08)'
                        }}
                      >
                        <ArrowUpRight
                          size={18}
                          className="text-white"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 md:p-8 lg:p-10">
                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
                        {dateLabel && (
                          <time
                            dateTime={
                              post.publishedAt ||
                              post.createdAt
                            }
                            className="text-[10px] uppercase tracking-[0.35em] font-semibold"
                            style={{
                              color: themeColors.secondaryText,
                              fontFamily: themeFonts.body
                            }}
                          >
                            {dateLabel}
                          </time>
                        )}

                        {post.author
                          ?.name && (
                          <span
                            className="text-[10px] uppercase tracking-[0.25em]"
                            style={{
                              color:
                                themeColors.secondaryText
                            }}
                          >
                            {
                              post.author
                                .name
                            }
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className={cn(
                          'font-extralight uppercase leading-[1.05]',
                          isFeatured
                            ? 'text-3xl md:text-5xl'
                            : 'text-2xl md:text-3xl'
                        )}
                        style={{
                          color:
                            themeColors.mainText,
                          fontFamily:
                            themeFonts.heading
                        }}
                      >
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {showExcerpt &&
                        post.excerpt && (
                          <div
                            className="mt-6 text-sm md:text-base leading-relaxed font-light line-clamp-3"
                            style={{
                              color: themeColors.secondaryText,
                              fontFamily: themeFonts.body
                            }}
                          >
                            <TiptapRenderer
                              content={
                                post.excerpt
                              }
                              className={
                                tiptapLightSecondary
                              }
                            />
                          </div>
                        )}

                      {/* CTA */}
                      <div className="mt-10 flex items-center justify-between">
                        <div
                          className="w-12 h-[1px] transition-all duration-500 group-hover:w-24"
                          style={{
                            backgroundColor:
                              brandColor
                          }}
                        />

                        <span
                          className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] font-semibold"
                          style={{
                            color: brandColor,
                            fontFamily: themeFonts.body
                          }}
                        >
                          Read More

                          <ArrowUpRight
                            size={15}
                            className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                          />
                        </span>
                      </div>
                    </div>

                    {/* Bottom Accent */}
                    <div
                      className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700"
                      style={{
                        backgroundColor:
                          brandColor
                      }}
                    />
                  </Link>
                </article>
              );
            }
          )}
        </div>
      </div>
    </section>
  );
};