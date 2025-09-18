# Seamless Protocol Subgraph

A comprehensive subgraph for tracking Seamless Protocol vault activities and SEEM token transfers on Base network.

## 🚀 Features

### Vault Tracking
- **USDC Vault** - Track deposits, withdrawals, and transfers
- **cbBTC Vault** - Monitor Bitcoin vault activities  
- **WETH Vault** - Track Ethereum vault operations
- **Interest Accrual** - Monitor fee collection and interest events

### SEEM Token Tracking
- **Token Transfers** - Track all SEEM token movements
- **Token Holders** - Monitor holder balances and activity
- **Token Approvals** - Track DEX interaction approvals
- **Token Metadata** - Name, symbol, decimals, total supply

### Analytics & Insights
- **User Activity** - Cross-vault user behavior analysis
- **Global Statistics** - Protocol-wide metrics and totals
- **Daily Snapshots** - Time-series data for analytics
- **Volume Tracking** - Deposit/withdrawal volume analysis

## 📊 Subgraph Schema

### Core Entities
- `User` - User activity across all vaults and token
- `Vault` - Vault metadata and statistics
- `SeemToken` - SEEM token information and stats
- `TokenHolder` - Individual token holder data

### Event Entities
- `Deposit` - Vault deposit events
- `Withdrawal` - Vault withdrawal events
- `Transfer` - Vault share transfers
- `TokenTransfer` - SEEM token transfers
- `TokenApproval` - SEEM token approvals
- `AccrueInterest` - Interest accrual events

### Analytics Entities
- `VaultDailySnapshot` - Daily vault statistics
- `UserDailySnapshot` - Daily user activity
- `GlobalStats` - Protocol-wide metrics

## 🔧 Contract Addresses

### Vaults (Base Network)
- **USDC Vault**: `0x616a4E1db48e22028f6bbf20444Cd3b8e3273738`
- **cbBTC Vault**: `0x5a47C803488FE2BB0A0EAaf346b420e4dF22F3C7`
- **WETH Vault**: `0x27d8c7273fd3fcc6956a0b370ce5fd4a7fc65c18`

### Token (Base Network)
- **SEEM Token**: `0x1C7a460413dD4e964f96D8dFC56E7223cE88CD85`

## 🌐 Query Endpoint

```
https://api.studio.thegraph.com/query/111767/seemless-protocol/0.12.0
```

## 📈 Example Queries

### Get Vault Data
```graphql
{
  vaults {
    id
    name
    symbol
    totalAssets
    totalSupply
    lastUpdatedAt
  }
}
```

### Get SEEM Token Data
```graphql
{
  seemTokens {
    id
    name
    symbol
    totalSupply
    totalHolders
    lastUpdatedAt
  }
}
```

### Get User Activity
```graphql
{
  users(first: 10) {
    id
    totalDeposited
    totalWithdrawn
    lastActivityAt
  }
}
```

### Get Recent Transfers
```graphql
{
  tokenTransfers(first: 10, orderBy: blockTimestamp, orderDirection: desc) {
    id
    value
    blockTimestamp
    transactionHash
  }
}
```

## 🛠️ Development

### Prerequisites
- Node.js 16+
- Yarn
- Graph CLI

### Setup
```bash
# Install dependencies
yarn install

# Generate types
yarn codegen

# Build subgraph
yarn build

# Deploy to Studio
yarn deploy
```

### Local Development
```bash
# Start local Graph Node
docker-compose up

# Deploy locally
graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 seemless-protocol
```

## 📊 Key Metrics Tracked

### Vault Metrics
- Total assets and supply per vault
- Daily deposit/withdrawal volumes
- Unique user counts
- Interest accrual events

### Token Metrics
- Total supply and holder count
- Transfer volume and frequency
- Approval events for DEX interactions
- Holder distribution and activity

### User Metrics
- Cross-vault deposit/withdrawal totals
- First and last activity timestamps
- Vault-specific activity breakdowns

## 🔍 Use Cases

### For Developers
- Monitor vault performance and TVL
- Track user engagement and retention
- Analyze token distribution patterns

### For Analysts
- Study protocol adoption trends
- Monitor fee collection efficiency
- Track cross-vault user behavior

### For Users
- View personal vault activity
- Monitor SEEM token holdings
- Track protocol participation

## 📝 Version History

- **v0.12.0** - Added SEEM token tracking
- **v0.11.0** - Enhanced vault analytics
- **v0.10.0** - Initial vault tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- Seamless Protocol team
- The Graph Protocol
- Base network community
