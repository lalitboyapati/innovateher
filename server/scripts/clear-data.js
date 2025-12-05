import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Score from '../models/Score.js';

dotenv.config();

const clearData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innovateher');
    console.log('Connected to MongoDB');

    // Count before deletion for reporting
    const judgesBefore = await User.countDocuments({ role: 'judge' });
    const participantsBefore = await User.countDocuments({ role: 'participant' });
    const projectsBefore = await Project.countDocuments({});
    const scoresBefore = await Score.countDocuments({});
    const adminsBefore = await User.countDocuments({ role: 'admin' });

    console.log('\n📊 Current Data Count:');
    console.log(`  - Judges: ${judgesBefore}`);
    console.log(`  - Participants: ${participantsBefore}`);
    console.log(`  - Projects: ${projectsBefore}`);
    console.log(`  - Scores: ${scoresBefore}`);
    console.log(`  - Admins: ${adminsBefore} (will be preserved)\n`);

    // Delete all projects (this will cascade to scores via references)
    const projectsDeleted = await Project.deleteMany({});
    console.log(`✓ Deleted ${projectsDeleted.deletedCount} project(s)`);

    // Delete all scores
    const scoresDeleted = await Score.deleteMany({});
    console.log(`✓ Deleted ${scoresDeleted.deletedCount} score(s)`);

    // Delete all judges (Users with role='judge')
    const judgesDeleted = await User.deleteMany({ role: 'judge' });
    console.log(`✓ Deleted ${judgesDeleted.deletedCount} judge(s)`);

    // Delete all participants (Users with role='participant')
    const participantsDeleted = await User.deleteMany({ role: 'participant' });
    console.log(`✓ Deleted ${participantsDeleted.deletedCount} participant(s)`);

    // Verify admins are still there
    const adminsAfter = await User.countDocuments({ role: 'admin' });
    console.log(`✓ Preserved ${adminsAfter} admin account(s)`);

    console.log('\n✅ Data cleanup completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`  - Removed ${judgesDeleted.deletedCount} judge(s)`);
    console.log(`  - Removed ${participantsDeleted.deletedCount} participant(s)`);
    console.log(`  - Removed ${projectsDeleted.deletedCount} project(s)`);
    console.log(`  - Removed ${scoresDeleted.deletedCount} score(s)`);
    console.log(`  - Preserved ${adminsAfter} admin account(s)`);
    console.log('\n💡 All users (except admins) will need to create new accounts.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
};

clearData();
