require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const MatrimonyProfile = require('./models/MatrimonyProfile');
const CareerOpportunity = require('./models/CareerOpportunity');
const Temple = require('./models/Temple');

const temples = [
    { name: 'Shri Swaminarayan Mandir', type: 'Swaminarayan Temple', city: 'Mumbai', address: 'Bandra West, Mumbai, Maharashtra', description: 'A beautiful temple dedicated to Lord Swaminarayan with intricate architecture and peaceful atmosphere.', image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', rating: 4.8, reviews: 156, timings: '5:00 AM - 9:00 PM', phone: '+91 22 2640 1234', website: 'www.swaminarayanmumbai.org', features: ['Aarti', 'Prasad', 'Parking', 'Library'], specialDays: ['Ekadashi', 'Purnima', 'Janmashtami'] },
    { name: 'Shri Krishna Mandir', type: 'Krishna Temple', city: 'Ahmedabad', address: 'Navrangpura, Ahmedabad, Gujarat', description: 'Ancient temple with spiritual significance and regular bhajan sessions.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', rating: 4.6, reviews: 89, timings: '6:00 AM - 8:00 PM', phone: '+91 79 2640 5678', website: 'www.krishnamandir.org', features: ['Bhajan', 'Prasad', 'Garden', 'Meditation'], specialDays: ['Krishna Janmashtami', 'Radha Ashtami', 'Govardhan Puja'] },
    { name: 'Shri Hanuman Mandir', type: 'Hanuman Temple', city: 'Delhi', address: 'Connaught Place, New Delhi', description: 'Famous Hanuman temple known for its spiritual energy and Tuesday special prayers.', image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', rating: 4.7, reviews: 234, timings: '4:00 AM - 10:00 PM', phone: '+91 11 2345 6789', website: 'www.hanumanmandir.org', features: ['Tuesday Special', 'Prasad', 'Parking', 'Canteen'], specialDays: ['Hanuman Jayanti', 'Mangalvar', 'Purnima'] },
    { name: 'Shri Ganesh Mandir', type: 'Ganesh Temple', city: 'Pune', address: 'Koregaon Park, Pune, Maharashtra', description: 'Peaceful Ganesh temple with beautiful architecture and regular cultural programs.', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', rating: 4.5, reviews: 67, timings: '5:30 AM - 9:30 PM', phone: '+91 20 2640 9012', website: 'www.ganeshmandir.org', features: ['Aarti', 'Prasad', 'Library', 'Cultural Events'], specialDays: ['Ganesh Chaturthi', 'Sankashti', 'Angarki'] },
];

const matrimonyProfiles = [
    { name: 'Priya Sharma', age: 25, location: 'Mumbai, Maharashtra', education: 'MBA - Finance', profession: 'Financial Analyst', image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', interests: ['Reading', 'Travel', 'Cooking'], family: 'Marwadi Seervi Samaj', verified: true },
    { name: 'Meera Patel', age: 28, location: 'Ahmedabad, Gujarat', education: 'B.Tech - Computer Science', profession: 'Software Engineer', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', interests: ['Technology', 'Music', 'Yoga'], family: 'Marwadi Seervi Samaj', verified: true },
    { name: 'Anjali Gupta', age: 26, location: 'Delhi, NCR', education: 'CA', profession: 'Chartered Accountant', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', interests: ['Finance', 'Dance', 'Art'], family: 'Marwadi Seervi Samaj', verified: true },
    { name: 'Riya Jain', age: 24, location: 'Pune, Maharashtra', education: 'M.Sc - Biotechnology', profession: 'Research Scientist', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', interests: ['Science', 'Photography', 'Hiking'], family: 'Marwadi Seervi Samaj', verified: false },
];

const careerOpportunities = [
    { title: 'Software Developer', company: 'TechCorp India', location: 'Mumbai, Maharashtra', salary: '₹8-12 LPA', type: 'Full-time', experience: '2-4 years', skills: ['JavaScript', 'React', 'Node.js'] },
    { title: 'Financial Analyst', company: 'Global Finance Ltd', location: 'Delhi, NCR', salary: '₹6-10 LPA', type: 'Full-time', experience: '1-3 years', skills: ['Excel', 'Financial Modeling', 'SQL'] },
    { title: 'Marketing Manager', company: 'Digital Solutions', location: 'Bangalore, Karnataka', salary: '₹7-11 LPA', type: 'Full-time', experience: '3-5 years', skills: ['Digital Marketing', 'SEO', 'Analytics'] },
];

async function seed() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marwadi-portal');
    console.log('Connected to MongoDB for seeding...');

    let demoUser = await User.findOne({ email: 'seed@marwadi-portal.local' });
    if (!demoUser) {
        const seedPassword = process.env.SEED_ADMIN_PASSWORD || 'MarwadiAdmin@2026!';
        const hashedPassword = await bcrypt.hash(seedPassword, 10);
        demoUser = await User.create({ name: 'Marwadi Portal', email: 'seed@marwadi-portal.local', password: hashedPassword, role: 'admin' });
        console.log('Created demo owner user (seed@marwadi-portal.local)');
    }

    await Temple.deleteMany({});
    await Temple.insertMany(temples);
    console.log(`Seeded ${temples.length} temples`);

    await MatrimonyProfile.deleteMany({});
    await MatrimonyProfile.insertMany(matrimonyProfiles.map((p) => ({ ...p, owner: demoUser._id })));
    console.log(`Seeded ${matrimonyProfiles.length} matrimony profiles`);

    await CareerOpportunity.deleteMany({});
    await CareerOpportunity.insertMany(careerOpportunities.map((c) => ({ ...c, postedBy: demoUser._id })));
    console.log(`Seeded ${careerOpportunities.length} career opportunities`);

    console.log('Seeding complete.');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});