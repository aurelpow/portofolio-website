---
layout: post
title: "When to Migrate from Pandas to PySpark: Configuration, Hybrid Patterns, and ML Integration"
date: 2025-12-10
links:
  - label: "View on LinkedIn"
    url: "https://www.linkedin.com/posts/aur%C3%A9lien-darracq_datascience-python-machinelearning-activity-7405147001153298432-cFNN?utm_source=share&utm_medium=member_desktop&rcm=ACoAACj8uyMBzeRBxlTvSvVLQzWamr35ArYrhHE"
    kind: linkedin
tags: [Data Engineering, Python, PySpark, Pandas, Machine Learning]
---

Your churn model crashes at 15GB? Before rewriting everything for PySpark, try Pandas optimizations first (for example, `pd.read_csv(chunksize=10000)` and dtype tuning); if those don't help, then tune Spark settings such as `spark.driver.memory`.

**Most importantly:** don't waste money on cloud clusters if simple optimization solves the problem.

**Key Takeaway:** Before migrating to PySpark, tune Pandas memory usage with chunking and dtypes. When you do migrate, use PySpark for transformations and convert back to Pandas for ML—while optimizing `spark.config` for your workload and your budget.

In this post, I'll share a decision framework for migrating from Pandas to PySpark, including configuration tricks, hybrid patterns, and cost considerations.

---

## ❌ The Problem: Premature Migration, Misconfiguration & Overspending

Developers often jump to PySpark without exhausting Pandas optimizations (chunking, dtypes, dask), leading to unnecessary cloud infrastructure costs. Conversely, PySpark users often don't configure memory or partitions properly, creating new bottlenecks and wasting compute resources.

Consider three scenarios:
1.  **8GB CSV**: Pandas could handle this with optimization : **no cloud costs needed.**
2.  **20GB Transaction Data**: Needs a hybrid approach : **pay only for data prep, not modeling.**
3.  **50GB Dataset**: Requires pure PySpark with proper configuration : **necessary investment.**

---

## ✅ The Solution: A Migration Decision Tree

Migration isn't binary, it's a spectrum from Pandas optimization → Hybrid → Full PySpark, each requiring different configuration strategies and different cost implications.

### 📊 Decision Framework

| Data Size | Strategy | Key Configuration | Cost Impact |
|-----------|----------|-------------------|-------------|
| **< 10GB** | **Pandas Optimization** | `chunksize`, `dtype` optimization | FREE (local) |
| **10-50GB** | **Hybrid (PySpark → Pandas)** | `spark.driver.memory` (for collection) | Minutes of cluster time |
| **> 50GB** | **Pure PySpark** | `spark.sql.shuffle.partitions`, AQE | Worth the investment |
### 1. Data < 10GB: Optimize Pandas First (Cost: $0)

Before rewriting code, profile your Pandas memory with `df.memory_usage(deep=True)` and try dtype optimization. This approach costs nothing and often solves the problem.

**Example: Pandas Optimization**

```python
# Before migrating, optimize Pandas memory
import pandas as pd

dtypes = {'user_id': 'int32', 'category': 'category', 'amount': 'float32'}
chunks = pd.read_csv('data.csv', chunksize=50000, dtype=dtypes)

# Process in chunks
results = []
for chunk in chunks:
    processed = chunk.groupby('user_id')['amount'].sum()
    results.append(processed)
df_final = pd.concat(results)
```
💰 **Cost Analysis:** Runs on your laptop. Zero cloud costs.

### 2. Data 10-50GB: Hybrid PySpark → Pandas (Cost Optimized)

Use PySpark for heavy lifting (ETL), then aggregate down to a size Pandas can handle for ML (e.g., scikit-learn). 
You only pay for Spark during data preparation (minutes), not during model training (hours).

**Example: Hybrid with Spark Config**

```python
# Configure Spark for your workload
from pyspark.sql import SparkSession
import pyspark.sql.functions as F

spark = SparkSession.builder \
    .appName("FeatureEngineering") \
    .config("spark.driver.memory", "8g") \
    .config("spark.executor.memory", "4g") \
    .config("spark.sql.shuffle.partitions", "200") \
    .getOrCreate()

# PySpark: Feature engineering on 20GB data
features = spark.read.parquet('transactions.parquet') \
    .repartition(100, 'customer_id') \
    .groupBy('customer_id') \
    .agg(F.sum('amount').alias('total_spent'),
         F.count('*').alias('transaction_count'))

# Convert aggregated data (500MB) to Pandas
df_small = features.toPandas()

# Use scikit-learn as usual
from sklearn.ensemble import RandomForestClassifier
# model = RandomForestClassifier()
# model.fit(df_small[['total_spent', 'transaction_count']], y_train)
```
💰 **Cost Analysis:**

