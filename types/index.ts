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
  isReadyStock: boolean;
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

export type Inquiry = {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  status: 'NEW' | 'READ' | 'REPLIED';
  createdAt: Date;
};

export type OrderItem = {
  id: string;
  productName: string;
  isReadyStock: boolean;
  quantity: number;
};

export type Order = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string | null;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  
  items: { productName: string }[];
};
