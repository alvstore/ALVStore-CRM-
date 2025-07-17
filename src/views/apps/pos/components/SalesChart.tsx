'use client'

// React Imports
import { useMemo } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import { LineChart } from '@mui/x-charts/LineChart'
import { axisClasses } from '@mui/x-charts/ChartsAxis'

// Types
type SalesData = {
  date: string
  sales: number
}

type Props = {
  data: SalesData[]
}

const SalesChart = ({ data }: Props) => {
  // Hooks
  const theme = useTheme()
  
  // Prepare chart data
  const chartData = useMemo(() => {
    return {
      xAxis: [{
        data: data.map(item => item.date),
        scaleType: 'band' as const,
        tickLabelStyle: {
          fill: theme.palette.text.secondary
        },
        label: 'Date'
      }],
      yAxis: [{
        label: 'Sales ($)',
        tickLabelStyle: {
          fill: theme.palette.text.secondary
        },
        valueFormatter: (value: number) => `$${value.toFixed(2)}`
      }],
      series: [{
        data: data.map(item => item.sales),
        area: true,
        showMark: true,
        color: theme.palette.primary.main
      }]
    }
  }, [data, theme])

  return (
    <div className='bs-[300px]'>
      <LineChart
        xAxis={chartData.xAxis}
        yAxis={chartData.yAxis}
        series={chartData.series}
        sx={{
          [`.${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translate(-20px, 0)'
          },
          '& .MuiMarkElement-root': {
            fill: theme.palette.background.paper,
            stroke: theme.palette.primary.main,
            strokeWidth: 2
          },
          '& .MuiAreaElement-root': {
            fill: `${theme.palette.primary.main}33`,
            stroke: theme.palette.primary.main,
            strokeWidth: 2
          },
          '& .MuiLineElement-root': {
            stroke: theme.palette.primary.main,
            strokeWidth: 2
          }
        }}
        margin={{ left: 70, right: 30, top: 20, bottom: 50 }}
        slotProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[4],
              '& .MuiChartsTooltip-label': {
                color: theme.palette.text.primary
              },
              '& .MuiChartsTooltip-item': {
                color: theme.palette.text.primary
              }
            }
          }
        }}
      />
    </div>
  )
}

export default SalesChart
