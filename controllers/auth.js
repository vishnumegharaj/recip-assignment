const userSchema = require('../models/users.js');

async function createBulkUser(req, res, next) {
    try {
        const users = req.body.users;

        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of users' });
        }

        for (const user of users) {
            if (!user.fullName || !user.email || !user.phone) {
                return res.status(400).json({ message: 'Each user must have fullName, email, and phone' });
            }
        }

        const BATCH_SIZE = 500;
        let totalInserted = 0;
        const errors = [];

        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            const batch = users.slice(i, i + BATCH_SIZE);
            try {
                const result = await userSchema.insertMany(batch, { ordered: false });
                totalInserted += result.length;
            } catch (batchError) {
                if (batchError.name === 'MongoBulkWriteError') {
                    totalInserted += batchError.result?.nInserted ?? 0;
                    errors.push(...(batchError.writeErrors ?? []));
                } else {
                    throw batchError;
                }
            }
        }

        res.status(201).json({
            message: 'Bulk insert complete',
            totalReceived: users.length,
            totalInserted,
            totalFailed: errors.length,
            errors,
        });

    } catch (error) {
        next(error);
    }
}

async function bulkUpdateUsers(req, res, next) {
    try {
        const { users } = req.body;

        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of users to update' });
        }

        const operations = users.map((user) => {
            if (!user.email) throw new Error('Each user must have an email to match against');
            const { email, ...fieldsToUpdate } = user;
            const now = new Date();
            return {
                updateOne: {
                    filter: { email }, update: {
                        $set: {
                            ...fieldsToUpdate,
                            updatedAt: new Date()
                        }
                    }
                }
            };
        });

        const result = await userSchema.bulkWrite(operations, { ordered: false });

        res.status(200).json({
            message: 'Bulk update complete',
            totalReceived: users.length,
            matched: result.matchedCount,
            modified: result.modifiedCount,
            upserted: result.upsertedCount,
        });

    } catch (error) {
        next(error);
    }
}

module.exports = { createBulkUser, bulkUpdateUsers };