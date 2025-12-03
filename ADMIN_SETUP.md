# Admin Setup Guide

## Creating the Master Admin Account

To create the initial master admin account, use the provided script:

### Basic Usage (with defaults)
```bash
cd server
npm run create-admin
```

This will create an admin with:
- Email: `admin@innovateher.com`
- Password: `admin123`
- Name: `Master Admin`

### Custom Admin Account
```bash
cd server
npm run create-admin <email> <password> <firstName> <lastName>
```

Example:
```bash
npm run create-admin admin@mycompany.com SecurePass123 John Doe
```

### Important Notes

1. **Change Password**: After first login, change the default password immediately!
2. **Email Uniqueness**: The email must be unique. If an admin with that email already exists, the script will fail.
3. **Environment Variables**: Make sure your `.env` file has the correct `MONGODB_URI` set.

## User Management

Once logged in as an admin, you can:

1. **Access User Management**: Click on the "User Management" tab (visible only to admins)
2. **Create Judges**: Click "Create Judge" button to add new judge accounts
3. **Create Admins**: Click "Create Admin" button to add new admin accounts
4. **View All Users**: See all users with filtering by role
5. **Edit Users**: Click "Edit" on any user to update their information
6. **Delete Users**: Click "Delete" to remove users (cannot delete yourself)

## User Roles

- **Admin**: Full access to all features, can create/manage users
- **Judge**: Can view projects and assign judges to projects
- **Participant**: Can create and manage their own projects

## Security Best Practices

1. Create the master admin account immediately after setup
2. Change the default password on first login
3. Create additional admin accounts for team members
4. Use strong passwords for all admin accounts
5. Regularly review and audit user accounts

