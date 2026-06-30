import plansConfig from './plansConfig.json';
import { 
  User, 
  TrendingUp, 
  Globe, 
  Briefcase, 
  Home, 
  Coins, 
  Users,
  Receipt,
  Building,
  Building2,
  Shield,
  CreditCard
} from 'lucide-react';

// Individual ITR Services Data
export const individualServices = [
  {
    id: 'salary-basic-itr',
    title: "Salary (Basic) ITR",
    description: "Simple ITR filing for salaried individuals with basic income sources",
    icon: User,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    features: [
      "ITR-1 (Sahaj) Filing",
      "Salary Income Filing",
      "Form 16 Verification",
      "Standard Deduction Claim",
      "80C, 80D & Basic Deduction Support",
      "Bank Interest Income Reporting",
      "One House Property Support",
      "Up to ₹50 Lakhs Income",
      "Tax Computation Sheet",
      "Refund Status Assistance",
    ],
    detailContent: {
      overview: "Perfect for salaried employees with straightforward income sources. Our basic ITR filing service covers all essential requirements for individual taxpayers with income up to ₹50 Lakhs.",
      inclusions: [
        "ITR-1 (Sahaj) form preparation and filing",
        "Salary income computation",
        "Form 16 verification and reconciliation",
        "Standard deduction claims",
        "80C, 80D & basic deduction support",
        "Bank interest income reporting",
        "One house property support",
        "Tax computation sheet",
        "Refund status assistance"
      ],
      documents: [
        "Form 16 from employer",
        "Bank statements",
        "Investment proofs (80C, 80D)",
        "Aadhaar and PAN card"
      ]
    }
  },
  {
    id: 'salary-premium',
    title: "Salary (Premium)",
    description: "Comprehensive ITR filing for professionals with multiple income sources",
    icon: User,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "ITR-2 Filing",
      "Multiple Income Sources",
      "Salary + House Property",
      "Capital Gain Support",
      "Dividend & Interest Income",
      "Tax Saving Review",
      "Deduction Optimization",
      "Advance Tax Guidance",
      "Expert Consultation Support",
    ],
    detailContent: {
      overview: "Comprehensive tax filing for professionals with multiple income streams including salary, house property, capital gains, and investments.",
      inclusions: [
        "ITR-2 form preparation and filing",
        "Multiple income sources handling",
        "Salary + house property income",
        "Capital gain computation",
        "Dividend & interest income reporting",
        "Foreign assets disclosure (basic)",
        "Tax saving review",
        "Deduction optimization",
        "Advance tax guidance",
        "Expert consultation support"
      ],
      documents: [
        "Form 16 from all employers",
        "Property rental agreements",
        "Investment statements",
        "Capital gains documents"
      ]
    }
  },
  {
    id: 'capital-gain',
    title: "Capital Gain",
    description: "Specialized filing for stock market and investment gains",
    icon: TrendingUp,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "LTCG & STCG Computation",
      "Equity & Mutual Fund Gains",
      "Intraday & F&O Support",
      "Property Sale Capital Gains",
      "Indexation Benefit Calculation",
      "Bond & Investment Gain Reporting",
      "Capital Loss Set-off",
      "Carry Forward of Losses",
      "AIS/TIS Reconciliation",
      "Tax Planning Support",
    ],
    detailContent: {
      overview: "Expert handling of capital gains from stocks, mutual funds, property transactions, and F&O trading with optimal tax planning and loss optimization.",
      inclusions: [
        "LTCG & STCG computation",
        "Equity & mutual fund gains",
        "Intraday & F&O support",
        "Property sale capital gains",
        "Indexation benefit calculation",
        "Bond & investment gain reporting",
        "Capital loss set-off",
        "Carry forward of losses",
        "AIS/TIS reconciliation",
        "Tax planning support"
      ],
      documents: [
        "Trading account statements",
        "Mutual fund statements",
        "Property sale deed",
        "Purchase invoices and receipts"
      ]
    }
  },
  {
    id: 'nri-income',
    title: "Foreign / NRI Income",
    description: "ITR filing for NRIs and foreign income sources",
    icon: Globe,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "NRI ITR Filing",
      "Foreign Salary Income",
      "Foreign Asset Disclosure",
      "DTAA Benefit Claim",
      "Foreign Tax Credit (FTC)",
      "Schedule FA Reporting",
      "NRI Residential Status Analysis",
      "Rental Income in India",
      "Capital Gain for NRI",
      "NRE / NRO Income Tax Guidance ",
    ],
    detailContent: {
      overview: "Specialized NRI tax services covering foreign income, DTAA benefits, and compliance requirements for Non-Resident Indians with Indian income sources.",
      inclusions: [
        "NRI ITR filing",
        "Foreign salary income reporting",
        "Foreign asset disclosure",
        "DTAA benefit claim",
        "Foreign tax credit (FTC)",
        "Schedule FA reporting",
        "FBAR compliance guidance",
        "Rental income in India",
        "Capital gain for NRI",
        "FEMA basic compliance support"
      ],
      documents: [
        "Passport and visa copies",
        "Foreign salary certificates",
        "Bank statements (India & abroad)",
        "Tax paid certificates abroad"
      ]
    }
  }
];

