# Population Statistics API Documentation

## Base URL
```
/api/statistics/population
```

## Authentication
Tất cả endpoints yêu cầu:
- Bearer token trong header Authorization
- Role: `admin`, `manager`, hoặc `accountant` (Ban Quản Trị)

## Use Cases Overview

### TT006 - Thống kê nhân khẩu theo giới tính
### TT007 - Thống kê nhân khẩu theo độ tuổi  
### TT008 - Thống kê biến động nhân khẩu theo khoảng thời gian
### TT009 - Thống kê nhân khẩu theo tình trạng tạm trú, tạm vắng

## Endpoints

### 1. Tổng quan thống kê nhân khẩu

**GET** `/api/statistics/population/overview`

#### Mô tả
Hiển thị tổng quan tất cả các loại thống kê nhân khẩu và danh sách báo cáo có sẵn.

#### Response (200 OK)
```json
{
  "overview": {
    "gender": {
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
      ]
    },
    "age": {
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
    "temporaryStatus": {
      "temporaryResidence": 45,
      "temporaryAbsence": 23
    }
  },
  "availableReports": [
    {
      "id": "gender-statistics",
      "title": "Thống kê theo giới tính",
      "endpoint": "/api/statistics/population/gender",
      "description": "Phân tích số lượng và tỷ lệ theo giới tính"
    },
    {
      "id": "age-statistics",
      "title": "Thống kê theo độ tuổi",
      "endpoint": "/api/statistics/population/age",
      "description": "Phân tích số lượng và tỷ lệ theo nhóm tuổi"
    },
    {
      "id": "movement-statistics",
      "title": "Thống kê biến động",
      "endpoint": "/api/statistics/population/movement",
      "description": "Thống kê chuyển đến, chuyển đi theo thời gian"
    },
    {
      "id": "temporary-status",
      "title": "Thống kê tạm trú/tạm vắng",
      "endpoint": "/api/statistics/population/temporary-status",
      "description": "Thống kê tình trạng tạm trú, tạm vắng"
    }
  ]
}
```

### 2. TT006 - Thống kê theo giới tính

**GET** `/api/statistics/population/gender`

#### Mô tả
Hiển thị số lượng và tỷ lệ nhân khẩu theo từng giới tính với biểu đồ tròn.

#### Response (200 OK)
```json
{
  "statistics": {
    "total": 1250,
    "byGender": [
      {
        "gender": "Nam",
        "count": 630,
        "percentage": 50.4
      },
      {
        "gender": "Nữ",
        "count": 620,
        "percentage": 49.6
      }
    ],
    "chartData": [
      {
        "label": "Nam",
        "value": 630,
        "percentage": 50.4
      },
      {
        "label": "Nữ",
        "value": 620,
        "percentage": 49.6
      }
    ]
  },
  "summary": {
    "totalPopulation": 1250,
    "genderDistribution": {
      "Nam": {
        "count": 630,
        "percentage": 50.4
      },
      "Nữ": {
        "count": 620,
        "percentage": 49.6
      }
    }
  }
}
```

#### Response khi không có dữ liệu (200 OK)
```json
{
  "message": "Chưa có dữ liệu nhân khẩu để thống kê.",
  "statistics": {
    "total": 0,
    "byGender": [],
    "chartData": []
  }
}
```

### 3. TT007 - Thống kê theo độ tuổi

**GET** `/api/statistics/population/age`

#### Query Parameters
- `customAgeGroups` (optional): JSON string định nghĩa nhóm tuổi tùy chỉnh

#### Mô tả
Hiển thị số lượng và tỷ lệ nhân khẩu theo các nhóm độ tuổi với biểu đồ cột.

#### Nhóm tuổi mặc định
```json
[
  { "name": "0-6 tuổi", "min": 0, "max": 6 },
  { "name": "7-14 tuổi", "min": 7, "max": 14 },
  { "name": "15-18 tuổi", "min": 15, "max": 18 },
  { "name": "19-30 tuổi", "min": 19, "max": 30 },
  { "name": "31-45 tuổi", "min": 31, "max": 45 },
  { "name": "46-60 tuổi", "min": 46, "max": 60 },
  { "name": "Trên 60 tuổi", "min": 61, "max": 150 }
]
```

