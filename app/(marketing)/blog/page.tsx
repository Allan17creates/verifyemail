import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Card } from "@/components/ui/Card";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog, ismyemailworking.app",
  description: "Guides on email verification, deliverability, and list hygiene.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-dashboard px-6 py-20">
        <h1 className="text-3xl font-extrabold tracking-tight text-text">Blog</h1>
        <p className="mt-3 max-w-content text-subtext">
          Guides on email verification, deliverability, and list hygiene.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full transition-colors hover:bg-[#161616]">
                <h2 className="text-base font-semibold text-text">{post.title}</h2>
                <p className="mt-2 text-sm text-subtext">{post.description}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-subtext">
                  <span>{post.readTime}</span>
                  <span>·</span>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
