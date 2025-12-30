---
layout: post
title: "Building Efficient Data Pipelines with SQL Window Functions"
date: 2025-12-28
links:
  - label: "View on LinkedIn"
    url: "https://www.linkedin.com/posts/aur%C3%A9lien-darracq_sql-dataengineering-dataanalytics-activity-7411669929659318272-Cuv0?utm_source=share&utm_medium=member_desktop&rcm=ACoAACj8uyMBzeRBxlTvSvVLQzWamr35ArYrhHE"
    kind: linkedin
tags: [Data Engineering, SQL, Window Functions, Analytics]
---

**Window functions let you perform complex aggregations and rankings across ordered datasets without expensive joins or subqueries, making your data pipelines faster and more readable.**

## ❌ The Problem: Complex Subqueries and Joins
You're calculating month-over-month growth rates using three nested subqueries and a self-join. There's a better way.

Consider this SQL to compute month-over-month sales growth:

```sql
SELECT
    curr.month,
    curr.total_sales,
    prev.total_sales AS prev_month_sales,
    ((curr.total_sales - prev.total_sales) / prev.total_sales) * 100 AS mom_growth
FROM
    (SELECT month, SUM(sales) AS total_sales FROM sales_data GROUP BY month) AS curr
JOIN
    (SELECT month, SUM(sales) AS total_sales FROM sales_data GROUP BY month) AS prev
ON curr.month = DATEADD(MONTH, 1, prev.month);
```
This query is hard to read and inefficient due to multiple aggregations and joins.
## ✅ The Solution: SQL Window Functions
Using window functions, you can simplify the above query significantly:

```sql
SELECT
    month,
    SUM(sales) AS total_sales,
    LAG(SUM(sales)) OVER (ORDER BY month) AS prev_month_sales,
    ((SUM(sales) - LAG(SUM(sales)) OVER (ORDER BY month)) / LAG(SUM(sales)) OVER (ORDER BY month)) * 100 AS mom_growth
FROM sales_data
GROUP BY month;
```
You can ever improve readability by using a CTE:

```sql
WITH monthly_sales AS (
    SELECT
        month,
        SUM(sales) AS total_sales
    FROM sales_data
    GROUP BY month
)
SELECT
    month,
    total_sales,
    LAG(total_sales) OVER (ORDER BY month) AS prev_month_sales,
    ((total_sales - LAG(total_sales) OVER (ORDER BY month)) / LAG(total_sales) OVER (ORDER BY month)) * 100 AS mom_growth
FROM monthly_sales;
```
For this precise example it can be over kill to use CTE, but in more complex queries it can help with readability and maintainability.

## Key Window Functions
- `LAG()` and `LEAD()`: Access data from previous or next rows without self-joins.
- `ROW_NUMBER()`, `RANK()`, `DENSE_RANK()`: Assign unique or ranked numbers to rows within partitions.
- `SUM() OVER()`, `AVG() OVER()`: Perform cumulative or moving aggregates.

## Improving Performance
1. Always Define Frame Bounds for Aggregations
    ```sql
    -- ❌ SLOW: Unbounded (recalculates from start every row)
    SUM(revenue) OVER (ORDER BY date)
    ```
    ```sql
    -- ✅ FAST: Bounded window
    SUM(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW)
    ```
2. Partition Large Datasets
    ```sql
    -- Splits dataset into smaller chunks for parallel processing
    SELECT 
        date,
        product_category,
        revenue,
        SUM(revenue) OVER (
            PARTITION BY product_category 
            ORDER BY date
        ) as category_running_total
    FROM daily_sales;
    -- Processes each category independently ✅
    ```
3.  Use ROWS vs RANGE Carefully
    ```sql
    -- ROWS: Physical row offset (faster)
    SUM(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    )
    ```
    ```sql
    -- RANGE: Logical value range (slower, handles ties)
    SUM(revenue) OVER (
        ORDER BY date 
        RANGE BETWEEN INTERVAL '6 days' PRECEDING AND CURRENT ROW
    )
    ```