#### Response (200 OK)
```json
{
  "statistics": {
    "total": 1200,
    "byAgeGroup": [
      {
        "ageGroup": "0-6 tuổi",
        "minAge": 0,
        "maxAge": 6,
        "count": 120,
        "percentage": 10.0
      },
      {
        "ageGroup": "7-14 tuổi",
        "minAge": 7,
        "maxAge": 14,
        "count": 160,
        "percentage": 13.33
      },
      {
        "ageGroup": "15-18 tuổi",
        "minAge": 15,
        "maxAge": 18,
        "count": 80,
        "percentage": 6.67
      },
      {
        "ageGroup": "19-30 tuổi",
        "minAge": 19,
        "maxAge": 30,
        "count": 350,
        "percentage": 29.17
      },
      {
        "ageGroup": "31-45 tuổi",
        "minAge": 31,
        "maxAge": 45,
        "count": 320,
        "percentage": 26.67
      },
      {
        "ageGroup": "46-60 tuổi",
        "minAge": 46,
        "maxAge": 60,
        "count": 120,
        "percentage": 10.0
      },
      {
        "ageGroup": "Trên 60 tuổi",
        "minAge": 61,
        "maxAge": 150,
        "count": 50,
        "percentage": 4.17
      }
    ],
    "chartData": [
      {
        "label": "0-6 tuổi",
        "value": 120,
        "percentage": 10.0
      }
      // ... more items
    ],
    "ageGroupsUsed": [
      // Nhóm tuổi đã sử dụng
    ]
  },
  "summary": {
    "totalWithAgeData": 1200,
    "ageDistribution": [
      // Same as byAgeGroup
    ]
  }
}
```

#### Error Response - Nhóm tuổi không hợp lệ (400 Bad Request)
```json
{
  "error": {
    "code": "INVALID_AGE_GROUPS",
    "message": "Khoảng tuổi không hợp lệ. Tuổi bắt đầu phải nhỏ hơn hoặc bằng tuổi kết thúc."
  }
}
```

### 4. TT008 - Thống kê biến động nhân khẩu

**GET** `/api/statistics/population/movement`

#### Query Parameters (Required)
- `fromDate`: Ngày bắt đầu (YYYY-MM-DD)
- `toDate`: Ngày kết thúc (YYYY-MM-DD)

#### Mô tả
Hiển thị số lượng nhân khẩu chuyển đến, chuyển đi trong khoảng thời gian cụ thể.

#### Response (200 OK)
```json
{
  "statistics": {
    "period": {
      "fromDate": "2024-01-01",
      "toDate": "2024-01-31"
    },
    "movements": {
      "moveIn": 25,
      "moveOut": 18,
      "netChange": 7
    },
    "breakdown": {
      "newRegistrations": 15,
      "officialMoveIn": 10,
      "officialMoveOut": 18
    }
  },
  "summary": {
    "totalMovements": 43,
    "netPopulationChange": 7,
    "changeType": "Tăng"
  }
}
```

#### Response khi không có biến động (200 OK)
```json
{
  "message": "Không có biến động nhân khẩu trong khoảng thời gian này.",
  "statistics": {
    "period": {
      "fromDate": "2024-01-01",
      "toDate": "2024-01-31"
    },
    "movements": {
      "moveIn": 0,
      "moveOut": 0,
      "netChange": 0
    }
  }
}
```

#### Error Responses
```json
// Missing date range (400)
{
  "error": {
    "code": "MISSING_DATE_RANGE",
    "message": "Vui lòng cung cấp ngày bắt đầu và ngày kết thúc"
  }
}

// Invalid date format (400)
{
  "error": {
    "code": "INVALID_DATE_FORMAT",
    "message": "Định dạng ngày không hợp lệ"
  }
}

// Invalid date range (400)
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu"
  }
}
```

### 5. TT009 - Thống kê tạm trú, tạm vắng

**GET** `/api/statistics/population/temporary-status`

#### Query Parameters
- `mode` (optional): `current` (mặc định) hoặc `period`
- `fromDate` (required if mode=period): Ngày bắt đầu
- `toDate` (required if mode=period): Ngày kết thúc  
- `includeDetails` (optional): `true` để bao gồm danh sách chi tiết

#### Mô tả
Hiển thị số lượng nhân khẩu đang tạm trú, tạm vắng (tình trạng hiện tại hoặc theo khoảng thời gian).

#### Response - Tình trạng hiện tại (200 OK)
```json
{
  "statistics": {
    "mode": "current",
    "period": null,
    "temporaryStatus": {
      "temporaryResidence": 45,
      "temporaryAbsence": 23,
      "total": 68
    },
    "chartData": [
      {
        "label": "Tạm trú",
        "value": 45,
        "percentage": "66.18"
      },
      {
        "label": "Tạm vắng",
        "value": 23,
        "percentage": "33.82"
      }
    ]
  },
  "details": null
}
```

#### Response - Theo khoảng thời gian với chi tiết (200 OK)
```json
{
  "statistics": {
    "mode": "period",
    "period": {
      "fromDate": "2024-01-01",
      "toDate": "2024-01-31"
    },
    "temporaryStatus": {
      "temporaryResidence": 12,
      "temporaryAbsence": 8,
      "total": 20
    },
    "chartData": [
      {
        "label": "Tạm trú",
        "value": 12,
        "percentage": "60.00"
      },
      {
        "label": "Tạm vắng",
        "value": 8,
        "percentage": "40.00"
      }
    ]
  },
  "details": {
    "temporaryResidence": [
      {
        "id": 1,
        "nhankhau_id": 123,
        "loaithaydoi": "tạm trú",
        "ngaybatdau": "2024-01-15T00:00:00.000Z",
        "ngayketthuc": "2024-06-15T00:00:00.000Z",
        "ghichu": "Tạm trú để học tập",
        "hoten": "Nguyễn Văn A",
        "cccd": "123456789012"
      }
    ],
    "temporaryAbsence": [
      {
        "id": 2,
        "nhankhau_id": 456,
        "loaithaydoi": "tạm vắng",
        "ngaybatdau": "2024-01-20T00:00:00.000Z",
        "ngayketthuc": null,
        "ghichu": "Đi công tác dài hạn",
        "hoten": "Trần Thị B",
        "cccd": "987654321098"
      }
    ]
  }
}
```

