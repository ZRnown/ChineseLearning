const baseUrl = '/classics';

export const getComments = async (classicId: string) => {
  try {
    const response = await axios.get(`${baseUrl}/${classicId}/comments`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const createComment = async (classicId: string, content: string) => {
  try {
    const response = await axios.post(`${baseUrl}/${classicId}/comments`, { content });
    return response.data;
  } catch (error: any) {
    console.error('Error creating comment:', error);
    throw new Error('发表评论失败');
  }
};
