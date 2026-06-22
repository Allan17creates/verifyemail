import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = getPostBySlug(params.slug);
    return { title: `${post.title}, verifyemail.app`, description: post.description };
  } catch {
    return {};
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  let post;
  try {
    post = getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-content px-6 py-20">
        <p className="text-xs text-subtext">{post!.readTime} · The verifyemail.app team</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-text">{post!.title}</h1>

        <article className="prose-article mt-10 text-[18px] leading-[1.75]">
          <MDXRemote source={post!.content} />
        </article>

        <div className="mt-16 rounded-card border border-border bg-surface p-6 text-center">
          <Link href="/" className="text-sm font-medium text-accent hover:underline">
            Verify an email address now →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
