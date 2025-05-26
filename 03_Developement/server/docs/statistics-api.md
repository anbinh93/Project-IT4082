# Statistics API Documentation

## Base URL
```
/api/statistics
```

## Authentication
Tất cả endpoints yêu cầu:
- Bearer token trong header Authorization
- Role: `admin`, `manager`, hoặc `accountant` (Ban Quản Trị)

## Use Case: KT006 - Truy cập chức năng Thống kê

### Mô tả
Cho phép Ban Quản Trị (BQT) truy cập giao diện chính của chức năng thống kê với các lựa chọn báo cáo khác nhau.

## Endpoints

### 1. Lấy tổng quan thống kê (Main Dashboard)

**GET** `/api/statistics/overview`

#### Mô tả
Endpoint chính cho use case KT006. Hiển thị giao diện tổng quan về thống kê với các số liệu tổng hợp và danh sách các báo cáo có sẵn.

#### Response (200 OK)
```json
{
  "overview": {
    "population": {
      "total": 1250,
      "byGender": [
        {
          "gender": "Nam",
          "count": 630
        },
        {
          "gender": "Nữ", 
          "count": 620
        }
      ],
      "byAgeGroup": [
        {
          "ageGroup": "Dưới 18",
          "count": 280
        },
        {
          "ageGroup": "18-60",
          "count": 820
        },
        {
          "ageGroup": "Trên 60",
          "count": 150
        }
      ]
    },
    "feeCollection": {
      "yearly": {
        "total": 150000000,
        "transactions": 450
      },
      "monthly": {
        "total": 12500000,
        "transactions": 38
      },
      "activeFeeTypes": 5
    },
    "households": {
      "total": 320,
      "byDistrict": [
        {
          "district": "Ba Đình",
          "count": 85
        },
        {
          "district": "Hoàn Kiếm",
          "count": 72
        }
      ],
      "bySizeGroup": [
        {
          "sizeGroup": "2-4 người",
          "count": 180
        },
        {
          "sizeGroup": "1 người",
          "count": 65
        }
      ]
    },
    "recentActivities": {
      "recentPayments": [
        {
          "id": 45,
          "amount": 500000,
          "householdHead": "Nguyễn Văn A",
          "feeType": "Phí quản lý",
          "date": "2024-01-15T10:30:00.000Z"
        }
      ],
      "recentHouseholds": [
        {
          "id": 123,
          "householdHead": "Trần Thị B",
          "address": "123 Đường ABC, Phường XYZ, Quận DEF",
          "date": "2024-01-14T15:20:00.000Z"
        }
      ]
    }
  },
  "availableReports": {
    "population": {
      "title": "Thống kê Nhân khẩu",
      "description": "Báo cáo về dân số, độ tuổi, giới tính, nghề nghiệp",
      "endpoint": "/api/statistics/population",
      "icon": "users"
    },
    "feeCollection": {
      "title": "Thống kê Thu phí",
      "description": "Báo cáo về các khoản thu, tình hình nộp phí",
      "endpoint": "/api/statistics/fee-collection",
      "icon": "dollar-sign"
    },
    "households": {
      "title": "Thống kê Hộ khẩu",
      "description": "Báo cáo về số lượng hộ khẩu, phân bố địa lý",
      "endpoint": "/api/statistics/households",
      "icon": "home"
    },
    "temporaryResidence": {
      "title": "Thống kê Tạm trú/Tạm vắng",
      "description": "Báo cáo về tình hình tạm trú, tạm vắng",
      "endpoint": "/api/statistics/temporary-residence",
      "icon": "map-pin"
    }
  }
}
```

### 2. Lấy danh sách báo cáo có sẵn

**GET** `/api/statistics/reports`

#### Mô tả
Lấy danh sách chi tiết tất cả các báo cáo thống kê có sẵn trong hệ thống.

