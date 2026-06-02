export type ForumCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  accent: string;
  icon: string;
  _count: {
    posts: number;
  };
};

export type ForumPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  type: string;
  pinned: boolean;
  featured: boolean;
  views: number;
  createdAt: Date;
  author: {
    name: string | null;
    image: string | null;
  };
  category: {
    name: string;
    slug: string;
    accent: string;
  };
  postTags: Array<{
    tag: {
      name: string;
      slug: string;
    };
  }>;
  _count: {
    comments: number;
    reactions: number;
    bookmarks: number;
  };
};
