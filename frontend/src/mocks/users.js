// Owner: Sujeet. Sample users, one per role. Any password works in mock mode. tiers = what the user may do (see shared/roles.js).
export const users = [
 {
  "id": "p_g25",
  "email": "sanjay.b@iitrpr.ac.in",
  "name": "Dr. Sanjay Bedi",
  "desig": "Associate Professor, CSE",
  "dept": "CSE",
  "tiers": [
   "ind"
  ],
  "status": "authorised"
 },
 {
  "id": "p_hod",
  "email": "rakesh.v@iitrpr.ac.in",
  "name": "Prof. Rakesh Verma",
  "desig": "HOD, CSE",
  "dept": "CSE",
  "tiers": [
   "hod",
   "final"
  ],
  "status": "authorised"
 },
 {
  "id": "p_reg",
  "email": "suresh.n@iitrpr.ac.in",
  "name": "Dr. Suresh Nair",
  "desig": "Registrar",
  "dept": "Registrar office",
  "tiers": [
   "final"
  ],
  "status": "authorised"
 },
 {
  "id": "p_ar1",
  "email": "sunita.k@iitrpr.ac.in",
  "name": "Sunita Kapoor",
  "desig": "AR (Accounts)",
  "dept": "Accounts",
  "tiers": [
   "a_top"
  ],
  "status": "authorised"
 },
 {
  "id": "p_ao1",
  "email": "harpreet.s@iitrpr.ac.in",
  "name": "Harpreet Singh",
  "desig": "AO (Accounts)",
  "dept": "Accounts",
  "tiers": [
   "a_mid"
  ],
  "status": "authorised"
 },
 {
  "id": "p_aa1",
  "email": "pooja.r@iitrpr.ac.in",
  "name": "Pooja Rani",
  "desig": "SAA (Accounts)",
  "dept": "Accounts",
  "tiers": [
   "a_low"
  ],
  "status": "authorised"
 },
 {
  "id": "p_g41",
  "email": "aarti.k@iitrpr.ac.in",
  "name": "Aarti Khanna",
  "desig": "AR (Purchase)",
  "dept": "Purchase",
  "tiers": [
   "p_top"
  ],
  "status": "authorised"
 },
 {
  "id": "p_g43",
  "email": "ritu.k@iitrpr.ac.in",
  "name": "Ritu Kulkarni",
  "desig": "JS (Purchase)",
  "dept": "Purchase",
  "tiers": [
   "p_mid"
  ],
  "status": "authorised"
 },
 {
  "id": "p_g45",
  "email": "ajay.v@iitrpr.ac.in",
  "name": "Ajay Verma",
  "desig": "OA (Purchase)",
  "dept": "Purchase",
  "tiers": [
   "p_low"
  ],
  "status": "authorised"
 }
];
