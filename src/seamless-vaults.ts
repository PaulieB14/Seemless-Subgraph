import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Deposit as DepositEvent,
  Withdraw as WithdrawEvent,
  Transfer as TransferEvent,
  AccrueInterest as AccrueInterestEvent
} from "../generated/SeamlessUSDCVault/SeamlessUSDCVault"
import {
  Deposit as DepositEventcbBTC,
  Withdraw as WithdrawEventcbBTC,
  Transfer as TransferEventcbBTC,
  AccrueInterest as AccrueInterestEventcbBTC
} from "../generated/SeamlesscbBTCVault/SeamlesscbBTCVault"
import {
  Deposit as DepositEventWETH,
  Withdraw as WithdrawEventWETH,
  Transfer as TransferEventWETH,
  AccrueInterest as AccrueInterestEventWETH
} from "../generated/SeamlessWETHVault/SeamlessWETHVault"
import {
  Transfer as TokenTransferEvent,
  Approval as TokenApprovalEvent
} from "../generated/SeemToken/SeemToken"
import {
  User,
  Vault,
  Deposit,
  Withdrawal,
  Transfer,
  AccrueInterest,
  SeemToken,
  TokenHolder,
  TokenTransfer,
  TokenApproval
} from "../generated/schema"

// ===== VAULT ADDRESSES =====
const USDC_VAULT = "0x616a4E1db48e22028f6bbf20444Cd3b8e3273738"
const cbbtc_VAULT = "0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7"
const WETH_VAULT = "0x27d8c7273fd3fcc6956a0b370ce5fd4a7fc65c18"

// ===== TOKEN ADDRESSES =====
const SEEM_TOKEN = "0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85"

// ===== HELPER FUNCTIONS =====

function getVaultName(vaultAddress: string): string {
  let address = vaultAddress.toLowerCase()
  if (address == USDC_VAULT.toLowerCase()) {
    return "USDC"
  } else if (address == cbbtc_VAULT.toLowerCase()) {
    return "cbBTC"
  } else if (address == WETH_VAULT.toLowerCase()) {
    return "WETH"
  }
  return "UNKNOWN"
}

function getOrCreateUser(userAddress: Bytes): User {
  let user = User.load(userAddress)
  if (!user) {
    user = new User(userAddress)
    user.totalDepositedUSDC = BigInt.fromI32(0)
    user.totalDepositedcbBTC = BigInt.fromI32(0)
    user.totalDepositedWETH = BigInt.fromI32(0)
    user.totalWithdrawnUSDC = BigInt.fromI32(0)
    user.totalWithdrawncbBTC = BigInt.fromI32(0)
    user.totalWithdrawnWETH = BigInt.fromI32(0)
    user.totalDeposited = BigInt.fromI32(0)
    user.totalWithdrawn = BigInt.fromI32(0)
    user.firstDepositAt = null
    user.lastActivityAt = null
  }
  return user
}

function getOrCreateVault(vaultAddress: Bytes): Vault {
  let vault = Vault.load(vaultAddress)
  if (!vault) {
    vault = new Vault(vaultAddress)
    vault.name = getVaultName(vaultAddress.toHexString())
    vault.symbol = getVaultName(vaultAddress.toHexString())
    vault.totalAssets = BigInt.fromI32(0)
    vault.totalSupply = BigInt.fromI32(0)
    vault.createdAt = BigInt.fromI32(0)
    vault.lastUpdatedAt = BigInt.fromI32(0)
  }
  return vault
}

function updateUserTotals(user: User, vaultName: string, amount: BigInt, isDeposit: boolean): void {
  if (isDeposit) {
    if (vaultName == "USDC") {
      user.totalDepositedUSDC = user.totalDepositedUSDC.plus(amount)
    } else if (vaultName == "cbBTC") {
      user.totalDepositedcbBTC = user.totalDepositedcbBTC.plus(amount)
    } else if (vaultName == "WETH") {
      user.totalDepositedWETH = user.totalDepositedWETH.plus(amount)
    }
    user.totalDeposited = user.totalDeposited.plus(amount)
  } else {
    if (vaultName == "USDC") {
      user.totalWithdrawnUSDC = user.totalWithdrawnUSDC.plus(amount)
    } else if (vaultName == "cbBTC") {
      user.totalWithdrawncbBTC = user.totalWithdrawncbBTC.plus(amount)
    } else if (vaultName == "WETH") {
      user.totalWithdrawnWETH = user.totalWithdrawnWETH.plus(amount)
    }
    user.totalWithdrawn = user.totalWithdrawn.plus(amount)
  }
}

