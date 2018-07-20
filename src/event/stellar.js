module.exports = (stellarEngine) => {
  const createEvent = (event) => {
    return stellarEngine.createEvent(event)
  }

  const getAllEvents = () => {
    return stellarEngine.getAllEvents()
  }

  const bookEvent = (userId, eventId) => {
    return stellarEngine.bookEvent(userId, eventId)
  }

  const getBookedEvents = (userId) => {
    return stellarEngine.getBookedEvents(userId)
  }

  const getBookedCount = (userId, eventCode) => {
    return stellarEngine.getBookedCount(userId, eventCode)
  }

  const cancelBooking = (userId, eventCode)=> {
    return stellarEngine.cancelBooking(userId, eventCode)
  }

  const cancelEvent = (eventCode)=> {
    return stellarEngine.cancelEvent(eventCode)
  }

  const useTicket = (userId, eventCode) => {
    return stellarEngine.useTicket(userId, eventCode)
  }

  const useTicketByTransaction = (txId) => {
    return stellarEngine.useTicketByTransaction(txId)
  }

  const confirmTicketByTransaction = (txId) => {
    return stellarEngine.confirmTicketByTransaction(txId)
  }

  return {
    createEvent,
    getAllEvents,
    bookEvent,
    getBookedEvents,
    cancelBooking,
    useTicket,
    cancelEvent,
    getBookedCount,
    useTicketByTransaction,
    confirmTicketByTransaction
  }
}