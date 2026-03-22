import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Instagram, Heart, MessageCircle, Bookmark, MoreHorizontal, ExternalLink } from "lucide-react";


// ─────────────────────────────────────────────────────────────────────────────
// SETUP REQUIRED:
//
// 1. Convert @b52_bistro to an Instagram Professional (Business/Creator) account
//    at instagram.com/accounts/convert_to_professional
//
// 2. Go to developers.facebook.com → Create App → Business type
//    Add "Instagram" product. Connect your Instagram account.
//
// 3. Generate a long-lived User Access Token with scopes:
//    instagram_basic, instagram_content_publish, pages_show_list
//
// 4. Add to your .env:
//    VITE_INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
//    VITE_INSTAGRAM_USER_ID=your_instagram_user_id
//
// 5. Refresh the token every ~60 days via:
//    GET https://graph.instagram.com/refresh_access_token
//       ?grant_type=ig_refresh_token&access_token=YOUR_TOKEN
//    (or set up a cron job / backend endpoint to auto-refresh)
// ─────────────────────────────────────────────────────────────────────────────

const ACCESS_TOKEN = import.meta.env.VITE_INSTAGRAM_ACCESS_TOKEN;
const USER_ID = import.meta.env.VITE_INSTAGRAM_USER_ID;
const IG_HANDLE = "b52_bistro";
const IG_URL = `https://www.instagram.com/${IG_HANDLE}/`;

interface IGPost {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  like_count?: number;
  comments_count?: number;
  timestamp: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  username?: string;
}

const PLACEHOLDER_POSTS: IGPost[] = [
  {
    id: "1",
    media_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80",
    permalink: IG_URL,
    caption: "Tonight's signature platter ✨ Fresh, bold, unforgettable. #B52Bistro #KitchenArt",
    like_count: 284,
    comments_count: 18,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    media_type: "IMAGE",
    username: IG_HANDLE,
  },
  {
    id: "2",
    media_url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=600&q=80",
    permalink: IG_URL,
    caption: "Craft cocktails that tell a story 🍹 Every sip, a memory. #CocktailHour #B52Bistro",
    like_count: 412,
    comments_count: 31,
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    media_type: "IMAGE",
    username: IG_HANDLE,
  },
  {
    id: "3",
    media_url: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=600&q=80",
    permalink: IG_URL,
    caption: "Friday nights were made for this 🔥 Doors open 7PM. #B52NightLife #NairobiNights",
    like_count: 637,
    comments_count: 52,
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    media_type: "IMAGE",
    username: IG_HANDLE,
  },
];