// ===== TOKEN HELPER FUNCTIONS =====

function getOrCreateSeemToken(): SeemToken {
  let token = SeemToken.load(Bytes.fromHexString(SEEM_TOKEN))
  if (!token) {
    token = new SeemToken(Bytes.fromHexString(SEEM_TOKEN))
    token.name = "Seamless Protocol"
    token.symbol = "SEEM"
    token.decimals = 18
    token.totalSupply = BigInt.fromI32(0)
    token.totalHolders = 0
    token.createdAt = BigInt.fromI32(0)
    token.lastUpdatedAt = BigInt.fromI32(0)
  }
  return token
}

function getOrCreateTokenHolder(userAddress: Bytes): TokenHolder {
  let holder = TokenHolder.load(userAddress)
  if (!holder) {
    holder = new TokenHolder(userAddress)
    holder.token = Bytes.fromHexString(SEEM_TOKEN)
    holder.balance = BigInt.fromI32(0)
    holder.firstTransferAt = null
    holder.lastTransferAt = null
  }
  return holder
}

function updateTokenHolderBalance(holder: TokenHolder, newBalance: BigInt, blockTimestamp: BigInt): void {
  let wasZero = holder.balance.equals(BigInt.fromI32(0))
  let isNowZero = newBalance.equals(BigInt.fromI32(0))
  
  holder.balance = newBalance
  
  if (wasZero && !isNowZero) {
    // First time holding tokens
    holder.firstTransferAt = blockTimestamp
  }
  
  if (!isNowZero) {
    holder.lastTransferAt = blockTimestamp
  }
}

// ===== USDC VAULT HANDLERS =====

export function handleDepositUSDC(event: DepositEvent): void {
  let vaultName = getVaultName(USDC_VAULT)
  let user = getOrCreateUser(event.params.owner)
  let vault = getOrCreateVault(event.address)
  
  // Create deposit entity
  let deposit = new Deposit(event.transaction.hash.concatI32(event.logIndex.toI32()))
  deposit.user = user.id
  deposit.vault = vault.id
  deposit.vaultName = vaultName
  deposit.sender = event.params.sender
  deposit.owner = event.params.owner
  deposit.assets = event.params.assets
  deposit.shares = event.params.shares
  deposit.blockNumber = event.block.number
  deposit.blockTimestamp = event.block.timestamp
  deposit.transactionHash = event.transaction.hash
  
  // Update user totals
  updateUserTotals(user, vaultName, event.params.assets, true)
  user.firstDepositAt = event.block.timestamp
  user.lastActivityAt = event.block.timestamp
  
  // Update vault
  vault.totalAssets = vault.totalAssets.plus(event.params.assets)
  vault.totalSupply = vault.totalSupply.plus(event.params.shares)
  vault.lastUpdatedAt = event.block.timestamp
  
  // Save entities
  user.save()
  vault.save()
  deposit.save()
}

export function handleWithdrawUSDC(event: WithdrawEvent): void {
  let vaultName = getVaultName(USDC_VAULT)
  let user = getOrCreateUser(event.params.owner)
  let vault = getOrCreateVault(event.address)
  
  // Create withdrawal entity
  let withdrawal = new Withdrawal(event.transaction.hash.concatI32(event.logIndex.toI32()))
  withdrawal.user = user.id
  withdrawal.vault = vault.id
  withdrawal.vaultName = vaultName
  withdrawal.sender = event.params.sender
  withdrawal.receiver = event.params.receiver
  withdrawal.owner = event.params.owner
  withdrawal.assets = event.params.assets
  withdrawal.shares = event.params.shares
  withdrawal.blockNumber = event.block.number
  withdrawal.blockTimestamp = event.block.timestamp
  withdrawal.transactionHash = event.transaction.hash
  
  // Update user totals
  updateUserTotals(user, vaultName, event.params.assets, false)
  user.lastActivityAt = event.block.timestamp
  
  // Update vault
  vault.totalAssets = vault.totalAssets.minus(event.params.assets)
  vault.totalSupply = vault.totalSupply.minus(event.params.shares)
  vault.lastUpdatedAt = event.block.timestamp
  
  // Save entities
  user.save()
  vault.save()
  withdrawal.save()
}

