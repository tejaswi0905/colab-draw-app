// "use client";

// import CanvasComp from "@/app/components/Canvas";
// import { useSession } from "@/hooks/useSession";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import {use} from "react";

// export default function CanvasPage({ params }: { params: { roomId: string } }) {
//   const { user, loading } = useSession();
//   const router = useRouter();

//   const roomId = params.roomId;

//   // 🔒 Redirect if not logged in
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/signin");
//     }
//   }, [user, loading, router]);

//   // ⏳ While checking auth
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   // 🚫 Block render if not logged in
//   if (!user) {
//     return null;
//   }

//   return <CanvasComp roomId={roomId} />;
// }
"use client";

import dynamic from "next/dynamic";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { use } from "react"; // 🔥 IMPORTANT

const NewCanvas = dynamic(() => import("@/app/components/NewCanvas"), {
  ssr: false,
  loading: () => <div>Loading Canvas Editor...</div>
});

export default function CanvasPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const router = useRouter();
  const { user, loading } = useSession();

  // 🔥 unwrap params
  const { roomId } = use(params);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading) return <div className="text-white p-4">Loading...</div>;
  if (!user) return null;

  return <NewCanvas roomId={roomId} />;
}
