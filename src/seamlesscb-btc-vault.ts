import {
  AccrueInterest as AccrueInterestEvent,
  Approval as ApprovalEvent,
  Deposit as DepositEvent,
  EIP712DomainChanged as EIP712DomainChangedEvent,
  OwnershipTransferStarted as OwnershipTransferStartedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  ReallocateSupply as ReallocateSupplyEvent,
  ReallocateWithdraw as ReallocateWithdrawEvent,
  RevokePendingCap as RevokePendingCapEvent,
  RevokePendingGuardian as RevokePendingGuardianEvent,
  RevokePendingMarketRemoval as RevokePendingMarketRemovalEvent,
  RevokePendingTimelock as RevokePendingTimelockEvent,
  SetCap as SetCapEvent,
  SetCurator as SetCuratorEvent,
  SetFee as SetFeeEvent,
  SetFeeRecipient as SetFeeRecipientEvent,
  SetGuardian as SetGuardianEvent,
  SetIsAllocator as SetIsAllocatorEvent,
  SetName as SetNameEvent,
  SetSkimRecipient as SetSkimRecipientEvent,
  SetSupplyQueue as SetSupplyQueueEvent,
  SetSymbol as SetSymbolEvent,
  SetTimelock as SetTimelockEvent,
  SetWithdrawQueue as SetWithdrawQueueEvent,
  Skim as SkimEvent,
  SubmitCap as SubmitCapEvent,
  SubmitGuardian as SubmitGuardianEvent,
  SubmitMarketRemoval as SubmitMarketRemovalEvent,
  SubmitTimelock as SubmitTimelockEvent,
  Transfer as TransferEvent,
  UpdateLastTotalAssets as UpdateLastTotalAssetsEvent,
  UpdateLostAssets as UpdateLostAssetsEvent,
  Withdraw as WithdrawEvent,
} from "../generated/SeamlesscbBTCVault/SeamlesscbBTCVault"
import {
  AccrueInterest,
  Approval,
  Deposit,
  EIP712DomainChanged,
  OwnershipTransferStarted,
  OwnershipTransferred,
  ReallocateSupply,
  ReallocateWithdraw,
  RevokePendingCap,
  RevokePendingGuardian,
  RevokePendingMarketRemoval,
  RevokePendingTimelock,
  SetCap,
  SetCurator,
  SetFee,
  SetFeeRecipient,
  SetGuardian,
  SetIsAllocator,
  SetName,
  SetSkimRecipient,
  SetSupplyQueue,
  SetSymbol,
  SetTimelock,
  SetWithdrawQueue,
  Skim,
  SubmitCap,
  SubmitGuardian,
  SubmitMarketRemoval,
  SubmitTimelock,
  Transfer,
  UpdateLastTotalAssets,
  UpdateLostAssets,
  Withdraw,
} from "../generated/schema"

export function handleAccrueInterest(event: AccrueInterestEvent): void {
  let entity = new AccrueInterest(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newTotalAssets = event.params.newTotalAssets
  entity.feeShares = event.params.feeShares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sender = event.params.sender
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEIP712DomainChanged(
  event: EIP712DomainChangedEvent,
): void {
  let entity = new EIP712DomainChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferStarted(
  event: OwnershipTransferStartedEvent,
): void {
  let entity = new OwnershipTransferStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent,
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReallocateSupply(event: ReallocateSupplyEvent): void {
  let entity = new ReallocateSupply(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.internal_id = event.params.id
  entity.suppliedAssets = event.params.suppliedAssets
  entity.suppliedShares = event.params.suppliedShares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReallocateWithdraw(event: ReallocateWithdrawEvent): void {
  let entity = new ReallocateWithdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.internal_id = event.params.id
  entity.withdrawnAssets = event.params.withdrawnAssets
  entity.withdrawnShares = event.params.withdrawnShares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRevokePendingCap(event: RevokePendingCapEvent): void {
  let entity = new RevokePendingCap(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRevokePendingGuardian(
  event: RevokePendingGuardianEvent,
): void {
  let entity = new RevokePendingGuardian(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRevokePendingMarketRemoval(
  event: RevokePendingMarketRemovalEvent,
): void {
  let entity = new RevokePendingMarketRemoval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRevokePendingTimelock(
  event: RevokePendingTimelockEvent,
): void {
  let entity = new RevokePendingTimelock(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetCap(event: SetCapEvent): void {
  let entity = new SetCap(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.internal_id = event.params.id
  entity.cap = event.params.cap

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetCurator(event: SetCuratorEvent): void {
  let entity = new SetCurator(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newCurator = event.params.newCurator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetFee(event: SetFeeEvent): void {
  let entity = new SetFee(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.newFee = event.params.newFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetFeeRecipient(event: SetFeeRecipientEvent): void {
  let entity = new SetFeeRecipient(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newFeeRecipient = event.params.newFeeRecipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetGuardian(event: SetGuardianEvent): void {
  let entity = new SetGuardian(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.guardian = event.params.guardian

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetIsAllocator(event: SetIsAllocatorEvent): void {
  let entity = new SetIsAllocator(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.allocator = event.params.allocator
  entity.isAllocator = event.params.isAllocator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetName(event: SetNameEvent): void {
  let entity = new SetName(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.name = event.params.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetSkimRecipient(event: SetSkimRecipientEvent): void {
  let entity = new SetSkimRecipient(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newSkimRecipient = event.params.newSkimRecipient

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetSupplyQueue(event: SetSupplyQueueEvent): void {
  let entity = new SetSupplyQueue(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.newSupplyQueue = event.params.newSupplyQueue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetSymbol(event: SetSymbolEvent): void {
  let entity = new SetSymbol(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.symbol = event.params.symbol

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetTimelock(event: SetTimelockEvent): void {
  let entity = new SetTimelock(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.newTimelock = event.params.newTimelock

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSetWithdrawQueue(event: SetWithdrawQueueEvent): void {
  let entity = new SetWithdrawQueue(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.newWithdrawQueue = event.params.newWithdrawQueue

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSkim(event: SkimEvent): void {
  let entity = new Skim(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.token = event.params.token
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitCap(event: SubmitCapEvent): void {
  let entity = new SubmitCap(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.internal_id = event.params.id
  entity.cap = event.params.cap

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitGuardian(event: SubmitGuardianEvent): void {
  let entity = new SubmitGuardian(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newGuardian = event.params.newGuardian

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitMarketRemoval(
  event: SubmitMarketRemovalEvent,
): void {
  let entity = new SubmitMarketRemoval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.caller = event.params.caller
  entity.internal_id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubmitTimelock(event: SubmitTimelockEvent): void {
  let entity = new SubmitTimelock(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newTimelock = event.params.newTimelock

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateLastTotalAssets(
  event: UpdateLastTotalAssetsEvent,
): void {
  let entity = new UpdateLastTotalAssets(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.updatedTotalAssets = event.params.updatedTotalAssets

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpdateLostAssets(event: UpdateLostAssetsEvent): void {
  let entity = new UpdateLostAssets(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newLostAssets = event.params.newLostAssets

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.sender = event.params.sender
  entity.receiver = event.params.receiver
  entity.owner = event.params.owner
  entity.assets = event.params.assets
  entity.shares = event.params.shares

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
