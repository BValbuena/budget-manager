const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear categorías
  const marketing = await prisma.category.upsert({
    where: { name: 'Marketing' },
    update: {},
    create: {
      name: 'Marketing',
      description: 'Servicios de marketing digital'
    }
  });

  const diseño = await prisma.category.upsert({
    where: { name: 'Diseño' },
    update: {},
    create: {
      name: 'Diseño',
      description: 'Diseño gráfico y visual'
    }
  });

  // Crear opciones
  await prisma.option.upsert({
    where: { name: 'Gestión de redes sociales' },
    update: {},
    create: {
      name: 'Gestión de redes sociales',
      categoryId: marketing.id,
      priceEuro: 300,
      hours: 10,
      description: 'Publicaciones y gestión mensual',
      active: true
    }
  });

  await prisma.option.upsert({
    where: { name: 'Publicidad online' },
    update: {},
    create: {
      name: 'Publicidad online',
      categoryId: marketing.id,
      priceEuro: 500,
      hours: 15,
      description: 'Campañas publicitarias',
      active: true
    }
  });

  await prisma.option.upsert({
    where: { name: 'Diseño de logo' },
    update: {},
    create: {
      name: 'Diseño de logo',
      categoryId: diseño.id,
      priceEuro: 250,
      hours: 5,
      description: 'Creación de logotipo profesional',
      active: true
    }
  });
}

main()
  .then(() => {
    console.log('Datos de prueba creados.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
