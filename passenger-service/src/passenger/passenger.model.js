'use strict'

import { Schema, model } from 'mongoose';

const passengerSchema = new Schema(
{
    name: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ['PRESENT','AUSENT'],
        default: 'AUSENT'
    },

    isActive: {
        type: Boolean,
        default: true
    }

},
{
    timestamps: true,
    versionKey: false
});

export default model('Passenger', passengerSchema);