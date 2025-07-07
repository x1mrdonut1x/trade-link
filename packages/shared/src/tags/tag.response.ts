export interface TagDto {
  id: number;
  name: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
}

export type GetTagResponse = TagDto;

export type GetAllTagsResponse = (TagDto & {
  _count: {
    companies: number;
    contacts: number;
  };
})[];

export type CreateTagResponse = TagDto;

export type UpdateTagResponse = TagDto;

export type DeleteTagResponse = {
  success: boolean;
  message: string;
};
