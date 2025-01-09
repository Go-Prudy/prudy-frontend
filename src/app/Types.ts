// TYPES FOR CREATING BUDGET

export interface ISubAllocation {
    subCategory: string;
    amount: number;
}
interface ISubCategory {
    name: string;
}

export interface IExpense {
    amount: number;
    budgetCategoryId: string;
    narration: string;
    date: string;
}

export interface ManualData {
    amount: number;
    budgetCategoryId: string;
    narration: string;
    date: string;
}


export interface IAllocation {
    budgetCategory: string; // Category like Housing, Transportation
    amount?: number;         // Total amount for the category
    color?: string; // Add this field
    percentage?: number;     // Optional percentage representation
    subAllocations?: ISubAllocation[]; // Expenses under each category
}

export interface Income {
    name: string;
    amount: number;
}


export interface IBudget {
    id: string; // Unique identifier for the budget
    name: string;
    purpose: string;
    startDate: string;
    budgetType?: string;
    endDate: string;
    incomes?: Income[]; // Array of incomes
    allocations?: IAllocation[]; // Array of expense categories with expenses
}


export interface IVerifyOtpForm {
    reference: string;
    code: string;
    email: string;
    phoneNumber: string;
}

export interface ILoginForm {
    loginWith: string;
    email: string;
    pin?: string;
}

export interface ISignupForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    otpReference?: string;
    pin?: string;
    confirmPin?: string;
    registeredWith?: string;
}


export interface IOtpResponse {
    success: boolean;
    message: string;
    code: number;
    returnStatus: string;
    data: {
        reference: string;
    };
}


export interface IVerifyOtpResponse {
    success: boolean;
    message: string;
    code: number;
    returnStatus: string;
    data: any;
}


export interface IResendState {
    canResend: boolean;
    timeLeft: number;
    startTimer: () => void;
    tick: () => void;
}



export interface IAuthenticatedUser {
    token: string;
    profile: IUserProfile;
}

export interface IUserProfile {
    createdAt: string;
    updatedAt: string;
    uid: string;
    hasFreeTrial: boolean;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    registeredWith: string;
    isVerified: boolean;
    hasOnboarded: boolean;
    accountProviderId: string | null;
    profilePhotoUrl: string | null;
}



export interface IForgotPassword {
    otpRef: string;
    email: string;
    pin: string;
    confirmPin: string;
}



export interface ICreateCategory {
    id: string
    name: string;
    subCategories?: ISubCategory[];
}



export interface SubCategory {
    name: string;
}

export interface ICreateBudgetCategory {
    name: string;
    subCategories: SubCategory[];
}


export interface AccountParams {
    sortBy?: string;
    sortDir?: string;
    limit?: number;
    page?: number;
}



export interface AssignTransactionData {
    budgetId: string;
    categoryId: string;
}




export interface ICurrencyData {
    country: string,
    countryCode: string,
    flag: string,
    abbreviation: string,
    name: string,
    symbol: string,
}

export interface Expense {
    uid: string;
    narration: string;
    amount: number;
    date: string;
    time: string;
}

export interface BudgetCategory {
    uid: string;
    name: string;
    amountLeft: number;
    amountAllocated: number;
    amountSpent: number;
}

export interface Budget {
    budgetCategories: BudgetCategory[];
    // ... other budget properties
}

export interface ExpenseResponse {
    data: {
        docs: Expense[];
        totalDocs: number;
        limit: number;
        page: number;
        totalPages: number;
    };
}