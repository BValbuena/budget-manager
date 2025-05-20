const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { startOfMonth, endOfMonth, subMonths } = require('date-fns');

exports.getMonthlyStats = async (req, res) => {
  try {
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);

      const total = await prisma.plan.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      });

      months.push({
        month: start.toLocaleString('es-ES', { month: 'long' }),
        total,
      });
    }

    res.json(months);
  } catch (error) {
    console.error('Error en /monthly:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas mensuales' });
  }
};

exports.getPopularOptions = async (req, res) => {
  try {
    const result = await prisma.planOption.groupBy({
      by: ['optionId'],
      _count: {
        optionId: true,
      },
      orderBy: {
        _count: {
          optionId: 'desc',
        },
      },
      take: 10,
    });

    const optionsWithName = await Promise.all(
      result.map(async (item) => {
        const option = await prisma.option.findUnique({
          where: { id: item.optionId },
        });

        return {
          name: option?.name || `Opción ${item.optionId}`,
          count: item._count.optionId,
        };
      })
    );

    res.json(optionsWithName);
  } catch (error) {
    console.error('Error en /popular-options:', error);
    res.status(500).json({ error: 'Error al obtener opciones más populares' });
  }
};
