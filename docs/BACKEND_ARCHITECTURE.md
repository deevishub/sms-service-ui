# SMS Platform — Backend Architecture & Service Design (Phase 1)

> This document extends [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) and focuses on the **Go backend monorepo** implementation.

---

## Overview

The backend is a **Go monorepo** with ~10 microservices sharing common packages. **Phase 1 simplifies the design** by using HTTP provider APIs (MSG91/Gupshup) instead of direct SMPP connections.

### Key Change from Original Design

- ~~SMPP Gateway~~ → **Provider Service** (HTTP clients for MSG91/Gupshup)
- ~~DLT template matching engine~~ → **Metadata validation** (we just pass PE ID, Sender ID, Template ID to upstream)
- No direct SMPP until Phase 3+

---

## Repository Structure: `sms-platform/`

```
sms-platform/
├── services/                          # All microservices in Go
│   ├── api-gateway/                   # HTTP API entry point
│   │   ├── cmd/server/main.go
│   │   ├── internal/handler/          # HTTP handlers
│   │   ├── internal/middleware/       # Auth, rate limiting
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── auth-service/                  # JWT, API keys, users, RBAC
│   │   ├── cmd/server/main.go
│   │   ├── internal/handler/
│   │   ├── internal/repository/       # DB access
│   │   ├── internal/service/          # Business logic
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── message-service/               # Core SMS validation & enqueuing
│   │   ├── cmd/server/main.go
│   │   ├── internal/handler/
│   │   │   ├── send_sms.go            # POST /v1/sms/send
│   │   │   ├── send_bulk.go           # POST /v1/sms/bulk
│   │   │   └── get_status.go          # GET /v1/sms/:id
│   │   ├── internal/service/
│   │   │   ├── validator.go           # Phone format, sender ID check
│   │   │   ├── enricher.go            # Add UUID, detect encoding
│   │   │   ├── dlt_validator.go       # Check PE ID, Template ID exist
│   │   │   └── producer.go            # Produce to BullMQ/Kafka
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── provider-service/              # HTTP clients for MSG91, Gupshup [NEW]
│   │   ├── cmd/server/main.go
│   │   ├── internal/client/
│   │   │   ├── msg91_client.go        # HTTP client for MSG91 API
│   │   │   ├── gupshup_client.go      # HTTP client for Gupshup API
│   │   │   ├── types.go               # Shared request/response types
│   │   │   └── errors.go              # Error handling & mapping
│   │   ├── internal/manager/
│   │   │   ├── failover.go            # Provider selection & failover
│   │   │   ├── health_check.go        # Provider health monitoring
│   │   │   └── circuit_breaker.go     # Circuit breaker pattern
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── worker-service/                # Kafka/BullMQ consumer
│   │   ├── cmd/worker/main.go
│   │   ├── internal/consumer/
│   │   │   ├── high_priority.go       # OTP/Transactional
│   │   │   ├── normal_priority.go     # Service messages
│   │   │   └── bulk_priority.go       # Campaigns
│   │   ├── internal/processor/
│   │   │   ├── dlt_metadata.go        # Validate metadata only
│   │   │   ├── rate_limiter.go        # Per-account/provider limits
│   │   │   └── provider_dispatcher.go # Call provider-service
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── webhook-service/               # DLR callback dispatch
│   │   ├── cmd/server/main.go
│   │   ├── internal/handler/
│   │   │   ├── msg91_webhook.go       # Parse MSG91 DLR webhook
│   │   │   ├── gupshup_webhook.go     # Parse Gupshup DLR webhook
│   │   │   └── dlr_processor.go       # Update DB + customer webhook
│   │   ├── internal/dispatcher/       # HTTP dispatch to customer URL
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── billing-service/               # Wallet, Razorpay, invoices, GST
│   │   ├── cmd/server/main.go
│   │   ├── internal/handler/
│   │   │   ├── balance.go             # GET wallet balance
│   │   │   ├── recharge.go            # POST top-up
│   │   │   └── transactions.go        # GET ledger
│   │   ├── internal/service/
│   │   │   ├── wallet.go              # Balance operations
│   │   │   ├── razorpay.go            # Razorpay integration
│   │   │   └── invoice_generator.go   # Monthly invoices
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── campaign-service/              # Bulk SMS, CSV, scheduling
│   │   ├── cmd/server/main.go
│   │   ├── internal/handler/
│   │   │   ├── campaign_crud.go
│   │   │   └── progress.go
│   │   ├── internal/service/
│   │   │   ├── parser.go              # CSV parsing & validation
│   │   │   ├── scheduler.go           # Cron-based scheduling
│   │   │   └── dispatcher.go          # Batch to worker
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── dlt-service/                   # DLT metadata store (simplified)
│   │   ├── cmd/server/main.go
│   │   ├── internal/handler/
│   │   │   ├── pe_id.go               # Entity ID management
│   │   │   ├── sender_id.go           # Sender ID CRUD
│   │   │   └── template.go            # Template CRUD
│   │   ├── internal/service/
│   │   │   └── validator.go           # Just stores & checks existence
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── admin-service/                 # Internal: accounts, provider config [NEW]
│   │   ├── cmd/server/main.go
│   │   ├── internal/handler/
│   │   │   ├── accounts.go
│   │   │   ├── providers.go
│   │   │   └── pricing.go
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   └── notification-service/          # Email alerts, internal comms
│       ├── cmd/server/main.go
│       ├── internal/sender/
│       │   └── aws_ses.go
│       ├── go.mod
│       └── Dockerfile
│
├── pkg/                               # Shared Go packages across services
│   ├── database/
│   │   ├── postgres.go                # PostgreSQL client, connection pool
│   │   ├── migrations.go              # SQL schema management
│   │   └── transaction.go
│   │
│   ├── queue/
│   │   ├── bullmq.go                  # Redis BullMQ queues (Phase 1)
│   │   ├── kafka.go                   # Kafka producer/consumer (Phase 2+)
│   │   └── config.go
│   │
│   ├── cache/
│   │   ├── redis.go                   # Redis client wrapper
│   │   ├── rate_limiter.go            # Token bucket implementation
│   │   └── ttl.go
│   │
│   ├── auth/
│   │   ├── jwt.go                     # JWT sign/verify
│   │   ├── api_key.go                 # API key validation
│   │   └── rbac.go                    # Role-based access control
│   │
│   ├── models/
│   │   ├── message.go
│   │   ├── account.go
│   │   ├── user.go
│   │   └── dlr.go
│   │
│   ├── errors/
│   │   ├── codes.go                   # Standard error codes
│   │   ├── response.go                # Standardized error responses
│   │   └── mapping.go                 # Provider error → platform error
│   │
│   ├── logger/
│   │   └── logger.go                  # Structured logging (zap/zerolog)
│   │
│   ├── config/
│   │   └── config.go                  # Env loading, viper configuration
│   │
│   ├── middleware/
│   │   ├── auth.go                    # Auth middleware
│   │   ├── logging.go                 # Request logging
│   │   └── error_handler.go           # Global error handler
│   │
│   └── types/
│       ├── context.go                 # Custom context types
│       └── request_id.go              # Request tracing
│
├── sdks/                              # Client SDKs for customers
│   ├── node/
│   │   ├── package.json
│   │   ├── src/
│   │   ├── README.md
│   │   └── examples/
│   │
│   ├── python/
│   │   ├── setup.py
│   │   ├── sms_platform/
│   │   ├── examples/
│   │   └── README.md
│   │
│   ├── go/                            # Go client for internal use
│   │   └── client.go
│   │
│   └── curl-examples/                 # cURL examples for quick testing
│       ├── send_sms.sh
│       ├── create_api_key.sh
│       └── get_balance.sh
│
├── infrastructure/
│   ├── docker/
│   │   └── Dockerfile.* (per service)
│   │
│   ├── docker-compose.yml             # Local dev: Postgres, Redis, BullMQ
│   │
│   ├── kubernetes/
│   │   └── helm/
│   │       ├── values.yaml
│   │       ├── templates/
│   │       └── Chart.yaml
│   │
│   └── terraform/
│       ├── main.tf                    # AWS ECS/App Runner (Phase 1) or EKS (Phase 2)
│       ├── database.tf                # RDS PostgreSQL
│       ├── cache.tf                   # ElastiCache Redis
│       ├── queue.tf                   # BullMQ on Redis or MSK (Phase 2)
│       └── secrets.tf                 # Secrets Manager
│
├── docs/
│   ├── api/
│   │   ├── openapi.yaml               # OpenAPI 3.0 spec (source of truth)
│   │   └── examples/
│   │
│   ├── guides/
│   │   ├── quickstart.md
│   │   ├── authentication.md
│   │   ├── dlt_integration.md
│   │   └── webhooks.md
│   │
│   └── architecture/
│       ├── overview.md
│       ├── provider_abstraction.md
│       └── message_flow.md
│
├── tests/
│   ├── integration/
│   │   ├── test_send_sms.go
│   │   ├── test_webhook.go
│   │   └── fixtures/
│   │
│   ├── load/
│   │   ├── k6_script.js               # k6 load testing
│   │   └── README.md
│   │
│   └── e2e/
│       └── README.md
│
├── go.work                            # Go workspace file (multi-module)
├── Makefile                           # Build, test, run commands
├── docker-compose.yml                 # Local dev environment
├── CONTRIBUTING.md
└── README.md
```

