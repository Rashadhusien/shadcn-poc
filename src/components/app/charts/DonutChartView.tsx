import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useSeriesColors } from './useSeriesColors'

export interface DonutSliceInput {
  id: string
  label: string
  value: number
}

interface DonutChartViewProps {
  slices: readonly DonutSliceInput[]
  height?: number
  valueFormatter?: (value: number) => string
  /** Accessible summary, e.g. "Orders grouped by status". */
  ariaLabel: string
}

/**
 * Donut chart on the shared Recharts wrapper: theme series colors, legend
 * with icon/label pairs (never color-only), hover tooltips.
 */
export function DonutChartView({ slices, height = 280, valueFormatter, ariaLabel }: DonutChartViewProps) {
  const colors = useSeriesColors()

  return (
    <div aria-label={ariaLabel} role="figure">
      <ResponsiveContainer height={height} width="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--popover)',
              borderColor: 'var(--border)',
              borderRadius: '0.75rem',
              color: 'var(--popover-foreground)',
              fontSize: '12px',
            }}
            formatter={(value, name) => [
              typeof value === 'number' && valueFormatter ? valueFormatter(value) : value,
              name,
            ]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value) => <span style={{ color: 'var(--foreground)' }}>{value}</span>}
          />
          <Pie
            data={slices.map((slice) => ({ ...slice }))}
            dataKey="value"
            nameKey="label"
            innerRadius="55%"
            outerRadius="85%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {slices.map((slice, index) => (
              <Cell key={slice.id} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
