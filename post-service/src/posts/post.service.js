'use strict';

import Post from './post.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const createPostService = async (data) => {
    return await Post.create(data);
};

export const getPostsService = async (role) => {

    if (role === 'ADMIN_ROLE') {
        return await Post.find()
            .sort({ createdAt: -1 });
    }

    return await Post.find({
        isDeleted: false
    }).sort({ createdAt: -1 });
};

export const getPostByIdService = async (id, role) => {

    if (role === 'ADMIN_ROLE') {
        return await Post.findById(id);
    }

    return await Post.findOne({
        _id: id,
        isDeleted: false
    });
};

export const updatePostService = async (id, data) => {
    return await Post.findByIdAndUpdate(id, data, { new: true });
};

export const softDeletePostService = async (id) => {
    return await Post.findByIdAndUpdate(id, {
        isDeleted: true
    });
};

export const reactivatePostService = async (id) => {
    return await Post.findByIdAndUpdate(id, {
        isDeleted: false
    }, { new: true });
};

export const deleteImageFromCloudinary = async (publicId) => {
    if (!publicId) return;
    await cloudinary.uploader.destroy(publicId);
};

export const getMyPostsService = async (userId) => {

    return await Post.find({
        createdBy: userId
    }).sort({ createdAt: -1 });
};