// Business ITR Services Data
export const businessServices = [
  {
    id: 'business-profession',
    title: "Business & Profession",
    description: "Comprehensive ITR filing for business owners and professionals",
    icon: Briefcase,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "ITR-3 / ITR-4 Filing",
      "Business Income Reporting",
      "Professional Income Filing",
      "Presumptive Taxation (44AD / 44ADA / 44AE)",
      "Profit & Loss Review",
      "Balance Sheet Basic Review",
      "GST Turnover Reconciliation",
      "Advance Tax Guidance",
      "Deduction Optimization",
      "Tax Planning Support",
    ],
    detailContent: {
      overview: "Complete business tax filing for proprietors, professionals, and small businesses with comprehensive income and expense management under presumptive and regular taxation schemes.",
      inclusions: [
        "ITR-3 / ITR-4 form selection and filing",
        "Business income reporting",
        "Professional income filing",
        "Presumptive taxation (44AD / 44ADA / 44AE)",
        "Profit & loss review",
        "Balance sheet basic review",
        "GST turnover reconciliation",
        "Advance tax guidance",
        "Deduction optimization",
        "Tax planning support"
      ],
      documents: [
        "Books of accounts",
        "Bank statements",
        "Purchase and sales invoices",
        "GST returns (if applicable)",
        "Expense receipts and bills"
      ]
    }
  },
  {
    id: 'fo-trading',
    title: "F&O Trading",
    description: "Specialized filing for futures and options trading income",
    icon: TrendingUp,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "F&O Trading Income Reporting",
      "Intraday & Speculative Income",
      "Business Income Treatment",
      "Turnover Calculation",
      "Profit & Loss Analysis",
      "Loss Carry Forward",
      "Audit Applicability Check",
      "AIS/TIS Reconciliation",
      "Broker Statement Review",
      "Advance Tax Support",
    ],
    detailContent: {
      overview: "Expert F&O trading tax services with proper classification of speculative vs business income, turnover calculation, loss optimization, and audit applicability check.",
      inclusions: [
        "F&O trading income reporting",
        "Intraday & speculative income",
        "Business income treatment",
        "Turnover calculation",
        "Profit & loss analysis",
        "Loss carry forward",
        "Audit applicability check",
        "AIS/TIS reconciliation",
        "Broker statement review",
        "Advance tax support"
      ],
      documents: [
        "Trading account statements",
        "Contract notes",
        "P&L statements from broker",
        "Bank statements"
      ]
    }
  },
  {
    id: 'house-property',
    title: "House Property",
    description: "ITR filing for rental income and property investments",
    icon: Home,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "Rental Income Reporting",
      "House Property Income Filing",
      "Home Loan Interest Deduction",
      "Principal Repayment Benefits",
      "Property Tax Deduction",
      "Multiple Property Support",
      "Self-Occupied + Let-Out Property",
      "Co-owner Property Support",
      "Municipal Tax Adjustment",
      "Tax Saving Review",
    ],
    detailContent: {
      overview: "Comprehensive house property income filing with rental income optimization, home loan benefits, and maximum deduction claims for single or multiple properties.",
      inclusions: [
        "Rental income reporting",
        "House property income filing",
        "Home loan interest deduction",
        "Principal repayment benefits",
        "Property tax deduction",
        "Multiple property support",
        "Self-occupied + let-out property",
        "Co-owner property support",
        "Municipal tax adjustment",
        "Tax saving review"
      ],
      documents: [
        "Rental agreements",
        "Property tax receipts",
        "Home loan statements",
        "Maintenance bills",
        "Co-ownership documents (if applicable)"
      ]
    }
  },
  {
    id: 'crypto-trading',
    title: "Crypto Trading",
    description: "ITR filing for cryptocurrency trading and investments",
    icon: Coins,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "Crypto Trading Income",
      "Virtual Digital Asset (VDA) Reporting",
      "Buy/Sell Transaction Review",
      "Exchange Statement Reconciliation",
      "30% Tax Computation",
      "Loss Treatment Guidance",
      "Wallet Transaction Support",
      "Foreign Exchange Reporting (Basic)",
      "AIS Reconciliation",
      "Expert Consultation Support",
    ],
    detailContent: {
      overview: "Specialized cryptocurrency tax filing with proper VDA classification, 30% tax computation, exchange reconciliation, and compliance with the latest crypto tax regulations.",
      inclusions: [
        "Crypto trading income reporting",
        "Virtual digital asset (VDA) reporting",
        "Buy/sell transaction review",
        "Exchange statement reconciliation",
        "30% tax computation",
        "Loss treatment guidance",
        "Wallet transaction support",
        "Foreign exchange reporting (basic)",
        "AIS reconciliation",
        "Expert consultation support"
      ],
      documents: [
        "Exchange trading statements",
        "Wallet transaction history",
        "Purchase receipts",
        "TDS certificates (if any)"
      ]
    }
  },
  {
    id: 'huf-filing',
    title: "HUF Filing",
    description: "Hindu Undivided Family tax return filing",
    icon: Users,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "HUF ITR Filing",
      "Family Business Income",
      "Property Income",
      "Investment Income",
      "Capital Gain Support",
      "Bank Interest & Dividend Reporting",
      "Deduction Claims",
      "Tax Planning for HUF",
      "Partition / Coparcener Basic Guidance",
      "Compliance Review",
    ],
    detailContent: {
      overview: "Complete HUF tax filing services covering family business income, property investments, capital gains, and tax optimization strategies for Hindu Undivided Families.",
      inclusions: [
        "HUF ITR filing",
        "Family business income",
        "Property income",
        "Investment income",
        "Capital gain support",
        "Bank interest & dividend reporting",
        "Deduction claims",
        "Tax planning for HUF",
        "Partition / coparcener basic guidance",
        "Compliance review"
      ],
      documents: [
        "HUF deed / declaration",
        "Business partnership deeds",
        "Property documents",
        "Investment statements",
        "Bank statements"
      ]
    }
  }
];

