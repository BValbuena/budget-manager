const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPlan = async (req, res) => {
  try {
    const {
      clientName,
      clientEmail,
      clientPhone,
      budget,
      selectedOptionIds
    } = req.body;

    
    const setting = await prisma.setting.findFirst();
    if (!setting) {
      return res.status(400).json({ message: 'No se ha definido el precio por hora en Settings.' });
    }
    const pricePerHour = setting.hourlyRate;


    const options = await prisma.option.findMany({
      where: { id: { in: selectedOptionIds } },
    });

    const totalHours = options.reduce((acc, opt) => acc + opt.hours, 0);
    const totalCost = options.reduce((acc, opt) =>
      acc + (opt.isFree ? 0 : opt.hours * pricePerHour), 0);


    const plan = await prisma.plan.create({
      data: {
        clientName,
        clientEmail,
        clientPhone,
        budget,
        totalCost,
        totalHours,
        pricePerHour, 
        planOptions: {
          create: selectedOptionIds.map(id => ({ optionId: id }))
        }
      },
      include: {
        planOptions: { include: { option: true } }
      }
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error('Error al crear plan:', error);
    res.status(500).json({ message: 'Error al crear plan', error });
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [plans, totalCount, totalHoursAgg, totalCostAgg] = await Promise.all([
      prisma.plan.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          planOptions: {
            include: { option: true },
          },
        },
      }),
      prisma.plan.count(),
      prisma.plan.aggregate({ _sum: { totalHours: true } }),
      prisma.plan.aggregate({ _sum: { totalCost: true } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const totalHours = totalHoursAgg._sum.totalHours || 0;
    const totalCost = totalCostAgg._sum.totalCost || 0;

    res.json({
      plans,
      totalPages,
      totalHours,
      totalCost,
    });
  } catch (error) {
    console.error("Error al obtener planes:", error);
    res.status(500).json({ message: "Error al obtener planes", error });
  }
};

