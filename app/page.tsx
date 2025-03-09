import Link from "next/link";

export default function Home() {
  return (
    <>
      <nav className="flex items-center text-2xl gap-4 justify-center mt-8">
        <h1>Hi there</h1>
        <Link href={"/upload"} scroll={false} className="text-blue-400">
          Upload route
        </Link>
      </nav>
    </>
  );
}