#### Response (200 OK)
```json
{
  "reports": [
    {
      "id": "population-overview",
      "title": "Tổng quan Nhân khẩu",
      "category": "population",
      "description": "Thống kê tổng quan về dân số trong khu vực",
      "endpoint": "/api/statistics/population/overview"
    },
    {
      "id": "population-demographics",
      "title": "Nhân khẩu học",
      "category": "population",
      "description": "Phân tích theo độ tuổi, giới tính, nghề nghiệp",
      "endpoint": "/api/statistics/population/demographics"
    },
    {
      "id": "fee-collection-summary",
      "title": "Tổng quan Thu phí",
      "category": "fee-collection",
      "description": "Tình hình thu phí tổng quan",
      "endpoint": "/api/statistics/fee-collection/summary"
    },
    {
      "id": "fee-collection-detailed",
      "title": "Chi tiết Thu phí",
      "category": "fee-collection",
      "description": "Phân tích chi tiết theo từng khoản thu",
      "endpoint": "/api/statistics/fee-collection/detailed"
    },
    {
      "id": "household-distribution",
      "title": "Phân bố Hộ khẩu",
      "category": "households",
      "description": "Phân bố hộ khẩu theo địa lý và quy mô",
      "endpoint": "/api/statistics/households/distribution"
    },
    {
      "id": "temporary-residence",
      "title": "Tạm trú/Tạm vắng",
      "category": "temporary-residence",
      "description": "Thống kê tình hình tạm trú, tạm vắng",
      "endpoint": "/api/statistics/temporary-residence/summary"
    }
  ],
  "categories": [
    {
      "id": "population",
      "name": "Nhân khẩu",
      "icon": "users"
    },
    {
      "id": "fee-collection",
      "name": "Thu phí",
      "icon": "dollar-sign"
    },
    {
      "id": "households",
      "name": "Hộ khẩu",
      "icon": "home"
    },
    {
      "id": "temporary-residence",
      "name": "Tạm trú/Tạm vắng",
      "icon": "map-pin"
    }
  ]
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Token không hợp lệ hoặc đã hết hạn"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "FORBIDDEN",
    "message": "Không có quyền truy cập chức năng thống kê"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": {
    "code": "STATISTICS_OVERVIEW_ERROR",
    "message": "Lỗi khi lấy thống kê tổng quan",
    "details": "Error message (chỉ hiển thị trong development mode)"
  }
}
```

## Use Case Flow

### KT006 - Truy cập chức năng Thống kê

1. **BQT đăng nhập** vào hệ thống
2. **BQT chọn mục "Thống kê"** từ menu chính
3. **Frontend gọi** `GET /api/statistics/overview`
4. **Hệ thống trả về** giao diện tổng quan với:
   - Số liệu tổng hợp (nhân khẩu, thu phí, hộ khẩu)
   - Hoạt động gần đây
   - Danh sách các báo cáo có sẵn
5. **BQT có thể**:
   - Xem tổng quan nhanh
   - Chọn loại báo cáo cụ thể
   - Điều hướng đến báo cáo chi tiết

## Frontend Integration

### React Component Example
```jsx
import React, { useState, useEffect } from 'react';
import { getStatisticsOverview } from '../api/statistics';

function StatisticsDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const data = await getStatisticsOverview();
        setOverview(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="statistics-dashboard">
      <h1>Thống kê Tổng quan</h1>
      
      {/* Quick Stats Cards */}
      <div className="stats-cards">
        <div className="card">
          <h3>Tổng Nhân khẩu</h3>
          <span>{overview.overview.population.total}</span>
        </div>
        <div className="card">
          <h3>Tổng Hộ khẩu</h3>
          <span>{overview.overview.households.total}</span>
        </div>
        <div className="card">
          <h3>Thu phí tháng này</h3>
          <span>{overview.overview.feeCollection.monthly.total.toLocaleString()} VNĐ</span>
        </div>
      </div>

      {/* Available Reports */}
      <div className="available-reports">
        <h2>Báo cáo chi tiết</h2>
        {Object.entries(overview.availableReports).map(([key, report]) => (
          <div key={key} className="report-card">
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <button onClick={() => navigateToReport(report.endpoint)}>
              Xem báo cáo
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Next Steps

Sau khi triển khai use case cha KT006, các use case con có thể được phát triển:

1. **KT006.1** - Thống kê Nhân khẩu chi tiết
2. **KT006.2** - Thống kê Thu phí chi tiết  
3. **KT006.3** - Thống kê Hộ khẩu chi tiết
4. **KT006.4** - Thống kê Tạm trú/Tạm vắng

Mỗi use case con sẽ có endpoint riêng và logic xử lý phức tạp hơn. 