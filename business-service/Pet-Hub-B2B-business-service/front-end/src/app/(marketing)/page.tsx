import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/">Home Page</Link>
      <div className="">hahha</div>
      <Link href="/auth/login">Login Page</Link>
    </div>
  );
}
