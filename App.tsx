import React, { Component } from 'react'
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity
} from 'react-native'
import moment from 'moment'

export default class StopwatchApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: 0,
      currentTime: 0,
      laps: [],
    }
    this.timer = null
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  startTimer = () => {
    const currentTime = new Date().getTime()
    this.setState({
      startTime: currentTime,
      currentTime,
      laps: [0],
    })
    this.timer = setInterval(() => {
      this.setState({ currentTime: new Date().getTime() })
    }, 100)
  }

  recordLap = () => {
    const timestamp = new Date().getTime()
    const { laps, currentTime, startTime } = this.state
    const [firstLap, ...other] = laps
    this.setState({
      laps: [0, firstLap + currentTime - startTime, ...other],
      startTime: timestamp,
      currentTime: timestamp,
    })
  }

  stopTimer = () => {
    clearInterval(this.timer)
    const { laps, currentTime, startTime } = this.state
    const [firstLap, ...other] = laps
    this.setState({
      laps: [firstLap + currentTime - startTime, ...other],
      startTime: 0,
      currentTime: 0,
    })
  }

  resetTimer = () => {
    this.setState({
      laps: [],
      startTime: 0,
      currentTime: 0,
    })
  }

  resumeTimer = () => {
    const currentTime = new Date().getTime()
    this.setState({
      startTime: currentTime,
      currentTime,
    })
    this.timer = setInterval(() => {
      this.setState({ currentTime: new Date().getTime() })
    }, 100)
  }

  render() {
    const { currentTime, startTime, laps } = this.state
    const timerInterval = currentTime - startTime

    return (
      <View style={styles.container}>
        <TimerDisplay
          interval={laps.reduce((total, curr) => total + curr, 0) + timerInterval}
          style={styles.timer}
        />
        {laps.length === 0 && (
          <ButtonRow>
            <RoundButton
              title='Lap'
              color='#8B8B90'
              background='#151515'
              disabled
            />
            <RoundButton
              title='Start'
              color='#50D167'
              background='#1B361F'
              onPress={this.startTimer}
            />
          </ButtonRow>
        )}
        {startTime > 0 && (
          <ButtonRow>
            <RoundButton
              title='Lap'
              color='#FFFFFF'
              background='#3D3D3D'
              onPress={this.recordLap}
            />
            <RoundButton
              title='Stop'
              color='#E33935'
              background='#3C1715'
              onPress={this.stopTimer}
            />
          </ButtonRow>
        )}
        {laps.length > 0 && startTime === 0 && (
          <ButtonRow>
            <RoundButton
              title='Reset'
              color='#FFFFFF'
              background='#3D3D3D'
              onPress={this.resetTimer}
            />
            <RoundButton
              title='Start'
              color='#50D167'
              background='#1B361F'
              onPress={this.resumeTimer}
            />
          </ButtonRow>
        )}
        <LapsTable laps={laps} timerInterval={timerInterval} />
      </View>
    )
  }
}

function TimerDisplay({ interval, style }) {
  const pad = (n) => (n < 10 ? '0' + n : n)
  const duration = moment.duration(interval)
  const centiseconds = Math.floor(duration.milliseconds() / 10)
  return (
    <View style={styles.timerContainer}>
      <Text style={style}>{pad(duration.minutes())}:</Text>
      <Text style={style}>{pad(duration.seconds())},</Text>
      <Text style={style}>{pad(centiseconds)}</Text>
    </View>
  )
}

function RoundButton({ title, color, background, onPress, disabled }) {
  return (
    <TouchableOpacity
      onPress={() => !disabled && onPress()}
      style={[styles.button, { backgroundColor: background }]}
      activeOpacity={disabled ? 1.0 : 0.7}
    >
      <View style={styles.buttonBorder}>
        <Text style={[styles.buttonTitle, { color }]}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

function Lap({ number, interval, isFastest, isSlowest }) {
  const lapStyle = [
    styles.lapText,
    isFastest && styles.fastest,
    isSlowest && styles.slowest,
  ]
  return (
    <View style={styles.lap}>
      <Text style={lapStyle}>Lap {number}</Text>
      <TimerDisplay style={[lapStyle, styles.lapTimer]} interval={interval} />
    </View>
  )
}

function LapsTable({ laps, timerInterval }) {
  const finishedLaps = laps.slice(1)
  let min = Number.MAX_SAFE_INTEGER
  let max = Number.MIN_SAFE_INTEGER
  if (finishedLaps.length >= 2) {
    finishedLaps.forEach((lap) => {
      if (lap < min) min = lap
      if (lap > max) max = lap
    })
  }
  return (
    <ScrollView style={styles.scrollView}>
      {laps.map((lap, index) => (
        <Lap
          number={laps.length - index}
          key={laps.length - index}
          interval={index === 0 ? timerInterval + lap : lap}
          isFastest={lap === min}
          isSlowest={lap === max}
        />
      ))}
    </ScrollView>
  )
}

function ButtonRow({ children }) {
  return <View style={styles.buttonsRow}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    alignItems: 'center',
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  timer: {
    color: '#FFFFFF',
    fontSize: 76,
    fontWeight: '200',
    width: 110,
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: 18,
  },
  buttonBorder: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    marginTop: 80,
    marginBottom: 30,
  },
  lapText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  lapTimer: {
    width: 30,
  },
  lap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#151515',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  scrollView: {
    alignSelf: 'stretch',
  },
  fastest: {
    color: '#4BC05F',
  },
  slowest: {
    color: '#CC3531',
  },
  timerContainer: {
    flexDirection: 'row',
  },
})