#### Response khi không có dữ liệu (200 OK)
```json
{
  "message": "Hiện không có nhân khẩu nào đăng ký tạm trú hoặc tạm vắng.",
  "statistics": {
    "mode": "current",
    "period": null,
    "temporaryStatus": {
      "temporaryResidence": 0,
      "temporaryAbsence": 0,
      "total": 0
    }
  }
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
    "code": "GENDER_STATISTICS_ERROR", // hoặc các code khác
    "message": "Lỗi khi lấy thống kê theo giới tính",
    "details": "Error message (chỉ hiển thị trong development mode)"
  }
}
```

## Use Case Flows

### TT006 - Thống kê theo giới tính
1. BQT chọn "Thống kê theo giới tính"
2. Frontend gọi `GET /api/statistics/population/gender`
3. Hệ thống trả về số liệu và tỷ lệ theo giới tính
4. Hiển thị bảng và biểu đồ tròn

### TT007 - Thống kê theo độ tuổi
1. BQT chọn "Thống kê theo độ tuổi"
2. (Tùy chọn) BQT có thể tùy chỉnh nhóm tuổi
3. Frontend gọi `GET /api/statistics/population/age`
4. Hệ thống trả về phân tích theo nhóm tuổi
5. Hiển thị bảng và biểu đồ cột

### TT008 - Thống kê biến động
1. BQT chọn "Thống kê biến động"
2. BQT nhập khoảng thời gian (từ ngày - đến ngày)
3. Frontend gọi `GET /api/statistics/population/movement?fromDate=...&toDate=...`
4. Hệ thống trả về số liệu chuyển đến/đi
5. Hiển thị bảng thống kê biến động

### TT009 - Thống kê tạm trú/tạm vắng
1. BQT chọn "Thống kê tạm trú/tạm vắng"
2. BQT chọn mode: tình trạng hiện tại hoặc theo khoảng thời gian
3. Frontend gọi `GET /api/statistics/population/temporary-status`
4. (Tùy chọn) Xem danh sách chi tiết
5. Hiển thị bảng và biểu đồ

## Frontend Integration Examples

### React Component cho TT006
```jsx
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

function GenderStatistics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/statistics/population/gender', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="gender-statistics">
      <h2>Thống kê theo giới tính</h2>
      
      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card">
          <h3>Tổng nhân khẩu</h3>
          <span className="number">{data.statistics.total}</span>
        </div>
        {data.statistics.byGender.map(item => (
          <div key={item.gender} className="card">
            <h3>{item.gender}</h3>
            <span className="number">{item.count}</span>
            <span className="percentage">({item.percentage}%)</span>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data.statistics.chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
            >
              {data.statistics.chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
```

### React Component cho TT008
```jsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

function PopulationMovement() {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMovementData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/statistics/population/movement?fromDate=${fromDate.toISOString().split('T')[0]}&toDate=${toDate.toISOString().split('T')[0]}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="population-movement">
      <h2>Thống kê biến động nhân khẩu</h2>
      
      {/* Date Range Picker */}
      <div className="date-range">
        <div>
          <label>Từ ngày:</label>
          <DatePicker
            selected={fromDate}
            onChange={setFromDate}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div>
          <label>Đến ngày:</label>
          <DatePicker
            selected={toDate}
            onChange={setToDate}
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <button onClick={fetchMovementData} disabled={loading}>
          {loading ? 'Đang tải...' : 'Xem thống kê'}
        </button>
      </div>

      {/* Results */}
      {data && (
        <div className="movement-results">
          <div className="summary">
            <h3>Kết quả từ {data.statistics.period.fromDate} đến {data.statistics.period.toDate}</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="label">Chuyển đến:</span>
                <span className="value">{data.statistics.movements.moveIn}</span>
              </div>
              <div className="stat-item">
                <span className="label">Chuyển đi:</span>
                <span className="value">{data.statistics.movements.moveOut}</span>
              </div>
              <div className="stat-item">
                <span className="label">Biến động ròng:</span>
                <span className={`value ${data.statistics.movements.netChange >= 0 ? 'positive' : 'negative'}`}>
                  {data.statistics.movements.netChange}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Export Features

Tất cả endpoints hỗ trợ xuất báo cáo bằng cách thêm query parameter:
- `export=excel`: Xuất file Excel
- `export=pdf`: Xuất file PDF

Ví dụ:
```
GET /api/statistics/population/gender?export=excel
GET /api/statistics/population/age?export=pdf
``` 