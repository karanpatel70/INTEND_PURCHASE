// Owner: Manvendra. Sample indents, one for every stage. Same shape the backend will return.
export const indents = [
 {
  "id": "i144",
  "no": "IND-2026-0141",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "HOD",
  "holder": "p_hod",
  "total": 89680,
  "gem": false,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to HOD",
    "remark": "",
    "t": "2026-10-06T05:00:00.000Z"
   }
  ],
  "signs": {},
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Network switches and cabling",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Upgrade of the CSE research lab network. Replaces two failed switches and old cabling.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 214, CSE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "RN/2209/114",
    "qdate": "2026-09-28",
    "vendor": "Rajdhani Networks Pvt. Ltd.",
    "items": [
     {
      "desc": "24-port managed switch",
      "qty": 2,
      "rate": 31000
     },
     {
      "desc": "CAT6 cable box (305 m)",
      "qty": 5,
      "rate": 2800
     }
    ],
    "tax": 18,
    "total": 89680,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": null,
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i145",
  "no": "IND-2026-0142",
  "formCode": "SPS-101(R)",
  "by": "p_g25",
  "stage": "A_TOP",
  "holder": "p_ar1",
  "total": 171100,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to HOD",
    "remark": "",
    "t": "2026-10-05T07:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "Within the research budget.",
    "t": "2026-10-06T03:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-10-06T03:00:00.000Z"
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Oscilloscope probes (100 MHz)",
    "cat": "Non-consumables",
    "purpose": "Probes for the signal-processing research bench.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 214, CSE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "TKI/8841",
    "qdate": "2026-09-28",
    "vendor": "Tek Instruments India",
    "items": [
     {
      "desc": "100 MHz passive probe, 10x",
      "qty": 10,
      "rate": 14500
     }
    ],
    "tax": 18,
    "total": 171100,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ],
    "gemReason": "Item is on GeM but the required 100 MHz probe model is not listed there.",
    "country": "India"
   },
   "accounts": null,
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i146",
  "no": "IND-2026-0139",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "A_LOW",
  "holder": "p_aa1",
  "total": 47790,
  "gem": true,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to HOD",
    "remark": "",
    "t": "2026-10-03T06:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "",
    "t": "2026-10-04T02:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "y",
    "text": "Forwarded to Pooja Rani, SAA (Accounts), skipping JAO/AO",
    "remark": "Please fill the budget details.",
    "t": "2026-10-05T04:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-10-04T02:00:00.000Z"
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Projector and screen for seminar room",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Seminar room has no working projector.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "Yes",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 214, CSE Department, Main Academic Block",
    "modes": [
     "GeM"
    ],
    "nq": 1,
    "qno": "GEM/2026/B/553",
    "qdate": "2026-09-28",
    "vendor": "GeM seller: Vision AV Solutions",
    "items": [
     {
      "desc": "WUXGA projector, 4500 lumens",
      "qty": 1,
      "rate": 36000
     },
     {
      "desc": "Motorised screen, 8 ft",
      "qty": 1,
      "rate": 4500
     }
    ],
    "tax": 18,
    "total": 47790,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": null,
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i147",
  "no": "IND-2026-0140",
  "formCode": "SPS-101(R)",
  "by": "p_g25",
  "stage": "P_MID",
  "holder": "p_g43",
  "total": 145140,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   },
   {
    "pid": "p_g41",
    "stage": "P_TOP"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to HOD",
    "remark": "",
    "t": "2026-10-01T07:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "",
    "t": "2026-10-02T02:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "y",
    "text": "Filled the Accounts section",
    "remark": "Budget available.",
    "t": "2026-10-04T05:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Approved and sent to Aarti Khanna, DR (Purchase)",
    "remark": "Skipped JAO/AO and JAA/SAA.",
    "t": "2026-10-04T06:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "y",
    "text": "Forwarded to Ritu Kulkarni, Supdt. (Purchase), skipping OA/JA/SA",
    "remark": "Please check the quotation calculations.",
    "t": "2026-10-06T06:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-10-02T02:00:00.000Z"
   },
   "accounts": {
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-10-05T05:00:00.000Z"
    }
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Lab chemicals: organic synthesis kit",
    "cat": "Consumables",
    "purpose": "Consumables for the first-year synthesis lab.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 214, CSE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "CSL/0932",
    "qdate": "2026-09-28",
    "vendor": "ChemSource Labs",
    "items": [
     {
      "desc": "Reagent kit, organic synthesis",
      "qty": 1,
      "rate": 98000
     },
     {
      "desc": "Glassware consumables set",
      "qty": 1,
      "rate": 25000
     }
    ],
    "tax": 18,
    "total": 145140,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ],
    "gemReason": "Specified grade is not available on GeM.",
    "country": "India"
   },
   "accounts": {
    "head": "Departmental grant, CSE",
    "sanctioned": 600000,
    "available": 412000,
    "booked": 145140,
    "by": "p_ar1",
    "t": "2026-10-05T05:00:00.000Z"
   },
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i148",
  "no": "IND-2026-0137",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "FINAL",
  "holder": "p_reg",
  "total": 36816,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   },
   {
    "pid": "p_g41",
    "stage": "P_TOP"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to HOD",
    "remark": "",
    "t": "2026-09-28T07:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "",
    "t": "2026-09-29T08:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Filled the Accounts section and sent to Aarti Khanna, DR (Purchase)",
    "remark": "",
    "t": "2026-10-01T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the Purchase section and sent to Dr. Suresh Nair, Registrar, for final approval",
    "remark": "Proposal is in order.",
    "t": "2026-10-06T04:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-09-29T08:00:00.000Z"
   },
   "accounts": {
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-10-01T08:00:00.000Z"
    }
   },
   "purchase": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-10-06T04:00:00.000Z"
    }
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Soldering stations (4)",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Electronics lab bench setup.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 214, CSE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "EM/7710",
    "qdate": "2026-09-28",
    "vendor": "ElectroMart",
    "items": [
     {
      "desc": "Temperature-controlled soldering station",
      "qty": 4,
      "rate": 7800
     }
    ],
    "tax": 18,
    "total": 36816,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, CSE",
    "sanctioned": 600000,
    "available": 412000,
    "booked": 36816,
    "by": "p_ar1",
    "t": "2026-10-01T08:00:00.000Z"
   },
   "purchase": {
    "quote": true,
    "calc": true,
    "order": true,
    "pagesFrom": 1,
    "pagesTo": 4,
    "cfa": 36816,
    "by": "p_g41",
    "t": "2026-10-06T04:00:00.000Z"
   },
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i149",
  "no": "IND-2026-0138",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "DONE",
  "holder": null,
  "total": 48380,
  "gem": true,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to HOD",
    "remark": "",
    "t": "2026-09-17T08:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, DR (Accounts)",
    "remark": "",
    "t": "2026-09-19T08:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "y",
    "text": "Forwarded to Pooja Rani, SAA (Accounts), skipping JAO/AO",
    "remark": "",
    "t": "2026-09-20T08:00:00.000Z"
   },
   {
    "pid": "p_aa1",
    "type": "g",
    "text": "Filled the Accounts section. Approved and sent back to Harpreet Singh, AO",
    "remark": "",
    "t": "2026-09-22T08:00:00.000Z"
   },
   {
    "pid": "p_ao1",
    "type": "g",
    "text": "Approved and sent back to Sunita Kapoor, DR (Accounts)",
    "remark": "",
    "t": "2026-09-23T02:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Approved and sent to Aarti Khanna, AR (Purchase)",
    "remark": "",
    "t": "2026-09-23T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the Purchase section and sent to Dr. Suresh Nair, Registrar",
    "remark": "",
    "t": "2026-09-26T08:00:00.000Z"
   },
   {
    "pid": "p_reg",
    "type": "g",
    "text": "Approved and sent back to Aarti Khanna, AR (Purchase), for the purchase order",
    "remark": "",
    "t": "2026-09-28T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the PO form. Generated purchase order PO/2026/0412",
    "remark": "",
    "t": "2026-09-29T08:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-09-19T08:00:00.000Z"
   },
   "final": {
    "pid": "p_reg",
    "t": "2026-09-28T08:00:00.000Z"
   },
   "accounts": {
    "a_low": {
     "pid": "p_aa1",
     "t": "2026-09-22T08:00:00.000Z"
    },
    "a_mid": {
     "pid": "p_ao1",
     "t": "2026-09-23T02:00:00.000Z"
    },
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-09-23T08:00:00.000Z"
    }
   },
   "purchase": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-09-26T08:00:00.000Z"
    }
   },
   "po": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-09-29T08:00:00.000Z"
    }
   }
  },
  "po": "PO/2026/0412",
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Laptop for project work",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Project associate laptop.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "Yes",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 214, CSE Department, Main Academic Block",
    "modes": [
     "GeM"
    ],
    "nq": 1,
    "qno": "GEM/2026/B/401",
    "qdate": "2026-09-28",
    "vendor": "GeM seller: Digital Hub",
    "items": [
     {
      "desc": "14-inch laptop, 16 GB RAM",
      "qty": 1,
      "rate": 41000
     }
    ],
    "tax": 18,
    "total": 48380,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, CSE",
    "sanctioned": 600000,
    "available": 412000,
    "booked": 48380,
    "by": "p_ar1",
    "t": "2026-09-23T08:00:00.000Z"
   },
   "purchase": {
    "quote": true,
    "calc": true,
    "order": true,
    "pagesFrom": 1,
    "pagesTo": 4,
    "cfa": 48380,
    "by": "p_g41",
    "t": "2026-09-26T08:00:00.000Z"
   },
   "po": {
    "ref": "412-26/CSE-0138/Dept./PS/",
    "date": "2026-09-28",
    "kind": "Purchase order",
    "subject": "Laptop for project work",
    "vendor": "GeM seller: Digital Hub",
    "vendorAddr": "Digital Hub, Shop 12, Sector 17\nChandigarh - 160 017",
    "deliverTo": "Room 214, CSE Department, Main Academic Block, IIT Ropar",
    "deliveryBy": "Within 3 weeks",
    "byDate": "2026-10-19",
    "payment": "100% against delivery",
    "gst": "Included",
    "terms": "Warranty: 3 years on-site.",
    "items": [
     {
      "desc": "14-inch laptop, 16 GB RAM",
      "qty": 1,
      "rate": 41000
     }
    ],
    "gstPct": 18,
    "qno": "GEM/2026/B/401",
    "qdate": "2026-09-28",
    "signer": "Assistant Registrar (S&P)",
    "byPreset": "Pick a date",
    "std": "Liquidated damages : Being an educational Institute time is essence of the order. Date of the delivery should be strictly adhered to, otherwise, this Institute reserves the right not to accept the delivery in part or full. The liquidated damages @1% per week subject to a maximum of 10% value of the order can be imposed.\nJurisdiction: The Courts of Ropar alone will have the jurisdiction to try any matter, dispute or difference between the parties arising out of this tender/contract. It is specifically agreed that no Court outside and other than Ropar court shall have jurisdiction in the matter.\nPre-Requisite Requirement : You are requested to intimate us well in advance the pre-requisite installation requirements.",
    "cc": "",
    "by": "p_g41",
    "t": "2026-09-29T08:00:00.000Z"
   }
  },
  "order": {
   "status": "open",
   "ext": []
  },
  "version": 1
 },
 {
  "id": "i150",
  "no": "IND-2026-0136",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "RETURNED",
  "holder": "p_g25",
  "total": 17024,
  "gem": false,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to HOD",
    "remark": "",
    "t": "2026-10-02T06:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "o",
    "text": "Sent back for revision to Dr. Sanjay Bedi, Assistant Professor, CSE",
    "remark": "Please attach the quotation copy and confirm the budget head.",
    "t": "2026-10-03T03:00:00.000Z"
   }
  ],
  "signs": {},
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Office stationery",
    "cat": "Consumables",
    "research": "No",
    "purpose": "Quarterly stationery for the department office.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 214, CSE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "GS/118",
    "qdate": "2026-09-28",
    "vendor": "Gupta Stationers",
    "items": [
     {
      "desc": "A4 paper, 500 sheets (carton)",
      "qty": 20,
      "rate": 620
     },
     {
      "desc": "Assorted stationery",
      "qty": 1,
      "rate": 2800
     }
    ],
    "tax": 12,
    "total": 17024,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Stationery-list.pdf",
      "s": "54 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": null,
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i151",
  "no": "IND-2026-0135",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "PO_TOP",
  "holder": "p_g41",
  "total": 27730,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   },
   {
    "pid": "p_g41",
    "stage": "P_TOP"
   },
   {
    "pid": "p_reg",
    "stage": "FINAL"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to HOD",
    "remark": "",
    "t": "2026-09-26T08:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, DR (Accounts)",
    "remark": "",
    "t": "2026-09-27T08:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Filled the Accounts section and sent to Aarti Khanna, AR (Purchase)",
    "remark": "",
    "t": "2026-09-30T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the Purchase section and sent to Dr. Suresh Nair, Registrar",
    "remark": "",
    "t": "2026-10-04T08:00:00.000Z"
   },
   {
    "pid": "p_reg",
    "type": "g",
    "text": "Approved and sent back to Aarti Khanna, AR (Purchase), for the purchase order",
    "remark": "",
    "t": "2026-10-07T05:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-09-27T08:00:00.000Z"
   },
   "final": {
    "pid": "p_reg",
    "t": "2026-10-07T05:00:00.000Z"
   },
   "accounts": {
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-09-30T08:00:00.000Z"
    }
   },
   "purchase": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-10-04T08:00:00.000Z"
    }
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Whiteboards and markers",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Replacement boards for two tutorial rooms.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 214, CSE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "ODI/5521",
    "qdate": "2026-09-28",
    "vendor": "Office Depot India",
    "items": [
     {
      "desc": "Magnetic whiteboard, 6x4 ft",
      "qty": 4,
      "rate": 5200
     },
     {
      "desc": "Marker set (box of 50)",
      "qty": 3,
      "rate": 900
     }
    ],
    "tax": 18,
    "total": 27730,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, CSE",
    "sanctioned": 600000,
    "available": 412000,
    "booked": 27730,
    "by": "p_ar1",
    "t": "2026-09-30T08:00:00.000Z"
   },
   "purchase": {
    "quote": true,
    "calc": true,
    "order": true,
    "pagesFrom": 1,
    "pagesTo": 4,
    "cfa": 27730,
    "by": "p_g41",
    "t": "2026-10-04T08:00:00.000Z"
   },
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i153",
  "no": "IND-2026-0144",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "A_MID",
  "holder": "p_ao1",
  "total": 49560,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-10-04T06:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "",
    "t": "2026-10-05T02:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "y",
    "text": "Forwarded to Harpreet Singh, AO (Accounts), skipping JAA/SAA",
    "remark": "Please check the budget head.",
    "t": "2026-10-06T05:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-10-05T02:00:00.000Z"
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, ECE",
    "sanctioned": 600000,
    "title": "Digital multimeters (10)",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Multimeters for the first-year electronics lab.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 108, ECE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "MW/3321",
    "qdate": "2026-09-28",
    "vendor": "Meterworld Electronics",
    "items": [
     {
      "desc": "Bench digital multimeter, 6.5 digit",
      "qty": 10,
      "rate": 4200
     }
    ],
    "tax": 18,
    "total": 49560,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": null,
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i155",
  "no": "IND-2026-0146",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "P_TOP",
  "holder": "p_g41",
  "total": 44132,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-10-01T06:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, DR (Accounts)",
    "remark": "",
    "t": "2026-10-02T05:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Filled the Accounts section and sent to Aarti Khanna, DR (Purchase)",
    "remark": "",
    "t": "2026-10-06T04:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-10-02T05:00:00.000Z"
   },
   "accounts": {
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-10-06T04:00:00.000Z"
    }
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, ECE",
    "sanctioned": 600000,
    "title": "RF connectors and cables",
    "cat": "Consumables",
    "research": "No",
    "purpose": "SMA connectors and low-loss cables for the RF bench.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 108, ECE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "MCC/771",
    "qdate": "2026-09-28",
    "vendor": "Microwave Components Co.",
    "items": [
     {
      "desc": "SMA male connector, pack of 20",
      "qty": 6,
      "rate": 2100
     },
     {
      "desc": "Low-loss RF cable, 2 m",
      "qty": 8,
      "rate": 3100
     }
    ],
    "tax": 18,
    "total": 44132,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, CSE",
    "sanctioned": 600000,
    "available": 412000,
    "booked": 44132,
    "by": "p_ar1",
    "t": "2026-10-06T04:00:00.000Z"
   },
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i157",
  "no": "IND-2026-0148",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "REJECTED",
  "holder": null,
  "total": 96760,
  "gem": false,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-10-02T06:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "",
    "t": "2026-10-03T04:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "r",
    "text": "Rejected the indent",
    "remark": "Not an academic requirement. Please use the department laptop pool.",
    "t": "2026-10-04T07:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-10-03T04:00:00.000Z"
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, ECE",
    "sanctioned": 600000,
    "title": "Gaming-grade laptop",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Laptop for personal use in the lab.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 108, ECE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "CZ/902",
    "qdate": "2026-09-28",
    "vendor": "Compu Zone",
    "items": [
     {
      "desc": "Gaming laptop, 32 GB RAM, RTX graphics",
      "qty": 1,
      "rate": 82000
     }
    ],
    "tax": 18,
    "total": 96760,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": null,
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1,
  "rejIdx": 2
 },
 {
  "id": "i158",
  "no": "IND-2026-0130",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "DONE",
  "holder": null,
  "total": 99120,
  "gem": false,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-08-20T08:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "",
    "t": "2026-08-22T08:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Filled the Accounts section and sent to Aarti Khanna, DR (Purchase)",
    "remark": "",
    "t": "2026-08-28T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the Purchase section and sent to Dr. Suresh Nair, Registrar, for final approval",
    "remark": "",
    "t": "2026-09-01T08:00:00.000Z"
   },
   {
    "pid": "p_reg",
    "type": "g",
    "text": "Approved and sent back to Aarti Khanna, DR (Purchase), for the purchase order",
    "remark": "",
    "t": "2026-09-03T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the PO form. Generated purchase order PO/2026/0398",
    "remark": "",
    "t": "2026-09-05T08:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-08-22T08:00:00.000Z"
   },
   "final": {
    "pid": "p_reg",
    "t": "2026-09-03T08:00:00.000Z"
   },
   "accounts": {
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-08-28T08:00:00.000Z"
    }
   },
   "purchase": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-09-01T08:00:00.000Z"
    }
   },
   "po": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-09-05T08:00:00.000Z"
    }
   }
  },
  "po": "PO/2026/0398",
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Server rack and UPS",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Rack and online UPS for the departmental server room.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 108, CSE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "NI/4412",
    "qdate": "2026-09-28",
    "vendor": "Netlink Infra Pvt. Ltd.",
    "items": [
     {
      "desc": "42U server rack",
      "qty": 1,
      "rate": 38000
     },
     {
      "desc": "3 kVA online UPS",
      "qty": 1,
      "rate": 46000
     }
    ],
    "tax": 18,
    "total": 99120,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, CSE",
    "sanctioned": 600000,
    "available": 412000,
    "booked": 99120,
    "by": "p_ar1",
    "t": "2026-08-28T08:00:00.000Z"
   },
   "purchase": {
    "quote": true,
    "calc": true,
    "order": true,
    "pagesFrom": 1,
    "pagesTo": 4,
    "cfa": 99120,
    "by": "p_g41",
    "t": "2026-09-01T08:00:00.000Z"
   },
   "po": {
    "ref": "0732-26/CSE-0130/Dept./PS/",
    "date": "2026-09-05",
    "kind": "Purchase order",
    "subject": "Server rack and UPS",
    "vendor": "Netlink Infra Pvt. Ltd.",
    "vendorAddr": "Netlink Infra Pvt. Ltd.\nPlot 21, Industrial Area Phase 2\nChandigarh - 160 002",
    "deliverTo": "Room 108, CSE Department, Main Academic Block, IIT Ropar",
    "deliveryBy": "Within 3 weeks",
    "byPreset": "3 weeks",
    "byDate": "2026-09-26",
    "payment": "100% against delivery",
    "gst": "Extra as applicable",
    "terms": "",
    "gstPct": 18,
    "qno": "NI/4412",
    "qdate": "2026-09-28",
    "items": [
     {
      "desc": "42U server rack",
      "qty": 1,
      "rate": 38000
     },
     {
      "desc": "3 kVA online UPS",
      "qty": 1,
      "rate": 46000
     }
    ],
    "signer": "Assistant Registrar (S&P)",
    "std": "Liquidated damages : Being an educational Institute time is essence of the order. Date of the delivery should be strictly adhered to, otherwise, this Institute reserves the right not to accept the delivery in part or full. The liquidated damages @1% per week subject to a maximum of 10% value of the order can be imposed.\nJurisdiction: The Courts of Ropar alone will have the jurisdiction to try any matter, dispute or difference between the parties arising out of this tender/contract. It is specifically agreed that no Court outside and other than Ropar court shall have jurisdiction in the matter.\nPre-Requisite Requirement : You are requested to intimate us well in advance the pre-requisite installation requirements.",
    "cc": "",
    "by": "p_g41",
    "t": "2026-09-05T08:00:00.000Z"
   }
  },
  "order": {
   "status": "open",
   "ext": []
  },
  "version": 1
 },
 {
  "id": "i161",
  "no": "IND-2026-0129",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "DONE",
  "holder": null,
  "total": 42480,
  "gem": false,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-08-29T08:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "",
    "t": "2026-08-31T08:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Filled the Accounts section and sent to Aarti Khanna, DR (Purchase)",
    "remark": "",
    "t": "2026-09-06T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the Purchase section and sent to Dr. Suresh Nair, Registrar, for final approval",
    "remark": "",
    "t": "2026-09-10T08:00:00.000Z"
   },
   {
    "pid": "p_reg",
    "type": "g",
    "text": "Approved and sent back to Aarti Khanna, DR (Purchase), for the purchase order",
    "remark": "",
    "t": "2026-09-12T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the PO form. Generated purchase order PO/2026/0409",
    "remark": "",
    "t": "2026-09-14T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "r",
    "text": "Cancelled purchase order PO/2026/0409",
    "remark": "Supplier discontinued this model and could not offer a replacement.",
    "t": "2026-10-04T08:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-08-31T08:00:00.000Z"
   },
   "final": {
    "pid": "p_reg",
    "t": "2026-09-12T08:00:00.000Z"
   },
   "accounts": {
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-09-06T08:00:00.000Z"
    }
   },
   "purchase": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-09-10T08:00:00.000Z"
    }
   },
   "po": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-09-14T08:00:00.000Z"
    }
   }
  },
  "po": "PO/2026/0409",
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, ECE",
    "sanctioned": 600000,
    "title": "Printer toner cartridges",
    "cat": "Consumables",
    "research": "No",
    "purpose": "Toner for the department office printers.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 108, ECE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "IW/908",
    "qdate": "2026-09-28",
    "vendor": "Inkwell Supplies",
    "items": [
     {
      "desc": "Toner cartridge, black",
      "qty": 10,
      "rate": 3600
     }
    ],
    "tax": 18,
    "total": 42480,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, CSE",
    "sanctioned": 600000,
    "available": 412000,
    "booked": 42480,
    "by": "p_ar1",
    "t": "2026-09-06T08:00:00.000Z"
   },
   "purchase": {
    "quote": true,
    "calc": true,
    "order": true,
    "pagesFrom": 1,
    "pagesTo": 4,
    "cfa": 42480,
    "by": "p_g41",
    "t": "2026-09-10T08:00:00.000Z"
   },
   "po": {
    "ref": "0723-26/ECE-0129/Dept./PS/",
    "date": "2026-09-14",
    "kind": "Purchase order",
    "subject": "Printer toner cartridges",
    "vendor": "Inkwell Supplies",
    "vendorAddr": "Inkwell Supplies\nPlot 21, Industrial Area Phase 2\nChandigarh - 160 002",
    "deliverTo": "Room 108, ECE Department, Main Academic Block, IIT Ropar",
    "deliveryBy": "Within 3 weeks",
    "byPreset": "3 weeks",
    "byDate": "2026-10-05",
    "payment": "100% against delivery",
    "gst": "Extra as applicable",
    "terms": "",
    "gstPct": 18,
    "qno": "IW/908",
    "qdate": "2026-09-28",
    "items": [
     {
      "desc": "Toner cartridge, black",
      "qty": 10,
      "rate": 3600
     }
    ],
    "signer": "Assistant Registrar (S&P)",
    "std": "Liquidated damages : Being an educational Institute time is essence of the order. Date of the delivery should be strictly adhered to, otherwise, this Institute reserves the right not to accept the delivery in part or full. The liquidated damages @1% per week subject to a maximum of 10% value of the order can be imposed.\nJurisdiction: The Courts of Ropar alone will have the jurisdiction to try any matter, dispute or difference between the parties arising out of this tender/contract. It is specifically agreed that no Court outside and other than Ropar court shall have jurisdiction in the matter.\nPre-Requisite Requirement : You are requested to intimate us well in advance the pre-requisite installation requirements.",
    "cc": "",
    "by": "p_g41",
    "t": "2026-09-14T08:00:00.000Z"
   }
  },
  "order": {
   "status": "cancelled",
   "ext": [],
   "cancel": {
    "reason": "Supplier discontinued this model and could not offer a replacement.",
    "by": "p_g41",
    "t": "2026-10-04T08:00:00.000Z"
   }
  },
  "version": 1
 },
 {
  "id": "i162",
  "no": "IND-2026-0127",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "DONE",
  "holder": null,
  "total": 15104,
  "gem": false,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-08-12T08:00:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "",
    "t": "2026-08-14T08:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Filled the Accounts section and sent to Aarti Khanna, DR (Purchase)",
    "remark": "",
    "t": "2026-08-20T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the Purchase section and sent to Dr. Suresh Nair, Registrar, for final approval",
    "remark": "",
    "t": "2026-08-24T08:00:00.000Z"
   },
   {
    "pid": "p_reg",
    "type": "g",
    "text": "Approved and sent back to Aarti Khanna, DR (Purchase), for the purchase order",
    "remark": "",
    "t": "2026-08-26T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Filled the PO form. Generated purchase order PO/2026/0388",
    "remark": "",
    "t": "2026-08-28T08:00:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Marked the order as delivered",
    "remark": "",
    "t": "2026-09-20T08:00:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-08-14T08:00:00.000Z"
   },
   "final": {
    "pid": "p_reg",
    "t": "2026-08-26T08:00:00.000Z"
   },
   "accounts": {
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-08-20T08:00:00.000Z"
    }
   },
   "purchase": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-08-24T08:00:00.000Z"
    }
   },
   "po": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-08-28T08:00:00.000Z"
    }
   }
  },
  "po": "PO/2026/0388",
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 600000,
    "title": "Ethernet patch panels",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Patch panels for the new lab wiring.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 108, CSE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 2,
    "qno": "RN/2188",
    "qdate": "2026-09-28",
    "vendor": "Rajdhani Networks Pvt. Ltd.",
    "items": [
     {
      "desc": "24-port CAT6 patch panel",
      "qty": 4,
      "rate": 3200
     }
    ],
    "tax": 18,
    "total": 15104,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, CSE",
    "sanctioned": 600000,
    "available": 412000,
    "booked": 15104,
    "by": "p_ar1",
    "t": "2026-08-20T08:00:00.000Z"
   },
   "purchase": {
    "quote": true,
    "calc": true,
    "order": true,
    "pagesFrom": 1,
    "pagesTo": 4,
    "cfa": 15104,
    "by": "p_g41",
    "t": "2026-08-24T08:00:00.000Z"
   },
   "po": {
    "ref": "0740-26/CSE-0127/Dept./PS/",
    "date": "2026-08-28",
    "kind": "Purchase order",
    "subject": "Ethernet patch panels",
    "vendor": "Rajdhani Networks Pvt. Ltd.",
    "vendorAddr": "Rajdhani Networks Pvt. Ltd.\nPlot 21, Industrial Area Phase 2\nChandigarh - 160 002",
    "deliverTo": "Room 108, CSE Department, Main Academic Block, IIT Ropar",
    "deliveryBy": "Within 3 weeks",
    "byPreset": "3 weeks",
    "byDate": "2026-09-18",
    "payment": "100% against delivery",
    "gst": "Extra as applicable",
    "terms": "",
    "gstPct": 18,
    "qno": "RN/2188",
    "qdate": "2026-09-28",
    "items": [
     {
      "desc": "24-port CAT6 patch panel",
      "qty": 4,
      "rate": 3200
     }
    ],
    "signer": "Assistant Registrar (S&P)",
    "std": "Liquidated damages : Being an educational Institute time is essence of the order. Date of the delivery should be strictly adhered to, otherwise, this Institute reserves the right not to accept the delivery in part or full. The liquidated damages @1% per week subject to a maximum of 10% value of the order can be imposed.\nJurisdiction: The Courts of Ropar alone will have the jurisdiction to try any matter, dispute or difference between the parties arising out of this tender/contract. It is specifically agreed that no Court outside and other than Ropar court shall have jurisdiction in the matter.\nPre-Requisite Requirement : You are requested to intimate us well in advance the pre-requisite installation requirements.",
    "cc": "",
    "by": "p_g41",
    "t": "2026-08-28T08:00:00.000Z"
   }
  },
  "order": {
   "status": "delivered",
   "ext": [],
   "deliveredOn": "2026-09-20"
  },
  "version": 1
 },
 {
  "id": "i219",
  "no": "IND-2026-0051",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "PO_LOW",
  "holder": "p_g45",
  "total": 84606,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   },
   {
    "pid": "p_aa1",
    "stage": "A_LOW"
   },
   {
    "pid": "p_ao1",
    "stage": "A_MID"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   },
   {
    "pid": "p_g41",
    "stage": "P_TOP"
   },
   {
    "pid": "p_reg",
    "stage": "FINAL"
   },
   {
    "pid": "p_g41",
    "stage": "PO_TOP"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-09-26T01:31:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, DR (Accounts)",
    "remark": "",
    "t": "2026-09-26T21:07:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "y",
    "text": "Forwarded to Pooja Rani, SAA (Accounts), skipping JAO/AO",
    "remark": "Please fill the budget details.",
    "t": "2026-09-28T05:18:00.000Z"
   },
   {
    "pid": "p_aa1",
    "type": "y",
    "text": "Filled the Accounts section",
    "remark": "",
    "t": "2026-09-28T18:50:00.000Z"
   },
   {
    "pid": "p_aa1",
    "type": "g",
    "text": "Approved and sent back to Harpreet Singh, JAO (Accounts)",
    "remark": "",
    "t": "2026-09-30T11:08:00.000Z"
   },
   {
    "pid": "p_ao1",
    "type": "g",
    "text": "Approved and sent back to Sunita Kapoor, DR (Accounts)",
    "remark": "",
    "t": "2026-10-01T02:34:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Approved and sent to Aarti Khanna, DR (Purchase)",
    "remark": "",
    "t": "2026-10-01T06:08:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "y",
    "text": "Filled the Purchase section",
    "remark": "",
    "t": "2026-10-02T00:17:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Approved and sent to Dr. Suresh Nair, Registrar",
    "remark": "Proposal is in order.",
    "t": "2026-10-03T14:44:00.000Z"
   },
   {
    "pid": "p_reg",
    "type": "g",
    "text": "Approved and sent back to Aarti Khanna, DR (Purchase) for the purchase order",
    "remark": "",
    "t": "2026-10-05T02:09:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "y",
    "text": "Forwarded to Ajay Verma, JA (Purchase), skipping JS/Supdt.",
    "remark": "",
    "t": "2026-10-06T17:44:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-09-26T21:07:00.000Z"
   },
   "final": {
    "pid": "p_reg",
    "t": "2026-10-05T02:09:00.000Z"
   },
   "accounts": {
    "a_low": {
     "pid": "p_aa1",
     "t": "2026-09-30T11:08:00.000Z"
    },
    "a_mid": {
     "pid": "p_ao1",
     "t": "2026-10-01T02:34:00.000Z"
    },
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-10-01T06:08:00.000Z"
    }
   },
   "purchase": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-10-03T14:44:00.000Z"
    }
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, EE",
    "sanctioned": 600000,
    "title": "Digital theodolite (EE)",
    "cat": "Non-consumables",
    "research": "Yes",
    "purpose": "Upgrade for the EE research group.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 114, EE Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 4,
    "qno": "SSI/8057",
    "qdate": "2026-09-13",
    "vendor": "Survey Systems India",
    "items": [
     {
      "desc": "Digital theodolite",
      "qty": 1,
      "rate": 71700
     }
    ],
    "tax": 18,
    "total": 84606,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, EE",
    "sanctioned": 600000,
    "available": 455000,
    "booked": 84606,
    "by": "p_aa1",
    "t": "2026-09-28T18:50:00.000Z"
   },
   "purchase": {
    "quote": true,
    "calc": true,
    "order": true,
    "pagesFrom": 2,
    "pagesTo": 6,
    "cfa": 84606,
    "by": "p_g41",
    "t": "2026-10-02T00:17:00.000Z"
   },
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i204",
  "no": "IND-2026-0059",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "P_LOW",
  "holder": "p_g45",
  "total": 38586,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   },
   {
    "pid": "p_aa1",
    "stage": "A_LOW"
   },
   {
    "pid": "p_ao1",
    "stage": "A_MID"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   },
   {
    "pid": "p_g41",
    "stage": "P_TOP"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-09-29T00:54:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, DR (Accounts)",
    "remark": "Needed for the lab.",
    "t": "2026-09-30T09:32:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "y",
    "text": "Forwarded to Pooja Rani, SAA (Accounts), skipping JAO/AO",
    "remark": "Please fill the budget details.",
    "t": "2026-09-30T15:28:00.000Z"
   },
   {
    "pid": "p_aa1",
    "type": "y",
    "text": "Filled the Accounts section",
    "remark": "",
    "t": "2026-10-02T05:23:00.000Z"
   },
   {
    "pid": "p_aa1",
    "type": "g",
    "text": "Approved and sent back to Harpreet Singh, JAO (Accounts)",
    "remark": "",
    "t": "2026-10-03T05:45:00.000Z"
   },
   {
    "pid": "p_ao1",
    "type": "g",
    "text": "Approved and sent back to Sunita Kapoor, DR (Accounts)",
    "remark": "",
    "t": "2026-10-04T12:34:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Approved and sent to Aarti Khanna, DR (Purchase)",
    "remark": "",
    "t": "2026-10-05T11:08:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "y",
    "text": "Forwarded to Ajay Verma, OA (Purchase), skipping JS/Supdt.",
    "remark": "Please check the quotation calculations.",
    "t": "2026-10-06T06:32:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-09-30T09:32:00.000Z"
   },
   "accounts": {
    "a_low": {
     "pid": "p_aa1",
     "t": "2026-10-03T05:45:00.000Z"
    },
    "a_mid": {
     "pid": "p_ao1",
     "t": "2026-10-04T12:34:00.000Z"
    },
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-10-05T11:08:00.000Z"
    }
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, ECE",
    "sanctioned": 600000,
    "title": "Magnetic stirrers",
    "cat": "Non-consumables",
    "research": "Yes",
    "purpose": "Needed for a sponsored research project.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 260, Chemical Department, Main Academic Block",
    "modes": [
     "E-mail"
    ],
    "nq": 3,
    "qno": "L/1066",
    "qdate": "2026-09-17",
    "vendor": "Labtronics",
    "items": [
     {
      "desc": "Magnetic stirrer with hot plate",
      "qty": 3,
      "rate": 10900
     }
    ],
    "tax": 18,
    "total": 38586,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, ECE",
    "sanctioned": 600000,
    "available": 502000,
    "booked": 38586,
    "by": "p_aa1",
    "t": "2026-10-02T05:23:00.000Z"
   },
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i217",
  "no": "IND-2026-0062",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "PO_MID",
  "holder": "p_g43",
  "total": 54280,
  "gem": false,
  "trail": [
   {
    "pid": "p_hod",
    "stage": "HOD"
   },
   {
    "pid": "p_ar1",
    "stage": "A_TOP"
   },
   {
    "pid": "p_g41",
    "stage": "P_TOP"
   },
   {
    "pid": "p_reg",
    "stage": "FINAL"
   },
   {
    "pid": "p_g41",
    "stage": "PO_TOP"
   }
  ],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-09-29T14:19:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "g",
    "text": "Approved and sent to Sunita Kapoor, AR (Accounts)",
    "remark": "Recommended.",
    "t": "2026-09-30T17:00:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "y",
    "text": "Filled the Accounts section",
    "remark": "",
    "t": "2026-10-01T02:12:00.000Z"
   },
   {
    "pid": "p_ar1",
    "type": "g",
    "text": "Approved and sent to Aarti Khanna, DR (Purchase)",
    "remark": "",
    "t": "2026-10-01T11:14:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "y",
    "text": "Filled the Purchase section",
    "remark": "",
    "t": "2026-10-02T13:22:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "g",
    "text": "Approved and sent to Dr. Suresh Nair, Registrar",
    "remark": "Proposal is in order.",
    "t": "2026-10-04T05:30:00.000Z"
   },
   {
    "pid": "p_reg",
    "type": "g",
    "text": "Approved and sent back to Aarti Khanna, DR (Purchase) for the purchase order",
    "remark": "",
    "t": "2026-10-05T07:29:00.000Z"
   },
   {
    "pid": "p_g41",
    "type": "y",
    "text": "Forwarded to Ritu Kulkarni, Supdt. (Purchase)",
    "remark": "",
    "t": "2026-10-05T19:46:00.000Z"
   }
  ],
  "signs": {
   "hod": {
    "pid": "p_hod",
    "t": "2026-09-30T17:00:00.000Z"
   },
   "final": {
    "pid": "p_reg",
    "t": "2026-10-05T07:29:00.000Z"
   },
   "accounts": {
    "a_top": {
     "pid": "p_ar1",
     "t": "2026-10-01T11:14:00.000Z"
    }
   },
   "purchase": {
    "p_top": {
     "pid": "p_g41",
     "t": "2026-10-04T05:30:00.000Z"
    }
   }
  },
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, Chemical",
    "sanctioned": 800000,
    "title": "Reference textbooks (CSE)",
    "cat": "Consumables",
    "research": "No",
    "purpose": "Needed for a sponsored research project.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 309, CSE Department, Main Academic Block",
    "modes": [
     "Spot visit"
    ],
    "nq": 2,
    "qno": "ABD/2381",
    "qdate": "2026-09-21",
    "vendor": "Academic Book Depot",
    "items": [
     {
      "desc": "Reference textbook set",
      "qty": 10,
      "rate": 4600
     }
    ],
    "tax": 18,
    "total": 54280,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": {
    "head": "Departmental grant, Chemical",
    "sanctioned": 800000,
    "available": 681000,
    "booked": 54280,
    "by": "p_ar1",
    "t": "2026-10-01T02:12:00.000Z"
   },
   "purchase": {
    "quote": true,
    "calc": true,
    "order": true,
    "pagesFrom": 2,
    "pagesTo": 9,
    "cfa": 54280,
    "by": "p_g41",
    "t": "2026-10-02T13:22:00.000Z"
   },
   "po": null
  },
  "order": null,
  "version": 1
 },
 {
  "id": "i238",
  "no": "IND-2026-0083",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "CANCELLED",
  "holder": null,
  "total": 54634,
  "gem": false,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Created the indent and submitted it to Prof. Rakesh Verma",
    "remark": "",
    "t": "2026-10-02T20:42:00.000Z"
   },
   {
    "pid": "p_hod",
    "type": "o",
    "text": "Sent back for revision to Dr. Sanjay Bedi, Associate Professor, BME",
    "remark": "Quantity does not match the quotation. Please correct it.",
    "t": "2026-10-04T08:59:00.000Z"
   },
   {
    "pid": "p_g25",
    "type": "r",
    "text": "Cancelled the indent",
    "remark": "Requirement changed, the specification is different now.",
    "t": "2026-10-05T19:01:00.000Z"
   }
  ],
  "signs": {},
  "po": null,
  "submitted": true,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, BME",
    "sanctioned": 500000,
    "title": "Laptops for project staff",
    "cat": "Non-consumables",
    "research": "No",
    "purpose": "Replacement of failed units in the BME department.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 143, BME Department, Main Academic Block",
    "modes": [
     "Vendor’s website"
    ],
    "nq": 4,
    "qno": "DH/8474",
    "qdate": "2026-08-27",
    "vendor": "Digital Hub",
    "items": [
     {
      "desc": "14-inch laptop, 16 GB RAM",
      "qty": 1,
      "rate": 46300
     }
    ],
    "tax": 18,
    "total": 54634,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": null,
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1,
  "cancel": {
   "reason": "Requirement changed, the specification is different now.",
   "by": "p_g25",
   "t": "2026-10-05T19:01:00.000Z"
  },
  "cancelIdx": 0
 },
 {
  "id": "i164",
  "no": "IND-2026-0089",
  "formCode": "SPS-101",
  "by": "p_g25",
  "stage": "DRAFT",
  "holder": "p_g25",
  "total": 65608,
  "gem": false,
  "trail": [],
  "history": [
   {
    "pid": "p_g25",
    "type": "y",
    "text": "Saved a draft",
    "remark": "",
    "t": "2026-10-03T23:24:00.000Z"
   }
  ],
  "signs": {},
  "po": null,
  "submitted": false,
  "data": {
   "indenter": {
    "budgetHead": "Departmental grant, CSE",
    "sanctioned": 300000,
    "title": "Data loggers",
    "cat": "Non-consumables",
    "research": "Yes",
    "purpose": "Requirement for the new semester courses.",
    "approvalEnclosed": "Yes",
    "space": "NA",
    "install": "Not required",
    "gem": "No",
    "cname": "Dr. Sanjay Bedi",
    "caddr": "Room 207, CSE Department, Main Academic Block",
    "modes": [
     "Spot visit"
    ],
    "nq": 2,
    "qno": "IH/3081",
    "qdate": "2026-08-27",
    "vendor": "Instrumentation Hub",
    "items": [
     {
      "desc": "8-channel data logger",
      "qty": 2,
      "rate": 27800
     }
    ],
    "tax": 18,
    "total": 65608,
    "pay": "100% against delivery",
    "delivery": "3 weeks from PO",
    "decl": true,
    "docs": [
     {
      "n": "Quotation.pdf",
      "s": "212 KB",
      "by": "p_g25"
     },
     {
      "n": "Specification-sheet.pdf",
      "s": "88 KB",
      "by": "p_g25"
     }
    ]
   },
   "accounts": null,
   "purchase": null,
   "po": null
  },
  "order": null,
  "version": 1
 }
];
