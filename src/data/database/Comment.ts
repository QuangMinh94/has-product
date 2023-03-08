export interface CommentRequest {
  taskId: string
  userId: string
  comment: string
  createdDate: Date
}

export interface CommentResponse {
  Comment: string
  UserId?: string
  CreatedDate: Date
  Attachment: []
  _id: string
  __v: number
}
