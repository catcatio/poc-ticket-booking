const ticketingFactory = (stellarWrapper, masterAccount, masterAsset) => {
  const bookTicket = async (user, event, amount = 1, uuid = '') => {
    return stellarWrapper.doBookTicket(masterAccount, masterAsset, user, event, amount, `B:${event.asset.getCode()}:${uuid}`)
  }

  const cancelBooking = async (user, event, amount = 1, uuid = '') => {
    return await stellarWrapper.swap(user, event.asset, event.distributor, masterAsset, amount, amount, `X:${event.asset.getCode()}:${uuid}`)
  }

  const queryRemainingTickets = (event) => {
    return stellarWrapper.queryBalance(event.distributor, event.asset)
      .then(result => {
        return result && parseInt(result.balance)
      })
  }

  const queryTicketCount = async (user, event) => {
    //// basic flow: assume all trades were made through the system
    // check current balance
    // check burnt balance
    // check total buy and sell
    // compare result

    const currentBalance = await stellarWrapper.queryBalance(user, event.asset)
      .then(result => {
        return result && result.balance
      })

    const burntBalance = await stellarWrapper.queryOperations(user, 100, 'desc')
      .then(operations =>
        operations.filter(operation =>
          operation.type === 'payment'
          && operation.to === event.issuer.publicKey()
          && operation.asset_code === event.asset.getCode()
          && operation.asset_issuer === event.asset.getIssuer()
        ).length
      )

    const [totalBuyTrades, totalReturnTrades] = await stellarWrapper.queryAllTrades(user, 100)
      .then(trades => {
        const compareTradeAsset = (baseAsset, counterAsset, counterAccount) => (trade) =>
          trade.base_asset_code === baseAsset.getCode()
          && trade.base_asset_issuer === baseAsset.getIssuer()
          && trade.counter_asset_code === counterAsset.getCode()
          && trade.counter_asset_issuer === counterAsset.getIssuer()
          && trade.counter_account === counterAccount

        // count transactions that the counter party is Event Distributor
        const eventDistributorPk = event.distributor.publicKey()
        const buyTrades = trades.filter(compareTradeAsset(masterAsset, event.asset, eventDistributorPk)).length
        const returnTrades = trades.filter(compareTradeAsset(event.asset, masterAsset, eventDistributorPk)).length

        return [buyTrades, returnTrades]
      })

    const totalBalance = totalBuyTrades - totalReturnTrades - burntBalance
    return Math.min(currentBalance, totalBalance < 0 ? 0 : totalBalance)
  }

  const burnTicket = (user, event, amount = 1, uuid = '') => {
    return stellarWrapper.transfer(user, event.issuer.publicKey(), amount, event.asset, `C:${event.asset.getCode()}:${uuid}`)
  }

  const queryBookedTickets = (user) => {
    return stellarWrapper.queryAllAsstes(user)
      .then(asset => asset.filter(a => a.asset_type !== 'native' && a.balance > 0)
        .map(a => ({
          eventCode: a.asset_code,
          balance: a.balance
        })))
  }

  const queryTransactionMemo = async (txId) => {
    return stellarWrapper.queryTransactionMemo(txId)
  }

  const simpleBookEvent = (user, event, amount = 1, uuid = '') => {
    return stellarWrapper.simpleBookEvent(masterAsset, user, event, amount, `B:${event.asset.getCode()}:${uuid}`)
  }

  return {
    bookTicket,
    simpleBookEvent,
    queryRemainingTickets,
    queryTicketCount,
    burnTicket,
    queryBookedTickets,
    queryTransactionMemo,
    cancelBooking
  }
}


module.exports = ticketingFactory

