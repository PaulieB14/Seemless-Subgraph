import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { AccrueInterest } from "../generated/schema"
import { AccrueInterest as AccrueInterestEvent } from "../generated/SeamlessUSDCVault/SeamlessUSDCVault"
import { handleAccrueInterest } from "../src/seamless-usdc-vault"
import { createAccrueInterestEvent } from "./seamless-usdc-vault-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newTotalAssets = BigInt.fromI32(234)
    let feeShares = BigInt.fromI32(234)
    let newAccrueInterestEvent = createAccrueInterestEvent(
      newTotalAssets,
      feeShares
    )
    handleAccrueInterest(newAccrueInterestEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("AccrueInterest created and stored", () => {
    assert.entityCount("AccrueInterest", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AccrueInterest",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newTotalAssets",
      "234"
    )
    assert.fieldEquals(
      "AccrueInterest",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "feeShares",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
