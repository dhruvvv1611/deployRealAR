import prisma from "../lib/prisma.js"; // Ensure you have Prisma configured for your models

export const getPanoramicImagesByPostId = async (req, res) => {
  const postId = req.params.id;

  try {
    // Fetch the post with the specified ID
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: {
        panoramic: true, // Select only the panoramic field
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ panoramics: post.panoramic });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch panoramic images" });
  }
};
