import { Box } from '@mui/material'
import React from 'react'
import { CountdownCircleTimer } from 'react-countdown-circle-timer'

const minuteSeconds = 60
const hourSeconds = 3600
const daySeconds = 86400

const timerProps = {
  isPlaying: true,
  size: 120,
  strokeWidth: 6
}
const getTimeSeconds = time => (minuteSeconds - time) | 0
const getTimeMinutes = time => ((time % hourSeconds) / minuteSeconds) | 0
const getTimeHours = time => ((time % daySeconds) / hourSeconds) | 0
const getTimeDays = time => (time / daySeconds) | 0

const CountDown = ({ start }) => {
  const targetDate = new Date(start)
  targetDate.setDate(targetDate.getDate() + 45)
  const targetTime = targetDate.getTime()

  // Calculate remaining time in milliseconds
  const remainingTime = targetTime - new Date().getTime()

  // Function to format the remaining time
  const renderTime = (value, unit) => {
    return (
      <div className='flex flex-col items-center '>
        <div>{value}</div>
        <div>{unit}</div>
      </div>
    )
  }

  // Function to calculate remaining days and hours
  const calculateRemainingTime = () => {
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24))
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    return { days, hours }
  }

  const { days, hours } = calculateRemainingTime()

  return (
    <Box display={'flex'} gap={5} p={4}>
      <CountdownCircleTimer
        colors='#7E2E84'
        duration={45 * daySeconds}
        initialRemainingTime={days * daySeconds + hours * hourSeconds}
        {...timerProps}
      >
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime(days, 'Jours')}</span>}
      </CountdownCircleTimer>
      <CountdownCircleTimer
        {...timerProps}
        colors='#11aabb'
        duration={daySeconds}
        initialRemainingTime={(hours * hourSeconds) % daySeconds}
        onComplete={totalElapsedTime => ({
          shouldRepeat: remainingTime - totalElapsedTime > hourSeconds
        })}
      >
        {({ elapsedTime, color }) => <span style={{ color }}>{renderTime(hours, 'Heurs')}</span>}
      </CountdownCircleTimer>
    </Box>
  )
}

export default CountDown
