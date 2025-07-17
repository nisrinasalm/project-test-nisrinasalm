export type IdeaData = {
  id: number;
  slug: string;
  title: string;
  content: string;
  small_image: {
    id: number;
    mime: string;
    file_name: string;
    url: string;
  };
  medium_image: {
    id: number;
    mime: string;
    file_name: string;
    url: string;
  };
};