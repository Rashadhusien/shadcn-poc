import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useSeriesColors } from './useSeriesColors'

export interface BarSeriesInput {
  id: string
  label: string
  data: readonly number[]
}

interface BarChartViewProps {
  categories: readonly string[]
  series: readonly BarSeriesInput[]
  /** Columns (default) or horizontal bars for long category names. */
  layout?: 'vertical' | 'horizontal'
  height?: number
  valueFormatter?: (value: number) => string
  /** Accessible summary, e.g. "Orders received and completed per day". */
  ariaLabel: string
}

/**
 * Bar / column chart on the shared Recharts wrapper: series colors from the
 * active theme, rounded data ends, hairline grid on the value axis only, a
 * legend only when series compare, and a hover tooltip per bar.
 */
export function BarChartView({
  categories,
  series,
  layout = 'vertical',
  height = 280,
  valueFormatter,
  ariaLabel,
}: BarChartViewProps) {
  const colors = useSeriesColors()
  const horizontal = layout === 'horizontal'
  const rows = categories.map((category, index) => {
    const row: Record<string, string | number> = { category }
    series.forEach((item) => {
      row[item.id] = item.data[index] ?? 0
    })
    return row
  })

  return (
    <div aria-label={ariaLabel} role="figure">
      <ResponsiveContainer height={height} width="100%">
        <BarChart data={rows} layout={layout} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="none" vertical={horizontal} horizontal={!horizontal} />
          {horizontal ? (
            <>
              <XAxis
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                type="number"
                tickFormatter={valueFormatter}
              />
              <YAxis
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                type="category"
                dataKey="category"
                width="auto"
              />
            </>
          ) : (
            <>
              <XAxis
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dataKey="category"
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width="auto"
                tickFormatter={valueFormatter}
              />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--popover)',
              borderColor: 'var(--border)',
              borderRadius: '0.75rem',
              color: 'var(--popover-foreground)',
              fontSize: '12px',
            }}
            formatter={(value) => (typeof value === 'number' && valueFormatter ? valueFormatter(value) : value)}
          />
          {series.length > 1 && (
            <Legend verticalAlign="top" align="right" wrapperStyle={{ fontSize: '12px' }} />
          )}
          {series.map((item, index) => (
            <Bar
              key={item.id}
              dataKey={item.id}
              name={item.label}
              fill={colors[index % colors.length]}
              radius={4}
              barSize={undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