---

## Phase 1 Service Interactions

```
CLIENT (REST API / Dashboard)
       │
       ▼
┌──────────────────┐
│  API Gateway     │  ← Rate limit 100 req/sec per API key
│  (Go / Gin/Chi)  │  ← Auth: JWT or API Key+Secret
└────────┬─────────┘
         │
    ┌────┴────┬────────┬──────────┬──────────┐
    │         │        │          │          │
    ▼         ▼        ▼          ▼          ▼
  Auth     Message  Campaign  Billing   DLT
  Svc      Svc      Svc       Svc      Svc
   │        │        │         │        │
   │        └────┬───┴────┬────┘        │
   │             │        │            │
   │             ▼        ▼            │
   │        BullMQ Queues              │
   │        (Redis-backed)             │
   │             │                     │
   │             ▼                     │
   │        ┌──────────────┐          │
   │        │ Worker Svc   │←─────────┘
   │        │ (Consumers)  │
   │        └──────┬───────┘
   │               │
   │               ▼
   │        ┌─────────────────┐
   │        │ Provider Service│
   │        │ • MSG91 client  │
   │        │ • Gupshup client│
   │        └────────┬────────┘
   │                 │
   │                 ▼
   │          Upstream APIs
   │          (MSG91, Gupshup)
   │                 │
   │                 ▼
   │          Telecom Operators
   │          (Jio, Airtel, Vi, BSNL)
   │
   ├─→ PostgreSQL (accounts, users, api_keys, templates, etc.)
   │
   ├─→ Redis (rate limit tokens, sessions, OTP cache)
   │
   └─→ Webhook Service ←─ DLR callbacks from Provider Service
        (Dispatches to customer URL)
```