export function handleTransferUSDC(event: TransferEvent): void {
  let vaultName = getVaultName(USDC_VAULT)
  let fromUser = getOrCreateUser(event.params.from)
  let toUser = getOrCreateUser(event.params.to)
  let vault = getOrCreateVault(event.address)
  
  // Create transfer entity
  let transfer = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
  transfer.vault = vault.id
  transfer.vaultName = vaultName
  transfer.from = fromUser.id
  transfer.to = toUser.id
  transfer.value = event.params.value
  transfer.blockNumber = event.block.number
  transfer.blockTimestamp = event.block.timestamp
  transfer.transactionHash = event.transaction.hash
  
  // Update user activity
  fromUser.lastActivityAt = event.block.timestamp
  toUser.lastActivityAt = event.block.timestamp
  
  // Save entities
  fromUser.save()
  toUser.save()
  vault.save()
  transfer.save()
}

export function handleAccrueInterestUSDC(event: AccrueInterestEvent): void {
  let vaultName = getVaultName(USDC_VAULT)
  let vault = getOrCreateVault(event.address)
  
  // Create accrue interest entity
  let accrueInterest = new AccrueInterest(event.transaction.hash.concatI32(event.logIndex.toI32()))
  accrueInterest.vault = vault.id
  accrueInterest.vaultName = vaultName
  accrueInterest.newTotalAssets = event.params.newTotalAssets
  accrueInterest.feeShares = event.params.feeShares
  accrueInterest.blockNumber = event.block.number
  accrueInterest.blockTimestamp = event.block.timestamp
  accrueInterest.transactionHash = event.transaction.hash
  
  // Update vault
  vault.totalAssets = event.params.newTotalAssets
  vault.lastUpdatedAt = event.block.timestamp
  
  // Save entities
  vault.save()
  accrueInterest.save()
}

// ===== cbBTC VAULT HANDLERS =====

export function handleDepositcbBTC(event: DepositEventcbBTC): void {
  let vaultName = getVaultName(cbbtc_VAULT)
  let user = getOrCreateUser(event.params.owner)
  let vault = getOrCreateVault(event.address)
  
  let deposit = new Deposit(event.transaction.hash.concatI32(event.logIndex.toI32()))
  deposit.user = user.id
  deposit.vault = vault.id
  deposit.vaultName = vaultName
  deposit.sender = event.params.sender
  deposit.owner = event.params.owner
  deposit.assets = event.params.assets
  deposit.shares = event.params.shares
  deposit.blockNumber = event.block.number
  deposit.blockTimestamp = event.block.timestamp
  deposit.transactionHash = event.transaction.hash
  
  updateUserTotals(user, vaultName, event.params.assets, true)
  user.firstDepositAt = event.block.timestamp
  user.lastActivityAt = event.block.timestamp
  
  vault.totalAssets = vault.totalAssets.plus(event.params.assets)
  vault.totalSupply = vault.totalSupply.plus(event.params.shares)
  vault.lastUpdatedAt = event.block.timestamp
  
  user.save()
  vault.save()
  deposit.save()
}

export function handleWithdrawcbBTC(event: WithdrawEventcbBTC): void {
  let vaultName = getVaultName(cbbtc_VAULT)
  let user = getOrCreateUser(event.params.owner)
  let vault = getOrCreateVault(event.address)
  
  let withdrawal = new Withdrawal(event.transaction.hash.concatI32(event.logIndex.toI32()))
  withdrawal.user = user.id
  withdrawal.vault = vault.id
  withdrawal.vaultName = vaultName
  withdrawal.sender = event.params.sender
  withdrawal.receiver = event.params.receiver
  withdrawal.owner = event.params.owner
  withdrawal.assets = event.params.assets
  withdrawal.shares = event.params.shares
  withdrawal.blockNumber = event.block.number
  withdrawal.blockTimestamp = event.block.timestamp
  withdrawal.transactionHash = event.transaction.hash
  
  updateUserTotals(user, vaultName, event.params.assets, false)
  user.lastActivityAt = event.block.timestamp
  
  vault.totalAssets = vault.totalAssets.minus(event.params.assets)
  vault.totalSupply = vault.totalSupply.minus(event.params.shares)
  vault.lastUpdatedAt = event.block.timestamp
  
  user.save()
  vault.save()
  withdrawal.save()
}

