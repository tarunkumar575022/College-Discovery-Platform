import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.course.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding users...');
  const hashedPassword = bcrypt.hashSync('password123', 10);

  const user1 = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      email: 'alex@example.com',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: hashedPassword,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Rohit Verma',
      email: 'rohit@example.com',
      password: hashedPassword,
    },
  });

  console.log('Seeding colleges...');

  const collegesData = [
    {
      name: 'IIT Bombay',
      location: 'Mumbai, Maharashtra',
      fees: 220000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1958,
      nirfRanking: 3,
      ownership: 'Government',
      courseTypes: 'B.Tech,M.Tech,MBA',
      description: 'Indian Institute of Technology Bombay is a premier public research university and technical institute in Powai, Mumbai. It is globally recognized for its world-class engineering programs, cutting-edge research, and outstanding entrepreneurial ecosystem.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 220000 },
        { name: 'B.Tech Electrical Engineering', duration: '4 Years', fees: 220000 },
        { name: 'M.Tech Microelectronics', duration: '2 Years', fees: 80000 }
      ],
      placement: {
        avgSalary: 22.5,
        highSalary: 150.0,
        recruiters: ['Google', 'Microsoft', 'Apple', 'Uber', 'Qualcomm', 'Rubrik']
      },
      reviews: [
        { rating: 5, comment: 'Phenomenal academic rigor and unparalleled peer group. The campus life by Powai lake is magical.', userId: user1.id },
        { rating: 5, comment: 'Placements are top-notch. Opportunities are endless if you are willing to work hard.', userId: user2.id }
      ]
    },
    {
      name: 'IIT Delhi',
      location: 'New Delhi, Delhi',
      fees: 225000,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1961,
      nirfRanking: 2,
      ownership: 'Government',
      courseTypes: 'B.Tech,M.Tech,MBA',
      description: 'Indian Institute of Technology Delhi is one of the top engineering and research institutions in India, located in Hauz Khas. Known for its strong industry connections, prestigious research centers, and competitive startup environment.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 225000 },
        { name: 'B.Tech Mechanical Engineering', duration: '4 Years', fees: 225000 },
        { name: 'M.Tech Artificial Intelligence', duration: '2 Years', fees: 90000 }
      ],
      placement: {
        avgSalary: 21.0,
        highSalary: 140.0,
        recruiters: ['Microsoft', 'Goldman Sachs', 'Amazon', 'Meta', 'Flipkart', 'Intel']
      },
      reviews: [
        { rating: 5, comment: 'Located in the heart of Delhi, campus life is super vibrant. Competitive and motivating environment.', userId: user2.id },
        { rating: 4, comment: 'Exceptional faculty. The workload can get intense, but it is totally worth it.', userId: user3.id }
      ]
    },
    {
      name: 'NIT Warangal',
      location: 'Warangal, Telangana',
      fees: 145000,
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1959,
      nirfRanking: 21,
      ownership: 'Government',
      courseTypes: 'B.Tech,M.Tech,MCA',
      description: 'National Institute of Technology Warangal is the first in the chain of NITs established in India. It is highly regarded for its technical education standards, extensive sports facilities, and strong alumni base.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 145000 },
        { name: 'B.Tech Electronics & Communication', duration: '4 Years', fees: 145000 },
        { name: 'MCA', duration: '3 Years', fees: 85000 }
      ],
      placement: {
        avgSalary: 15.0,
        highSalary: 88.0,
        recruiters: ['Amazon', 'Nvidia', 'Microsoft', 'Oracle', 'Qualcomm', 'Tata Motors']
      },
      reviews: [
        { rating: 4, comment: 'One of the best NITs in the country. Placements for CSE and ECE are at par with top IITs.', userId: user1.id },
        { rating: 5, comment: 'Great cultural festivals like SpringSpree and excellent sports facilities.', userId: user3.id }
      ]
    },
    {
      name: 'BITS Pilani',
      location: 'Pilani, Rajasthan',
      fees: 450000,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1964,
      nirfRanking: 25,
      ownership: 'Private',
      courseTypes: 'B.E.,M.Sc.,MBA',
      description: 'Birla Institute of Technology and Science, Pilani is a leading private deemed university known for its no-attendance policy, unique Practice School (internship) program, and stellar reputation in software and finance sectors.',
      courses: [
        { name: 'B.E. Computer Science', duration: '4 Years', fees: 450000 },
        { name: 'B.E. Electrical & Electronics', duration: '4 Years', fees: 450000 },
        { name: 'M.Sc. Economics (Dual Degree)', duration: '5 Years', fees: 450000 }
      ],
      placement: {
        avgSalary: 19.5,
        highSalary: 110.0,
        recruiters: ['Google', 'Salesforce', 'McKinsey', 'Apple', 'Adobe', 'Uber']
      },
      reviews: [
        { rating: 5, comment: 'Zero attendance rule gives you immense freedom to follow your passion. BITSian network is incredibly strong.', userId: user3.id },
        { rating: 4, comment: 'High tuition fee, but the infrastructure and the placement returns are excellent.', userId: user1.id }
      ]
    },
    {
      name: 'VIT Vellore',
      location: 'Vellore, Tamil Nadu',
      fees: 198000,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1984,
      nirfRanking: 11,
      ownership: 'Private',
      courseTypes: 'B.Tech,M.Tech,MCA',
      description: 'Vellore Institute of Technology is a highly ranked private university in Tamil Nadu. Famous for its flexible credit system, diverse international partnerships, and massive campus size.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 198000 },
        { name: 'B.Tech Biotechnology', duration: '4 Years', fees: 175000 },
        { name: 'M.Tech Software Engineering', duration: '2 Years', fees: 95000 }
      ],
      placement: {
        avgSalary: 9.0,
        highSalary: 75.0,
        recruiters: ['TCS', 'Cognizant', 'Wipro', 'Infosys', 'Intel', 'Amazon']
      },
      reviews: [
        { rating: 4, comment: 'Massive campus with top-tier laboratories. Strict hostel rules, but overall a great learning place.', userId: user2.id },
        { rating: 4, comment: 'Placements are huge, hundreds of companies visit. Just keep your CGPA high.', userId: user3.id }
      ]
    },
    {
      name: 'Osmania University',
      location: 'Hyderabad, Telangana',
      fees: 35000,
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1525920980995-f8a382bf42c5?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1918,
      nirfRanking: 64,
      ownership: 'Government',
      courseTypes: 'B.Tech,M.Sc,MBA',
      description: 'Osmania University is one of the oldest and most prestigious state universities in India. Known for its historical Arts College building, massive green campus, and contributing heavily to state research and public administration.',
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 Years', fees: 35005 },
        { name: 'M.Sc Chemistry', duration: '2 Years', fees: 15000 },
        { name: 'MBA', duration: '2 Years', fees: 40000 }
      ],
      placement: {
        avgSalary: 6.5,
        highSalary: 24.0,
        recruiters: ['TCS', 'Infosys', 'Deloitte', 'Capgemini', 'Accenture', 'Wipro']
      },
      reviews: [
        { rating: 4, comment: 'Extremely affordable education with historical heritage. Faculty are highly experienced.', userId: user1.id },
        { rating: 4, comment: 'Vast campus ideal for researchers. Placements are decent for engineering stream.', userId: user2.id }
      ]
    },
    {
      name: 'JNTU Hyderabad',
      location: 'Hyderabad, Telangana',
      fees: 50000,
      rating: 4.0,
      image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1972,
      nirfRanking: 83,
      ownership: 'Government',
      courseTypes: 'B.Tech,M.Tech,MBA',
      description: 'Jawaharlal Nehru Technological University Hyderabad is a premier public university focused on engineering and technology. It shapes the curriculum and standards for hundreds of affiliated colleges across Telangana.',
      courses: [
        { name: 'B.Tech Computer Science', duration: '4 Years', fees: 50000 },
        { name: 'B.Tech Information Technology', duration: '4 Years', fees: 50000 },
        { name: 'M.Tech Computer Networks', duration: '2 Years', fees: 30000 }
      ],
      placement: {
        avgSalary: 7.0,
        highSalary: 32.0,
        recruiters: ['Wipro', 'Cognizant', 'TCS', 'Microsoft', 'Honeywell', 'Oracle']
      },
      reviews: [
        { rating: 4, comment: 'Academics are highly structured. Location in Kukatpally is excellent for tech-corridor access.', userId: user3.id },
        { rating: 4, comment: 'Decent infrastructure and laboratory equipment. Good placements if you stand out.', userId: user1.id }
      ]
    },
    {
      name: 'IIIT Hyderabad',
      location: 'Hyderabad, Telangana',
      fees: 360000,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1998,
      nirfRanking: 55,
      ownership: 'Private',
      courseTypes: 'B.Tech,M.S.,PhD',
      description: 'International Institute of Information Technology Hyderabad is a prestigious research-focused university specialized in computer science, electronics, and computational linguistics. Its coding culture is widely regarded as the best in India.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 360000 },
        { name: 'B.Tech Electronics & Communication', duration: '4 Years', fees: 360000 },
        { name: 'MS by Research in Computer Science', duration: '2 Years', fees: 180000 }
      ],
      placement: {
        avgSalary: 26.0,
        highSalary: 102.0,
        recruiters: ['Google', 'Microsoft', 'Bloomberg', 'Uber', 'Adobe', 'Tower Research']
      },
      reviews: [
        { rating: 5, comment: 'Unrivaled coding and research culture. GSoC selections and competitive programming ranks are top tier.', userId: user2.id },
        { rating: 5, comment: 'Placements are better than almost all IITs. Curriculums are focused directly on core subjects from year one.', userId: user1.id }
      ]
    },
    {
      name: 'University of Hyderabad',
      location: 'Hyderabad, Telangana',
      fees: 25000,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1974,
      nirfRanking: 10,
      ownership: 'Government',
      courseTypes: 'M.Tech,M.Sc,MA',
      description: 'The University of Hyderabad (HCU) is a premier central university recognized as an Institution of Eminence. Situated in a scenic 2300-acre forest-like campus, it is a hub for humanities, social sciences, and pure science research.',
      courses: [
        { name: 'Integrated M.Tech Computer Science', duration: '5 Years', fees: 35000 },
        { name: 'M.Sc Physics', duration: '2 Years', fees: 12000 },
        { name: 'MA English', duration: '2 Years', fees: 10000 }
      ],
      placement: {
        avgSalary: 8.5,
        highSalary: 45.0,
        recruiters: ['Cognizant', 'Wipro', 'ICICI Bank', 'TCS', 'Oracle', 'Deloitte']
      },
      reviews: [
        { rating: 5, comment: 'A peaceful, serene campus. Incredible libraries and absolute academic freedom.', userId: user3.id },
        { rating: 4, comment: 'Best suited for research and higher studies, but tech companies hire well too.', userId: user2.id }
      ]
    },
    {
      name: 'Manipal Institute of Technology',
      location: 'Manipal, Karnataka',
      fees: 410000,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1957,
      nirfRanking: 61,
      ownership: 'Private',
      courseTypes: 'B.Tech,M.Tech,MCA',
      description: 'Manipal Institute of Technology is a leading private college located in the beautiful university town of Manipal. Offering state-of-the-art labs, incubation centers, and a diverse multicultural environment.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 410000 },
        { name: 'B.Tech Aeronautical Engineering', duration: '4 Years', fees: 380000 },
        { name: 'M.Tech VLSI Design', duration: '2 Years', fees: 190000 }
      ],
      placement: {
        avgSalary: 10.5,
        highSalary: 54.0,
        recruiters: ['Microsoft', 'Amazon', 'Cisco', 'Dell', 'EY', 'Philips']
      },
      reviews: [
        { rating: 4, comment: 'Manipal town is a student heaven. Wonderful facilities and high-quality education.', userId: user1.id },
        { rating: 5, comment: 'Highly active student clubs. Practical exposure is heavily prioritized.', userId: user3.id }
      ]
    },
    {
      name: 'SRM University',
      location: 'Chennai, Tamil Nadu',
      fees: 250000,
      rating: 4.1,
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1985,
      nirfRanking: 32,
      ownership: 'Private',
      courseTypes: 'B.Tech,M.Tech,MBA',
      description: 'SRM Institute of Science and Technology is a top-ranking private university in Kattankulathur, Chennai. Features excellent infrastructure, extensive research initiatives, and vibrant campus festivals.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 250000 },
        { name: 'B.Tech Mechanical Engineering', duration: '4 Years', fees: 200000 },
        { name: 'M.Tech Data Science', duration: '2 Years', fees: 120000 }
      ],
      placement: {
        avgSalary: 8.0,
        highSalary: 48.0,
        recruiters: ['TCS', 'Wipro', 'Amazon', 'Microsoft', 'IBM', 'L&T']
      },
      reviews: [
        { rating: 4, comment: 'The infrastructure is futuristic. Incredible coding labs and sports fields.', userId: user2.id },
        { rating: 4, comment: 'Huge cohort size but they manage placements very professionally.', userId: user1.id }
      ]
    },
    {
      name: 'Amity University',
      location: 'Noida, Uttar Pradesh',
      fees: 310000,
      rating: 3.9,
      image: 'https://images.unsplash.com/photo-1492538368677-f6e0afe31dcc?q=80&w=800&auto=format&fit=crop',
      establishedYear: 2005,
      nirfRanking: 35,
      ownership: 'Private',
      courseTypes: 'B.Tech,BBA,MBA',
      description: 'Amity University Noida is a private university known for its massive modern campus, high-tech amenities, global study programs, and corporate connections.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 310000 },
        { name: 'BBA', duration: '3 Years', fees: 280000 },
        { name: 'MBA', duration: '2 Years', fees: 340000 }
      ],
      placement: {
        avgSalary: 6.0,
        highSalary: 30.0,
        recruiters: ['Capgemini', 'Accenture', 'Amazon', 'DXC Technology', 'HCL', 'Wipro']
      },
      reviews: [
        { rating: 4, comment: 'Top class infrastructure, air-conditioned classes, and standard hostels. Decent placements.', userId: user3.id },
        { rating: 3, comment: 'Strict attendance policies but has a very diverse and happening college life.', userId: user2.id }
      ]
    },
    {
      name: 'Christ University Bangalore',
      location: 'Bengaluru, Karnataka',
      fees: 220000,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1969,
      nirfRanking: 60,
      ownership: 'Private',
      courseTypes: 'B.Com,BBA,MCA',
      description: 'Christ University is a highly prestigious private deemed university located in Bengaluru. Renowned for its commerce, law, and business administration programs, set within a lush green, eco-friendly city campus.',
      courses: [
        { name: 'B.Com Honours', duration: '3 Years', fees: 150000 },
        { name: 'BBA Finance & Accountancy', duration: '3 Years', fees: 220000 },
        { name: 'MCA', duration: '2 Years', fees: 180000 }
      ],
      placement: {
        avgSalary: 7.5,
        highSalary: 28.0,
        recruiters: ['EY', 'Deloitte', 'KPMG', 'PwC', 'Target', 'Goldman Sachs']
      },
      reviews: [
        { rating: 4, comment: 'Strict dress code and attendance rules. However, the exposure and personality development is amazing.', userId: user1.id },
        { rating: 5, comment: 'Unbeatable management education and placement drives for corporate roles in Bangalore.', userId: user3.id }
      ]
    },
    {
      name: 'PSG College of Technology',
      location: 'Coimbatore, Tamil Nadu',
      fees: 110000,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1951,
      nirfRanking: 63,
      ownership: 'Private',
      courseTypes: 'B.Tech,B.E.,M.Tech',
      description: 'PSG College of Technology is a government-aided private engineering college. Known for its strong industry-institute collaborations, specialized workshops, and top placement records in southern India.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 110000 },
        { name: 'B.E. Mechanical Engineering (Sandwich)', duration: '5 Years', fees: 125000 },
        { name: 'M.Tech Product Design', duration: '2 Years', fees: 65000 }
      ],
      placement: {
        avgSalary: 11.0,
        highSalary: 60.0,
        recruiters: ['Caterpillar', 'Larsen & Toubro', 'Intel', 'Microsoft', 'Qualcomm', 'Bosch']
      },
      reviews: [
        { rating: 4, comment: 'The practical industry exposure via sandwich courses is unmatched. Best technical college in TN after IIT.', userId: user2.id },
        { rating: 4, comment: 'Highly qualified professors and deep-seated industry connections dating back decades.', userId: user3.id }
      ]
    },
    {
      name: 'Thapar University',
      location: 'Patiala, Punjab',
      fees: 380000,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1627556704302-624286467c65?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1956,
      nirfRanking: 20,
      ownership: 'Private',
      courseTypes: 'B.E.,M.E.,M.Tech',
      description: 'Thapar Institute of Engineering and Technology is a premier private university in Punjab. It has an excellent research profile and has partnered with Trinity College Dublin for student exchange programs.',
      courses: [
        { name: 'B.E. Computer Science & Engineering', duration: '4 Years', fees: 380000 },
        { name: 'B.E. Electronics & Computer Engineering', duration: '4 Years', fees: 350000 },
        { name: 'M.E. Software Engineering', duration: '2 Years', fees: 140000 }
      ],
      placement: {
        avgSalary: 10.0,
        highSalary: 45.0,
        recruiters: ['IBM', 'Infosys', 'JP Morgan Chase', 'Amazon', 'Reliance Industries', 'Maruti Suzuki']
      },
      reviews: [
        { rating: 4, comment: 'Campus is beautiful and hostels are like premium apartments. High academic quality.', userId: user1.id },
        { rating: 5, comment: 'Exceptional placement rates for CSE branches year after year.', userId: user2.id }
      ]
    },
    {
      name: 'Anna University',
      location: 'Chennai, Tamil Nadu',
      fees: 60000,
      rating: 4.4,
      image: 'https://images.unsplash.com/photo-1616512659455-111d3367649f?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1978,
      nirfRanking: 13,
      ownership: 'Government',
      courseTypes: 'B.E.,B.Tech,M.E.',
      description: 'Anna University is a premier public state university, centralizing engineering education in Tamil Nadu. The CEG (College of Engineering, Guindy) campus is renowned for engineering research and historical prestige.',
      courses: [
        { name: 'B.E. Computer Science & Engineering', duration: '4 Years', fees: 60000 },
        { name: 'B.E. Information Technology', duration: '4 Years', fees: 60000 },
        { name: 'M.E. Applied Electronics', duration: '2 Years', fees: 28000 }
      ],
      placement: {
        avgSalary: 8.0,
        highSalary: 36.0,
        recruiters: ['Cognizant', 'TCS', 'Caterpillar', 'Zoho', 'Ford', 'Adobe']
      },
      reviews: [
        { rating: 4, comment: 'CEG campus is highly green and historical. Affordable tuition fee with outstanding brand value.', userId: user3.id },
        { rating: 5, comment: 'Strong coding environment and very helpful senior community.', userId: user2.id }
      ]
    },
    {
      name: 'Jadavpur University',
      location: 'Kolkata, West Bengal',
      fees: 10000,
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1955,
      nirfRanking: 4,
      ownership: 'Government',
      courseTypes: 'B.E.,M.E.,M.Tech',
      description: 'Jadavpur University is a premier public research university in Kolkata. It is legendary for offering top-tier engineering education at extremely minimal fees, producing world-class researchers and engineers.',
      courses: [
        { name: 'B.E. Computer Science & Engineering', duration: '4 Years', fees: 10000 },
        { name: 'B.E. Electronics & Telecommunication', duration: '4 Years', fees: 10000 },
        { name: 'M.E. Computer Technology', duration: '2 Years', fees: 5000 }
      ],
      placement: {
        avgSalary: 14.5,
        highSalary: 85.0,
        recruiters: ['PwC', 'Deloitte', 'Texas Instruments', 'Amazon', 'Samsung', 'Google']
      },
      reviews: [
        { rating: 5, comment: 'Unbelievable ROI. You pay practically nothing and get placed in top tech giants.', userId: user1.id },
        { rating: 4, comment: 'Highly political, but the academic freedom and intellectual capability of the students is outstanding.', userId: user2.id }
      ]
    },
    {
      name: 'Delhi Technological University',
      location: 'New Delhi, Delhi',
      fees: 190000,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1941,
      nirfRanking: 29,
      ownership: 'Government',
      courseTypes: 'B.Tech,M.Tech,MBA',
      description: 'Delhi Technological University (formerly Delhi College of Engineering) is a prestigious public university in Delhi. DTU is celebrated for its outstanding coding culture, fests, and strong recruitment drives.',
      courses: [
        { name: 'B.Tech Computer Engineering', duration: '4 Years', fees: 190000 },
        { name: 'B.Tech Software Engineering', duration: '4 Years', fees: 190000 },
        { name: 'M.Tech Computer Science', duration: '2 Years', fees: 95000 }
      ],
      placement: {
        avgSalary: 16.5,
        highSalary: 120.0,
        recruiters: ['Microsoft', 'Amazon', 'SanDisk', 'McKinsey', 'Paytm', 'Google']
      },
      reviews: [
        { rating: 5, comment: 'Coding culture is highly motivating. Almost every major company visits DTU.', userId: user3.id },
        { rating: 4, comment: 'Campus is huge with great spots. Hostels are comfortable and college life is top tier.', userId: user1.id }
      ]
    },
    {
      name: 'PES University',
      location: 'Bengaluru, Karnataka',
      fees: 380000,
      rating: 4.3,
      image: 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=800&auto=format&fit=crop',
      establishedYear: 1972,
      nirfRanking: 75,
      ownership: 'Private',
      courseTypes: 'B.Tech,M.Tech,MCA',
      description: 'PES University is a leading private university in Bengaluru. It is highly regarded for its structured computer science syllabus, rigorous test schedule (PESSAT), and immediate access to Bangalore tech hubs.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 380000 },
        { name: 'B.Tech Electronics & Communication', duration: '4 Years', fees: 340000 },
        { name: 'M.Tech Cloud Computing', duration: '2 Years', fees: 160000 }
      ],
      placement: {
        avgSalary: 9.5,
        highSalary: 50.0,
        recruiters: ['Cisco', 'Akamai', 'Target Corporation', 'Wipro', 'Microsoft', 'Intuit']
      },
      reviews: [
        { rating: 4, comment: 'Academics are very intense with regular exams, but the placement training and cells are extremely efficient.', userId: user2.id },
        { rating: 4, comment: 'Brilliant lab infrastructures and clean campus. Right in South Bangalore.', userId: user3.id }
      ]
    },
    {
      name: 'Symbiosis Institute of Technology',
      location: 'Pune, Maharashtra',
      fees: 280000,
      rating: 4.2,
      image: 'https://images.unsplash.com/photo-1576495199011-eb94736d05d6?q=80&w=800&auto=format&fit=crop',
      establishedYear: 2008,
      nirfRanking: 78,
      ownership: 'Private',
      courseTypes: 'B.Tech,M.Tech,MBA',
      description: 'Symbiosis Institute of Technology (SIT) Pune is a constituent of Symbiosis International University. Offers dynamic curricula, international semesters abroad, and top-class facilities in Lavale hills.',
      courses: [
        { name: 'B.Tech Computer Science & Engineering', duration: '4 Years', fees: 280000 },
        { name: 'B.Tech Robotics & Automation', duration: '4 Years', fees: 260000 },
        { name: 'M.Tech Artificial Intelligence', duration: '2 Years', fees: 130000 }
      ],
      placement: {
        avgSalary: 8.2,
        highSalary: 38.0,
        recruiters: ['Dell', 'IBM', 'TCS', 'Symantec', 'Amdocs', 'Capgemini']
      },
      reviews: [
        { rating: 4, comment: 'The Lavale campus scenery is breathtaking. Modern classrooms and good foreign exchange options.', userId: user1.id },
        { rating: 4, comment: 'Faculty members are very helpful. Placements are solid for CS and IT.', userId: user3.id }
      ]
    }
  ];

  const createdCollegesList: any[] = [];
  for (const col of collegesData) {
    const createdCollege = await prisma.college.create({
      data: {
        name: col.name,
        location: col.location,
        fees: col.fees,
        rating: col.rating,
        image: col.image,
        establishedYear: col.establishedYear,
        nirfRanking: col.nirfRanking,
        ownership: col.ownership,
        courseTypes: col.courseTypes,
        description: col.description,
        courses: {
          create: col.courses
        },
        placements: {
          create: {
            avgSalary: col.placement.avgSalary,
            highSalary: col.placement.highSalary,
            recruiters: col.placement.recruiters.join(',')
          }
        }
      }
    });

    createdCollegesList.push(createdCollege);

    for (const rev of col.reviews) {
      await prisma.review.create({
        data: {
          rating: rev.rating,
          comment: rev.comment,
          userId: rev.userId,
          collegeId: createdCollege.id
        }
      });
    }
  }

  console.log('Seeding Q&A discussions...');
  const bombay = createdCollegesList.find(c => c.name.includes('Bombay'));
  const delhi = createdCollegesList.find(c => c.name.includes('Delhi'));

  if (bombay) {
    const q1 = await prisma.question.create({
      data: {
        title: 'What is the coding and hackathon culture like at IIT Bombay?',
        content: 'I am planning to join CSE and want to understand the active programming clubs and GSoC participation.',
        userId: user1.id,
        collegeId: bombay.id,
      }
    });

    await prisma.answer.createMany({
      data: [
        { content: 'It is highly competitive and extremely active. The Web and Coding Club (WnCC) organizes weekly sessions and hackathons. GSoC selections are routinely in the double digits.', userId: user2.id, questionId: q1.id },
        { content: 'Additionally, the senior network is massive. You will get mentorship from people who have excelled in ICPC and top open-source projects.', userId: user3.id, questionId: q1.id }
      ]
    });
  }

  if (delhi) {
    const q2 = await prisma.question.create({
      data: {
        title: 'How strict is the attendance policy at IIT Delhi?',
        content: 'Is there a strict 75% attendance rule or do professors relax it?',
        userId: user2.id,
        collegeId: delhi.id,
      }
    });

    await prisma.answer.create({
      data: {
        content: 'The official rule is 75%, and most professors enforce it strictly. However, some professors relax it if you have valid medical reasons.',
        userId: user1.id,
        questionId: q2.id
      }
    });
  }

  // General discussion question
  const q3 = await prisma.question.create({
    data: {
      title: 'Should I choose B.Tech CSE in a newer IIT or Core branch in an older IIT?',
      content: 'I have options between Metallurgy at IIT Bombay/Delhi versus CSE at IIT Tirupati/Palakkad. What is the placements comparison?',
      userId: user3.id,
    }
  });

  await prisma.answer.createMany({
    data: [
      { content: 'If you are absolutely passionate about coding, choose CSE. Newer IITs have excellent CSE curriculums and the coding environment is growing rapidly.', userId: user1.id, questionId: q3.id },
      { content: 'Older IITs give you better brand value and alumni network. Many students in core branches still prepare for software placements and succeed.', userId: user2.id, questionId: q3.id }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