---

## Key Design Decisions (Phase 1)

### 1. No Direct SMPP in Phase 1

- All SMS go through **HTTP provider APIs** (MSG91, Gupshup)
- Simplifies deployment: no SMPP certificate management, no operator agreements needed
- Faster to market

### 2. Queue: BullMQ (Redis) not Kafka

- **Phase 1**: Redis BullMQ (simpler, lower overhead)
- **Phase 2+**: Kafka MSK (when we hit 5M+ msgs/month)
- Same consumer code; just swap the queue implementation

### 3. Database: PostgreSQL only (no ScyllaDB)

- **Phase 1**: PostgreSQL with partitioned `messages` table
- **Phase 2**: Add ScyllaDB for high-write scenarios (1M+ msgs/day)

### 4. Auth: API Key + Secret (HMAC) + JWT

- **API**: `X-API-Key: ak_live_xxx` + `X-API-Secret: sk_live_xxx` (HMAC-SHA256 signature)
- **Dashboard**: JWT (access + refresh tokens)
- **Internal**: mTLS in K8s pods

### 5. Provider Abstraction Layer

**NOT** direct SMPP. Instead, each provider has:

- HTTP client (with retries, backoff)
- Health checker (latency, error rate)
- Circuit breaker (auto-fallback on failure)

```go
interface ProviderClient {
    SendSMS(ctx, message) error        // HTTP POST to provider
    ParseDLRWebhook(body) (DLR, error) // Parse webhook payload
    HealthCheck() HealthStatus         // Check provider status
}
```

---

## PostgreSQL Schema (Phase 1)