export function handleTransfercbBTC(event: TransferEventcbBTC): void {
  let vaultName = getVaultName(cbbtc_VAULT)
  let fromUser = getOrCreateUser(event.params.from)
  let toUser = getOrCreateUser(event.params.to)
  let vault = getOrCreateVault(event.address)
  
  let transfer = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
  transfer.vault = vault.id
  transfer.vaultName = vaultName
  transfer.from = fromUser.id
  transfer.to = toUser.id
  transfer.value = event.params.value
  transfer.blockNumber = event.block.number
  transfer.blockTimestamp = event.block.timestamp
  transfer.transactionHash = event.transaction.hash
  
  fromUser.lastActivityAt = event.block.timestamp
  toUser.lastActivityAt = event.block.timestamp
  
  fromUser.save()
  toUser.save()
  vault.save()
  transfer.save()
}

export function handleAccrueInterestcbBTC(event: AccrueInterestEventcbBTC): void {
  let vaultName = getVaultName(cbbtc_VAULT)
  let vault = getOrCreateVault(event.address)
  
  let accrueInterest = new AccrueInterest(event.transaction.hash.concatI32(event.logIndex.toI32()))
  accrueInterest.vault = vault.id
  accrueInterest.vaultName = vaultName
  accrueInterest.newTotalAssets = event.params.newTotalAssets
  accrueInterest.feeShares = event.params.feeShares
  accrueInterest.blockNumber = event.block.number
  accrueInterest.blockTimestamp = event.block.timestamp
  accrueInterest.transactionHash = event.transaction.hash
  
  vault.totalAssets = event.params.newTotalAssets
  vault.lastUpdatedAt = event.block.timestamp
  
  vault.save()
  accrueInterest.save()
}

// ===== WETH VAULT HANDLERS =====

export function handleDepositWETH(event: DepositEventWETH): void {
  let vaultName = getVaultName(WETH_VAULT)
  let user = getOrCreateUser(event.params.owner)
  let vault = getOrCreateVault(event.address)
  
  let deposit = new Deposit(event.transaction.hash.concatI32(event.logIndex.toI32()))
  deposit.user = user.id
  deposit.vault = vault.id
  deposit.vaultName = vaultName
  deposit.sender = event.params.sender
  deposit.owner = event.params.owner
  deposit.assets = event.params.assets
  deposit.shares = event.params.shares
  deposit.blockNumber = event.block.number
  deposit.blockTimestamp = event.block.timestamp
  deposit.transactionHash = event.transaction.hash
  
  updateUserTotals(user, vaultName, event.params.assets, true)
  user.firstDepositAt = event.block.timestamp
  user.lastActivityAt = event.block.timestamp
  
  vault.totalAssets = vault.totalAssets.plus(event.params.assets)
  vault.totalSupply = vault.totalSupply.plus(event.params.shares)
  vault.lastUpdatedAt = event.block.timestamp
  
  user.save()
  vault.save()
  deposit.save()
}

export function handleWithdrawWETH(event: WithdrawEventWETH): void {
  let vaultName = getVaultName(WETH_VAULT)
  let user = getOrCreateUser(event.params.owner)
  let vault = getOrCreateVault(event.address)
  
  let withdrawal = new Withdrawal(event.transaction.hash.concatI32(event.logIndex.toI32()))
  withdrawal.user = user.id
  withdrawal.vault = vault.id
  withdrawal.vaultName = vaultName
  withdrawal.sender = event.params.sender
  withdrawal.receiver = event.params.receiver
  withdrawal.owner = event.params.owner
  withdrawal.assets = event.params.assets
  withdrawal.shares = event.params.shares
  withdrawal.blockNumber = event.block.number
  withdrawal.blockTimestamp = event.block.timestamp
  withdrawal.transactionHash = event.transaction.hash
  
  updateUserTotals(user, vaultName, event.params.assets, false)
  user.lastActivityAt = event.block.timestamp
  
  vault.totalAssets = vault.totalAssets.minus(event.params.assets)
  vault.totalSupply = vault.totalSupply.minus(event.params.shares)
  vault.lastUpdatedAt = event.block.timestamp
  
  user.save()
  vault.save()
  withdrawal.save()
}

