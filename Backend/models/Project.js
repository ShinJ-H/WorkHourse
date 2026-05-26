// Project.js

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        status: {
            type: String,
            enum: ["Pending", "In Progress", "Completed", "Overdue"],
            default: "Pending",
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High"],
            default: "Low",
        },

        startDate: {
            type: Date,
        },

        endDate: {
            type: Date,
        },

        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        files: [
            {
                url: String,
                public_id: String,
                mimeType: String,
                originalName: String,
            },
        ],

        team: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                status: {
                    type: String,
                    enum: ["Pending", "In Progress", "Completed"],
                    default: "Pending",
                },

                completedAt: {
                    type: Date,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Project", projectSchema);