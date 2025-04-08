import { useContext, useState, useEffect, useRef } from 'react'
import { CircularProgress, Typography } from '@mui/material'

const red = '#f54e4e'
const green = '#4aec8c'

function CustomCounterTimeDown({ time, setTimeSendDocument }) {
  // work/break/null
  const [secondsLeft, setSecondsLeft] = useState(0)

  const secondsLeftRef = useRef(secondsLeft)

  function tick() {
    secondsLeftRef.current--
    setSecondsLeft(secondsLeftRef.current)
  }

  useEffect(() => {
    function switchMode() {
      const nextSeconds = time

      setSecondsLeft(nextSeconds)
      setTimeSendDocument(nextSeconds)
      secondsLeftRef.current = nextSeconds
    }

    secondsLeftRef.current = time
    setSecondsLeft(secondsLeftRef.current)

    const interval = setInterval(() => {
      if (secondsLeftRef.current === 0) {
        setTimeSendDocument()
        switchMode()
      }

      tick()
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const totalSeconds = time
  const percentage = Math.round((secondsLeft / totalSeconds) * 100)

  const minutes = Math.floor(secondsLeft / 60)
  let seconds = secondsLeft % 60
  if (seconds < 10) seconds = '0' + seconds

  return <Typography color={'#FFB911'}>{minutes + ':' + seconds}</Typography>
}

export default CustomCounterTimeDown
