class EventBus {
  private readonly eventMap: Record<string, ((...args: any[]) => unknown)[]>

  constructor() {
    this.eventMap = {}
  }

  on(eventName: string, eventFn: (...args: any[]) => unknown) {
    let eventFns = this.eventMap[eventName]
    if (!eventFns) {
      eventFns = []
      this.eventMap[eventName] = eventFns
    }
    eventFns.push(eventFn)
  }

  once(eventName: string, eventFn: (...args: any[]) => unknown) {
    let eventFns = this.eventMap[eventName]
    if (!eventFns) {
      eventFns = []
      this.eventMap[eventName] = eventFns
    }
    const onceEventFn = (...args: any[]) => {
      eventFn(...args)
      this.off(eventName, onceEventFn)
    }
    eventFns.push(onceEventFn)
  }

  off(eventName: string, eventFn: (...args: any[]) => unknown) {
    const eventFns = this.eventMap[eventName]
    if (!eventFns) return
    for (let i = 0; i < eventFns.length; i++) {
      const fn = eventFns[i]
      if (fn === eventFn) {
        eventFns.splice(i, 1)
        break
      }
    }
    if (eventFns.length === 0) {
      delete this.eventMap[eventName]
    }
  }

  emit(eventName: string, ...args: any[]) {
    const eventFns = this.eventMap[eventName]
    if (!eventFns) return
    eventFns.forEach(fn => {
      fn(...args)
    })
  }
}

export default new EventBus()