// Registration Services Data
export const registrationServices = [
  {
    id: 'gst-registration',
    title: "GST Registration",
    description: "Complete GST registration for businesses and professionals",
    icon: Receipt,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    features: [
      "Online GST Registration",
      "GSTIN Certificate",
      "Document Preparation & Verification",
      "Business Type Assessment",
      "HSN/SAC Code Guidance",
      "Composition Scheme Advice",
      "GST Portal Setup",
      "Authorized Signatory Assistance",
      "CA-Assisted Application Review",
      "GST Login Credentials Support ",
      "Post-Registration Compliance Guidance",
      "ARN Tracking & Status Updates",
    ],
    detailContent: {
      overview: "Complete GST registration service for businesses, freelancers, and professionals — covering document preparation, portal setup, and post-registration compliance guidance.",
      inclusions: [
        "Online GST registration on GST portal",
        "GSTIN certificate",
        "Document preparation & verification",
        "Business type assessment",
        "Threshold limit guidance",
        "Composition scheme advice",
        "GST portal setup",
        "Login credentials assistance",
        "Post-registration compliance guidance",
        "Filing acknowledgement support"
      ],
      documents: [
        "PAN card of business / proprietor",
        "Aadhaar card",
        "Address proof of business (electricity bill / rent agreement)",
        "Bank account details (cancelled cheque)",
        "Passport-size photograph",
        "Business registration certificate (if applicable)"
      ]
    }
  },
  {
    id: 'huf-registration',
    title: "HUF Registration",
    description: "Hindu Undivided Family registration and setup services",
    icon: Users,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "HUF Deed Preparation",
      "HUF Declaration Drafting",
      "PAN Application & Processing ",
      "PAN Tracking Assistance",
      "Bank Account Opening Support",
      "Karta & Coparcener Documentation",
      "Tax Benefits Guidance",
      "HUF Structure Consultation",
      "Tax Planning for HUF Income ",
      "Income Tax Return Eligibility Guidance ",
      "Basic HUF Compliance Guidance ",
      "Post-Registration Support",
    ],
    detailContent: {
      overview: "Complete HUF registration and setup service — covering deed preparation, PAN application, bank account opening, and tax planning to maximize HUF benefits.",
      inclusions: [
        "HUF deed preparation",
        "PAN application for HUF",
        "Bank account opening support",
        "Karta & coparcener documentation",
        "Legal documentation",
        "Tax benefits guidance",
        "HUF income planning",
        "Deduction optimization",
        "Compliance setup",
        "Post-registration support"
      ],
      documents: [
        "PAN card of Karta",
        "Aadhaar card of Karta",
        "Address proof",
        "Details of all coparceners",
        "Marriage certificate of Karta",
        "Bank account details"
      ]
    }
  },
  {
    id: 'company-registration',
    title: "Company Registration",
    description: "Private Limited Company incorporation with full compliance setup",
    icon: Building,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "Private Limited Company Incorporation",
      "SPICe+ Incorporation Filing ",
      "Certificate of Incorporation",
      "DIN Allotment ",
      "Company PAN & TAN Application ",
      "Name Approval Assistance ",
      "MOA & AOA Drafting",
      "Incorporation Document Preparation ",
      "MCA Application Tracking ",
      "Bank Account Opening Guidance",
      "Post-Incorporation Compliance Roadmap ",
      "Govt fees upto 2000INR",
    ],
    detailContent: {
      overview: "End-to-end Private Limited Company incorporation service — from name reservation and DSC to ROC filing, certificate of incorporation, and post-incorporation compliance setup.",
      inclusions: [
        "Private limited company incorporation",
        "ROC filing (MCA portal)",
        "Certificate of incorporation",
        "Digital signature certificates (DSC)",
        "Director identification number (DIN)",
        "MOA & AOA drafting",
        "Company PAN & TAN application",
        "Registered office setup",
        "Compliance calendar",
        "Post-incorporation guidance"
      ],
      documents: [
        "PAN card of all directors",
        "Aadhaar card of all directors",
        "Address proof of directors",
        "Passport-size photographs",
        "Registered office address proof",
        "NOC from property owner (if rented)"
      ]
    }
  },
  {
    id: 'llp-registration',
    title: "LLP Registration",
    description: "Limited Liability Partnership registration and compliance setup",
    planId: "699747cb583ee92f4aed58a3",
    icon: Building2,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "LLP Incorporation (MCA Portal)",
      "Certificate of Incorporation (LLP) ",
      "LLP Agreement Drafting ",
      "LLP PAN & TAN Application",
      "Name Approval Assistance ",
      "Partner Consent Documentation ",
      "MCA Application Preparation ",
      "MCA Application Tracking ",
      "DPIN Allotment ",
      "Registered Office Address Guidance ",
      "Post-Incorporation Compliance Guidance",
      "Govt fees upto 1000INR",
    ],
    detailContent: {
      overview: "Complete LLP registration service — covering MCA filing, LLP agreement drafting, DSC, DPIN, PAN/TAN application, and post-registration compliance setup.",
      inclusions: [
        "LLP incorporation (MCA portal)",
        "LLP agreement drafting",
        "ROC registration",
        "Digital signature certificates (DSC)",
        "Designated partner identification (DPIN)",
        "LLP PAN & TAN application",
        "Partner certificates",
        "Registered office setup",
        "Compliance setup",
        "Post-registration support"
      ],
      documents: [
        "PAN card of all partners",
        "Aadhaar card of all partners",
        "Address proof of partners",
        "Passport-size photographs",
        "Registered office address proof",
        "NOC from property owner (if rented)"
      ]
    }
  }
];

