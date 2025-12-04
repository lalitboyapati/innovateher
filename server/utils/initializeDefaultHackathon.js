import Hackathon from '../models/Hackathon.js';
import User from '../models/User.js';

/**
 * Ensures the default "InnovateHer" hackathon exists in the database
 * Creates it if it doesn't exist, or uses existing one
 */
export const initializeDefaultHackathon = async () => {
  try {
    // Check if default hackathon already exists
    let defaultHackathon = await Hackathon.findOne({ name: 'InnovateHer' });
    
    if (!defaultHackathon) {
      console.log('Creating default "InnovateHer" hackathon...');
      
      // Try to find an admin user to assign as creator
      let adminUser = await User.findOne({ role: 'admin' });
      
      // If no admin exists, create a system user or use the first user
      if (!adminUser) {
        adminUser = await User.findOne();
      }
      
      // If no user exists yet, we'll delay hackathon creation until first user is created
      // This will be handled in the project creation route as a fallback
      if (!adminUser) {
        console.log('No users found yet. Default hackathon will be created when first project is submitted.');
        return null;
      }
      
      // Create default hackathon with dates
      const now = new Date();
      const endDate = new Date(now);
      endDate.setFullYear(endDate.getFullYear() + 1); // Set end date to 1 year from now
      
      defaultHackathon = new Hackathon({
        name: 'InnovateHer',
        description: 'The default hackathon for all InnovateHer project submissions. Join us in creating innovative solutions!',
        startDate: now,
        endDate: endDate,
        status: 'active',
        createdBy: adminUser._id,
      });
      
      await defaultHackathon.save();
      console.log('✓ Default "InnovateHer" hackathon created successfully');
    } else {
      console.log('✓ Default "InnovateHer" hackathon already exists');
      
      // Ensure it's active
      if (defaultHackathon.status !== 'active') {
        defaultHackathon.status = 'active';
        await defaultHackathon.save();
        console.log('✓ Updated default hackathon status to "active"');
      }
    }
    
    return defaultHackathon;
  } catch (error) {
    console.error('Error initializing default hackathon:', error);
    return null;
  }
};

/**
 * Gets the default InnovateHer hackathon ID
 */
export const getDefaultHackathonId = async () => {
  try {
    const hackathon = await Hackathon.findOne({ name: 'InnovateHer' });
    return hackathon ? hackathon._id : null;
  } catch (error) {
    console.error('Error getting default hackathon:', error);
    return null;
  }
};
