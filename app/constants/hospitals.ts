interface Facility {
  cluster_eng: string;
  institution_eng: string;
  with_AE_service_eng: string;
  address_eng: string;
  cluster_tc: string;
  institution_tc: string;
  with_AE_service_tc: string;
  address_tc: string;
  cluster_sc: string;
  institution_sc: string;
  with_AE_service_sc: string;
  address_sc: string;
  latitude: number;
  longitude: number;
}

interface Facility2 {
  cluster_eng: string;
  institution_eng: string;
  address_eng: string;
  cluster_tc: string;
  institution_tc: string;
  address_tc: string;
  cluster_sc: string;
  institution_sc: string;
  address_sc: string;
  latitude: number;
  longitude: number;
}

import hospitalData from '../../assets/data/facility-hosp.json';
import clinicData from '../../assets/data/facility-sop.json';
import clinicData2 from '../../assets/data/facility-gop.json';

export const hospitals: Facility[] = hospitalData ;

export const clinics: Facility2[] = clinicData;
export const clinics2: Facility2[] = clinicData2;