// Other Filing Services Data
export const otherServices = [
  {
    id: 'gst-filing',
    title: "GST Return Filing",
    description: "Complete GST return filing and compliance support for businesses",
    planId: "699747cb583ee92f4aed58a4",
    icon: Receipt,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    features: [
      "Online GST Registration ",
      "GSTIN Certificate",
      "Document Preparation & Verification",
      "Business Type Assessment",
      "HSN/SAC Code Guidance",
      "Composition Scheme Advice ",
      "GST Portal Setup",
      "Authorized Signatory Assistance ",
      "ARN Tracking & Status Updates ",
      "CA-Assisted Application Review",
      "GST Login Credentials Support ",
      "Post-Registration Compliance Guidance",
    ],
    detailContent: {
      overview: "Complete GST return filing and compliance support for businesses — covering monthly, quarterly, and NIL returns with ITC review and reconciliation.",
      inclusions: [
        "GSTR-1 return filing",
        "GSTR-3B return filing",
        "Monthly & quarterly GST compliance",
        "NIL return filing",
        "GST sales & purchase reconciliation",
        "Input tax credit (ITC) review",
        "GST liability calculation",
        "Late fee & interest guidance",
        "GST portal support",
        "Basic notice assistance",
        "Filing confirmation & acknowledgement"
      ],
      documents: [
        "Sales invoices",
        "Purchase invoices",
        "Bank statements",
        "Previous GST returns (if any)",
        "GSTIN certificate"
      ]
    }
  },
  {
    id: 'tds-filing',
    title: "Form 26QB Filing – TDS on Property Purchase",
    description: "Complete TDS return filing and compliance support for businesses & professionals",
    planId: "699747cb583ee92f4aed58a5",
    icon: CreditCard,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "TDS Calculation on Property Purchase",
      "Form 26QB Online Filing",
      "TDS Challan Generation & Payment Support",
      "PAN Verification of Buyer & Seller",
      "Form 16B TDS Certificate Generation",
      "End-to-End Documentation Support",
      "Expert Assistance for Section 194IA Compliance",
    ],
    detailContent: {
      overview: "Complete TDS return filing and compliance support covering all TDS forms — salary, non-salary, NRI payments, and TCS returns with challan verification.",
      inclusions: [
        "Quarterly TDS return filing",
        "Form 24Q filing (salary TDS)",
        "Form 26Q filing (non-salary TDS)",
        "Form 27Q filing (NRI payments)",
        "Form 27EQ filing (TCS return)",
        "Challan verification",
        "Deductee data preparation",
        "PAN verification support",
        "Late fee & interest calculation",
        "TDS payment guidance",
        "Filing acknowledgement support",
        "Basic compliance consultation"
      ],
      documents: [
        "Salary register / payroll data",
        "TDS challan details",
        "Deductee PAN details",
        "Payment vouchers",
        "Previous TDS returns (if any)"
      ]
    }
  },
  {
    id: 'pf-esic',
    title: "PF & ESIC Registration",
    description: "Complete employee compliance setup for businesses and employers",
    planId: "699747cb583ee92f4aed58a6",
    icon: Shield,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    features: [
      "PF Registration (EPFO)",
      "ESIC Registration (ESIC Portal)",
      "Employer Registration Support",
      "Employee Code Generation",
      "Establishment Registration",
      "Document Preparation & Verification",
      "Digital Portal Setup Support",
      "Login Credentials Assistance",
      "Basic Compliance Guidance",
      "Registration Certificate Support",
      "Payroll Compliance Consultation",
      "Post Registration Assistance",
    ],
    detailContent: {
      overview: "Complete employee compliance setup for businesses — covering PF and ESIC registration, employer setup, employee code generation, and post-registration support.",
      inclusions: [
        "PF registration (EPFO)",
        "ESIC registration (ESIC portal)",
        "Employer registration support",
        "Employee code generation",
        "Establishment registration",
        "Document preparation & verification",
        "Digital portal setup support",
        "Login credentials assistance",
        "Basic compliance guidance",
        "Registration certificate support",
        "Payroll compliance consultation",
        "Post registration assistance"
      ],
      documents: [
        "Business registration certificate",
        "PAN card of business",
        "Address proof of establishment",
        "Employee details (name, DOB, Aadhaar)",
        "Bank account details"
      ]
    }
  },
  // {
  //   id: 'test-production-plan',
  //   title: "Test Production Plan",
  //   description: "Special plan for production payment testing",
  //   price: "₹1",
  //   numericPrice: 1,
  //   icon: Shield,
  //   bgColor: "bg-green-50",
  //   iconColor: "text-green-600",
  //   features: [
  //     "Production Testing",
  //     "Real Payment Verification",
  //     "100% Secure Transaction",
  //     "Instant Confirmation",
  //   ],
  //   detailContent: {
  //     overview: "This plan is specifically designed for testing real payments in the production environment at a nominal cost of ₹1.",
  //     inclusions: [
  //       "Real payment processing",
  //       "Order creation",
  //       "Status tracking",
  //       "Email confirmation"
  //     ],
  //     documents: [
  //       "Test Document"
  //     ]
  //   }
  // }
];

// Service Categories
export const serviceCategories = {
  individual: {
    title: "Individual ITR Filing Services",
    description: "Choose the perfect ITR filing service based on your income sources and requirements",
    icon: User,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    services: individualServices
  },
  business: {
    title: "Business ITR Filing Services", 
    description: "Professional tax filing services for businesses, traders, and specialized income sources",
    icon: Briefcase,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    services: businessServices
  },
  registration: {
    title: "Registration Services",
    description: "Complete business registration and compliance setup services",
    icon: Building,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    services: registrationServices
  },
  other: {
    title: "Other Filing Services",
    description: "Additional compliance and filing services for businesses",
    icon: Receipt,
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600", 
    services: otherServices
  }
};

const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

[...individualServices, ...businessServices, ...registrationServices, ...otherServices].forEach(service => {
  if (plansConfig[service.id]) {
    service.numericPrice = plansConfig[service.id].price;
    if (service.price && service.price.startsWith('Starting')) {
      service.price = `Starting ${formatPrice(service.numericPrice)}`;
    } else {
      service.price = formatPrice(service.numericPrice);
    }
  }
});