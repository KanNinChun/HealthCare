interface Hospital {
  name: string;
  type: '公立' | '私立';
  coordinate: { latitude: number; longitude: number };
  services: string[];
}

interface Clinic {
  name: string;
  type: string;
  coordinate: { latitude: number; longitude: number };
}

// 資料來源: 香港醫院管理局 (https://www.ha.org.hk)
export const hospitals: Hospital[] = [
  // 公立醫院
  { 
    name: '瑪麗醫院', 
    type: '公立',
    coordinate: { latitude: 22.2675, longitude: 114.1305 },
    services: ['急症室', '住院服務', '專科門診']
  },
  {
    name: '威爾斯親王醫院',
    type: '公立',
    coordinate: { latitude: 22.3826, longitude: 114.1912 },
    services: ['24小時急症', '心臟科', '兒科']
  },
  {
    name: '伊利沙伯醫院',
    type: '公立',
    coordinate: { latitude: 22.3099, longitude: 114.1715 },
    services: ['創傷中心', '癌症治療', '深切治療']
  },
  // 私立醫院
  {
    name: '養和醫院',
    type: '私立', 
    coordinate: { latitude: 22.2718, longitude: 114.1562 },
    services: ['體格檢查', '私家病房', '專科診療']
  },
  {
    name: '港安醫院',
    type: '私立',
    coordinate: { latitude: 22.2614, longitude: 114.1463 },
    services: ['婦產科', '骨科', '眼科']
  }
];

// 資料來源: 衛生署 (https://www.dh.gov.hk)
export const clinics = [
  {
    name: '中區健康院診所',
    coordinate: { latitude:  22.284375, longitude: 114.152691 },
    type: '普通科'
  },
  {
    name: '油麻地診所',
    coordinate: { latitude: 22.3124, longitude: 114.1702 },
    type: '家庭醫學'
  },
  {
    name: '觀塘社區診所',
    coordinate: { latitude: 22.3106, longitude: 114.2265 },
    type: '牙科'
  }
];