```sql
-- Customers / Accounts
CREATE TABLE accounts (
    id UUID PRIMARY KEY,
    company_name VARCHAR(255),
    entity_id VARCHAR(50),            -- DLT PE ID
    plan VARCHAR(20),                  -- starter/growth/business
    status VARCHAR(20),                -- active/suspended
    created_at TIMESTAMPTZ
);

CREATE TABLE users (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts,
    email VARCHAR UNIQUE,
    password_hash VARCHAR,
    role VARCHAR,                      -- owner/admin/member/viewer
    created_at TIMESTAMPTZ
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts,
    key_id VARCHAR UNIQUE,             -- Public: ak_live_xxx
    key_hash VARCHAR,                  -- HMAC hash of secret
    rate_limit INT DEFAULT 100,
    created_at TIMESTAMPTZ
);

-- DLT Metadata
CREATE TABLE sender_ids (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts,
    sender_id VARCHAR,                 -- e.g., TD-MYBANK
    category VARCHAR,                  -- transactional/promotional
    dlt_status VARCHAR,                -- pending/approved
    created_at TIMESTAMPTZ
);

CREATE TABLE templates (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts,
    template_name VARCHAR,
    template_body TEXT,
    dlt_template_id VARCHAR,           -- From DLT Platform
    category VARCHAR,
    dlt_status VARCHAR,
    created_at TIMESTAMPTZ
);

-- Messages (partitioned by account_id + date)
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    account_id UUID,
    date DATE,                         -- For partitioning
    to_number VARCHAR,
    sender_id_id UUID REFERENCES sender_ids,
    message_body TEXT,
    template_id UUID REFERENCES templates,
    message_type VARCHAR,              -- transactional/promotional
    encoding VARCHAR,                  -- gsm7/ucs2
    segment_count INT,
    status VARCHAR,                    -- queued/submitted/delivered/failed
    provider VARCHAR,                  -- msg91/gupshup
    provider_message_id VARCHAR,       -- From provider
    error_code VARCHAR,
    cost DECIMAL,
    created_at TIMESTAMPTZ,
    submitted_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ
) PARTITION BY RANGE (date);

-- Wallets
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    account_id UUID UNIQUE REFERENCES accounts,
    balance DECIMAL,
    reserved DECIMAL,                  -- For in-flight messages
    updated_at TIMESTAMPTZ
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts,
    type VARCHAR,                      -- credit/debit/refund
    amount DECIMAL,
    balance_after DECIMAL,
    reference_type VARCHAR,            -- payment/sms/refund
    created_at TIMESTAMPTZ
);

-- Webhooks
CREATE TABLE webhook_configs (
    id UUID PRIMARY KEY,
    account_id UUID REFERENCES accounts,
    url VARCHAR,
    secret VARCHAR,                    -- For HMAC signing
    events JSONB,                      -- ['message.status', ...]
    is_active BOOLEAN,
    created_at TIMESTAMPTZ
);
```

---

## Provider Abstraction (New in Phase 1)

```go
// pkg/providers/interface.go
package providers

type Client interface {
    // Send message via provider
    SendSMS(ctx context.Context, msg *Message) (*ProviderResponse, error)

    // Parse incoming DLR webhook
    ParseDLRWebhook(body []byte) (*DLR, error)

    // Health check
    GetHealth(ctx context.Context) *Health
}

type Message struct {
    To         string // E.164 format
    SenderId   string // e.g., TD-MYBANK
    Body       string
    TemplateId string // DLT template ID
    PeId       string // DLT entity ID
    Metadata   map[string]string
}

type ProviderResponse struct {
    MessageId   string // Provider-assigned ID
    Status      string // accepted/rejected/queued
    ErrorCode   string
    ErrorDesc   string
    Cost        float64
}

type DLR struct {
    MessageId string // Map back to platform message_id
    Status    string // DELIVRD/FAILED/PENDING
    Timestamp time.Time
}

// services/provider-service/internal/client/msg91.go
type MSG91Client struct {
    apiKey    string
    httpClient  *http.Client
}

func (c *MSG91Client) SendSMS(ctx context.Context, msg *Message) (*ProviderResponse, error) {
    // POST https://api.msg91.com/api/v5/send?
    // params: {authkey, route, sender, message, mobiles, template_id, pe_id, ...}

    // Make HTTP request, parse response, return ProviderResponse
}

func (c *MSG91Client) ParseDLRWebhook(body []byte) (*DLR, error) {
    // MSG91 sends: "message_id=<id>&status=<status>&timestamp=<ts>"
    // Parse, return DLR
}
```

---

## Message Flow (End-to-End, Phase 1)

1. **Customer sends SMS via API**

   - `POST /v1/sms/send` to api-gateway
   - API Gateway validates JWT/API Key
   - Rate limiter checks quota

2. **Message Service validates**

   - Checks: phone format, sender ID exists, template ID exists
   - Enriches: adds UUID, detects encoding (GSM-7 vs UCS-2), counts segments
   - Billing pre-check: wallet balance sufficient?
   - Produces to BullMQ queue: `sms:outbound:{priority}`

