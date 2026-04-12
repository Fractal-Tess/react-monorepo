import { HomePage } from "@/components/home-page"

export default function Page() {
  return <HomePage convexEnabled={Boolean(process.env.NEXT_PUBLIC_CONVEX_URL)} />
}