function formatCount(n?: number): string {
  if (!n) return "0";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

function truncateCaption(caption?: string, maxLen = 100): { text: string; truncated: boolean } {
  if (!caption) return { text: "", truncated: false };
  if (caption.length <= maxLen) return { text: caption, truncated: false };
  return { text: caption.slice(0, maxLen).trimEnd(), truncated: true };
}

const IGCard = ({ post, index }: { post: IGPost; index: number }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showFull, setShowFull] = useState(false);
  const { text, truncated } = truncateCaption(post.caption);
  const displayLikes = (post.like_count ?? 0) + (liked ? 1 : 0);
  const imgSrc =
    post.media_type === "VIDEO" && post.thumbnail_url ? post.thumbnail_url : post.media_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card border border-border rounded-lg overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <a
          href={IG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group"
        >
          <div className="p-[2px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
            <div className="bg-background rounded-full p-[2px]">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Instagram size={14} className="text-primary" />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight group-hover:underline">
              {IG_HANDLE}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">Nairobi, Kenya</p>
          </div>
        </a>
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Open on Instagram"
        >
          <MoreHorizontal size={18} />
        </a>
      </div>

      {/* Image */}
      <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="block">
        <div className="aspect-square overflow-hidden bg-muted relative group">
          <img
            src={imgSrc}
            alt={post.caption ?? "B52 Bistro post"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {post.media_type === "VIDEO" && (
            <div className="absolute top-3 right-3 bg-black/60 rounded-full px-2 py-1 text-[10px] text-white flex items-center gap-1">
              ▶ Video
            </div>
          )}
          {post.media_type === "CAROUSEL_ALBUM" && (
            <div className="absolute top-3 right-3 text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <rect x="2" y="6" width="12" height="12" rx="2" opacity=".6" />
                <rect x="6" y="2" width="16" height="16" rx="2" />
              </svg>
            </div>
          )}
        </div>
      </a>

      {/* Action bar */}
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`transition-all duration-200 active:scale-125 ${
              liked ? "text-red-500" : "text-foreground hover:text-muted-foreground"
            }`}
            aria-label="Like"
          >
            <Heart size={22} fill={liked ? "currentColor" : "none"} />
          </button>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Comment"
          >
            <MessageCircle size={22} />
          </a>
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Open in Instagram"
          >
            <ExternalLink size={20} />
          </a>
        </div>
        <button
          onClick={() => setSaved((v) => !v)}
          className={`transition-all duration-200 ${
            saved ? "text-foreground" : "text-foreground hover:text-muted-foreground"
          }`}
          aria-label="Save"
        >
          <Bookmark size={22} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Likes */}
      <div className="px-4 pb-1">
        <p className="text-sm font-semibold">{formatCount(displayLikes)} likes</p>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-2">
          <p className="text-sm leading-relaxed">
            <span className="font-semibold mr-1">{IG_HANDLE}</span>
            {showFull ? post.caption : text}
            {truncated && !showFull && (
              <>
                {"... "}
                <button
                  onClick={() => setShowFull(true)}
                  className="text-muted-foreground text-sm hover:text-foreground"
                >
                  more
                </button>
              </>
            )}
          </p>
        </div>
      )}

      {/* Comments count */}
      {(post.comments_count ?? 0) > 0 && (
        <div className="px-4 pb-2">
          <a
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View all {formatCount(post.comments_count)} comments
          </a>
        </div>
      )}

      {/* Timestamp */}
      <div className="px-4 pb-3">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {timeAgo(post.timestamp)}
        </p>
      </div>
    </motion.div>
  );
};

const InstagramFeed = () => {
  const [posts, setPosts] = useState<IGPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!ACCESS_TOKEN || !USER_ID) {
        setPosts(PLACEHOLDER_POSTS);
        setUsingPlaceholder(true);
        setLoading(false);
        return;
      }

      try {
        const fields =
          "id,media_url,thumbnail_url,permalink,caption,like_count,comments_count,timestamp,media_type,username";
        const res = await fetch(
          `https://graph.instagram.com/${USER_ID}/media?fields=${fields}&limit=3&access_token=${ACCESS_TOKEN}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.data?.length) {
          setPosts(data.data.slice(0, 3));
        } else {
          throw new Error("No posts returned");
        }
      } catch (err) {
        console.warn("Instagram API unavailable, using placeholder posts.", err);
        setPosts(PLACEHOLDER_POSTS);
        setUsingPlaceholder(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="font-label text-xs text-primary mb-4">Follow Us</p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter">
            <span className="font-display text-4xl md:text-6xl">@{IG_HANDLE}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-md mx-auto">
            Follow our journey on Instagram for the latest moments, events, and vibes from
            Nairobi's premium nightlife destination.
          </p>
          {usingPlaceholder && (
            <p className="text-[10px] text-muted-foreground/50 mt-3 tracking-wide">
              Preview mode — add <code>VITE_INSTAGRAM_ACCESS_TOKEN</code> to load live posts
            </p>
          )}
        </motion.div>

        {/* Posts grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg border border-border overflow-hidden animate-pulse"
              >
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-muted rounded w-24" />
                    <div className="h-2 bg-muted rounded w-16" />
                  </div>
                </div>
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-muted rounded w-16" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <IGCard key={post.id} post={post} index={i} />
            ))}
          </div>
        )}

        {/* Follow CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero text-xs inline-flex items-center gap-2"
          >
            <Instagram size={14} />
            Follow @{IG_HANDLE}
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default InstagramFeed;