3. **Worker Service consumes**

   - Pulls from BullMQ: `sms:outbound:high` (OTP), `normal`, `bulk` (campaigns)
   - For each message:
     - DLT metadata validation (PE ID, Sender ID, Template ID exist)
     - Rate limit per account/per provider
     - Call **Provider Service** to dispatch

4. **Provider Service (NEW)**

   - Route selection logic: which provider to use?
   - Currently: always MSG91 (Phase 1); failover to Gupshup if MSG91 fails
   - Calls `MSG91Client.SendSMS()` → HTTP POST to MSG91 API
   - Gets back provider message ID + status
   - Updates message DB: status = `submitted`, provider_message_id = `<id from MSG91>`
   - Returns success/error to worker

5. **Provider (MSG91) sends to operators**

   - Queues at Jio/Airtel/Vi/BSNL
   - Delivers to handset
   - Generates DLR (Delivery Report)

6. **DLR comes back to platform**

   - MSG91 webhooks to platform: `POST /v1/webhooks/msg91/dlr`
   - Webhook Service receives, parses status (DELIVRD / FAILED / PENDING)
   - Updates message DB: status = `delivered` | `failed`, delivered_at = <timestamp>
   - Reserves wallet credit: does wallet balance need adjustment?
   - If customer configured webhook: dispatch to customer URL with signature

7. **Customer receives updates**
   - DLR webhook: `POST <customer_webhook_url>` with {message_id, status, delivered_at}
   - Dashboard: real-time message status in logs

---

## Deployment (Phase 1)

**NOT Kubernetes yet.** Use AWS ECS Fargate (simpler):

```
AWS ECS on Fargate:
├── api-gateway (2 replicas)
├── message-service (2 replicas)
├── worker-service (2 replicas, auto-scale on BullMQ depth)
├── webhook-service (2 replicas)
├── billing-service (1 replica)
├── campaign-service (1 replica)
├── dlt-service (1 replica)
├── auth-service (1 replica)
└── provider-service (1 replica, stateless)

Data:
├── RDS PostgreSQL (db.t3.micro → db.r6g.large as scale)
└── ElastiCache Redis (cache.t3.micro → cache.r6g.large for BullMQ queues + cache)
```

**Docker Compose (local dev):**

```bash
docker-compose up
# Starts: postgres, redis, all services
```

**Local dev:**

```bash
go run ./services/api-gateway/cmd/server/main.go
go run ./services/message-service/cmd/server/main.go
# ... each service in separate terminal
```

---

## Configuration (Env Vars)

```bash
# Database
DATABASE_URL=postgres://user:pass@localhost/sms_platform

# Cache
REDIS_URL=redis://localhost:6379

# Queue
QUEUE_DRIVER=bullmq  # Phase 1; switch to kafka for Phase 2
BULLMQ_REDIS_URL=redis://localhost:6379

# Providers
PROVIDER_MSG91_API_KEY=xxxxx
PROVIDER_MSG91_PRIORITY=1           # Lower = higher priority
PROVIDER_MSG91_RATE_LIMIT=8500      # msgs/sec
PROVIDER_GUPSHUP_API_KEY=xxxxx
PROVIDER_GUPSHUP_PRIORITY=2
PROVIDER_GUPSHUP_RATE_LIMIT=3000

# Billing
RAZORPAY_KEY_ID=rzp_xxx
RAZORPAY_KEY_SECRET=xxxxx

# Server
API_GATEWAY_PORT=8080
AUTH_SERVICE_PORT=8081
...

# JWT
JWT_SECRET=very_secret_key
JWT_EXPIRY=15m

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

---

## Testing

**Unit tests:**

```bash
go test ./...
```

**Integration tests:**

```bash
docker-compose -f docker-compose.test.yml up
go test -tags=integration ./tests/integration/...
```

**Load testing (k6):**

```bash
k6 run tests/load/k6_script.js
```

---

## Next Steps (Implementation)

1. ✅ Create Go module structure (`go.mod` per service)
2. ✅ Implement auth-service (JWT + API key management)
3. ✅ Implement message-service (validation + producer)
4. ✅ Implement provider-service (MSG91 + Gupshup HTTP clients)
5. ✅ Implement worker-service (consumer + dispatcher)
6. ✅ Implement webhook-service (DLR parser + customer dispatch)
7. ✅ Implement billing-service (wallet + Razorpay)
8. ✅ Wire it all together + local Docker Compose
9. ✅ Deploy to AWS ECS
10. ⏳ Add SDKs (Node.js, Python)
