const userSchema = require('../models/users.js');

async function createBulkUser(req, res) {
    console.log("inside bulk create user controller");
    try {
        const users = await req.body.users; // Expecting an array of user objects in the request body
   
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of users' });
        }
        //chicking users 
        for (const user of users) {
            user.fullName = user.fullName;
            if (!user.fullName || !user.email || !user.phone) {
                return res.status(400).json({ message: 'Each user must have fullName, email, and phone' });
            }
        }

        //inserting 500 users per batch 
        const BATCH_SIZE = 500;
        let totalInserted = 0;
        const errors = [];

        for (let i = 0; i < users.length; i += BATCH_SIZE) {
            const batch = users.slice(i, i + BATCH_SIZE);

            try {
                const result = await userSchema.insertMany(batch, { ordered: false });
                console.log("result:", result);
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

        return res.status(201).json({
            message: `Successfully created ${users.length} users`,
            errors: errors.map((error) => error.err),
        });

    } catch (error) {
        console.error('Error creating bulk users:', error);
        throw error;
    }
}
async function BulkUpdate(req, res) {
    try {
        const users = req.body.users;
        
        if (!Array.isArray(users) || users.length === 0) {
            return res.status(400).json({ message: 'Please provide an array of users to update' });
        }

        const operations = users.map((user) => {
            if (!user.email) throw new Error('Each user must have an email to match against');

            const { email, ...fieldsToUpdate } = user;

            return {
                updateOne: {
                    filter: { email },
                    update: { $set: fieldsToUpdate },
                },
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
        console.error('Error updating bulk users:', error);
        throw error;
    }
}

module.exports = { createBulkUser, BulkUpdate };