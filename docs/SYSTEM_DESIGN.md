# 📱 SMS Service Platform - System Design Document

## _A robust and scalable SMS Service application_

---

## Table of Contents

1. [Introduction & Overview](#1-introduction--overview)
2. [Key Concepts & Terminology](#2-key-concepts--terminology)
3. [India-Specific Regulatory Requirements](#3-india-specific-regulatory-requirements)
4. [High-Level Architecture](#4-high-level-architecture)
5. [Detailed Component Design](#5-detailed-component-design)
6. [Database Design](#6-database-design)
7. [API Design](#7-api-design)
8. [Message Lifecycle](#8-message-lifecycle)
9. [Scalability & Performance](#9-scalability--performance)
10. [Security Architecture](#10-security-architecture)
11. [Monitoring & Observability](#11-monitoring--observability)
12. [Technology Stack](#12-technology-stack)
13. [Infrastructure & Deployment](#13-infrastructure--deployment)
14. [Cost Estimation Model](#14-cost-estimation-model)
15. [Development Roadmap](#15-development-roadmap)
16. [Inbound SMS (2-Way Messaging)](#16-inbound-sms-2-way-messaging)
17. [OTP-as-a-Service](#17-otp-as-a-service)
18. [WhatsApp Business Integration Strategy](#18-whatsapp-business-integration-strategy)
19. [Disaster Recovery & Business Continuity](#19-disaster-recovery--business-continuity)
20. [Roadmap Visual Timeline](#20-roadmap-visual-timeline)

---

## 1. Introduction & Overview

### What We're Building

A cloud communication platform that allows businesses to send transactional, promotional, and OTP SMS messages via simple REST APIs or a web dashboard.

### Goals

- **For Developers**: Simple REST APIs, SDKs in multiple languages, webhook callbacks, and comprehensive documentation.
- **For Business Users**: A self-service dashboard with campaign management, analytics, template management, and billing.
- **For Operations**: Real-time monitoring, multi-operator routing, automatic failover, and DLT compliance.

### Target Market

- Indian startups and enterprises needing programmatic SMS (OTPs, alerts, notifications).
- Marketing teams running bulk promotional campaigns.
- SaaS platforms embedding SMS into their products (white-label potential).

### Competitive Positioning

**Note:** Phase 1 (Months 1–6) operates as a **reseller** via upstream HTTP providers (MSG91/Gupshup). Phase 3+ becomes an **aggregator** with direct SMPP to operators.

```
┌──────────────────────┬─────────────────────┬───────────┬──────────────┬──────────────┐
│ Feature              │ Phase 1 (Reseller)  │ Twilio    │ MSG91        │ Gupshup      │
├──────────────────────┼─────────────────────┼───────────┼──────────────┼──────────────┤
│ India DLT Native     │ ✅ Built-in         │ ❌ Addon  │ ✅ Built-in  │ ✅ Built-in  │
│ SMPP Direct Connect  │ ⏳ Phase 3+         │ ❌        │ ❌           │ ✅           │
│ HTTP API to Provider │ ✅ Phase 1          │ ❌        │ ✅ Upstream  │ ✅ Upstream  │
│ Sub-second Latency   │ ✅ <200ms*          │ ~500ms    │ ~400ms       │ ~300ms       │
│ Transparent Pricing  │ ✅ Cost-plus model  │ ❌ Markup │ ⚠️ Tiered    │ ⚠️ Tiered    │
│ Self-hosted Option   │ ✅ Phase 3+         │ ❌        │ ❌           │ ❌           │
│ WhatsApp + SMS       │ ⏳ Phase 4          │ ✅        │ ✅           │ ✅           │
│ Real-time Analytics  │ ✅                  │ ✅        │ ⚠️ Delayed   │ ⚠️ Basic     │
│ Data Residency 🇮🇳   │ ✅ India (via MSG91)│ ❌ US     │ ✅ India     │ ✅ India     │
└──────────────────────┴─────────────────────┴───────────┴──────────────┴──────────────┘
*Depends on upstream provider latency. Control plane latency for routing/auth still <200ms.
```

### Core Use Cases

1. **Transactional SMS** — OTPs, order confirmations, payment alerts, delivery updates
2. **Promotional SMS** — Marketing campaigns, offers, re-engagement (DND-compliant)
3. **OTP-as-a-Service** — Generate, send, verify OTPs with auto-retry and expiry
4. **Bulk Campaigns** — Schedule and send millions of messages with throttling
5. **2-Way Messaging** — Receive inbound SMS, keyword-based auto-responses
6. **WhatsApp Business** — Template messages, session messages via unified API

---

## 2. Key Concepts & Terminology

### SMS Industry Terms

| Term                    | Definition                                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **SMPP**                | Short Message Peer-to-Peer — the standard protocol for exchanging SMS between carriers and aggregators. Our platform connects to Indian telecom operators via SMPP v3.4. |
| **SMSC**                | Short Message Service Center — the telecom operator's server that stores and forwards SMS messages.                                                                      |
| **DLR**                 | Delivery Report — a callback from the operator confirming whether a message was delivered, failed, or is pending.                                                        |
| **Sender ID**           | The alphanumeric name (e.g., `TD-MYBANK`) that appears as the sender on the recipient's phone. In India, these follow TRAI's 6-character format.                         |
| **DLT**                 | Distributed Ledger Technology — India's TRAI-mandated platform for registering entities, sender IDs, and message templates to prevent spam.                              |
| **MNP**                 | Mobile Number Portability — users can switch operators while keeping their number. MNP lookup determines the current operator for routing.                               |
| **DND**                 | Do Not Disturb — TRAI's registry of numbers that have opted out of promotional messages. Promotional SMS must not be sent to DND numbers.                                |
| **Throughput**          | Messages per second (MPS) that can be sent through an SMPP connection. Typical operator connections allow 50–500 MPS per bind.                                           |
| **PDU**                 | Protocol Data Unit — the packet format used in SMPP. Key PDUs: `submit_sm` (send), `deliver_sm` (DLR), `enquire_link` (heartbeat).                                       |
| **Bind**                | An SMPP session connection to an operator. Types: Transmitter (send only), Receiver (receive only), Transceiver (both).                                                  |
| **Template**            | A pre-approved message format registered on the DLT platform. Variable parts are marked with placeholders like `{#var#}`.                                                |
| **Entity ID**           | A unique ID assigned to a business on the DLT platform (also called Principal Entity ID or PE ID).                                                                       |
| **Scrubbing**           | The process of filtering messages against DND registry and consent databases before sending.                                                                             |
| **Content Template ID** | The DLT-registered template ID that must be sent with every SMS for operator-side verification.                                                                          |

### Message Types (India-Specific)

```
┌─────────────────┬────────────┬────────────┬───────────────────────────────────┐
│ Type            │ Sender ID  │ DND Check  │ Use Case                          │
│                 │ Prefix     │ Required?  │                                   │
├─────────────────┼────────────┼────────────┼───────────────────────────────────┤
│ Transactional   │ TD-XXXXXX  │ No         │ OTP, alerts, order updates        │
│ Promotional     │ TP-XXXXXX  │ Yes        │ Marketing, offers, campaigns      │
│ Service Implicit│ SI-XXXXXX  │ No         │ Account info (non-OTP)            │
│ Service Explicit│ SE-XXXXXX  │ Yes*       │ Opted-in service messages         │
│ Government      │ GV-XXXXXX  │ No         │ Government notifications          │
└─────────────────┴────────────┴────────────┴───────────────────────────────────┘

* SE messages can be sent to DND numbers if user has given explicit consent
```

### Platform-Specific Terms

| Term                 | Definition                                                                                                        |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **API Key / Secret** | Credentials for authenticating API requests. Key is the identifier; Secret is used for HMAC signing.              |
| **Webhook**          | HTTP callback URL configured by the customer to receive real-time DLR status updates.                             |
| **Wallet**           | Prepaid credit balance used to pay for messages. Deducted per SMS segment sent.                                   |
| **Campaign**         | A bulk send operation targeting a list of recipients with a single template/message.                              |
| **Route**            | A specific SMPP connection path to an operator, with its own throughput and pricing.                              |
| **Segment**          | A single SMS can be up to 160 chars (GSM-7) or 70 chars (UCS-2/Unicode). Longer messages are split into segments. |

---

## 3. India-Specific Regulatory Requirements

### TRAI DLT Compliance (Mandatory since 2021)

India's Telecom Regulatory Authority (TRAI) mandates that all commercial SMS must go through a **DLT (Distributed Ledger Technology)** platform for spam control.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DLT REGISTRATION FLOW                            │
│                                                                     │
│  Step 1: Entity Registration                                       │
│  ├── Business registers on a DLT platform (Jio, Airtel, Vi, BSNL) │
│  ├── Gets a unique Entity ID (PE ID)                               │
│  └── KYC verification required                                     │
│                                                                     │
│  Step 2: Sender ID (Header) Registration                           │
│  ├── Register sender IDs (e.g., TD-MYBANK, TP-MYSHOP)             │
│  ├── Must follow 6-char format with type prefix                    │
│  └── Approved by operator (1-7 business days)                      │
│                                                                     │
│  Step 3: Template Registration                                     │
│  ├── Register message templates with variables                     │
│  │   Example: "Dear {#var#}, your OTP is {#var#}. Valid for        │
│  │   {#var#} minutes. -MYBANK"                                     │
│  ├── Each template gets a Content Template ID                      │
│  └── Approved by operator (1-3 business days)                      │
│                                                                     │
│  Step 4: Consent Registration (for promotional)                    │
│  ├── Upload customer consent records                               │
│  └── Required for promotional & service-explicit messages          │
└─────────────────────────────────────────────────────────────────────┘
```

### DLT Platforms in India

| Platform        | Operator      | Portal URL                                      |
| --------------- | ------------- | ----------------------------------------------- |
| Jio TrueConnect | Reliance Jio  | trueconnect.jio.com                             |
| Airtel IQ       | Bharti Airtel | www.airtel.in/business/commercial-communication |
| Vi Business     | Vodafone Idea | dltconnect.viconnect.in                         |
| BSNL Smart      | BSNL          | www.ucc-bsnl.co.in                              |
| MTNL            | MTNL          | www.ucc-mtnl.in                                 |

### Our Platform's DLT Compliance Implementation

```
┌──────────────────────────────────────────────────────────┐
│                DLT SERVICE (dlt-service)                  │
│                                                          │
│  1. Template Matching Engine                             │
│     • Every outgoing SMS is matched against registered   │
│       DLT templates stored in our database               │
│     • Variables are extracted and validated               │
│     • Rejects messages that don't match any template     │
│                                                          │
│  2. Header/Sender ID Validation                          │
│     • Validates sender ID belongs to the account         │
│     • Ensures correct prefix (TD/TP/SI/SE/GV)           │
│     • Checks sender ID is DLT-approved                  │
│                                                          │
│  3. DND Scrubbing (for Promotional)                      │
│     • Checks recipient against TRAI DND registry         │
│     • Caches DND data locally (updated daily)            │
│     • Blocks promotional SMS to DND numbers              │
│                                                          │
│  4. Consent Verification (for SE type)                   │
│     • Verifies consent records for SE messages           │
│     • Maintains consent database per entity              │
│                                                          │
│  5. Entity ID Injection                                  │
│     • Adds Entity ID and Template ID to SMPP             │
│       TLV (Tag-Length-Value) parameters                   │
│     • Required by operators for message acceptance       │
└──────────────────────────────────────────────────────────┘
```

### Key Regulatory Rules

- **Timing Restrictions**: Promotional SMS can only be sent between **9:00 AM – 9:00 PM** IST.
- **Frequency Capping**: TRAI recommends no more than 6 promotional messages per day to a single number.
- **Opt-out**: Every promotional SMS must include opt-out instructions.
- **Data Retention**: Message logs must be retained for **1 year** minimum.
- **Penalties**: Non-compliance can result in ₹1,000–₹10,000 per message penalty and potential blacklisting.

---

## 4. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                      │
│                                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  REST API     │  │  Dashboard   │  │  SDKs        │  │  Webhooks    │   │
│  │  (curl/HTTP)  │  │  (Next.js)   │  │  (Node/Py/..)│  │  (callbacks) │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────▲───────┘   │
│         │                 │                  │                  │           │
└─────────┼─────────────────┼──────────────────┼──────────────────┼───────────┘
          │                 │                  │                  │
          ▼                 ▼                  ▼                  │
┌─────────────────────────────────────────────────────────────────┼───────────┐
│                       API GATEWAY (Go)                          │           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │           │
│  │Rate Limiter│  │   Auth     │  │ Validation │                │           │
│  └────────────┘  └────────────┘  └────────────┘                │           │
└────────────────────────────┬────────────────────────────────────┼───────────┘
                             │                                    │
          ┌──────────────────┼────────────────────┐               │
          ▼                  ▼                    ▼               │
┌──────────────┐  ┌──────────────────┐  ┌──────────────┐         │
│ Auth Service │  │ Message Service  │  │   Billing    │         │
│ (Go)         │  │ (Go)             │  │   Service    │         │
│ • JWT/API Key│  │ • Validate msg   │  │   (Go)       │         │
│ • User mgmt  │  │ • DLT check      │  │ • Wallet     │         │
│ • RBAC       │  │ • Enqueue Kafka   │  │ • Pricing    │         │
└──────────────┘  └────────┬─────────┘  └──────────────┘         │
                           │                                      │
                           ▼                                      │
┌─────────────────────────────────────────────────────────────────┤
│                    APACHE KAFKA                                  │
│                                                                  │
│  Topics:                                                         │
│  ├── sms.outbound.high     (OTP, transactional — priority)      │
│  ├── sms.outbound.normal   (service messages)                   │
│  ├── sms.outbound.bulk     (campaigns, promotional)             │
│  ├── sms.dlr               (delivery reports)                   │
│  ├── sms.failed            (failed messages — retry/DLQ)        │
│  ├── sms.inbound           (incoming messages)                  │
│  └── sms.webhook           (webhook dispatch queue)             │
└────────────────────────────┬─────────────────────────────┬──────┘
                             │                             │
                             ▼                             ▼
┌──────────────────────────────────┐    ┌──────────────────────────┐
│       WORKER SERVICE (Go)        │    │   WEBHOOK SERVICE (Go)   │
│                                  │    │                          │
│  • Consume from Kafka            │    │  • Consume sms.dlr       │
│  • Route selection (MNP lookup)  │    │  • Consume sms.webhook   │
│  • DLT template matching         │    │  • HTTP POST to customer │
│  • Rate limiting per operator    │    │  • Retry with backoff    │
│  • Submit to SMPP Gateway        │    │  • Signature signing     │
└──────────────┬───────────────────┘    └──────────────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│      SMPP GATEWAY (Go)           │
│                                  │
│  ┌────────┐ ┌────────┐          │
│  │ Jio    │ │ Airtel │          │
│  │ SMSC   │ │ SMSC   │          │
│  │ Bind   │ │ Bind   │          │
│  └────┬───┘ └────┬───┘          │
│  ┌────────┐ ┌────────┐          │
│  │ Vi     │ │ BSNL   │          │
│  │ SMSC   │ │ SMSC   │          │
│  │ Bind   │ │ Bind   │          │
│  └────┬───┘ └────┬───┘          │
│                                  │
│  • Connection pool management    │
│  • PDU encoding/decoding         │
│  • Enquire link (heartbeat)      │
│  • DLR receive & parse           │
│  • Auto-reconnect on failure     │
└──────────────┬───────────────────┘
               │
               ▼
┌──────────────────────────────────┐
│     TELECOM OPERATORS (SMSC)     │
│                                  │
│  Jio │ Airtel │ Vi │ BSNL │ ... │
│                                  │
│  ──────────► Mobile Handset 📱   │
└──────────────────────────────────┘
```

### Data Store Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
│                                                              │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │  PostgreSQL 15+      │  │  ScyllaDB / Cassandra        │  │
│  │                      │  │                              │  │
│  │  • Users & accounts  │  │  • Message logs (write-heavy)│  │
│  │  • API keys          │  │  • DLR records               │  │
│  │  • Sender IDs        │  │  • Campaign message details  │  │
│  │  • DLT templates     │  │                              │  │
│  │  • Routes & pricing  │  │  Partitioned by:             │  │
│  │  • Wallets & billing │  │  account_id + date           │  │
│  │  • Webhook configs   │  │                              │  │
│  │  • Campaigns         │  │  Retention: 90 days hot,     │  │
│  │                      │  │  1 year cold (S3)            │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
│                                                              │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │  Redis 7+ Cluster    │  │  Elasticsearch 8+            │  │
│  │                      │  │                              │  │
│  │  • Rate limit tokens │  │  • Full-text message search  │  │
│  │  • Session cache     │  │  • Log analytics             │  │
│  │  • OTP store (TTL)   │  │  • Dashboard search          │  │
│  │  • MNP lookup cache  │  │  • Audit trail search        │  │
│  │  • DND cache         │  │                              │  │
│  │  • Route health      │  │                              │  │
│  └─────────────────────┘  └──────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Detailed Component Design

### 5.1 API Gateway

```
┌─────────────────────────────────────────┐
│              API GATEWAY                 │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Rate Limiter                    │   │
│  │  • Per API Key: 100 req/sec      │   │
│  │  • Per IP: 50 req/sec            │   │
│  │  • Global: 10,000 req/sec        │   │
│  │  • Algorithm: Token Bucket       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Authentication                  │   │
│  │  • API Key + Secret (HMAC)       │   │
│  │  • JWT for Dashboard             │   │
│  │  • Webhook signature verify      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Request Validation              │   │
│  │  • Schema validation             │   │
│  │  • Phone number format           │   │
│  │  • Payload size limits           │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Technology: Go (Gin / Fiber / chi)     │
│  Why: Low latency, minimal memory,     │
│  native concurrency with goroutines     │
└─────────────────────────────────────────┘
```

### 5.2 Message Service

```
┌─────────────────────────────────────────────────┐
│              MESSAGE SERVICE (Go)                 │
│                                                   │
│  Responsibilities:                                │
│  1. Validate incoming SMS requests                │
│     • Phone number format (E.164 / Indian 10-dig)│
│     • Sender ID ownership & DLT status            │
│     • Message length & encoding detection         │
│     • Template ID presence for DLT compliance     │
│                                                   │
│  2. Enrich message                                │
│     • Add message UUID                            │
│     • Detect encoding (GSM-7 vs UCS-2)            │
│     • Calculate segment count                     │
│     • Determine message type (TXN/PROMO/OTP)      │
│                                                   │
│  3. Billing pre-check                             │
│     • Check wallet balance (via billing-service)  │
│     • Reserve credits (optimistic deduction)      │
│                                                   │
│  4. Produce to Kafka                              │
│     • Route to priority topic based on type       │
│     • sms.outbound.high → OTP/Transactional       │
│     • sms.outbound.normal → Service messages      │
│     • sms.outbound.bulk → Promotional/Campaign    │
│                                                   │
│  Response: 202 Accepted + message_id              │
│  (Async — actual delivery is fire-and-forget      │
│   from the API caller's perspective)              │
└─────────────────────────────────────────────────┘
```

### 5.3 Worker Service

```
┌─────────────────────────────────────────────────┐
│              WORKER SERVICE (Go)                  │
│                                                   │
│  Kafka Consumer Groups:                           │
│  • worker-high    → sms.outbound.high (8 partns) │
│  • worker-normal  → sms.outbound.normal (4 prtns)│
│  • worker-bulk    → sms.outbound.bulk (16 partns) │
│                                                   │
│  Processing Pipeline:                             │
│  ┌─────────────────────────────────────────────┐ │
│  │ 1. Deserialize message from Kafka           │ │
│  │ 2. DLT template matching (dlt-service)      │ │
│  │ 3. DND scrubbing (promotional only)         │ │
│  │ 4. MNP lookup → determine current operator  │ │
│  │ 5. Route selection (routing-service)         │ │
│  │    • Primary route based on operator         │ │
│  │    • Failover route if primary unhealthy     │ │
│  │    • Cost-based routing for promotional      │ │
│  │ 6. Rate limiting per SMPP connection         │ │
│  │ 7. Submit to SMPP Gateway                    │ │
│  │ 8. Store message in ScyllaDB                 │ │
│  │ 9. Update status: queued → submitted         │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  Retry Strategy:                                  │
│  • Transient failure → retry 3x with backoff     │
│  • SMPP timeout → retry on alternate route        │
│  • Permanent failure → move to sms.failed (DLQ)  │
│  • DLQ messages reviewed and reprocessed manually │
└─────────────────────────────────────────────────┘
```

### 5.4 SMPP Gateway

```
┌─────────────────────────────────────────────────┐
│             SMPP GATEWAY (Go)                    │
│                                                   │
│  Connection Pool:                                 │
│  ┌─────────────────────────────────────────────┐ │
│  │ Operator    │ Binds │ Type       │ MPS      │ │
│  │─────────────│───────│────────────│──────────│ │
│  │ Jio         │  4    │ Transceiver│ 200/bind │ │
│  │ Airtel      │  4    │ Transceiver│ 150/bind │ │
│  │ Vi          │  2    │ Transceiver│ 100/bind │ │
│  │ BSNL        │  2    │ Transceiver│  50/bind │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  Features:                                        │
│  • SMPP v3.4 protocol implementation              │
│  • Persistent TCP connections with keep-alive     │
│  • enquire_link every 30 seconds (heartbeat)      │
│  • Auto-reconnect with exponential backoff        │
│  • Connection health monitoring                   │
│  • PDU encoding: GSM-7, UCS-2, Latin-1            │
│  • Long message handling (UDH concatenation)      │
│  • TLV parameters for DLT (entity_id, tmpl_id)   │
│  • DLR parsing from deliver_sm PDUs               │
│  • Sequence number tracking for correlation       │
│                                                   │
│  DLR Processing:                                  │
│  • Parse deliver_sm → extract message_id, status  │
│  • Map operator status codes to standard statuses │
│  • Produce to sms.dlr Kafka topic                 │
│  • Standard statuses: DELIVRD, EXPIRED, UNDELIV,  │
│    ACCEPTD, REJECTD, UNKNOWN                      │
└─────────────────────────────────────────────────┘
```

### 5.5 Routing Service

```
┌─────────────────────────────────────────────────┐
│            ROUTING SERVICE (Go)                   │
│                                                   │
│  Route Selection Algorithm:                       │
│  ┌─────────────────────────────────────────────┐ │
│  │ 1. MNP Lookup                               │ │
│  │    • Query MNP database for current operator│ │
│  │    • Cache result in Redis (TTL: 24h)       │ │
│  │                                              │ │
│  │ 2. Route Scoring (weighted)                 │ │
│  │    • Delivery rate (40% weight)             │ │
│  │    • Latency (25% weight)                   │ │
│  │    • Cost (20% weight)                      │ │
│  │    • Current load (15% weight)              │ │
│  │                                              │ │
│  │ 3. Health Check                             │ │
│  │    • Skip routes with >5% error rate (5min) │ │
│  │    • Skip routes with avg latency >5s       │ │
│  │                                              │ │
│  │ 4. Failover                                 │ │
│  │    • If primary fails → try secondary route │ │
│  │    • Max 2 failover attempts                │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  MNP Data Source:                                 │
│  • Updated daily from MNP clearinghouse           │
│  • ~1.2 billion number records                    │
│  • Stored in Redis for fast lookup                │
│  • Fallback: route via default operator path      │
└─────────────────────────────────────────────────┘
```

### 5.6 Billing Service

```
┌─────────────────────────────────────────────────┐
│            BILLING SERVICE (Go)                   │
│                                                   │
│  Wallet System:                                   │
│  • Prepaid model — customers add credits first   │
│  • Credits deducted per SMS segment sent          │
│  • Atomic balance operations (PostgreSQL SERIALIZ)│
│  • Low balance alerts at 20%, 10%, 5%             │
│  • Auto-recharge via Razorpay (optional)          │
│                                                   │
│  Pricing Engine:                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │ Factor        │ Impact                      │ │
│  │───────────────│─────────────────────────────│ │
│  │ Message type  │ TXN > OTP > PROMO           │ │
│  │ Operator      │ Jio cheapest, BSNL costliest│ │
│  │ Volume tier   │ Higher volume = lower price  │ │
│  │ Route quality │ Premium routes cost more     │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  Billing Flow:                                    │
│  1. Reserve credits (on message submit)           │
│  2. Confirm deduction (on DLR: DELIVRD)           │
│  3. Refund credits (on DLR: UNDELIV/REJECTD)     │
│  4. Daily reconciliation job                      │
│                                                   │
│  Payment Integration:                             │
│  • Razorpay for Indian payments (UPI, cards, NB)  │
│  • Invoice generation (monthly)                   │
│  • GST-compliant invoices (18% GST)               │
│  • Credit note for refunds                        │
└─────────────────────────────────────────────────┘
```

### 5.7 Campaign Service

```
┌─────────────────────────────────────────────────┐
│           CAMPAIGN SERVICE (Go)                   │
│                                                   │
│  Features:                                        │
│  • Upload recipient list (CSV, max 10M numbers)  │
│  • Schedule campaigns (immediate or future)       │
│  • Throttle sending rate (e.g., 1000 msg/min)    │
│  • Variable substitution per recipient            │
│  • Campaign pause/resume/cancel                   │
│  • Real-time progress tracking                    │
│                                                   │
│  Campaign Execution:                              │
│  1. Parse recipient CSV → validate numbers        │
│  2. Split into batches (1000 per batch)           │
│  3. Produce batches to sms.outbound.bulk          │
│  4. Track progress: sent/delivered/failed counts  │
│  5. Generate campaign report on completion        │
│                                                   │
│  Scheduling:                                      │
│  • Cron-based scheduler for future campaigns      │
│  • Timezone-aware (IST default)                   │
│  • Respects promotional timing window (9AM-9PM)   │
│  • Auto-pause if wallet balance insufficient      │
└─────────────────────────────────────────────────┘
```

### 5.8 Webhook Service

```
┌─────────────────────────────────────────────────┐
│           WEBHOOK SERVICE (Go)                    │
│                                                   │
│  • Consumes DLR events from sms.dlr topic        │
│  • Looks up customer's webhook URL config         │
│  • Signs payload with HMAC-SHA256 (shared secret) │
│  • POST to customer URL with status update        │
│                                                   │
│  Retry Policy:                                    │
│  • Attempt 1: immediate                           │
│  • Attempt 2: after 30 seconds                    │
│  • Attempt 3: after 2 minutes                     │
│  • Attempt 4: after 10 minutes                    │
│  • Attempt 5: after 1 hour                        │
│  • After 5 failures: mark as failed, log it       │
│                                                   │
│  Webhook Payload:                                 │
│  {                                                │
│    "event": "message.status",                     │
│    "message_id": "msg_abc123",                    │
│    "status": "delivered",                         │
│    "to": "919876543210",                          │
│    "delivered_at": "2024-01-15T10:30:00Z",        │
│    "error_code": null                             │
│  }                                                │
│                                                   │
│  Headers:                                         │
│  X-Webhook-Signature: sha256=<hmac>               │
│  X-Webhook-Timestamp: <unix_ts>                   │
└─────────────────────────────────────────────────┘
```

---

## 6. Database Design

### PostgreSQL Schema (Primary — Relational Data)

```sql
-- ==========================================
-- USERS & AUTHENTICATION
-- ==========================================

CREATE TABLE accounts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name    VARCHAR(255) NOT NULL,
    entity_id       VARCHAR(50),           -- DLT Entity/PE ID
    plan            VARCHAR(20) DEFAULT 'starter', -- starter/growth/enterprise
    status          VARCHAR(20) DEFAULT 'active',  -- active/suspended/closed
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    role            VARCHAR(20) DEFAULT 'member', -- owner/admin/member/viewer
    is_active       BOOLEAN DEFAULT true,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE api_keys (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    key_id          VARCHAR(50) UNIQUE NOT NULL,  -- Public: "ak_live_xxxxx"
    key_hash        VARCHAR(255) NOT NULL,        -- HMAC hash of secret
    name            VARCHAR(100) NOT NULL,
    permissions     JSONB DEFAULT '["sms:send","sms:read"]',
    rate_limit      INT DEFAULT 100,              -- req/sec
    is_active       BOOLEAN DEFAULT true,
    last_used_at    TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SENDER IDs & TEMPLATES (DLT)
-- ==========================================

CREATE TABLE sender_ids (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    sender_id       VARCHAR(11) NOT NULL,         -- e.g., "TD-MYBANK"
    category        VARCHAR(20) NOT NULL,          -- transactional/promotional/service_implicit/service_explicit
    dlt_status      VARCHAR(20) DEFAULT 'pending', -- pending/approved/rejected
    dlt_registered_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(account_id, sender_id)
);

CREATE TABLE templates (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    template_name   VARCHAR(255) NOT NULL,
    template_body   TEXT NOT NULL,                 -- "Your OTP is {#var#}..."
    dlt_template_id VARCHAR(50),                   -- DLT Content Template ID
    category        VARCHAR(20) NOT NULL,          -- transactional/promotional/service
    variable_count  INT DEFAULT 0,
    dlt_status      VARCHAR(20) DEFAULT 'pending',
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- ROUTING
-- ==========================================

CREATE TABLE routes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,         -- "Jio Direct Transactional"
    operator        VARCHAR(50) NOT NULL,          -- jio/airtel/vi/bsnl
    smpp_host       VARCHAR(255) NOT NULL,
    smpp_port       INT NOT NULL DEFAULT 2775,
    smpp_username   VARCHAR(100) NOT NULL,
    smpp_password   VARCHAR(100) NOT NULL,         -- Encrypted
    bind_type       VARCHAR(20) DEFAULT 'transceiver',
    max_binds       INT DEFAULT 4,
    max_tps         INT DEFAULT 200,               -- Max messages per second per bind
    category        VARCHAR(20) NOT NULL,          -- transactional/promotional/otp
    priority        INT DEFAULT 1,                 -- Lower = higher priority
    is_active       BOOLEAN DEFAULT true,
    health_status   VARCHAR(20) DEFAULT 'healthy', -- healthy/degraded/down
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE route_pricing (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id        UUID NOT NULL REFERENCES routes(id),
    operator        VARCHAR(50) NOT NULL,
    message_type    VARCHAR(20) NOT NULL,          -- transactional/promotional
    price_per_sms   DECIMAL(10,4) NOT NULL,        -- In INR (e.g., 0.1500)
    effective_from  DATE NOT NULL,
    effective_to    DATE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- BILLING & WALLET
-- ==========================================

CREATE TABLE wallets (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID UNIQUE NOT NULL REFERENCES accounts(id),
    balance         DECIMAL(12,4) NOT NULL DEFAULT 0, -- In INR
    reserved        DECIMAL(12,4) NOT NULL DEFAULT 0, -- Held for in-flight messages
    currency        VARCHAR(3) DEFAULT 'INR',
    auto_recharge   BOOLEAN DEFAULT false,
    low_balance_threshold DECIMAL(12,4) DEFAULT 100,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    type            VARCHAR(20) NOT NULL,          -- credit/debit/refund/reversal
    amount          DECIMAL(12,4) NOT NULL,
    balance_after   DECIMAL(12,4) NOT NULL,
    reference_type  VARCHAR(30),                   -- payment/sms/campaign/refund
    reference_id    VARCHAR(100),                  -- payment_id or message_id
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    invoice_number  VARCHAR(50) UNIQUE NOT NULL,   -- "INV-2024-00001"
    period_start    DATE NOT NULL,
    period_end      DATE NOT NULL,
    subtotal        DECIMAL(12,2) NOT NULL,
    gst_amount      DECIMAL(12,2) NOT NULL,        -- 18% GST
    total           DECIMAL(12,2) NOT NULL,
    status          VARCHAR(20) DEFAULT 'generated', -- generated/paid/overdue
    pdf_url         VARCHAR(500),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- CAMPAIGNS
-- ==========================================

CREATE TABLE campaigns (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    name            VARCHAR(255) NOT NULL,
    template_id     UUID REFERENCES templates(id),
    sender_id_id    UUID REFERENCES sender_ids(id),
    status          VARCHAR(20) DEFAULT 'draft',   -- draft/scheduled/running/paused/completed/cancelled
    total_recipients INT DEFAULT 0,
    sent_count      INT DEFAULT 0,
    delivered_count INT DEFAULT 0,
    failed_count    INT DEFAULT 0,
    scheduled_at    TIMESTAMPTZ,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    throttle_rate   INT DEFAULT 0,                 -- msgs/min, 0 = unlimited
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- WEBHOOKS
-- ==========================================

CREATE TABLE webhook_configs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id      UUID NOT NULL REFERENCES accounts(id),
    url             VARCHAR(500) NOT NULL,
    secret          VARCHAR(255) NOT NULL,         -- For HMAC signing
    events          JSONB DEFAULT '["message.status"]',
    is_active       BOOLEAN DEFAULT true,
    last_triggered  TIMESTAMPTZ,
    failure_count   INT DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_users_account ON users(account_id);
CREATE INDEX idx_api_keys_account ON api_keys(account_id);
CREATE INDEX idx_api_keys_key_id ON api_keys(key_id);
CREATE INDEX idx_sender_ids_account ON sender_ids(account_id);
CREATE INDEX idx_templates_account ON templates(account_id);
CREATE INDEX idx_transactions_account ON transactions(account_id);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_campaigns_account ON campaigns(account_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
```

### ScyllaDB Schema (Message Store — High Write Throughput)

```cql
-- Messages table: partitioned by account + date for efficient queries
CREATE TABLE messages (
    account_id      UUID,
    date            DATE,              -- Partition by day
    message_id      UUID,
    campaign_id     UUID,
    to_number       TEXT,
    sender_id       TEXT,
    message_body    TEXT,
    template_id     TEXT,              -- DLT template ID
    message_type    TEXT,              -- transactional/promotional/otp
    encoding        TEXT,              -- gsm7/ucs2
    segment_count   INT,
    status          TEXT,              -- queued/submitted/delivered/failed/expired
    route_id        UUID,
    operator        TEXT,
    smpp_message_id TEXT,              -- From operator
    error_code      TEXT,
    error_message   TEXT,
    cost            DECIMAL,
    submitted_at    TIMESTAMP,
    delivered_at    TIMESTAMP,
    created_at      TIMESTAMP,
    PRIMARY KEY ((account_id, date), message_id)
) WITH CLUSTERING ORDER BY (message_id DESC)
  AND default_time_to_live = 7776000;  -- 90 days TTL

-- Lookup by message_id (for API queries and DLR correlation)
CREATE TABLE messages_by_id (
    message_id      UUID PRIMARY KEY,
    account_id      UUID,
    date            DATE,
    to_number       TEXT,
    status          TEXT,
    created_at      TIMESTAMP,
    delivered_at    TIMESTAMP
);

-- DLR records
CREATE TABLE delivery_reports (
    message_id      UUID,
    dlr_timestamp   TIMESTAMP,
    status          TEXT,             -- DELIVRD/EXPIRED/UNDELIV/ACCEPTD/REJECTD
    operator_status TEXT,             -- Raw status from operator
    error_code      TEXT,
    raw_receipt     TEXT,             -- Full DLR receipt string
    PRIMARY KEY (message_id, dlr_timestamp)
) WITH CLUSTERING ORDER BY (dlr_timestamp DESC);
```

---

## 7. API Design

### Base URL & Versioning

```
Production:  https://api.smsplatform.in/v1
Staging:     https://api-staging.smsplatform.in/v1
```

### Authentication

```
# Option 1: API Key + Secret in headers
X-API-Key: ak_live_xxxxxxxxxxxxx
X-API-Secret: sk_live_xxxxxxxxxxxxx

# Option 2: Basic Auth (key:secret base64 encoded)
Authorization: Basic base64(key:secret)

# Option 3: JWT (for dashboard)
Authorization: Bearer eyJhbGciOi...
```

### Core Endpoints

#### Send SMS

```http
POST /v1/sms/send
Content-Type: application/json

{
    "to": "919876543210",
    "sender_id": "TD-MYBANK",
    "message": "Your OTP is 123456. Valid for 5 minutes.",
    "template_id": "1107161234567890123",
    "callback_url": "https://myapp.com/webhooks/sms",
    "metadata": {
        "order_id": "ORD-12345",
        "user_id": "usr_abc"
    }
}

# Response: 202 Accepted
{
    "success": true,
    "data": {
        "message_id": "msg_01HQ3K5V8XXXXXXXXX",
        "status": "queued",
        "to": "919876543210",
        "segments": 1,
        "cost": 0.15,
        "currency": "INR"
    }
}
```

#### Send Bulk SMS

```http
POST /v1/sms/bulk
Content-Type: application/json

{
    "sender_id": "TP-MYSHOP",
    "template_id": "1107161234567890124",
    "messages": [
        {
            "to": "919876543210",
            "message": "Hi Rahul, 50% off on electronics! Shop now."
        },
        {
            "to": "919876543211",
            "message": "Hi Priya, 50% off on electronics! Shop now."
        }
    ],
    "schedule_at": "2024-01-20T10:00:00+05:30"
}

# Response: 202 Accepted
{
    "success": true,
    "data": {
        "batch_id": "batch_01HQ3XXXXXXXXX",
        "total_messages": 2,
        "estimated_cost": 0.30,
        "status": "scheduled"
    }
}
```

#### Get Message Status

```http
GET /v1/sms/{message_id}

# Response: 200 OK
{
    "success": true,
    "data": {
        "message_id": "msg_01HQ3K5V8XXXXXXXXX",
        "to": "919876543210",
        "sender_id": "TD-MYBANK",
        "status": "delivered",
        "segments": 1,
        "cost": 0.15,
        "submitted_at": "2024-01-15T10:30:00Z",
        "delivered_at": "2024-01-15T10:30:02Z",
        "operator": "jio",
        "error_code": null
    }
}
```

#### List Messages (with filtering)

```http
GET /v1/sms?from=2024-01-01&to=2024-01-31&status=delivered&limit=50&cursor=xxx

# Response: 200 OK
{
    "success": true,
    "data": [
        { "message_id": "...", "to": "...", "status": "delivered", ... }
    ],
    "pagination": {
        "cursor": "next_cursor_token",
        "has_more": true,
        "total": 12500
    }
}
```

#### Wallet & Billing

```http
GET /v1/billing/balance
# Response
{ "balance": 5420.50, "reserved": 120.00, "available": 5300.50, "currency": "INR" }

POST /v1/billing/recharge
{ "amount": 10000, "payment_method": "razorpay" }
# Response: redirects to Razorpay checkout or returns order_id
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_BALANCE",
    "message": "Your wallet balance is insufficient. Required: ₹0.15, Available: ₹0.00",
    "details": {
      "required": 0.15,
      "available": 0.0
    }
  },
  "request_id": "req_01HQ3XXXXXXXXX"
}
```

### Standard Error Codes

| HTTP Status | Error Code           | Description                                       |
| ----------- | -------------------- | ------------------------------------------------- |
| 400         | INVALID_PHONE_NUMBER | Phone number format is invalid                    |
| 400         | INVALID_SENDER_ID    | Sender ID not registered or not approved          |
| 400         | TEMPLATE_MISMATCH    | Message doesn't match any registered DLT template |
| 401         | INVALID_API_KEY      | API key is invalid or expired                     |
| 402         | INSUFFICIENT_BALANCE | Wallet balance too low                            |
| 403         | PERMISSION_DENIED    | API key lacks required permission                 |
| 404         | MESSAGE_NOT_FOUND    | Message ID does not exist                         |
| 429         | RATE_LIMIT_EXCEEDED  | Too many requests                                 |
| 500         | INTERNAL_ERROR       | Server error                                      |
| 503         | SERVICE_UNAVAILABLE  | Platform temporarily unavailable                  |

---

## 8. Message Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                    COMPLETE MESSAGE LIFECYCLE                         │
│                                                                      │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐   │
│  │ CREATED  │────►│ QUEUED   │────►│PROCESSING│────►│SUBMITTED │   │
│  │          │     │          │     │          │     │          │   │
│  │API recvd │     │In Kafka  │     │Worker    │     │Sent to   │   │
│  │validated │     │topic     │     │picked up │     │SMPP GW   │   │
│  └──────────┘     └──────────┘     └──────────┘     └─────┬────┘   │
│                                                           │         │
│                                         ┌─────────────────┤         │
│                                         │                 │         │
│                                         ▼                 ▼         │
│                                   ┌──────────┐     ┌──────────┐    │
│                                   │ ACCEPTED │     │ REJECTED │    │
│                                   │          │     │          │    │
│                                   │Operator  │     │Operator  │    │
│                                   │accepted  │     │rejected  │    │
│                                   └─────┬────┘     └──────────┘    │
│                                         │                          │
│                              ┌──────────┼──────────┐               │
│                              │          │          │               │
│                              ▼          ▼          ▼               │
│                        ┌──────────┐┌──────────┐┌──────────┐       │
│                        │DELIVERED ││ EXPIRED  ││UNDELIVRD │       │
│                        │          ││          ││          │       │
│                        │Phone     ││TTL       ││Phone off/│       │
│                        │received  ││exceeded  ││invalid   │       │
│                        └──────────┘└──────────┘└──────────┘       │
│                                                                    │
│  At each status change:                                            │
│  1. ScyllaDB message record updated                                │
│  2. Kafka event produced (sms.dlr topic)                           │
│  3. Webhook dispatched to customer (if configured)                 │
│  4. Billing adjusted (refund if undelivered, confirm if delivered) │
│  5. Analytics counters updated in Redis                            │
└──────────────────────────────────────────────────────────────────────┘
```

### Timing Expectations

| Stage                            | Expected Duration | SLA Target          |
| -------------------------------- | ----------------- | ------------------- |
| API → Kafka (queued)             | < 50ms            | p99 < 100ms         |
| Kafka → Worker processing        | < 100ms           | p99 < 500ms         |
| Worker → SMPP submit             | < 100ms           | p99 < 200ms         |
| SMPP → Operator acceptance       | < 500ms           | p99 < 2s            |
| Operator → Handset delivery      | 1–30 seconds      | Depends on operator |
| DLR callback to platform         | 1–60 seconds      | Depends on operator |
| **End-to-end (API → Delivered)** | **2–10 seconds**  | **p95 < 15s**       |

### Status Mapping from Operators

```
┌──────────────┬──────────────────┬─────────────────────┐
│ Our Status   │ SMPP Status      │ Operator Codes      │
├──────────────┼──────────────────┼─────────────────────┤
│ delivered    │ DELIVRD          │ 000, 001            │
│ failed       │ UNDELIV          │ 002, 003, 050-099   │
│ expired      │ EXPIRED          │ 004, 011            │
│ rejected     │ REJECTD          │ 005, 006, 008       │
│ unknown      │ UNKNOWN          │ All others          │
└──────────────┴──────────────────┴─────────────────────┘
```

---

## 9. Scalability & Performance

### Design Targets

| Metric            | Target         | How                                              |
| ----------------- | -------------- | ------------------------------------------------ |
| Peak throughput   | 50,000 SMS/sec | Horizontal scaling of workers + SMPP connections |
| API latency (p99) | < 200ms        | Go services, Redis caching, connection pooling   |
| Message queue lag | < 5 seconds    | Kafka partitioning, consumer group scaling       |
| DLR processing    | < 2 seconds    | Dedicated DLR consumer group                     |
| Dashboard load    | < 1 second     | Next.js SSR, CDN, API caching                    |
| System uptime     | 99.95%         | Multi-AZ, auto-healing, circuit breakers         |

### Horizontal Scaling Strategy

```
┌────────────────────────────────────────────────────────────┐
│              SCALING APPROACH PER COMPONENT                 │
│                                                            │
│  API Gateway:                                              │
│  • Stateless → scale with HPA (CPU > 70%)                 │
│  • Min 3, Max 20 pods                                     │
│  • Load balanced via AWS ALB                               │
│                                                            │
│  Message Service:                                          │
│  • Stateless → scale with HPA                             │
│  • Min 3, Max 15 pods                                     │
│                                                            │
│  Worker Service:                                           │
│  • Scale with Kafka consumer lag (KEDA)                   │
│  • 1 consumer per partition                               │
│  • sms.outbound.high: 8 partitions → max 8 workers       │
│  • sms.outbound.bulk: 16 partitions → max 16 workers     │
│                                                            │
│  SMPP Gateway:                                             │
│  • Scale based on connection pool utilization              │
│  • Each pod manages connections to 1–2 operators          │
│  • Sticky routing: operator X → SMPP pod Y               │
│                                                            │
│  Kafka:                                                    │
│  • 3-node cluster (can expand to 6)                       │
│  • Replication factor: 3                                  │
│  • Key partitioning by account_id (even distribution)     │
│                                                            │
│  PostgreSQL:                                               │
│  • Primary + 2 read replicas                              │
│  • Connection pooling via PgBouncer                       │
│  • Read queries → replicas                                │
│                                                            │
│  ScyllaDB:                                                 │
│  • 3-node cluster (can expand to 9)                       │
│  • RF=3, CL=LOCAL_QUORUM for writes                       │
│  • CL=LOCAL_ONE for reads (eventual consistency OK)       │
│                                                            │
│  Redis:                                                    │
│  • 6-node cluster (3 primary + 3 replica)                 │
│  • Sharded by key hash                                    │
└────────────────────────────────────────────────────────────┘
```

### Kafka Topic Design

```
┌──────────────────────┬────────────┬─────────┬──────────────────────────┐
│ Topic                │ Partitions │ RF      │ Purpose                   │
├──────────────────────┼────────────┼─────────┼──────────────────────────┤
│ sms.outbound.high    │ 8          │ 3       │ OTP & transactional       │
│ sms.outbound.normal  │ 4          │ 3       │ Service messages          │
│ sms.outbound.bulk    │ 16         │ 3       │ Promotional/campaigns     │
│ sms.dlr              │ 8          │ 3       │ Delivery reports          │
│ sms.failed           │ 4          │ 3       │ Failed messages (DLQ)     │
│ sms.inbound          │ 4          │ 3       │ Incoming messages         │
│ sms.webhook          │ 8          │ 3       │ Webhook dispatch          │
│ sms.billing          │ 4          │ 3       │ Billing events            │
└──────────────────────┴────────────┴─────────┴──────────────────────────┘

Partition Key: account_id (ensures ordering per account)
Retention: 7 days (messages) / 3 days (DLR)
```

### Caching Strategy

```
┌────────────────────────┬────────────┬───────────────────────────────┐
│ Cache Key Pattern      │ TTL        │ Purpose                        │
├────────────────────────┼────────────┼───────────────────────────────┤
│ apikey:{key_id}        │ 5 min      │ API key validation cache       │
│ ratelimit:{key}:{win}  │ 1 sec      │ Token bucket counters          │
│ mnp:{phone}            │ 24 hours   │ MNP operator lookup            │
│ dnd:{phone}            │ 24 hours   │ DND registry check             │
│ route:health:{id}      │ 30 sec     │ Route health status            │
│ template:{id}          │ 1 hour     │ DLT template cache             │
│ sender:{acct}:{sid}    │ 1 hour     │ Sender ID ownership            │
│ wallet:{acct}          │ 10 sec     │ Wallet balance (approximate)   │
│ otp:{phone}:{purpose}  │ 5-10 min   │ OTP value for verification     │
│ session:{token}        │ 24 hours   │ Dashboard session              │
└────────────────────────┴────────────┴───────────────────────────────┘
```

---

## 10. Security Architecture

### Authentication & Authorization

```
┌────────────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                            │
│                                                            │
│  Layer 1: Transport Security                               │
│  • TLS 1.3 for all API communication                      │
│  • mTLS for internal service-to-service (in K8s)          │
│  • SMPP connections over VPN to operators                  │
│                                                            │
│  Layer 2: API Authentication                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ REST API:                                            │ │
│  │ • API Key (ak_live_xxx) + Secret (sk_live_xxx)       │ │
│  │ • Key identifies account; Secret signs requests      │ │
│  │ • HMAC-SHA256 signature verification                 │ │
│  │ • Keys rotatable without downtime                    │ │
│  │                                                      │ │
│  │ Dashboard:                                           │ │
│  │ • Email + Password → JWT (access + refresh tokens)   │ │
│  │ • Access token: 15 min TTL                           │ │
│  │ • Refresh token: 7 day TTL (rotated on use)          │ │
│  │ • MFA via TOTP (Google Authenticator) — optional     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Layer 3: Authorization (RBAC)                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Role       │ Permissions                             │ │
│  │────────────│─────────────────────────────────────────│ │
│  │ owner      │ Full access, billing, user management   │ │
│  │ admin      │ All except billing & ownership transfer │ │
│  │ member     │ Send SMS, view logs, manage templates   │ │
│  │ viewer     │ View logs and analytics only            │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Layer 4: Data Security                                    │
│  • Passwords: bcrypt (cost=12)                            │
│  • API secrets: HMAC-SHA256 hashed (never stored raw)     │
│  • SMPP credentials: AES-256-GCM encrypted at rest        │
│  • PII (phone numbers): encrypted in logs, masked in UI   │
│  • Database: encrypted at rest (AWS RDS encryption)       │
│  • Backups: encrypted with customer-managed KMS keys      │
│                                                            │
│  Layer 5: Network Security                                 │
│  • VPC with private subnets for all services              │
│  • WAF on API Gateway (OWASP rules)                       │
│  • DDoS protection via AWS Shield                         │
│  • IP allowlisting available for enterprise accounts      │
│  • Security groups: least privilege                       │
└────────────────────────────────────────────────────────────┘
```

### Audit Logging

```
Every sensitive operation is logged to an immutable audit trail:

• API key created/revoked
• User login/logout (with IP and user-agent)
• Password changes
• Webhook URL changes
• Billing operations (recharge, refund)
• Sender ID / template changes
• Admin actions on accounts

Stored in: PostgreSQL (audit_logs table) + Elasticsearch (for search)
Retention: 2 years
```

---

## 11. Monitoring & Observability

### Three Pillars

```
┌────────────────────────────────────────────────────────────┐
│                 OBSERVABILITY STACK                          │
│                                                            │
│  ┌─────────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   METRICS        │  │   LOGGING     │  │   TRACING     │ │
│  │   Prometheus     │  │   Loki / ELK  │  │   Jaeger      │ │
│  │   + Grafana      │  │              │  │   OpenTelemetry│ │
│  └─────────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### Key Metrics (Prometheus)

```
# API Gateway
api_requests_total{method, endpoint, status}         # Request count
api_request_duration_seconds{method, endpoint}        # Latency histogram
api_rate_limit_hits_total{key_id}                     # Rate limit triggers

# Message Pipeline
sms_messages_queued_total{type, priority}              # Messages entering Kafka
sms_messages_submitted_total{operator, route}          # Sent to operator
sms_messages_delivered_total{operator}                 # Confirmed delivered
sms_messages_failed_total{operator, error_code}        # Failed
sms_processing_duration_seconds{stage}                 # Per-stage latency

# SMPP Gateway
smpp_connections_active{operator}                      # Active SMPP binds
smpp_connections_errors_total{operator, type}           # Connection errors
smpp_submit_sm_duration_seconds{operator}              # SMPP submit latency
smpp_deliver_sm_total{operator, status}                # DLR counts
smpp_enquire_link_failures_total{operator}             # Heartbeat failures

# Kafka
kafka_consumer_lag{topic, group}                       # Consumer lag
kafka_messages_produced_total{topic}                   # Producer throughput
kafka_messages_consumed_total{topic, group}            # Consumer throughput

# Billing
wallet_balance_gauge{account_id}                       # Current balances
billing_transactions_total{type}                       # Transaction counts

# Infrastructure
go_goroutines                                          # Goroutine count
go_memstats_alloc_bytes                                # Memory usage
process_cpu_seconds_total                              # CPU usage
```

### Grafana Dashboards

```
1. Platform Overview     — Total SMS/sec, delivery rate, revenue, active users
2. Message Pipeline      — Kafka lag, processing latency, queue depths
3. Operator Health       — Per-operator delivery rate, latency, error rates
4. SMPP Connections      — Connection status, bind count, heartbeat status
5. API Performance       — Request rate, latency percentiles, error rates
6. Billing Dashboard     — Revenue, recharges, wallet balances
7. Customer Health       — Per-account metrics, top senders, error patterns
```

### Alerting Rules

```yaml
# Critical (PagerDuty — immediate)
- alert: SMPPConnectionDown
  expr: smpp_connections_active{} == 0
  for: 1m
  severity: critical

- alert: DeliveryRateDropped
  expr: rate(sms_messages_delivered_total[5m]) / rate(sms_messages_submitted_total[5m]) < 0.8
  for: 5m
  severity: critical

- alert: KafkaConsumerLagHigh
  expr: kafka_consumer_lag > 10000
  for: 3m
  severity: critical

# Warning (Slack — investigate)
- alert: APILatencyHigh
  expr: histogram_quantile(0.99, api_request_duration_seconds) > 1
  for: 5m
  severity: warning

- alert: ErrorRateElevated
  expr: rate(sms_messages_failed_total[5m]) / rate(sms_messages_submitted_total[5m]) > 0.05
  for: 5m
  severity: warning

- alert: WalletBalanceLow
  expr: wallet_balance_gauge < 100
  for: 1m
  severity: warning
```

---

## 12. Technology Stack

```
┌────────────────────┬──────────────────────────────────────────┐
│ Layer              │ Technology                                │
├────────────────────┼──────────────────────────────────────────┤
│ Frontend           │ Next.js 14+ (App Router) + TypeScript     │
│ Dashboard UI       │ Tailwind CSS, TanStack Query, Zustand     │
│ Charts             │ Recharts / Apache ECharts                 │
│ UI Components      │ shadcn/ui + Radix UI primitives           │
│                    │                                          │
│ API Gateway        │ Go (custom, net/http or Gin/Fiber)        │
│                    │                                          │
│ Backend Services   │ Go (all services)                         │
│                    │ Fast, low memory, excellent concurrency   │
│                    │ Ideal for high-throughput SMS pipelines   │
│                    │                                          │
│ SMPP Layer         │ Go                                        │
│                    │ Libraries: go-smpp, fiorix/go-smpp        │
│                    │                                          │
│ Message Queue      │ Apache Kafka (Confluent / self-hosted)   │
│                    │                                          │
│ Primary Database   │ PostgreSQL 15+                            │
│ Message Store      │ ScyllaDB (or Apache Cassandra)           │
│ Cache              │ Redis 7+ (Cluster mode)                   │
│ Search             │ Elasticsearch 8+                          │
│                    │                                          │
│ Container Runtime  │ Docker + Kubernetes (EKS/AKS)            │
│ CI/CD              │ GitHub Actions / GitLab CI                │
│ IaC                │ Terraform + Helm Charts                   │
│                    │                                          │
│ Cloud Provider     │ AWS Mumbai (ap-south-1) - Primary        │
│                    │ Azure Central India - DR                  │
│                    │                                          │
│ Monitoring         │ Prometheus + Grafana                      │
│ Logging            │ ELK Stack (or Loki)                      │
│ Tracing            │ Jaeger / OpenTelemetry                    │
│ Secrets            │ HashiCorp Vault / AWS Secrets Manager     │
│                    │                                          │
│ Payment Gateway    │ Razorpay (India)                          │
│ Email (internal)   │ AWS SES                                   │
│ CDN                │ CloudFront / Cloudflare                   │
└────────────────────┴──────────────────────────────────────────┘
```

### Repository Strategy

```
We use a 2-repo approach — backend monorepo + frontend repo(s):

┌─────────────────────────────────────────────────────────────┐
│  Repo 1: sms-platform (Go backend monorepo)                │
│  ├── services/          # All Go microservices              │
│  ├── pkg/               # Shared Go packages                │
│  ├── sdks/              # Client SDKs (Node, Python, etc.)  │
│  ├── infrastructure/    # Terraform, K8s, Docker            │
│  ├── docs/              # API specs, architecture docs      │
│  ├── tests/             # Integration, load, e2e tests      │
│  ├── go.work            # Go workspace (multi-module)       │
│  └── Makefile                                               │
│                                                             │
│  Why monorepo for backend:                                  │
│  • Shared pkg/ (models, errors, middleware, kafka, redis)   │
│  • Single Go workspace — seamless cross-service refactors   │
│  • One docker-compose.yml for local dev                     │
│  • Path-based CI: only build/deploy changed services        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  Repo 2: sms-service-ui (Next.js frontend)                  │
│  ├── app/               # Next.js App Router pages          │
│  ├── components/        # UI components (shadcn/ui)         │
│  ├── lib/               # API client, auth, utils           │
│  ├── hooks/             # React hooks                       │
│  ├── store/             # Zustand state                     │
│  └── Dockerfile                                             │
│                                                             │
│  Why separate repo for frontend:                            │
│  • Different deploy cadence (UI ships faster)               │
│  • Different toolchain (Node vs Go)                         │
│  • Independent CI/CD — Vercel / standalone Docker           │
│  • Admin panel can live here as a second Next.js app        │
│    or in its own repo if team grows                         │
└─────────────────────────────────────────────────────────────┘

Contract between repos:
  • OpenAPI spec (docs/api/) in sms-platform is the source of truth
  • sms-service-ui generates typed API client from the spec
  • Breaking API changes require spec bump + coordinated release
```

### Service Breakdown

```
sms-platform/                        # Repo 1: Backend monorepo
├── services/                        # All backend services in Go
│   ├── api-gateway/                 # Go — Request routing, rate limiting, auth
│   │   ├── cmd/server/main.go
│   │   ├── internal/
│   │   │   ├── handler/
│   │   │   ├── middleware/
│   │   │   ├── router/
│   │   │   └── config/
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── message-service/             # Go — Core SMS handling, validation
│   │   ├── cmd/server/main.go
│   │   ├── internal/
│   │   │   ├── handler/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   └── kafka/
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── worker-service/              # Go — Kafka consumers, message processing
│   │   ├── cmd/worker/main.go
│   │   ├── internal/
│   │   │   ├── consumer/
│   │   │   ├── processor/
│   │   │   └── retry/
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── smpp-gateway/                # Go — SMPP connections to operators
│   │   ├── cmd/gateway/main.go
│   │   ├── internal/
│   │   │   ├── connector/
│   │   │   ├── pool/
│   │   │   ├── encoder/
│   │   │   └── dlr/
│   │   ├── go.mod
│   │   └── Dockerfile
│   │
│   ├── routing-service/             # Go — Route selection, MNP lookup
│   ├── billing-service/             # Go — Wallet, pricing, invoices
│   ├── campaign-service/            # Go — Bulk SMS, scheduling
│   ├── dlt-service/                 # Go — DLT compliance, template matching
│   ├── webhook-service/             # Go — Callback dispatching
│   ├── auth-service/                # Go — User management, API keys, JWT
│   ├── notification-service/        # Go — Internal alerts, emails
│   └── admin-service/               # Go — Internal admin operations
│
├── pkg/                             # Shared Go packages across services
│   ├── database/                    # PostgreSQL client, connection pool
│   ├── kafka/                       # Kafka producer/consumer wrappers
│   ├── redis/                       # Redis client wrapper
│   ├── logger/                      # Structured logging (zerolog/zap)
│   ├── config/                      # Env/config loading (viper)
│   ├── models/                      # Shared data models
│   ├── errors/                      # Custom error types
│   └── middleware/                   # Shared HTTP middleware
│
├── sdks/
│   ├── node/                        # Node.js SDK
│   ├── python/                      # Python SDK
│   ├── java/                        # Java SDK
│   ├── php/                         # PHP SDK
│   └── curl-examples/               # cURL examples
│
├── infrastructure/
│   ├── docker/                      # Dockerfiles per service
│   ├── docker-compose.yml           # Local dev infrastructure
│   ├── kubernetes/                  # K8s manifests / Helm charts
│   └── terraform/                   # AWS infrastructure
│
├── docs/
│   ├── api/                         # OpenAPI/Swagger specs
│   ├── guides/                      # Integration guides
│   └── architecture/                # Architecture docs
│
├── tests/
│   ├── integration/                 # Go integration tests
│   ├── load/                        # k6 / Artillery load tests
│   └── e2e/                         # End-to-end tests
│
├── go.work                          # Go workspace file (multi-module)
├── Makefile                         # Build, test, run commands
├── SYSTEM_DESIGN.md
├── GETTING_STARTED.md
└── README.md
```

```
sms-service-ui/                      # Repo 2: Customer dashboard
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard home
│   │   ├── sms/
│   │   │   ├── send/page.tsx
│   │   │   └── logs/page.tsx
│   │   ├── campaigns/page.tsx
│   │   ├── templates/page.tsx
│   │   ├── sender-ids/page.tsx
│   │   ├── billing/page.tsx
│   │   └── settings/
│   │       ├── api-keys/page.tsx
│   │       ├── webhooks/page.tsx
│   │       └── profile/page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── charts/
│   ├── tables/
│   └── forms/
├── lib/
│   ├── api-client.ts                # Typed API client (from OpenAPI spec)
│   ├── auth.ts
│   └── utils.ts
├── hooks/
├── store/                           # Zustand state management
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── Dockerfile
└── README.md
```

---

## 13. Infrastructure & Deployment

### AWS Architecture (Primary — ap-south-1 Mumbai)

```
┌──────────────────────────────────────────────────────────────────┐
│                    AWS ap-south-1 (Mumbai)                        │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  VPC (10.0.0.0/16)                                        │  │
│  │                                                            │  │
│  │  ┌──────────────────┐  ┌──────────────────┐               │  │
│  │  │ Public Subnet     │  │ Public Subnet     │              │  │
│  │  │ AZ: ap-south-1a   │  │ AZ: ap-south-1b   │              │  │
│  │  │ ┌──────────────┐ │  │ ┌──────────────┐ │              │  │
│  │  │ │ ALB          │ │  │ │ NAT Gateway  │ │              │  │
│  │  │ │ (API + Web)  │ │  │ │              │ │              │  │
│  │  │ └──────────────┘ │  │ └──────────────┘ │              │  │
│  │  └──────────────────┘  └──────────────────┘               │  │
│  │                                                            │  │
│  │  ┌──────────────────┐  ┌──────────────────┐               │  │
│  │  │ Private Subnet    │  │ Private Subnet    │              │  │
│  │  │ AZ: ap-south-1a   │  │ AZ: ap-south-1b   │              │  │
│  │  │ ┌──────────────┐ │  │ ┌──────────────┐ │              │  │
│  │  │ │ EKS Cluster  │ │  │ │ EKS Cluster  │ │              │  │
│  │  │ │ (Worker Nodes)│ │  │ │ (Worker Nodes)│ │              │  │
│  │  │ │              │ │  │ │              │ │              │  │
│  │  │ │ • API Gateway│ │  │ │ • Workers    │ │              │  │
│  │  │ │ • Msg Service│ │  │ │ • SMPP GW    │ │              │  │
│  │  │ │ • Auth Svc   │ │  │ │ • Webhook Svc│ │              │  │
│  │  │ │ • Billing Svc│ │  │ │ • Campaign   │ │              │  │
│  │  │ └──────────────┘ │  │ └──────────────┘ │              │  │
│  │  └──────────────────┘  └──────────────────┘               │  │
│  │                                                            │  │
│  │  ┌──────────────────┐  ┌──────────────────┐               │  │
│  │  │ Data Subnet       │  │ Data Subnet       │              │  │
│  │  │ AZ: ap-south-1a   │  │ AZ: ap-south-1b   │              │  │
│  │  │ ┌──────────────┐ │  │ ┌──────────────┐ │              │  │
│  │  │ │ RDS Postgres │ │  │ │ RDS Postgres │ │              │  │
│  │  │ │ (Primary)    │ │  │ │ (Standby)    │ │              │  │
│  │  │ └──────────────┘ │  │ └──────────────┘ │              │  │
│  │  │ ┌──────────────┐ │  │ ┌──────────────┐ │              │  │
│  │  │ │ ScyllaDB     │ │  │ │ ScyllaDB     │ │              │  │
│  │  │ │ (Node 1)     │ │  │ │ (Node 2,3)   │ │              │  │
│  │  │ └──────────────┘ │  │ └──────────────┘ │              │  │
│  │  │ ┌──────────────┐ │  │ ┌──────────────┐ │              │  │
│  │  │ │ MSK (Kafka)  │ │  │ │ MSK (Kafka)  │ │              │  │
│  │  │ │ Broker 1     │ │  │ │ Broker 2,3   │ │              │  │
│  │  │ └──────────────┘ │  │ └──────────────┘ │              │  │
│  │  │ ┌──────────────┐ │  │                   │              │  │
│  │  │ │ ElastiCache  │ │  │                   │              │  │
│  │  │ │ Redis Cluster│ │  │                   │              │  │
│  │  │ └──────────────┘ │  │                   │              │  │
│  │  └──────────────────┘  └──────────────────┘               │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  External:                                                       │
│  ├── CloudFront CDN (dashboard static assets)                   │
│  ├── Route 53 (DNS)                                             │
│  ├── AWS WAF (on ALB)                                           │
│  ├── S3 (message archives, CSV uploads, invoices)               │
│  ├── SES (internal emails)                                      │
│  └── Secrets Manager / Parameter Store                          │
└──────────────────────────────────────────────────────────────────┘
```

### CI/CD Pipeline

```
┌───────────────────────────────────────────────────────────────┐
│                    CI/CD PIPELINE                              │
│                                                               │
│  Trigger: Push to main / PR merge                            │
│                                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────┐│
│  │  Lint    │→│  Test   │→│  Build  │→│  Deploy           ││
│  │         │  │         │  │         │  │                   ││
│  │golangci │  │go test  │  │Docker   │  │Staging: auto     ││
│  │eslint   │  │coverage │  │push ECR │  │Prod: manual gate ││
│  │typecheck│  │integratn│  │Helm pkg │  │Canary → 100%     ││
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────┘│
│                                                               │
│  Path-based builds (backend monorepo):                       │
│  • services/api-gateway/** → build + deploy api-gateway only │
│  • services/billing-service/** → build + deploy billing only │
│  • pkg/** → rebuild + test ALL services                      │
│                                                               │
│  Frontend (sms-service-ui):                                  │
│  • Push to main → build → deploy to Vercel / Docker + CDN   │
└───────────────────────────────────────────────────────────────┘
```

### Kubernetes Deployment Strategy

```yaml
# Canary deployment for critical services
Strategy:
  1. Deploy canary (10% traffic) → monitor for 5 min
  2. If error rate < 1% and latency p99 < 500ms → proceed
  3. Roll out to 50% → monitor for 5 min
  4. Roll out to 100%
  5. If any stage fails → automatic rollback

# Pod resource requests (per service)
api-gateway:     CPU: 500m,  Memory: 256Mi,  Replicas: 3-20
message-service: CPU: 500m,  Memory: 256Mi,  Replicas: 3-15
worker-service:  CPU: 1000m, Memory: 512Mi,  Replicas: 4-16
smpp-gateway:    CPU: 1000m, Memory: 512Mi,  Replicas: 2-8
billing-service: CPU: 250m,  Memory: 256Mi,  Replicas: 2-6
webhook-service: CPU: 250m,  Memory: 128Mi,  Replicas: 2-8
```

---

## 14. Cost Estimation Model

### Infrastructure Costs (Monthly — Production)

```
┌─────────────────────────────┬──────────┬──────────────────────────┐
│ Component                   │ Cost/mo  │ Spec                      │
├─────────────────────────────┼──────────┼──────────────────────────┤
│ EKS Cluster                 │ $73      │ Control plane              │
│ EC2 Worker Nodes (6x)       │ $1,200   │ 6x m5.xlarge (4vCPU/16GB)│
│ RDS PostgreSQL              │ $400     │ db.r6g.large, Multi-AZ    │
│ MSK (Kafka) 3-broker        │ $600     │ kafka.m5.large            │
│ ElastiCache Redis Cluster   │ $350     │ cache.r6g.large, 6 nodes  │
│ ScyllaDB (EC2, 3-node)      │ $900     │ 3x i3.xlarge             │
│ ALB                         │ $50      │ Application Load Balancer  │
│ NAT Gateway                 │ $100     │ Data transfer              │
│ S3 Storage                  │ $50      │ Message archives, uploads  │
│ CloudFront CDN              │ $30      │ Dashboard static assets    │
│ Route 53                    │ $5       │ DNS                        │
│ Secrets Manager             │ $10      │ Secret storage             │
│ CloudWatch / Monitoring     │ $100     │ Logs, metrics              │
│ Data Transfer               │ $200     │ Estimated inter-service    │
├─────────────────────────────┼──────────┼──────────────────────────┤
│ TOTAL INFRASTRUCTURE        │ ~$4,068  │ ~₹3.4L/month              │
└─────────────────────────────┴──────────┴──────────────────────────┘
```

### Per-SMS Cost Breakdown

```
┌──────────────────────┬──────────────────┐
│ Component            │ Cost per SMS     │
├──────────────────────┼──────────────────┤
│ Operator charges     │ ₹0.10 – ₹0.18   │
│ Infrastructure       │ ₹0.001 – ₹0.003 │
│ Platform margin      │ ₹0.02 – ₹0.05   │
├──────────────────────┼──────────────────┤
│ Customer price       │ ₹0.12 – ₹0.25   │
└──────────────────────┴──────────────────┘

At 10M messages/month:
  Revenue: 10M × ₹0.18 avg = ₹18,00,000 (~$21,600)
  Operator: 10M × ₹0.12 avg = ₹12,00,000 (~$14,400)
  Infra: ~₹3,40,000 (~$4,068)
  Gross Margin: ~₹2,60,000 (~$3,100) = ~14.4%
```

### Pricing Tiers for Customers

```
┌────────────┬────────────────┬────────────┬──────────────┬───────────────┐
│ Plan       │ Monthly Volume │ TXN Price  │ PROMO Price  │ Monthly Fee   │
├────────────┼────────────────┼────────────┼──────────────┼───────────────┤
│ Starter    │ Up to 10K      │ ₹0.25      │ ₹0.20        │ Free          │
│ Growth     │ Up to 1L       │ ₹0.20      │ ₹0.16        │ ₹999          │
│ Business   │ Up to 10L      │ ₹0.16      │ ₹0.13        │ ₹4,999        │
│ Enterprise │ 10L+           │ Custom     │ Custom       │ Custom        │
└────────────┴────────────────┴────────────┴──────────────┴───────────────┘
```

---

## 15. Development Roadmap

### Phase 1: MVP (Months 1–3)

```
Goal: Core SMS sending platform with API and basic dashboard

✅ Auth service (registration, login, API keys)
✅ Single-SMS send API (POST /v1/sms/send)
✅ Message service → Kafka → Worker → SMPP (1 operator)
✅ Basic DLR handling
✅ PostgreSQL + ScyllaDB setup
✅ Wallet system (manual top-up)
✅ Basic Next.js dashboard (login, send SMS, view logs)
✅ DLT template storage and basic matching
✅ Docker Compose local dev environment
✅ Basic monitoring (Prometheus + Grafana)

Deliverable: Working API that can send and track SMS via 1 operator
```

### Phase 2: Production Ready (Months 4–6)

```
Goal: Multi-operator, campaign support, billing, production deployment

✅ Multi-operator SMPP connections (Jio, Airtel, Vi)
✅ Intelligent routing with MNP lookup
✅ Route failover and health monitoring
✅ DLT compliance engine (template matching, DND scrubbing)
✅ Bulk SMS / Campaign service (CSV upload, scheduling)
✅ Webhook service for DLR callbacks
✅ Razorpay payment integration
✅ Full dashboard (campaigns, templates, billing, settings)
✅ Rate limiting (per API key, per IP)
✅ Kubernetes deployment on AWS EKS
✅ CI/CD pipeline (GitHub Actions)
✅ Load testing (target: 5K SMS/sec)

Deliverable: Production-ready platform handling 5K SMS/sec
```

### Phase 3: Scale & Features (Months 7–9)

```
Goal: Enterprise features, scale to 50K SMS/sec

✅ OTP-as-a-Service (generate, send, verify)
✅ Inbound SMS (2-way messaging)
✅ Node.js and Python SDKs
✅ Advanced analytics dashboard (charts, trends)
✅ Elasticsearch integration for log search
✅ RBAC (multi-user accounts with roles)
✅ Auto-recharge (wallet)
✅ Invoice generation (GST-compliant)
✅ Sender ID management UI
✅ Scale to 50K SMS/sec
✅ DR setup (Azure Central India)

Deliverable: Feature-rich platform with enterprise capabilities
```

### Phase 4: Market Expansion (Months 10–12)

```
Goal: WhatsApp, self-service, developer experience

✅ WhatsApp Business API integration
✅ Unified API (SMS + WhatsApp)
✅ Developer portal with interactive docs
✅ Java and PHP SDKs
✅ White-label / reseller support
✅ SLA monitoring and reporting
✅ SOC 2 Type II compliance preparation
✅ Self-hosted option (Helm chart)

Deliverable: Multi-channel platform ready for enterprise sales
```

---

## 16. Inbound SMS (2-Way Messaging)

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   INBOUND SMS FLOW                            │
│                                                              │
│  📱 User sends SMS                                           │
│     to long/short code                                       │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────┐                                            │
│  │ Operator SMSC │                                           │
│  │ (deliver_sm)  │                                           │
│  └──────┬───────┘                                            │
│         │ SMPP deliver_sm (MO message)                       │
│         ▼                                                    │
│  ┌──────────────┐                                            │
│  │ SMPP Gateway  │                                           │
│  │ (receiver)    │                                           │
│  └──────┬───────┘                                            │
│         │ Produce to sms.inbound                             │
│         ▼                                                    │
│  ┌──────────────┐                                            │
│  │ Kafka         │                                           │
│  │ sms.inbound   │                                           │
│  └──────┬───────┘                                            │
│         │                                                    │
│         ▼                                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Inbound Processor (Worker)                           │   │
│  │                                                      │   │
│  │ 1. Parse incoming message (from, to, body)           │   │
│  │ 2. Match destination number → account                │   │
│  │ 3. Keyword matching (e.g., "STOP", "HELP", "YES")   │   │
│  │ 4. Auto-reply if keyword rule exists                 │   │
│  │ 5. Store inbound message in ScyllaDB                 │   │
│  │ 6. Dispatch webhook to customer's URL                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  Webhook Payload:                                            │
│  {                                                           │
│    "event": "message.inbound",                               │
│    "from": "919876543210",                                   │
│    "to": "919000012345",                                     │
│    "body": "YES",                                            │
│    "received_at": "2024-01-15T10:30:00Z",                    │
│    "keyword": "YES"                                          │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

### Number Types for Inbound

| Type              | Format                   | Cost      | Use Case                   |
| ----------------- | ------------------------ | --------- | -------------------------- |
| Long Code         | 10-digit virtual number  | ₹500/mo   | Low-volume 2-way           |
| Short Code        | 5-6 digit number         | ₹5,000/mo | High-volume, keyword-based |
| Shared Short Code | Keyword on shared number | ₹1,000/mo | Budget 2-way messaging     |

---

## 17. OTP-as-a-Service

### API Design

```http
# Step 1: Generate & Send OTP
POST /v1/otp/send
{
    "to": "919876543210",
    "purpose": "login",                  # login/signup/transaction/password_reset
    "template_id": "1107161234567890125",
    "otp_length": 6,                     # 4 or 6
    "expiry_seconds": 300,               # Default: 5 min
    "channel": "sms"                     # sms / whatsapp / both
}

# Response
{
    "success": true,
    "data": {
        "otp_id": "otp_01HQ3XXXXXXXXX",
        "status": "sent",
        "expires_at": "2024-01-15T10:35:00Z",
        "retry_after": 30
    }
}

# Step 2: Verify OTP
POST /v1/otp/verify
{
    "to": "919876543210",
    "purpose": "login",
    "otp": "123456"
}

# Response (success)
{
    "success": true,
    "data": {
        "verified": true,
        "otp_id": "otp_01HQ3XXXXXXXXX"
    }
}

# Response (failure)
{
    "success": false,
    "error": {
        "code": "OTP_INVALID",
        "message": "Invalid OTP. 2 attempts remaining.",
        "details": { "attempts_remaining": 2 }
    }
}
```

### OTP Service Logic

```
┌──────────────────────────────────────────────────────┐
│              OTP SERVICE FLOW                         │
│                                                      │
│  Send OTP:                                           │
│  1. Generate cryptographically random OTP            │
│  2. Store in Redis: otp:{phone}:{purpose} = hash     │
│     TTL = expiry_seconds (default 300s)              │
│  3. Rate limit: max 5 OTPs per phone per hour        │
│  4. Send via SMS (high priority Kafka topic)          │
│  5. If undelivered after 30s → auto-retry via        │
│     alternate route                                  │
│  6. If SMS fails → fallback to WhatsApp (if enabled) │
│                                                      │
│  Verify OTP:                                         │
│  1. Lookup Redis: otp:{phone}:{purpose}              │
│  2. Compare hash (constant-time comparison)          │
│  3. Max 5 verification attempts                      │
│  4. On success → delete from Redis                   │
│  5. On max attempts → lock for 15 minutes            │
│                                                      │
│  Security:                                           │
│  • OTP stored as bcrypt hash (not plaintext)         │
│  • Constant-time comparison (prevent timing attacks) │
│  • IP-based rate limiting on verify endpoint         │
│  • Auto-expire after TTL                             │
│  • One-time use (deleted after verification)         │
└──────────────────────────────────────────────────────┘
```

---

## 18. WhatsApp Business Integration Strategy

### Architecture

```
┌──────────────────────────────────────────────────────────────┐
│            WHATSAPP INTEGRATION                               │
│                                                              │
│  Our Platform ──► WhatsApp Business API (Cloud API / BSP)    │
│                                                              │
│  Integration via:                                            │
│  • Meta Cloud API (direct) — preferred                      │
│  • Or BSP partner (e.g., Gupshup, Kaleyra) — fallback      │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Unified API:                                           │ │
│  │                                                        │ │
│  │ POST /v1/messages/send                                 │ │
│  │ {                                                      │ │
│  │   "to": "919876543210",                                │ │
│  │   "channel": "whatsapp",     // or "sms" or "auto"    │ │
│  │   "type": "template",                                  │ │
│  │   "template": {                                        │ │
│  │     "name": "order_confirmation",                      │ │
│  │     "language": "en",                                  │ │
│  │     "parameters": ["Rahul", "ORD-12345"]               │ │
│  │   }                                                    │ │
│  │ }                                                      │ │
│  │                                                        │ │
│  │ "channel": "auto" → try WhatsApp first, fallback SMS  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Message Types:                                              │
│  • Template messages (pre-approved by Meta)                 │
│  • Session messages (within 24h user-initiated window)      │
│  • Interactive messages (buttons, lists)                    │
│  • Media messages (images, documents, video)                │
│                                                              │
│  Pricing:                                                    │
│  • Meta charges per conversation (24h window)               │
│  • Utility: ~₹0.30/conversation                             │
│  • Marketing: ~₹0.80/conversation                           │
│  • Our markup: 10–20%                                        │
└──────────────────────────────────────────────────────────────┘
```

---

## 19. Disaster Recovery & Business Continuity

### DR Strategy

```
┌──────────────────────────────────────────────────────────────┐
│                DISASTER RECOVERY PLAN                         │
│                                                              │
│  Primary: AWS Mumbai (ap-south-1)                            │
│  DR:      Azure Central India (or AWS Hyderabad)             │
│                                                              │
│  RPO (Recovery Point Objective): < 5 minutes                 │
│  RTO (Recovery Time Objective): < 30 minutes                 │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Replication Strategy:                                  │ │
│  │                                                        │ │
│  │ PostgreSQL:                                            │ │
│  │ • Synchronous replication within AZ (Multi-AZ RDS)    │ │
│  │ • Async cross-region replica (RPO: ~1 min)            │ │
│  │ • Automated daily snapshots (retained 30 days)        │ │
│  │                                                        │ │
│  │ ScyllaDB:                                              │ │
│  │ • RF=3 within primary region                          │ │
│  │ • Async replication to DR region (RPO: ~2 min)        │ │
│  │                                                        │ │
│  │ Kafka:                                                 │ │
│  │ • MirrorMaker 2 to DR Kafka cluster                   │ │
│  │ • Topic-level replication                             │ │
│  │                                                        │ │
│  │ Redis:                                                 │ │
│  │ • Not replicated to DR (rebuilt from source on failovr)│ │
│  │ • Ephemeral data — acceptable to lose                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Failover Procedure:                                         │
│  1. Detect outage (automated health checks, < 2 min)       │
│  2. DNS failover via Route 53 health checks (< 1 min)      │
│  3. Promote DR database replicas to primary                 │
│  4. Start DR Kubernetes cluster services                    │
│  5. Verify SMPP connections from DR region                  │
│  6. Resume message processing                               │
│  7. Total RTO target: < 30 minutes                          │
│                                                              │
│  Regular Testing:                                            │
│  • Monthly: DR database restore test                        │
│  • Quarterly: Full failover drill (off-peak hours)          │
│  • Annually: Chaos engineering (Chaos Monkey)               │
└──────────────────────────────────────────────────────────────┘
```

### Backup Schedule

```
┌──────────────────┬──────────────┬─────────────┬───────────────┐
│ Data Store       │ Backup Freq  │ Retention   │ Storage        │
├──────────────────┼──────────────┼─────────────┼───────────────┤
│ PostgreSQL       │ Daily full   │ 30 days     │ S3 (encrypted) │
│                  │ + WAL archive│             │                │
│ ScyllaDB         │ Daily snapshot│ 14 days    │ S3             │
│ Kafka            │ Topic mirror │ 7 days      │ DR Kafka       │
│ Elasticsearch    │ Daily snapshot│ 7 days     │ S3             │
│ Config/Secrets   │ On change    │ 90 days     │ Vault + S3     │
└──────────────────┴──────────────┴─────────────┴───────────────┘
```

---

## 20. Roadmap Visual Timeline

```
2024
│
├── Q1 (Jan-Mar): Phase 1 — MVP
│   ├── Month 1: Core infrastructure + Auth + Basic API
│   ├── Month 2: SMPP Gateway (1 operator) + Message pipeline
│   └── Month 3: Basic dashboard + Wallet + DLR handling
│
├── Q2 (Apr-Jun): Phase 2 — Production Ready
│   ├── Month 4: Multi-operator SMPP + Routing + MNP
│   ├── Month 5: DLT compliance + Campaigns + Webhooks
│   └── Month 6: Razorpay + Full dashboard + K8s deploy + Load test
│
├── Q3 (Jul-Sep): Phase 3 — Scale & Features
│   ├── Month 7: OTP service + Inbound SMS
│   ├── Month 8: SDKs + Elasticsearch + Advanced analytics
│   └── Month 9: RBAC + Auto-recharge + DR setup + 50K MPS
│
└── Q4 (Oct-Dec): Phase 4 — Market Expansion
    ├── Month 10: WhatsApp Business integration
    ├── Month 11: Developer portal + More SDKs + White-label
    └── Month 12: SOC 2 prep + Self-hosted option + Launch 🚀

Key Milestones:
  🔵 Mar: First SMS sent via platform
  🟢 Jun: Production launch (beta customers)
  🟡 Sep: 50K SMS/sec capacity
  🔴 Dec: Multi-channel (SMS + WhatsApp) GA
```

---

## Summary: Key Success Metrics

| Metric                     | Target                                     | Measurement                      |
| -------------------------- | ------------------------------------------ | -------------------------------- |
| **Delivery Rate**          | > 97% (transactional), > 90% (promotional) | Delivered / Submitted × 100      |
| **API Latency (p99)**      | < 200ms                                    | Prometheus histogram             |
| **End-to-End Delivery**    | < 10s (p95)                                | Submit timestamp → DLR timestamp |
| **System Uptime**          | 99.95%                                     | Monthly uptime calculation       |
| **Throughput**             | 50,000 SMS/sec peak                        | Kafka + SMPP metrics             |
| **SMPP Connection Uptime** | 99.9% per operator                         | Connection monitoring            |
| **Webhook Delivery Rate**  | > 99% (within 5 retries)                   | Webhook success tracking         |
| **Dashboard Load Time**    | < 1.5s (p95)                               | Core Web Vitals                  |
| **Customer Onboarding**    | < 15 min (API to first SMS)                | Tracked in dashboard             |
| **DLT Compliance**         | 100% (all messages template-matched)       | DLT service metrics              |

---

## Quick Reference: Key Decisions

| Decision            | Choice                      | Reasoning                                                                  |
| ------------------- | --------------------------- | -------------------------------------------------------------------------- |
| Architecture        | Event-driven Microservices  | SMS is async; need independent scaling                                     |
| Repository Strategy | 2-repo (backend + frontend) | Shared Go pkg/ in backend monorepo; independent frontend deploys           |
| Backend Language    | Go                          | High performance, low memory, excellent concurrency for SMPP & workers     |
| Frontend Framework  | Next.js 14+ (App Router)    | SSR/SSG for fast dashboard, API routes for BFF, great DX                   |
| SMPP Service        | Go                          | Same language as backend; go-smpp library, goroutines for connection pools |
| Message Queue       | Kafka                       | High throughput, persistence, replay                                       |
| Primary DB          | PostgreSQL                  | ACID, mature, good for relational data                                     |
| Message Store       | ScyllaDB                    | 100K+ writes/sec, perfect for logs                                         |
| Cache               | Redis                       | Fast, versatile, great for rate limiting                                   |
| Cloud               | AWS Mumbai                  | Data localization, low latency for India                                   |
| Container           | Kubernetes (EKS)            | Auto-scaling, resilience, industry standard                                |
| Payment             | Razorpay                    | Best for Indian payments, easy integration                                 |
| UI Components       | shadcn/ui + Tailwind        | Beautiful, accessible, copy-paste components                               |

---
