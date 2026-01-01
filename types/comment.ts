export interface Comment {
    id: string;
    author: string;
    authorEmail: string | null;
    body: string;
    createdAt: string;
    postId: string;
    isApproved: boolean;
}