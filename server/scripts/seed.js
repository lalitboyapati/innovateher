import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import Judge from '../models/Judge.js';
import Track from '../models/Track.js';
import RubricConfig from '../models/RubricConfig.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/innovateher');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Project.deleteMany({});
    await Judge.deleteMany({});
    await Track.deleteMany({});
    await RubricConfig.deleteMany({});
    console.log('Cleared existing data');

    // Create initial tracks
    const tracks = await Track.insertMany([
      {
        name: 'Purdue',
        category: 'Purdue',
        description: 'Purdue-focused projects and innovations',
        minJudges: 3,
        maxJudges: 4,
      },
      {
        name: 'Mind Matters',
        category: 'Mind Matters',
        description: 'Mental health and wellness innovations',
        minJudges: 3,
        maxJudges: 4,
      },
      {
        name: 'Finance Forward',
        category: 'Finance Forward',
        description: 'Financial technology and innovation',
        minJudges: 3,
        maxJudges: 4,
      },
      {
        name: 'Cultural Connect',
        category: 'Cultural Connect',
        description: 'Cultural connection and diversity initiatives',
        minJudges: 3,
        maxJudges: 4,
      },
      {
        name: 'Art+Tech Fusion',
        category: 'Art+Tech Fusion',
        description: 'Art and technology fusion projects',
        minJudges: 3,
        maxJudges: 4,
      },
    ]);
    console.log('Created initial tracks');

    // Create rubric configuration with initial weights
    const rubricConfig = await RubricConfig.create({
      globalRubric: {
        techStack: {
          name: 'Tech Stack',
          weight: 0.2,
          enabled: true,
        },
        design: {
          name: 'Design',
          weight: 0.2,
          enabled: true,
        },
        growthPotential: {
          name: 'Growth Potential',
          weight: 0.2,
          enabled: true,
        },
        presentation: {
          name: 'Presentation',
          weight: 0.2,
          enabled: true,
        },
        inspiration: {
          name: 'Inspiration',
          weight: 0.2,
          enabled: true,
        },
      },
      maxJudgesPerProject: 4,
      minJudgesPerProject: 3,
    });
    console.log('Created rubric configuration');

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

    // Create a test participant user for seed projects
    const testParticipant = await User.create({
      name: 'Test Participant',
      email: 'participant@test.com',
      password: 'password123',
      role: 'participant',
    });
    console.log('Created test participant user');

    // Create projects with assigned judges
    const projects = await Project.insertMany([
      {
        name: 'DataDynamos',
        category: 'Healthcare Innovation',
        description:
          'A telemedicine platform that connects rural patients with specialists using AI-powered diagnostics and real-time video consultations.',
        participantId: testParticipant._id,
        assignedJudges: [judges[0]._id, judges[1]._id, judges[2]._id],
        status: 'submitted',
      },
      {
        name: 'EcoTech Solutions',
        category: 'Sustainability',
        description:
          'A carbon footprint tracking app that gamifies sustainable living and connects users with local eco-friendly businesses.',
        participantId: testParticipant._id,
        assignedJudges: [judges[3]._id],
        status: 'submitted',
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

