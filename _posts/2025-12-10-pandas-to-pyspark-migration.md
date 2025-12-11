---
layout: post
title: "When to Migrate from Pandas to PySpark: Configuration, Hybrid Patterns, and ML Integration"
date: 2025-12-10
links:
  - label: "View on LinkedIn"
    url: "#"
    kind: linkedin
tags: [Data Engineering, Python, PySpark, Pandas, Machine Learning]
---

Your churn model crashes at 15GB? Before rewriting everything for PySpark, try Pandas optimizations first (for example, `pd.read_csv(chunksize=10000)` and dtype tuning); if those don't help, then tune Spark settings such as `spark.driver.memory`.

**Key Takeaway:** Before migrating to PySpark, tune Pandas memory usage with chunking and dtypes. When you do migrate, use PySpark for transformations and convert back to Pandas for ML—while optimizing `spark.config` for your workload.

In this post, I’ll share a decision framework for migrating from Pandas to PySpark, including configuration tricks and hybrid patterns.

---

## ❌ The Problem: Premature Migration & Misconfiguration

Developers often jump to PySpark without exhausting Pandas optimizations (chunking, dtypes, dask). Conversely, PySpark users often don't configure memory or partitions properly, creating new bottlenecks.

Consider three scenarios:
1.  **8GB CSV**: Pandas could handle this with optimization.
2.  **20GB Transaction Data**: Needs a hybrid approach.
3.  **50GB Dataset**: Requires pure PySpark with proper configuration.

---

## ✅ The Solution: A Migration Decision Tree

Migration isn't binary—it's a spectrum from Pandas optimization → Hybrid → Full PySpark, each requiring different configuration strategies.

### 📊 Decision Framework

| Data Size | Strategy | Key Configuration |
|-----------|----------|-------------------|
| **< 10GB** | **Pandas Optimization** | `chunksize`, `dtype` optimization |
| **10-50GB** | **Hybrid (PySpark → Pandas)** | `spark.driver.memory` (for collection) |
| **> 50GB** | **Pure PySpark** | `spark.sql.shuffle.partitions`, AQE |

### 1. Data < 10GB: Optimize Pandas First

Before rewriting code, profile your Pandas memory with `df.memory_usage(deep=True)` and try dtype optimization.

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

### 2. Data 10-50GB: Hybrid PySpark → Pandas

Use PySpark for heavy lifting (ETL), then aggregate down to a size Pandas can handle for ML (e.g., scikit-learn).

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

### 3. Data > 50GB: Pure PySpark with Tuning

For large-scale processing, you need to tune Spark configurations like partitions and adaptive query execution.

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


## 🔑 Key Config Reference

Don't forget these essential settings:

```python
# Essential spark.config settings
.config("spark.driver.memory", "8g")           # For .toPandas() conversions
.config("spark.executor.memory", "4g")         # Per-worker memory
.config("spark.sql.shuffle.partitions", "200") # Default is 200, tune to data size
.config("spark.sql.adaptive.enabled", "true")  # Auto-optimize at runtime
```


## 🚀 Call to Action

What's your migration blocker ? Pandas memory limits, spark configuration confusion, or losing access to ML libraries? Let's troubleshoot in the comments.
