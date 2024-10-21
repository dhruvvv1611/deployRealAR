 // controllers/modelsController.js
import prisma from "../lib/prisma.js"; // Ensure you have prisma configured for your models

export const getModelsByPostId = async (req, res) => {
  const postId = req.params.id;

  try {
    // Fetch the post with the specified ID
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        models: true, // Select only the models field
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ models: post.models });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch models" });
  }
};