- **Spark cluster:** ~5 minutes for data prep (e.g., $0.50 on AWS EMR)
- **Model training:** Runs locally on Pandas (FREE)
- **Total:** Much cheaper than running full pipeline on Spark

### 3. Data > 50GB: Pure PySpark with Tuning (Cost: Necessary)

For large-scale processing, you need to tune Spark configurations like partitions and adaptive query execution. At this scale, the investment is necessary—nothing else will work.

**Example: Pure PySpark with Tuning**

```python
from pyspark.sql.window import Window

# For large-scale pure PySpark (50GB+)
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")

sessions = spark.read.json('clickstream.json') \
    .repartition(200) \
    .withColumn('session_duration', 
                F.last('timestamp').over(Window.partitionBy('user_id')) - 
                F.first('timestamp').over(Window.partitionBy('user_id'))) \
    .groupBy('user_id').agg(
        F.count('page_view').alias('total_views'))

sessions.write.mode('overwrite').parquet('sessions.parquet')
```
💰 **Cost Analysis:**

- **Spark cluster:** 10-15 minutes for full processing
- **Cost:** Depends on cluster size, but unavoidable at this data scale
- **Optimization tip:** Use spot instances to reduce costs by 70-90%

### Optional: Full PySpark ML Example

If you migrate completely to PySpark (no `.toPandas()`), use Spark ML to train and evaluate models at scale. Here's a compact example using `RandomForestClassifier` from `pyspark.ml`.

```python
# Prepare features and label (assumes numeric columns exist on `sessions`)
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.classification import RandomForestClassifier
from pyspark.ml.evaluation import BinaryClassificationEvaluator

feature_cols = ['total_views', 'session_duration']
assembler = VectorAssembler(inputCols=feature_cols, outputCol='features')
data = assembler.transform(sessions).select('features', 'label')

# Train / test split
train, test = data.randomSplit([0.8, 0.2], seed=42)

# Train a Spark ML Random Forest
rf = RandomForestClassifier(labelCol='label', featuresCol='features', numTrees=50)
model = rf.fit(train)

# Predict and evaluate
preds = model.transform(test)
evaluator = BinaryClassificationEvaluator(labelCol='label', rawPredictionCol='rawPrediction')
auc = evaluator.evaluate(preds)
print(f"Test AUC: {auc:.4f}")

# Save the model for later
model.write().overwrite().save('models/spark_rf_model')
```
💰**Cost Analysis**: Entire pipeline runs on Spark cluster—essential for datasets that won't fit in memory.

## 🔑 Key Config Reference

Don't forget these essential settings:

```python
# Essential spark.config settings
.config("spark.driver.memory", "8g")           # For .toPandas() conversions
.config("spark.executor.memory", "4g")         # Per-worker memory
.config("spark.sql.shuffle.partitions", "200") # Default is 200, tune to data size
.config("spark.sql.adaptive.enabled", "true")  # Auto-optimize at runtime
```

## 💸 Cost Optimization Tips

1. Always try Pandas optimization first : It's free!
2. Use the hybrid approach when possible : Pay only for what you need
3. Shut down Spark clusters immediately after data prep in hybrid scenarios
4. Use spot instances for PySpark jobs (70-90% cost reduction)
5. Profile before scaling : Don't guess at cluster sizes
6. Consider Databricks Community Edition for learning (free tier)

## 🚀 Call to Action

What's your migration blocker ? Pandas memory limits, spark configuration confusion, or losing access to ML libraries? Let's troubleshoot in the comments of my LinkedIn post [here](https://www.linkedin.com/posts/aur%C3%A9lien-darracq_datascience-python-machinelearning-activity-7405147001153298432-cFNN?utm_source=share&utm_medium=member_desktop&rcm=ACoAACj8uyMBzeRBxlTvSvVLQzWamr35ArYrhHE).
