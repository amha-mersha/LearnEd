// import { Avatar } from "@/components/ui/avatar"
import { dummy_posts } from "@/utils/dummy_posts";
import Post from "./Post";

export default function Posts() {
  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {dummy_posts.map((item, ind) => (
        <Post key={ind} info={item} />
      ))}
    </div>
  );
}
