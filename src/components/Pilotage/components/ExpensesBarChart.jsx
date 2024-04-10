import React from 'react';
import {
  Box,
  Text,
  VStack,
  useColorModeValue,
  useTheme,
} from '@chakra-ui/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Sample data
const data = [
  { name: 'Cotisations retraite', value: 12000 },
  { name: 'Cotisations URSSAF', value: 8500 },
  { name: 'Cotisations facultatives Madelin', value: 4700 },
  { name: 'Abonnements logiciels', value: 2100 },
  { name: 'Assurance professionnelle', value: 1300 },
  { name: 'Autres dépenses', value: 500 },
];

function ExpensesBarChart() {
  const theme = useTheme();
  const bgColor = useColorModeValue('white', 'gray.100');
  const textColor = useColorModeValue('gray.600', 'gray.200');
  const barFillColor = theme.colors.pink[300];
  const totalExpenses = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box p={5} bg={bgColor} borderRadius="md" boxShadow="sm">
      <VStack spacing={5} align="stretch">
        <Text fontSize="xl" fontWeight="semibold" mb={1}>
          Dépenses
        </Text>
        <Text fontSize="3xl" fontWeight="bold" color={theme.colors.pink[600]}>
          {totalExpenses.toLocaleString('fr-FR')} €
        </Text>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 30, bottom: 0, left: 30 }}
            barCategoryGap="35%"
          >
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: textColor }} />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: textColor }} />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{
                borderRadius: '12px',
                borderColor: 'rgba(0,0,0,0)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
              formatter={(value) => [value.toLocaleString('fr-FR'), 'Valeur']}
            />
            <Bar dataKey="value" fill={barFillColor} radius={[10, 10, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.name === 'Cotisations URSSAF' ? theme.colors.pink[400] : barFillColor} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </VStack>
    </Box>
  );
}

export default ExpensesBarChart;
