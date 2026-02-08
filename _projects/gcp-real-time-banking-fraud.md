---
layout: project
title: Real-Time Banking Fraud Detection — Serverless Streaming Pipeline
thumb: /assets/img/project/gcp-fraud-detection-banner.png
date: 2026-02-08
permalink: /projects/realtime-fraud-detection-pipeline/
repo: https://github.com/aurelpow/gcp-banking-fraud-real-time
external_url: https://github.com/aurelpow/gcp-banking-fraud-real-time
tags: [Data Engineering, GCP, Real-Time Streaming, BigQuery, Pub/Sub, Terraform, Python, Medallion Architecture, Infrastructure as Code, Fraud Detection]
---

A **real-time streaming ETL pipeline** that detects fraudulent banking transactions with **< 1 second latency**, processing data through a **medallion architecture** on Google Cloud Platform.
Built with **serverless cloud-native technologies** for scalability, cost-efficiency, and production-grade observability 🚀.

---

## 🔑 Key Highlights
- **Real-time streaming** 📡: Pub/Sub to BigQuery with sub-second latency via native auto-ingestion — no Cloud Functions or Dataflow needed
- **Medallion architecture** 🏗️: Bronze (raw) → Silver (cleaned & enriched) → Gold (business metrics) with scheduled queries
- **Fraud analytics** 📊: Risk scoring, merchant profiling, hourly fraud rate monitoring
- **Infrastructure as Code** ⚙️: One-command deployment with Terraform; fully reproducible
- **Cost-optimized** 💰: Test the complete pipeline for under $2; pause/resume scripts to minimize idle costs

---

## 🏗️ Architecture Overview

```
┌─────────────────┐
│ Python Producer │  Synthetic banking transactions (1 TPS)
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────────────────────────────────────────────┐
│                  GOOGLE CLOUD PLATFORM                  │
│                                                         │
│  Pub/Sub Topic ──▶ BigQuery Subscription (< 1s)         │
│                          │                              │
│       ┌──────────────────▼──────────────────────┐       │
│       │       MEDALLION ARCHITECTURE            │       │
│       │                                         │       │
│       │  🥉 Bronze — Raw JSON storage (auto)    │       │
│       │  🥈 Silver — Cleaned, enriched, scored  │       │
│       │       (scheduled query, every 30 min)   │       │
│       │  🥇 Gold — Fraud metrics & merchant     │       │
│       │       analytics (scheduled, every 1 hr) │       │
│       └──────────────────┬──────────────────────┘       │
│                          ▼                              │
│               Looker Studio Dashboards                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 What Each Layer Does

### 🥉 Bronze — Raw Ingestion
Stores raw Pub/Sub messages as-is into BigQuery. Fully serverless, zero code required.

### 🥈 Silver — Cleaning & Enrichment
Scheduled query (every 30 min) that parses JSON into structured data and adds:
- **Merchant categorization** (E-commerce, Retail, Food & Beverage, Fuel)
- **Risk score** (0.1–0.9 based on amount and fraud flag)
- **Temporal features** (hour of day, day of week, amount bucket)
- **Deduplication** to prevent duplicate processing

### 🥇 Gold — Business Analytics
Two hourly scheduled queries produce analytics-ready tables:
- **Fraud metrics**: Hourly transaction counts, fraud rate, volume, high-risk user counts
- **Merchant analytics**: Per-merchant fraud rates, transaction volumes, average amounts

---

## 🛠️ Technology Stack

### Cloud Infrastructure (GCP)
- **Pub/Sub** — Real-time message queue (serverless, auto-scaling)
- **BigQuery** — Data warehouse, scheduled queries for ETL
- **Cloud Logging** — Observability and error tracking

### Infrastructure & Pipeline
- **Terraform** — Provision all GCP resources as code
- **Python 3.8+** — Transaction data generator with `google-cloud-pubsub`
- **Service Accounts** — Least-privilege IAM, no hardcoded credentials

---

## 🔮 Next Steps
- CI/CD pipeline with GitHub Actions for automated Terraform deploy 🔁
- Real-time ML fraud prediction with BigQuery ML 🤖
- Cloud Monitoring dashboards with SLO/SLI tracking 📊
- Dataflow & Cloud Composer for complex streaming at scale 🚀