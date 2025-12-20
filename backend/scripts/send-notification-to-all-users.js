/**
 * Script to send notification to all users
 * Usage: node backend/scripts/send-notification-to-all-users.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Notification = require('../models/Notification');

const sendNotificationToAllUsers = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Notification details
    const title = '🎉 Platform Güncellemesi / Platform Update';
    const message = 'PrestaLink platformunda yeni özellikler ve iyileştirmeler eklendi! Dashboard\'daki tüm metinler artık seçtiğiniz dilde görüntüleniyor. / New features and improvements have been added to the PrestaLink platform! All texts on the dashboard are now displayed in your selected language.';

    // Get all users
    const users = await User.find({}).select('_id role');
    console.log(`📊 Found ${users.length} users\n`);

    if (users.length === 0) {
      console.log('❌ No users found');
      await mongoose.disconnect();
      return;
    }

    // Create notifications for all users
    const notifications = users.map(user => ({
      targetUserId: user._id,
      targetRole: user.role || null,
      title,
      message,
      read: false,
    }));

    console.log('📝 Creating notifications...');
    await Notification.insertMany(notifications);
    console.log(`✅ Successfully sent notification to ${notifications.length} users\n`);

    // Group by role
    const byRole = {};
    users.forEach(user => {
      const role = user.role || 'unknown';
      byRole[role] = (byRole[role] || 0) + 1;
    });

    console.log('📊 Notification distribution:');
    Object.entries(byRole).forEach(([role, count]) => {
      console.log(`   ${role}: ${count} users`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

sendNotificationToAllUsers();


