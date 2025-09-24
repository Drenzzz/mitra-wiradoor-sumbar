export type Category = {
  id: string;
  name: string;
  description: string | null;
  deletedAt: Date | null;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  specifications: string;
  imageUrl: string;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: {
    name: string;
  };
};

export type ArticleCategory = {
  id: string;
  name: string;
  description: string | null;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  featuredImageUrl: string;
  status: 'PUBLISHED' | 'DRAFT';
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  
  categoryId: string;
  category: {
    name: string;
  };
  authorId: string;
  author: {
    name: string | null;
  };
};