export function handleTransferWETH(event: TransferEventWETH): void {
  let vaultName = getVaultName(WETH_VAULT)
  let fromUser = getOrCreateUser(event.params.from)
  let toUser = getOrCreateUser(event.params.to)
  let vault = getOrCreateVault(event.address)
  
  let transfer = new Transfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
  transfer.vault = vault.id
  transfer.vaultName = vaultName
  transfer.from = fromUser.id
  transfer.to = toUser.id
  transfer.value = event.params.value
  transfer.blockNumber = event.block.number
  transfer.blockTimestamp = event.block.timestamp
  transfer.transactionHash = event.transaction.hash
  
  fromUser.lastActivityAt = event.block.timestamp
  toUser.lastActivityAt = event.block.timestamp
  
  fromUser.save()
  toUser.save()
  vault.save()
  transfer.save()
}

export function handleAccrueInterestWETH(event: AccrueInterestEventWETH): void {
  let vaultName = getVaultName(WETH_VAULT)
  let vault = getOrCreateVault(event.address)
  
  let accrueInterest = new AccrueInterest(event.transaction.hash.concatI32(event.logIndex.toI32()))
  accrueInterest.vault = vault.id
  accrueInterest.vaultName = vaultName
  accrueInterest.newTotalAssets = event.params.newTotalAssets
  accrueInterest.feeShares = event.params.feeShares
  accrueInterest.blockNumber = event.block.number
  accrueInterest.blockTimestamp = event.block.timestamp
  accrueInterest.transactionHash = event.transaction.hash
  
  vault.totalAssets = event.params.newTotalAssets
  vault.lastUpdatedAt = event.block.timestamp
  
  vault.save()
  accrueInterest.save()
}

// ===== SEEM TOKEN HANDLERS =====

export function handleTokenTransfer(event: TokenTransferEvent): void {
  let token = getOrCreateSeemToken()
  let fromHolder = getOrCreateTokenHolder(event.params.from)
  let toHolder = getOrCreateTokenHolder(event.params.to)
  
  // Create transfer entity
  let transfer = new TokenTransfer(event.transaction.hash.concatI32(event.logIndex.toI32()))
  transfer.token = token.id
  transfer.from = fromHolder.id
  transfer.to = toHolder.id
  transfer.value = event.params.value
  transfer.blockNumber = event.block.number
  transfer.blockTimestamp = event.block.timestamp
  transfer.transactionHash = event.transaction.hash
  
  // Update holder balances
  let fromBalance = fromHolder.balance.minus(event.params.value)
  let toBalance = toHolder.balance.plus(event.params.value)
  
  updateTokenHolderBalance(fromHolder, fromBalance, event.block.timestamp)
  updateTokenHolderBalance(toHolder, toBalance, event.block.timestamp)
  
  // Update token stats
  token.lastUpdatedAt = event.block.timestamp
  if (token.createdAt.equals(BigInt.fromI32(0))) {
    token.createdAt = event.block.timestamp
  }
  
  // Save entities
  token.save()
  fromHolder.save()
  toHolder.save()
  transfer.save()
}

export function handleTokenApproval(event: TokenApprovalEvent): void {
  let token = getOrCreateSeemToken()
  let owner = getOrCreateTokenHolder(event.params.owner)
  let spender = getOrCreateTokenHolder(event.params.spender)
  
  // Create approval entity
  let approval = new TokenApproval(event.transaction.hash.concatI32(event.logIndex.toI32()))
  approval.token = token.id
  approval.owner = owner.id
  approval.spender = spender.id
  approval.value = event.params.value
  approval.blockNumber = event.block.number
  approval.blockTimestamp = event.block.timestamp
  approval.transactionHash = event.transaction.hash
  
  // Update token stats
  token.lastUpdatedAt = event.block.timestamp
  if (token.createdAt.equals(BigInt.fromI32(0))) {
    token.createdAt = event.block.timestamp
  }
  
  // Save entities
  token.save()
  owner.save()
  spender.save()
  approval.save()
}