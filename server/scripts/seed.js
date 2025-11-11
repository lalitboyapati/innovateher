import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import Judge from '../models/Judge.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innovateher');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Judge.deleteMany({});
    console.log('Cleared existing data');

    // Create judges
    const judges = await Judge.insertMany([
      { name: 'Emily Watson', initials: 'EW', specialty: 'Healthcare' },
      { name: 'James Park', initials: 'JP', specialty: 'AI & ML' },
      { name: 'Lisa Thompson', initials: 'LT', specialty: 'Product Design' },
      { name: 'David Kumar', initials: 'DK', specialty: 'Sustainability' },
      { name: 'Dr. Amanda Foster', initials: 'AF', specialty: 'AI & ML' },
      { name: 'Kevin Zhang', initials: 'KZ', specialty: 'Full Stack' },
      { name: 'Priya Patel', initials: 'PP', specialty: 'UX Design' },
    ]);
    console.log('Created judges');

    // Create projects with assigned judges
    const projects = await Project.insertMany([
      {
        name: 'DataDynamos',
        category: 'Healthcare Innovation',
        description:
          'A telemedicine platform that connects rural patients with specialists using AI-powered diagnostics and real-time video consultations.',
        assignedJudges: [judges[0]._id, judges[1]._id, judges[2]._id],
      },
      {
        name: 'EcoTech Solutions',
        category: 'Sustainability',
        description:
          'A carbon footprint tracking app that gamifies sustainable living and connects users with local eco-friendly businesses.',
        assignedJudges: [judges[3]._id],
      },
    ]);

    // Update judges to reflect assignments
    await Judge.findByIdAndUpdate(judges[0]._id, { assignedToProjectId: projects[0]._id });
    await Judge.findByIdAndUpdate(judges[1]._id, { assignedToProjectId: projects[0]._id });
    await Judge.findByIdAndUpdate(judges[2]._id, { assignedToProjectId: projects[0]._id });
    await Judge.findByIdAndUpdate(judges[3]._id, { assignedToProjectId: projects[1]._id });

    console.log('Created projects with assigned judges');
    console.log('Seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

