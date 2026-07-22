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

    absenceReason: {
        type: String,
        enum: ['SALUD', 'EMERGENCIA', 'EXTRACURRICULAR', 'OTRO', null],
        default: null
    },

    absenceReasonNote: {
        type: String,
        default: null
    },

    absenceReasonAt: {
        type: Date,
        default: null
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