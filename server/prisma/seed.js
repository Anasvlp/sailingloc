import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create locations
  const locations = await Promise.all([
    prisma.location.create({
      data: {
        name: 'Martinique',
        country: 'France',
        region: 'Antilles',
        latitude: 14.6415,
        longitude: -61.0242
      }
    }),
    prisma.location.create({
      data: {
        name: 'Corse',
        country: 'France',
        region: 'Méditerranée',
        latitude: 42.0396,
        longitude: 9.0129
      }
    }),
    prisma.location.create({
      data: {
        name: 'Côte d\'Azur',
        country: 'France',
        region: 'PACA',
        latitude: 43.7102,
        longitude: 7.2620
      }
    }),
    prisma.location.create({
      data: {
        name: 'Bretagne',
        country: 'France',
        region: 'Bretagne',
        latitude: 48.2020,
        longitude: -2.9326
      }
    }),
    prisma.location.create({
      data: {
        name: 'Marseille',
        country: 'France',
        region: 'PACA',
        latitude: 43.2965,
        longitude: 5.3698
      }
    })
  ]);

  console.log('📍 Created locations');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@sailingloc.fr',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'SailingLoc',
      role: 'ADMIN',
      isVerified: true
    }
  });

  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'pierre.martin@email.com',
        password: hashedPassword,
        firstName: 'Pierre',
        lastName: 'Martin',
        role: 'SELLER',
        isVerified: true,
        phone: '+33 6 12 34 56 78'
      }
    }),
    prisma.user.create({
      data: {
        email: 'marie.dubois@email.com',
        password: hashedPassword,
        firstName: 'Marie',
        lastName: 'Dubois',
        role: 'SELLER',
        isVerified: true,
        phone: '+33 6 23 45 67 89'
      }
    }),
    prisma.user.create({
      data: {
        email: 'thomas.leroy@email.com',
        password: hashedPassword,
        firstName: 'Thomas',
        lastName: 'Leroy',
        role: 'SELLER',
        isVerified: true,
        phone: '+33 6 34 56 78 90'
      }
    })
  ]);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'jean.dupont@email.com',
        password: hashedPassword,
        firstName: 'Jean',
        lastName: 'Dupont',
        role: 'USER',
        isVerified: true,
        phone: '+33 6 45 67 89 01'
      }
    }),
    prisma.user.create({
      data: {
        email: 'sophie.bernard@email.com',
        password: hashedPassword,
        firstName: 'Sophie',
        lastName: 'Bernard',
        role: 'USER',
        isVerified: true,
        phone: '+33 6 56 78 90 12'
      }
    }),
    prisma.user.create({
      data: {
        email: 'lucas.moreau@email.com',
        password: hashedPassword,
        firstName: 'Lucas',
        lastName: 'Moreau',
        role: 'USER',
        isVerified: true,
        phone: '+33 6 67 89 01 23'
      }
    }),
    prisma.user.create({
      data: {
        email: 'emma.petit@email.com',
        password: hashedPassword,
        firstName: 'Emma',
        lastName: 'Petit',
        role: 'USER',
        isVerified: true,
        phone: '+33 6 78 90 12 34'
      }
    }),
    prisma.user.create({
      data: {
        email: 'antoine.roux@email.com',
        password: hashedPassword,
        firstName: 'Antoine',
        lastName: 'Roux',
        role: 'USER',
        isVerified: true,
        phone: '+33 6 89 01 23 45'
      }
    })
  ]);

  console.log('👥 Created users');

  // Create boats
  const boatImages = [
    'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1450360/pexels-photo-1450360.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800'
  ];

  const boats = [];

  // Sailboats
  for (let i = 0; i < 15; i++) {
    const boat = await prisma.boat.create({
      data: {
        title: `Voilier ${['Beneteau', 'Jeanneau', 'Bavaria', 'Dufour', 'Hanse'][i % 5]} ${30 + (i % 20)}`,
        description: `Magnifique voilier parfait pour une croisière en famille ou entre amis. Équipé de tout le confort moderne, ce bateau vous garantit une navigation sûre et agréable. Idéal pour découvrir les plus belles côtes françaises.`,
        category: 'SAILBOAT',
        type: 'MONOHULL',
        brand: ['Beneteau', 'Jeanneau', 'Bavaria', 'Dufour', 'Hanse'][i % 5],
        model: `${30 + (i % 20)}`,
        year: 2015 + (i % 8),
        length: 9 + (i % 6),
        capacity: 4 + (i % 8),
        cabins: 2 + (i % 3),
        bathrooms: 1 + (i % 2),
        pricePerDay: 150 + (i * 20),
        deposit: 1000 + (i * 100),
        images: [boatImages[i % 5], boatImages[(i + 1) % 5], boatImages[(i + 2) % 5]],
        equipment: ['GPS', 'Pilote automatique', 'Guindeau électrique', 'Annexe', 'Moteur hors-bord'],
        rules: ['Permis bateau obligatoire', 'Pas d\'animaux', 'Non fumeur'],
        ownerId: sellers[i % 3].id,
        locationId: locations[i % 5].id,
        isActive: true
      }
    });
    boats.push(boat);
  }

  // Catamarans
  for (let i = 0; i < 10; i++) {
    const boat = await prisma.boat.create({
      data: {
        title: `Catamaran ${['Lagoon', 'Fountaine Pajot', 'Catana', 'Nautitech'][i % 4]} ${38 + (i % 12)}`,
        description: `Superbe catamaran spacieux et confortable, idéal pour les grandes familles ou groupes d'amis. Avec ses multiples espaces de vie et sa stabilité exceptionnelle, profitez d'une croisière inoubliable.`,
        category: 'CATAMARAN',
        type: 'MULTIHULL',
        brand: ['Lagoon', 'Fountaine Pajot', 'Catana', 'Nautitech'][i % 4],
        model: `${38 + (i % 12)}`,
        year: 2016 + (i % 7),
        length: 11 + (i % 4),
        capacity: 8 + (i % 4),
        cabins: 3 + (i % 3),
        bathrooms: 2 + (i % 2),
        pricePerDay: 300 + (i * 50),
        deposit: 2000 + (i * 200),
        images: [boatImages[i % 5], boatImages[(i + 1) % 5], boatImages[(i + 2) % 5]],
        equipment: ['GPS', 'Pilote automatique', 'Climatisation', 'Dessalinisateur', 'Annexe avec moteur'],
        rules: ['Permis bateau obligatoire', 'Maximum 12 personnes', 'Caution obligatoire'],
        ownerId: sellers[i % 3].id,
        locationId: locations[i % 5].id,
        isActive: true
      }
    });
    boats.push(boat);
  }

  // Motor boats
  for (let i = 0; i < 15; i++) {
    const boat = await prisma.boat.create({
      data: {
        title: `Bateau moteur ${['Princess', 'Azimut', 'Sunseeker', 'Fairline'][i % 4]} ${25 + (i % 15)}`,
        description: `Élégant bateau à moteur alliant performance et confort. Parfait pour des sorties à la journée ou des week-ends, avec tout l'équipement nécessaire pour passer des moments exceptionnels en mer.`,
        category: 'MOTORBOAT',
        type: 'MONOHULL',
        brand: ['Princess', 'Azimut', 'Sunseeker', 'Fairline'][i % 4],
        model: `${25 + (i % 15)}`,
        year: 2017 + (i % 6),
        length: 8 + (i % 5),
        capacity: 6 + (i % 6),
        cabins: 1 + (i % 3),
        bathrooms: 1 + (i % 2),
        pricePerDay: 200 + (i * 30),
        deposit: 1500 + (i * 150),
        images: [boatImages[i % 5], boatImages[(i + 1) % 5], boatImages[(i + 2) % 5]],
        equipment: ['GPS', 'Sondeur', 'Radio VHF', 'Bimini', 'Échelle de bain'],
        rules: ['Permis côtier obligatoire', 'Retour avant 19h', 'Carburant en sus'],
        ownerId: sellers[i % 3].id,
        locationId: locations[i % 5].id,
        isActive: true
      }
    });
    boats.push(boat);
  }

  // RIBs
  for (let i = 0; i < 10; i++) {
    const boat = await prisma.boat.create({
      data: {
        title: `Semi-rigide ${['Zodiac', 'Bombard', 'Valiant', 'Highfield'][i % 4]} ${6 + (i % 4)}m`,
        description: `Semi-rigide rapide et maniable, idéal pour explorer les criques et profiter des sports nautiques. Facile à piloter et parfait pour des sorties dynamiques en famille ou entre amis.`,
        category: 'RIB',
        type: 'MONOHULL',
        brand: ['Zodiac', 'Bombard', 'Valiant', 'Highfield'][i % 4],
        model: `${6 + (i % 4)}m`,
        year: 2018 + (i % 5),
        length: 6 + (i % 4),
        capacity: 6 + (i % 4),
        cabins: 0,
        bathrooms: 0,
        pricePerDay: 120 + (i * 15),
        deposit: 800 + (i * 50),
        images: [boatImages[i % 5], boatImages[(i + 1) % 5]],
        equipment: ['GPS', 'Sondeur', 'Bimini', 'Échelle de bain', 'Glacière'],
        rules: ['Permis côtier obligatoire', 'Navigation côtière uniquement', 'Gilets de sauvetage obligatoires'],
        ownerId: sellers[i % 3].id,
        locationId: locations[i % 5].id,
        isActive: true
      }
    });
    boats.push(boat);
  }

  console.log('⛵ Created boats');

  // Create bookings
  const bookings = [];
  for (let i = 0; i < 20; i++) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + (i * 7) + Math.floor(Math.random() * 30));
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 3 + Math.floor(Math.random() * 4));

    const boat = boats[Math.floor(Math.random() * boats.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const totalPrice = days * boat.pricePerDay;

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        boatId: boat.id,
        startDate,
        endDate,
        guestCount: 2 + Math.floor(Math.random() * 4),
        totalPrice,
        deposit: boat.deposit,
        status: ['PENDING', 'CONFIRMED', 'COMPLETED'][Math.floor(Math.random() * 3)],
        message: 'Nous avons hâte de naviguer sur votre magnifique bateau !'
      }
    });
    bookings.push(booking);
  }

  console.log('📅 Created bookings');

  // Create reviews
  for (let i = 0; i < 15; i++) {
    const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
    if (completedBookings.length === 0) continue;

    const booking = completedBookings[Math.floor(Math.random() * completedBookings.length)];
    
    await prisma.review.create({
      data: {
        userId: booking.userId,
        boatId: booking.boatId,
        bookingId: booking.id,
        rating: 4 + Math.floor(Math.random() * 2), // 4 or 5 stars
        comment: [
          'Excellente expérience ! Le bateau était parfait et le propriétaire très accueillant.',
          'Navigation fantastique, bateau en excellent état. Je recommande vivement !',
          'Superbe week-end en mer, tout était parfait. Merci pour cette belle expérience.',
          'Bateau conforme à la description, propriétaire disponible. Très satisfait !',
          'Magnifique croisière, bateau bien équipé et confortable. À refaire !'
        ][Math.floor(Math.random() * 5)],
        cleanliness: 4 + Math.floor(Math.random() * 2),
        accuracy: 4 + Math.floor(Math.random() * 2),
        communication: 4 + Math.floor(Math.random() * 2),
        location: 4 + Math.floor(Math.random() * 2),
        value: 4 + Math.floor(Math.random() * 2)
      }
    });
  }

  console.log('⭐ Created reviews');

  // Create favorites
  for (let i = 0; i < 10; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const boat = boats[Math.floor(Math.random() * boats.length)];

    try {
      await prisma.favorite.create({
        data: {
          userId: user.id,
          boatId: boat.id
        }
      });
    } catch (error) {
      // Ignore duplicate favorites
    }
  }

  console.log('❤️ Created favorites');

  // Create messages
  for (let i = 0; i < 15; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const receiver = sellers[Math.floor(Math.random() * sellers.length)];

    await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        content: [
          'Bonjour, votre bateau est-il disponible pour le week-end prochain ?',
          'Merci pour cette excellente navigation ! Tout était parfait.',
          'Pouvez-vous me donner plus d\'informations sur l\'équipement disponible ?',
          'Je souhaiterais réserver votre bateau pour une semaine en juillet.',
          'Excellent service, je recommande vivement ce propriétaire !'
        ][Math.floor(Math.random() * 5)],
        isRead: Math.random() > 0.5
      }
    });
  }

  console.log('💬 Created messages');

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- 1 Admin user`);
  console.log(`- 3 Seller users`);
  console.log(`- 5 Regular users`);
  console.log(`- 5 Locations`);
  console.log(`- 50 Boats (15 sailboats, 10 catamarans, 15 motorboats, 10 RIBs)`);
  console.log(`- 20 Bookings`);
  console.log(`- 15 Reviews`);
  console.log(`- 10 Favorites`);
  console.log(`- 15 Messages`);
  console.log('\n🔑 Login credentials:');
  console.log('Admin: admin@sailingloc.fr / password123');
  console.log('Seller: pierre.martin@email.com / password123');
  console.log('User: jean.dupont@email.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });