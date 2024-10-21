import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
            phone: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (!err) {
          const saved = await prisma.savedPost.findUnique({
            where: {
              userId_postId: {
                postId: id,
                userId: payload.id,
              },
            },
          });
          // Early return to prevent multiple response attempts
          return res
            .status(200)
            .json({ ...post, isSaved: saved ? true : false });
        } else {
          return res.status(403).json({ message: "Invalid token" });
        }
      });
    } else {
      return res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  // Validate postData
  const { postData, postDetail } = body;

  // Check if postData includes images, models, and panoramic images
  if (
    !postData.images ||
    !Array.isArray(postData.images) ||
    !postData.images.every((img) => typeof img === "string")
  ) {
    return res.status(400).json({
      message: "Invalid images format. Expected an array of strings.",
    });
  }

  if (
    !postData.models ||
    !Array.isArray(postData.models) ||
    !postData.models.every((model) => typeof model === "string")
  ) {
    return res.status(400).json({
      message: "Invalid models format. Expected an array of strings.",
    });
  }

  // Validate panoramic images
  if (
    !postData.panoramic ||
    !Array.isArray(postData.panoramic) ||
    !postData.panoramic.every((panoramic) => typeof panoramic === "string")
  ) {
    return res.status(400).json({
      message: "Invalid panoramic images format. Expected an array of strings.",
    });
  }

  try {
    // Create a new post with related post detail
    const newPost = await prisma.post.create({
      data: {
        ...postData,
        userId: tokenUserId,
        postDetail: {
          create: postDetail,
        },
      },
    });

    // Send successful response with the newly created post
    res.status(200).json(newPost);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params; // Get the post ID from the request parameters
  const tokenUserId = req.userId; // Get the user ID from the token

  // Get the update data from the request body
  const { postData, postDetail } = req.body; // Expecting postData and postDetail in the body

  try {
    // Fetch the existing post to check if it exists
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true }, // Include PostDetail to check its existence
    });

    // Check if the post exists
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authorized to update the post
    if (existingPost.userId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    // Update the post with new data
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...postData, // Spread the new post data
      },
    });

    // If postDetail is provided, update it as well
    if (postDetail) {
      await prisma.postDetail.upsert({
        where: { postId: id }, // Check if the postDetail already exists
        update: {
          ...postDetail, // Update existing postDetail with new data
        },
        create: {
          postId: id, // Create a new postDetail if it does not exist
          ...postDetail,
        },
      });
    }

    // Send a success response with the updated post
    res.status(200).json(updatedPost);
  } catch (err) {
    // Log the error and send a failure response
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params; // Get the post ID from the request parameters
  const tokenUserId = req.userId; // Get the user ID from the token

  try {
    // Fetch the post along with its related PostDetail
    const post = await prisma.post.findUnique({
      where: { id },
      include: { postDetail: true }, // Include related PostDetail for deletion
    });

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is authorized to delete the post
    if (post.userId !== tokenUserId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    // Delete the related PostDetail if it exists
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { postId: post.id }, // Delete the PostDetail record
      });
    }

    // Delete the post itself
    await prisma.post.delete({
      where: { id },
    });

    // Send a success response
    res.status(200).json({ message: "Post successfully deleted" });
  } catch (err) {
    // Log the error and send a failure response
    console.error("Error deleting post:", err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

export const getCoordinates = async (req, res) => {
  const { id } = req.params;
  try {
    const model = await prisma.model.findUnique({
      where: { id: Number(id) }, // Ensure you're matching the correct type
      select: {
        latitude: true,
        longitude: true,
      },
    });

    if (!model) {
      return res.status(404).json({ message: "Model not found" });
    }

    return res.status(200).json(model);
  } catch (error) {
    console.error("Error fetching model coordinates:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