4. Reuse Window Definitions
    ```sql
    -- ❌ INEFFICIENT: Recalculates ordering multiple times
    SELECT 
        date,
        LAG(revenue) OVER (ORDER BY date),
        LEAD(revenue) OVER (ORDER BY date),
        SUM(revenue) OVER (ORDER BY date)
    FROM daily_sales;
    ```
    ```sql
    -- ✅ EFFICIENT: Define window once
    SELECT 
        date,
        LAG(revenue) OVER w,
        LEAD(revenue) OVER w,
        SUM(revenue) OVER w
    FROM daily_sales
    WINDOW w AS (ORDER BY date);
    ```

##  Real World Performance Comparisons
### Scenario: Calculate 30-day metrics for 5 years of daily data (~1,825 rows)

- Query A: Using **LAG()** only
```sql
SELECT 
    date,
    revenue,
    LAG(revenue, 30) OVER (ORDER BY date) as revenue_30d_ago,
    revenue - LAG(revenue, 30) OVER (ORDER BY date) as change_30d
FROM daily_sales;
-- Execution time: ~50ms ✅
```
- Query B: Using **SUM OVER** (unbounded)
```sql
SELECT 
    date,
    revenue,
    SUM(revenue) OVER (ORDER BY date) as running_total
FROM daily_sales;
-- Execution time: ~180ms ⚠️
```
- Query C: Using **SUM OVER** (bounded 30-day window)
```sql
SELECT 
    date,
    revenue,
    SUM(revenue) OVER (
        ORDER BY date 
        ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
    ) as rolling_30d_total
FROM daily_sales;
-- Execution time: ~75ms ✅
```

## When to use each approach

#### Use LAG/LEAD When:

    ✅ Comparing specific rows (yesterday, last week, last month)
    ✅ Calculating period-over-period changes
    ✅ Finding next/previous non-null values
    ✅ Performance is critical
```sql
-- Perfect use cases
LAG(revenue, 1) OVER (ORDER BY date) as yesterday
LAG(revenue, 7) OVER (ORDER BY date) as last_week
LAG(revenue, 30) OVER (ORDER BY date) as last_month
```

#### Use SUM/AVG OVER When:
    ✅ Calculating running totals
    ✅ Computing moving averages
    ✅ Aggregating within sliding windows
    ✅ Need cumulative metrics

```sql
-- Perfect use cases
SUM(revenue) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) -- running total
AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) -- 7-day MA
SUM(orders) OVER (PARTITION BY region ORDER BY date) -- regional running totals
```

#### ADVANCED: Hybrid Approach (Best Performance)
```sql
-- Combine techniques for optimal performance
WITH daily_metrics AS (
    SELECT 
        date,
        revenue,
        -- Fast LAG operations
        LAG(revenue, 1) OVER w as prev_day,
        LAG(revenue, 7) OVER w as prev_week,
        
        -- Bounded aggregations
        AVG(revenue) OVER (
            ORDER BY date 
            ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
        ) as ma_7day,
        
        -- Row number (very fast)
        ROW_NUMBER() OVER w as day_number
    FROM daily_sales
    WINDOW w AS (ORDER BY date)
)
SELECT 
    *,
    revenue - prev_day as daily_change,
    revenue - prev_week as weekly_change,
    revenue - ma_7day as vs_7day_avg
FROM daily_metrics;
-- Execution time: ~60ms ✅
```

## Bottom Line (Conclusion)

### Performance Ranking (Fast → Slow):

1. 🥇 ROW_NUMBER / RANK - Simple enumeration
2. 🥈 LAG / LEAD - Direct row access (O(1))
3. 🥉 SUM/AVG with bounded ROWS - Fixed window size
4. ⚠️ SUM/AVG with RANGE - Value-based frames
5. 🐌 SUM/AVG unbounded - Recalculates everything (O(N²))

### Choose based on:
- Need point comparisons? → LAG/LEAD
- Need cumulative values? → SUM OVER with bounds
- Need both? → Combine them efficiently with WINDOW clause