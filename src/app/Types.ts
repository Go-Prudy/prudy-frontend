// TYPES FOR CREATING BUDGET

export interface ISubAllocation {
    subCategory: string;
    amount: number;
}

export interface IAllocation {
    budgetCategory: string; // Category like Housing, Transportation
    amount: number;         // Total amount for the category
    color: string; // Add this field
    percentage: number;     // Optional percentage representation
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
    profile: {
        createdAt: string;
        updatedAt: string;
        uid: string;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        registeredWith: string;
        isVerified: boolean;
        hasOnboarded: boolean;
        accountProviderId: string | null;
        profilePhoto: string | null;
    };
}



export interface IForgotPassword {
    otpRef: string;
    email: string;
    pin: string;
    confirmPin: string;
}