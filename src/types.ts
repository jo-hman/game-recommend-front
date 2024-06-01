type GameBundle = {
  id: string;
  authorAccountId: string;
  title: string;
  description: string;
  comments: Comment[];
};

type Comment = {
  comment: string;
  author: string;
};

export type { GameBundle, Comment };
